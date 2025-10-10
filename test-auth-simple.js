#!/usr/bin/env node

/**
 * Script de test simple pour l'authentification
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

console.log('🔐 Test simple de l\'authentification');
console.log('=====================================\n');

if (!CONVEX_URL) {
  console.error('❌ VITE_CONVEX_URL non trouvé dans .env');
  process.exit(1);
}

console.log(`📡 URL Convex: ${CONVEX_URL}`);

const convexClient = new ConvexHttpClient(CONVEX_URL);

async function testSimpleAuth() {
  try {
    // Test de connexion basique
    console.log('1️⃣ Test de connexion...');
    const users = await convexClient.query("auth:getAllUsers");
    console.log(`   ✅ Connexion réussie, ${users.length} utilisateurs trouvés\n`);

    // Test d'authentification simple
    console.log('2️⃣ Test d\'authentification...');
    const authResult = await convexClient.mutation("auth:authenticateUserSimple", {
      email: "admin@dr-ravalement.fr",
      password: "admin123"
    });
    
    console.log('   ✅ Authentification réussie');
    console.log(`   📧 Email: ${authResult.user.email}`);
    console.log(`   🎫 Token: ${authResult.session.token.substring(0, 20)}...\n`);

    // Test de validation de session
    console.log('3️⃣ Test de validation de session...');
    const validationResult = await convexClient.query("auth:validateSession", {
      token: authResult.session.token
    });

    if (validationResult) {
      console.log('   ✅ Session validée côté serveur');
      console.log(`   📧 Email validé: ${validationResult.user.email}`);
      console.log(`   ⏰ Expire le: ${validationResult.session.expires_at}\n`);
    } else {
      console.log('   ❌ Échec de validation de session\n');
    }

    console.log('🎉 Tests terminés avec succès !');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.message.includes('Could not find public function')) {
      console.error('💡 Vérifiez que Convex est démarré avec: npx convex dev');
    }
  }
}

testSimpleAuth();
