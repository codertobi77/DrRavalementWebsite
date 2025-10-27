#!/usr/bin/env node

/**
 * Script interactif de migration des données Convex
 * Guide complet pour migrer les données de dev vers prod
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import readline from 'readline';

// Obtenir __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Migration des Données Convex (Dev → Prod)');
console.log('='.repeat(50));
console.log('');

// Fonction pour lire le .env
function getEnvConfig() {
  const envFile = path.join(__dirname, '..', '.env');
  
  if (!fs.existsSync(envFile)) {
    console.error('❌ Fichier .env introuvable');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envFile, 'utf8');
  
  const devUrlMatch = envContent.match(/VITE_CONVEX_URL=(.+)/);
  const prodUrlMatch = envContent.match(/CONVEX_URL_PROD=(.+)/);
  
  return {
    devUrl: devUrlMatch ? devUrlMatch[1].trim() : null,
    prodUrl: prodUrlMatch ? prodUrlMatch[1].trim() : null,
  };
}

// Afficher la configuration actuelle
const config = getEnvConfig();

console.log('📋 Configuration actuelle:');
console.log(`   Dev: ${config.devUrl || '❌ Non configuré'}`);
console.log(`   Prod: ${config.prodUrl || '❌ Non configuré'}`);
console.log('');

// Étape 1 : Export depuis Dev
console.log('📤 ÉTAPE 1 : Export des données depuis Dev');
console.log('-'.repeat(50));

if (!config.devUrl || config.devUrl.includes('your-')) {
  console.log('❌ URL Convex dev non configurée');
  console.log('   Configurez VITE_CONVEX_URL dans .env');
  process.exit(1);
}

console.log('🔍 Export des données...');
try {
  execSync('node scripts/export-convex-data.js', { stdio: 'inherit' });
  console.log('');
} catch (error) {
  console.error('❌ Erreur lors de l\'export');
  process.exit(1);
}

// Vérifier que le fichier de backup existe
const backupFile = path.join(__dirname, '..', 'convex-data-backup.json');
if (!fs.existsSync(backupFile)) {
  console.error('❌ Fichier de backup non créé');
  process.exit(1);
}

const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
console.log(`✅ ${backup.metadata.totalDocuments} documents exportés\n`);

// Étape 2 : Déployer vers Prod
console.log('🚀 ÉTAPE 2 : Déploiement vers Production');
console.log('-'.repeat(50));

console.log('⚠️  Cette étape va déployer votre schéma et fonctions vers prod');
console.log('📝 Assurez-vous que votre code est prêt pour la production\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Continuer le déploiement vers prod ? (oui/non): ', (answer) => {
  if (answer.toLowerCase() !== 'oui' && answer.toLowerCase() !== 'o' && answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
    console.log('❌ Déploiement annulé');
    rl.close();
    process.exit(0);
  }

  console.log('');
  console.log('🔄 Déploiement en cours...');
  
  try {
    execSync('npx convex deploy', { stdio: 'inherit' });
    console.log('');
    console.log('✅ Déploiement réussi\n');
  } catch (error) {
    console.error('❌ Erreur lors du déploiement');
    rl.close();
    process.exit(1);
  }

  // Étape 3 : Import dans Prod
  console.log('📥 ÉTAPE 3 : Import des données dans Production');
  console.log('-'.repeat(50));
  
  console.log('⚠️  Cette étape va écraser les données existantes en prod');
  console.log('📝 Le fichier de backup sera utilisé pour l\'import\n');
  
  rl.question('Importer les données dans prod ? (oui/non): ', (answer2) => {
    if (answer2.toLowerCase() !== 'oui' && answer2.toLowerCase() !== 'o' && answer2.toLowerCase() !== 'yes' && answer2.toLowerCase() !== 'y') {
      console.log('❌ Import annulé');
      rl.close();
      process.exit(0);
    }

    console.log('');
    console.log('🔄 Import en cours...');
    
    try {
      execSync('node scripts/import-convex-data.js --prod --force', { stdio: 'inherit' });
      console.log('');
      console.log('✅ Migration complète terminée !\n');
    } catch (error) {
      console.error('❌ Erreur lors de l\'import');
      rl.close();
      process.exit(1);
    }

    // Résumé final
    console.log('🎉 Migration Réussie !');
    console.log('='.repeat(50));
    console.log('');
    console.log('📋 Prochaines étapes:');
    console.log('   1. Vérifiez votre application en production');
    console.log('   2. Testez les fonctionnalités principales');
    console.log('   3. Vérifiez les images et fichiers médias');
    console.log('   4. Connectez-vous à l\'admin et vérifiez les comptes\n');
    
    rl.close();
  });
});

