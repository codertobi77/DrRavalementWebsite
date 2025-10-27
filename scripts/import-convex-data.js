#!/usr/bin/env node

/**
 * Script d'import de données Convex
 * Importe les données depuis un fichier JSON vers la base de données Convex
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ConvexHttpClient } from 'convex/browser';

// Obtenir __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BACKUP_FILE = path.join(__dirname, '..', 'convex-data-backup.json');

// Obtenir l'URL Convex depuis .env
function getConvexUrl(env = 'dev') {
  const envFile = path.join(__dirname, '..', '.env');
  
  if (!fs.existsSync(envFile)) {
    console.error('❌ Fichier .env introuvable');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envFile, 'utf8');
  const match = envContent.match(/VITE_CONVEX_URL=(.+)/);
  
  if (!match) {
    console.error('❌ VITE_CONVEX_URL non configuré dans .env');
    process.exit(1);
  }

  let convexUrl = match[1].trim();

  // Si URL de prod est demandée
  if (env === 'prod') {
    const prodMatch = envContent.match(/CONVEX_URL_PROD=(.+)/);
    if (prodMatch) {
      convexUrl = prodMatch[1].trim();
    }
  }

  return convexUrl;
}

// Fonction principale d'import
async function importData() {
  console.log('🔄 Import des données Convex...\n');

  // Vérifier que le fichier de backup existe
  if (!fs.existsSync(BACKUP_FILE)) {
    console.error('❌ Fichier de backup introuvable:', BACKUP_FILE);
    console.error('   Exécutez d\'abord: node scripts/export-convex-data.js');
    process.exit(1);
  }

  // Charger le fichier de backup
  const backup = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf8'));
  
  console.log('📋 Métadonnées du backup:');
  console.log(`   - Exporté le: ${backup.metadata.exportedAt}`);
  console.log(`   - Environnement: ${backup.metadata.environment}`);
  console.log(`   - Total documents: ${backup.metadata.totalDocuments}\n`);

  // Obtenir l'environnement de destination
  const env = process.argv.includes('--prod') ? 'prod' : 'dev';
  const destinationUrl = getConvexUrl(env);

  console.log(`📍 Destination: ${env}`);
  console.log(`🌐 URL: ${destinationUrl}\n`);

  // Demander confirmation
  if (!process.argv.includes('--force')) {
    console.log('⚠️  ATTENTION: Cette opération va écraser les données existantes !');
    console.log('📝 Pour continuer, ajoutez le flag --force\n');
    process.exit(0);
  }

  console.log('🚀 Démarrage de l\'import...\n');

  const client = new ConvexHttpClient(destinationUrl);
  const data = backup.data;
  let totalImported = 0;

  // Mapping des noms de tables vers les noms de mutations
  const tableToMutation = {
    'users': 'users:createUser',
    'auth_sessions': 'auth:createSession',
    'site_config': 'siteConfig:setConfig',
    'bookings': 'bookings:createBooking',
    'projects': 'projects:createProject',
    'quotes': 'quotes:createQuote',
    'notifications': 'notifications:createNotification',
    'articles': 'articles:createArticle',
    'statistics': 'cms:createStatistic',
    'services': 'cms:createService',
    'zones': 'cms:createZone',
    'reasons': 'cms:createReason',
    'testimonials': 'cms:createTestimonial',
    'company_history': 'cms:createCompanyHistory',
    'values': 'cms:createValue',
    'team_members': 'cms:createTeamMember',
    'certifications': 'cms:createCertification',
    'process_steps': 'cms:createProcessStep',
    'project_filters': 'cms:createProjectFilter',
    'portfolio_projects': 'cms:createPortfolioProject',
  };

  // Importer chaque table
  for (const [table, documents] of Object.entries(data)) {
    if (!Array.isArray(documents) || documents.length === 0) {
      console.log(`⏭️  Table ${table}: 0 documents, ignoré`);
      continue;
    }

    console.log(`📦 Import de la table: ${table}...`);
    
    // Obtenir le nom de la mutation
    const mutationName = tableToMutation[table];
    
    if (!mutationName) {
      console.log(`   ⚠️  Fonction non trouvée pour ${table}, ignoré`);
      continue;
    }
    
    let imported = 0;
    let errors = 0;

    for (const doc of documents) {
      try {
        // Extraire l'ID si présent (ne pas l'envoyer pour la création)
        const { _id, _creationTime, ...docData } = doc;
        
        await client.mutation(mutationName, docData);
        imported++;
      } catch (error) {
        errors++;
        if (errors <= 3) {
          console.log(`   ⚠️  Erreur pour un document: ${error.message}`);
        }
      }
    }

    console.log(`   ✅ ${imported} documents importés`);
    if (errors > 0) {
      console.log(`   ⚠️  ${errors} erreurs`);
    }
    totalImported += imported;
  }

  console.log('\n✅ Import terminé !');
  console.log(`📊 Total de documents importés: ${totalImported}\n`);

  console.log('💡 Prochaines étapes:');
  console.log('   1. Vérifiez les données dans votre application');
  console.log('   2. Testez les fonctionnalités principales');
  console.log('   3. Vérifiez les images et fichiers médias\n');
}

// Exécuter
importData().catch(error => {
  console.error('❌ Erreur lors de l\'import:', error);
  process.exit(1);
});

