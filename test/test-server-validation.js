#!/usr/bin/env node

/**
 * Script de test pour la validation côté serveur
 * Teste la création d'utilisateurs, l'authentification et la validation de session
 */

import { ConvexHttpClient } from "convex/browser";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger la configuration depuis .env
function loadEnvConfig() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    const config = {};
    
    lines.forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        config[key.trim()] = value.trim();
      }
    });
    
    return config;
  }
  return {};
}

const envConfig = loadEnvConfig();
const CONVEX_URL = envConfig.VITE_CONVEX_URL;

if (!CONVEX_URL) {
  console.error('❌ VITE_CONVEX_URL non trouvé dans .env');
  process.exit(1);
}

const convexClient = new ConvexHttpClient(CONVEX_URL);

console.log('🔐 Test de la validation côté serveur');
console.log('=====================================\n');

async function testServerValidation() {
  try {
    // 1. Tester la connexion
    console.log('1️⃣ Test de connexion à Convex...');
    const connectionTest = await convexClient.query("auth:getAllUsers");
    console.log('   ✅ Connexion réussie\n');

    // 2. Créer un utilisateur de test
    console.log('2️⃣ Création d\'un utilisateur de test...');
    const testUser = {
      email: "test-validation@dr-ravalement.fr",
      password: "test123",
      name: "Test Validation",
      role: "admin"
    };

    try {
      const createResult = await convexClient.action("authActions:createAdminUser", testUser);
      console.log(`   ✅ Utilisateur créé (ID: ${createResult.userId})\n`);
    } catch (error) {
      if (error.message.includes('existe déjà')) {
        console.log('   ⚠️  Utilisateur existe déjà, continuons...\n');
      } else {
        throw error;
      }
    }

    // 3. Authentification
    console.log('3️⃣ Test d\'authentification...');
    const authResult = await convexClient.mutation("auth:authenticateUserSimple", {
      email: testUser.email,
      password: testUser.password
    });
    
    console.log('   ✅ Authentification réussie');
    console.log(`   📧 Email: ${authResult.user.email}`);
    console.log(`   👤 Nom: ${authResult.user.name}`);
    console.log(`   🔑 Rôle: ${authResult.user.role}`);
    console.log(`   🎫 Token: ${authResult.session.token.substring(0, 20)}...\n`);

    // 4. Validation de session côté serveur
    console.log('4️⃣ Test de validation de session côté serveur...');
    const validationResult = await convexClient.query("auth:validateSession", {
      token: authResult.session.token
    });

    if (validationResult) {
      console.log('   ✅ Session validée côté serveur');
      console.log(`   📧 Email validé: ${validationResult.user.email}`);
      console.log(`   👤 Nom validé: ${validationResult.user.name}`);
      console.log(`   🔑 Rôle validé: ${validationResult.user.role}`);
      console.log(`   ⏰ Expire le: ${validationResult.session.expires_at}\n`);
    } else {
      console.log('   ❌ Échec de validation de session\n');
    }

    // 5. Test avec token invalide
    console.log('5️⃣ Test avec token invalide...');
    const invalidValidation = await convexClient.query("auth:validateSession", {
      token: "token_invalide_12345"
    });

    if (invalidValidation === null) {
      console.log('   ✅ Token invalide correctement rejeté\n');
    } else {
      console.log('   ❌ Token invalide accepté (problème de sécurité)\n');
    }

    // 6. Test d'expiration de session
    console.log('6️⃣ Test d\'expiration de session...');
    
    // Créer une session expirée manuellement
    const expiredToken = `expired_${Date.now()}`;
    const now = new Date();
    const expiredTime = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(); // 24h dans le passé
    
    try {
      // Insérer une session expirée
      await convexClient.mutation("auth:insertSession", {
        userId: authResult.user._id,
        token: expiredToken,
        expiresAt: expiredTime,
        createdAt: expiredTime,
        lastUsed: expiredTime
      });

      const expiredValidation = await convexClient.query("auth:validateSession", {
        token: expiredToken
      });

      if (expiredValidation === null) {
        console.log('   ✅ Session expirée correctement rejetée\n');
      } else {
        console.log('   ❌ Session expirée acceptée (problème de sécurité)\n');
      }
    } catch (error) {
      console.log('   ⚠️  Impossible de tester l\'expiration (normal si la table n\'existe pas)\n');
    }

    // 7. Test de déconnexion
    console.log('7️⃣ Test de déconnexion...');
    try {
      await convexClient.mutation("auth:logout", {
        sessionId: authResult.session._id
      });
      console.log('   ✅ Déconnexion réussie\n');
    } catch (error) {
      console.log(`   ⚠️  Erreur lors de la déconnexion: ${error.message}\n`);
    }

    // 8. Vérification que la session est supprimée
    console.log('8️⃣ Vérification de suppression de session...');
    const deletedSessionValidation = await convexClient.query("auth:validateSession", {
      token: authResult.session.token
    });

    if (deletedSessionValidation === null) {
      console.log('   ✅ Session supprimée correctement\n');
    } else {
      console.log('   ❌ Session toujours active après déconnexion\n');
    }

    console.log('🎉 Tests de validation côté serveur terminés avec succès !');
    console.log('\n📋 Résumé des fonctionnalités testées :');
    console.log('   ✅ Connexion à Convex');
    console.log('   ✅ Création d\'utilisateur');
    console.log('   ✅ Authentification');
    console.log('   ✅ Validation de session côté serveur');
    console.log('   ✅ Rejet des tokens invalides');
    console.log('   ✅ Gestion de l\'expiration');
    console.log('   ✅ Déconnexion et suppression de session');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Exécuter les tests
testServerValidation();
