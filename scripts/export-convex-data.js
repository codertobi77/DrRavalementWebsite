#!/usr/bin/env node

/**
 * Script d'export de toutes les données Convex
 * Exporte toutes les données de la base de données Convex vers un fichier JSON
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ConvexHttpClient } from 'convex/browser';

// Obtenir __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const OUTPUT_FILE = path.join(__dirname, '..', 'convex-data-backup.json');

// Obtenir l'URL Convex depuis .env
function getConvexUrl(env = 'dev') {
  const envFile = path.join(__dirname, '..', '.env');
  
  if (!fs.existsSync(envFile)) {
    console.error('❌ Fichier .env introuvable');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envFile, 'utf8');
  let convexUrl = null;

  if (env === 'prod') {
    const match = envContent.match(/CONVEX_URL_PROD=(.+)/);
    convexUrl = match ? match[1].trim() : null;
  } else {
    const match = envContent.match(/VITE_CONVEX_URL=(.+)/);
    convexUrl = match ? match[1].trim() : null;
  }

  if (!convexUrl || convexUrl.includes('your-')) {
    console.error('❌ VITE_CONVEX_URL non configuré dans .env');
    console.error('   Ajoutez: VITE_CONVEX_URL=https://your-project.convex.cloud');
    process.exit(1);
  }

  return convexUrl;
}

// Fonction principale d'export
async function exportData() {
  console.log('🔄 Export des données Convex...\n');

  // Obtenir l'environnement
  const env = process.argv.includes('--prod') ? 'prod' : 'dev';
  const convexUrl = getConvexUrl(env);

  console.log(`📍 Environnement: ${env}`);
  console.log(`🌐 URL: ${convexUrl}\n`);

  const client = new ConvexHttpClient(convexUrl);

  // Liste de toutes les tables à exporter (selon schema.ts)
  const tables = [
    'users',
    'auth_sessions',
    'site_config',
    'bookings',
    'media_files',
    'projects',
    'quotes',
    'notifications',
    'statistics',
    'services',
    'zones',
    'reasons',
    'testimonials',
    'company_history',
    'values',
    'team_members',
    'certifications',
    'process_steps',
    'project_filters',
    'portfolio_projects',
    'articles',
  ];

  const exportedData = {};
  let totalDocs = 0;

  // Mapping des noms de tables vers les noms de fonctions
  const tableToFunction = {
    'users': 'users:getAllUsers',
    'auth_sessions': 'auth:getUserSessions',
    'site_config': 'siteConfig:getAllConfigs',
    'bookings': 'bookings:getBookings',
    'projects': 'projects:getAllProjects',
    'quotes': 'quotes:getAllQuotes',
    'notifications': 'notifications:getAllNotifications',
    'articles': 'articles:getArticles',
    'statistics': 'cms:getStatistics',
    'services': 'cms:getServices',
    'zones': 'cms:getZones',
    'reasons': 'cms:getReasons',
    'testimonials': 'cms:getTestimonials',
    'company_history': 'cms:getCompanyHistory',
    'values': 'cms:getValues',
    'team_members': 'cms:getTeamMembers',
    'certifications': 'cms:getCertifications',
    'process_steps': 'cms:getProcessSteps',
    'project_filters': 'cms:getProjectFilters',
    'portfolio_projects': 'cms:getPortfolioProjects',
  };

  // Exporter chaque table
  for (const table of tables) {
    try {
      console.log(`📦 Export de la table: ${table}...`);
      
      // Obtenir le nom de la fonction
      const functionName = tableToFunction[table];
      
      if (!functionName) {
        console.log(`   ⚠️  Fonction non trouvée pour ${table}, ignoré`);
        exportedData[table] = [];
        continue;
      }
      
      let data = [];
      try {
        // Appeler la fonction avec les bons paramètres
        if (functionName === 'cms:getStatistics' || functionName === 'cms:getCompanyHistory') {
          data = await client.query(functionName, {});
        } else if (functionName === 'articles:getArticles') {
          // Pour les articles, récupérer tous (sans filtre)
          data = await client.query(functionName, {});
        } else {
          data = await client.query(functionName, {});
        }
        
        // gérer les cas où les fonctions retournent un objet unique au lieu d'un array
        if (!Array.isArray(data)) {
          if (data !== null && data !== undefined) {
            data = [data];
          } else {
            data = [];
          }
        }
      } catch (e) {
        console.log(`   ⚠️  Erreur lors de l'appel à ${functionName}: ${e.message}`);
        data = [];
      }

      exportedData[table] = data || [];
      const count = Array.isArray(data) ? data.length : 0;
      console.log(`   ✅ ${count} documents exportés`);
      totalDocs += count;
    } catch (error) {
      console.log(`   ⚠️  Erreur lors de l'export: ${error.message}`);
      exportedData[table] = [];
    }
  }

  // Ajouter les métadonnées
  const backup = {
    metadata: {
      exportedAt: new Date().toISOString(),
      environment: env,
      convexUrl: convexUrl,
      totalDocuments: totalDocs,
      tables: Object.keys(exportedData).map(table => ({
        name: table,
        count: Array.isArray(exportedData[table]) ? exportedData[table].length : 0,
      })),
    },
    data: exportedData,
  };

  // Sauvegarder dans le fichier
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(backup, null, 2));
  
  console.log('\n✅ Export terminé !');
  console.log(`📄 Fichier créé: ${OUTPUT_FILE}`);
  console.log(`📊 Total de documents: ${totalDocs}\n`);

  // Afficher le résumé
  console.log('📋 Résumé par table:');
  Object.keys(exportedData).forEach(table => {
    const count = Array.isArray(exportedData[table]) ? exportedData[table].length : 0;
    console.log(`   - ${table}: ${count} documents`);
  });

  console.log('\n💡 Vous pouvez maintenant importer ces données avec:');
  console.log('   node scripts/import-convex-data.js\n');
}

// Exécuter
exportData().catch(error => {
  console.error('❌ Erreur lors de l\'export:', error);
  process.exit(1);
});

