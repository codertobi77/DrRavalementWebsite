#!/usr/bin/env node

/**
 * Script d'initialisation complète de Convex
 * Exécuter avec: node init-convex.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Initialisation complète de Convex\n');

try {
  // 1. Vérifier si Convex CLI est installé
  console.log('1️⃣ Vérification de Convex CLI...');
  try {
    execSync('npx convex --version', { stdio: 'pipe' });
    console.log('✅ Convex CLI disponible');
  } catch (error) {
    console.log('❌ Convex CLI non trouvé. Installation...');
    execSync('npm install -g convex', { stdio: 'inherit' });
  }

  // 2. Initialiser Convex (si pas déjà fait)
  console.log('\n2️⃣ Initialisation de Convex...');
  if (!fs.existsSync(path.join(__dirname, '.convex'))) {
    console.log('Initialisation du projet Convex...');
    console.log('⚠️  Suivez les instructions pour configurer votre projet Convex');
    console.log('   - Créez un compte sur convex.dev');
    console.log('   - Créez un nouveau projet');
    console.log('   - Copiez l\'URL de votre projet');
    console.log('   - Ajoutez-la à votre fichier .env comme VITE_CONVEX_URL');
  } else {
    console.log('✅ Projet Convex déjà initialisé');
  }

  // 3. Vérifier la configuration
  console.log('\n3️⃣ Vérification de la configuration...');
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('VITE_CONVEX_URL') && !envContent.includes('your-convex-url')) {
      console.log('✅ VITE_CONVEX_URL configuré');
    } else {
      console.log('⚠️  VITE_CONVEX_URL doit être configuré dans .env');
      console.log('   Exemple: VITE_CONVEX_URL=https://your-project.convex.cloud');
    }
  } else {
    console.log('❌ Fichier .env manquant');
  }

  // 4. Instructions finales
  console.log('\n📋 Instructions pour finaliser la configuration:');
  console.log('   1. Allez sur https://convex.dev');
  console.log('   2. Créez un compte et un nouveau projet');
  console.log('   3. Copiez l\'URL de votre projet');
  console.log('   4. Ajoutez-la à .env: VITE_CONVEX_URL=https://your-project.convex.cloud');
  console.log('   5. Exécutez: npx convex dev');
  console.log('   6. Exécutez: npx convex run initData:initializeDefaultData');
  console.log('   7. Testez avec: node test-convex-migration.js');

  console.log('\n🎉 Instructions d\'initialisation terminées !');

} catch (error) {
  console.error('❌ Erreur lors de l\'initialisation:', error.message);
  process.exit(1);
}
