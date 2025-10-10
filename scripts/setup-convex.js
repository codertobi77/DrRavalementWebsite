#!/usr/bin/env node

/**
 * Script de configuration automatique de Convex
 * Exécuter avec: node setup-convex.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Configuration automatique de Convex\n');

// 1. Vérifier si Convex est installé
console.log('1️⃣ Vérification de Convex...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (packageJson.dependencies?.convex) {
    console.log('✅ Convex est installé');
  } else {
    console.log('❌ Convex n\'est pas installé. Exécutez: npm install convex');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Erreur lors de la lecture de package.json:', error.message);
  process.exit(1);
}

// 2. Vérifier la configuration Convex
console.log('\n2️⃣ Vérification de la configuration...');
const convexJsonPath = path.join(__dirname, 'convex.json');
if (fs.existsSync(convexJsonPath)) {
  console.log('✅ convex.json trouvé');
} else {
  console.log('❌ convex.json manquant. Exécutez: npx convex dev');
  process.exit(1);
}

// 3. Vérifier les fonctions Convex
console.log('\n3️⃣ Vérification des fonctions Convex...');
const convexDir = path.join(__dirname, 'convex');
if (fs.existsSync(convexDir)) {
  const files = fs.readdirSync(convexDir);
  const requiredFiles = ['schema.ts', 'pages.ts', 'bookings.ts', 'siteConfig.ts'];
  const missingFiles = requiredFiles.filter(file => !files.includes(file));
  
  if (missingFiles.length === 0) {
    console.log('✅ Toutes les fonctions Convex sont présentes');
  } else {
    console.log('❌ Fichiers manquants:', missingFiles.join(', '));
    process.exit(1);
  }
} else {
  console.log('❌ Dossier convex manquant');
  process.exit(1);
}

// 4. Vérifier le fichier .env
console.log('\n4️⃣ Vérification du fichier .env...');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('VITE_CONVEX_URL')) {
    console.log('✅ VITE_CONVEX_URL trouvé dans .env');
  } else {
    console.log('⚠️  VITE_CONVEX_URL manquant dans .env');
    console.log('   Ajoutez: VITE_CONVEX_URL=your-convex-url');
  }
} else {
  console.log('⚠️  Fichier .env manquant');
  console.log('   Créez un fichier .env avec: VITE_CONVEX_URL=your-convex-url');
}

// 5. Instructions finales
console.log('\n📋 Prochaines étapes:');
console.log('   1. Configurez VITE_CONVEX_URL dans .env');
console.log('   2. Exécutez: npx convex dev');
console.log('   3. Exécutez: npx convex run initData:initializeDefaultData');
console.log('   4. Testez avec: node test-convex-migration.js');
console.log('   5. Démarrez l\'app: npm run dev');

console.log('\n🎉 Configuration terminée !');
