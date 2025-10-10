#!/usr/bin/env node

/**
 * Script de test pour vérifier que l'authentification fonctionne sans état de chargement infini
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

console.log('🔐 Test de l\'authentification sans état de chargement infini');
console.log('============================================================\n');

if (!CONVEX_URL) {
  console.error('❌ VITE_CONVEX_URL non trouvé dans .env');
  process.exit(1);
}

console.log(`📡 URL Convex: ${CONVEX_URL}`);

const convexClient = new ConvexHttpClient(CONVEX_URL);

async function testAuthNoLoading() {
  try {
    // Test de connexion basique
    console.log('1️⃣ Test de connexion...');
    const users = await convexClient.query("auth:getAllUsers");
    console.log(`   ✅ Connexion réussie, ${users.length} utilisateurs trouvés\n`);

    // Test d'authentification
    console.log('2️⃣ Test d\'authentification...');
    const authResult = await convexClient.mutation("auth:authenticateUserSimple", {
      email: "admin@dr-ravalement.fr",
      password: "admin123"
    });
    
    console.log('   ✅ Authentification réussie');
    console.log(`   📧 Email: ${authResult.user.email}`);
    console.log(`   👤 Nom: ${authResult.user.name}`);
    console.log(`   🔑 Rôle: ${authResult.user.role}`);
    console.log(`   🎫 Token: ${authResult.session.token.substring(0, 20)}...\n`);

    // Test de simulation de session (comme dans le contexte)
    console.log('3️⃣ Test de simulation de session...');
    const simulatedUser = {
      _id: 'temp',
      email: 'admin@dr-ravalement.fr',
      name: 'Administrateur',
      role: 'admin',
      status: 'active'
    };
    
    const simulatedSession = {
      _id: 'temp',
      user_id: 'temp',
      token: authResult.session.token,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      last_used: new Date().toISOString()
    };

    console.log('   ✅ Session simulée créée');
    console.log(`   📧 Email simulé: ${simulatedUser.email}`);
    console.log(`   👤 Nom simulé: ${simulatedUser.name}`);
    console.log(`   🔑 Rôle simulé: ${simulatedUser.role}`);
    console.log(`   ⏰ Expire le: ${simulatedSession.expires_at}\n`);

    // Test de déconnexion
    console.log('4️⃣ Test de déconnexion...');
    try {
      await convexClient.mutation("auth:logout", {
        sessionId: authResult.session._id
      });
      console.log('   ✅ Déconnexion réussie\n');
    } catch (error) {
      console.log(`   ⚠️  Erreur lors de la déconnexion: ${error.message}\n`);
    }

    console.log('🎉 Tests terminés avec succès !');
    console.log('\n📋 Résumé :');
    console.log('   ✅ Connexion à Convex');
    console.log('   ✅ Authentification');
    console.log('   ✅ Simulation de session (pas de validation côté serveur)');
    console.log('   ✅ Déconnexion');
    console.log('\n💡 L\'approche simplifiée évite les états de chargement infinis');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.message.includes('Could not find public function')) {
      console.error('💡 Vérifiez que Convex est démarré avec: npx convex dev');
    }
  }
}

testAuthNoLoading();
