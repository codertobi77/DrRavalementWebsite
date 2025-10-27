#!/usr/bin/env node

/**
 * Script de vérification des données après migration
 * Vérifie l'intégrité et la présence des données critiques
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ConvexHttpClient } from 'convex/browser';

// Obtenir __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Obtenir l'URL Convex
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

  return match[1].trim();
}

// Fonction principale de vérification
async function verifyData() {
  console.log('🔍 Vérification des données Convex...\n');

  const env = process.argv.includes('--prod') ? 'prod' : 'dev';
  const convexUrl = getConvexUrl(env);

  console.log(`📍 Environnement: ${env}`);
  console.log(`🌐 URL: ${convexUrl}\n`);

  const client = new ConvexHttpClient(convexUrl);

  // Liste des tables critiques
  const criticalTables = {
    users: { min: 1, description: 'Utilisateurs (au moins 1 admin)' },
    site_config: { min: 1, description: 'Configuration du site' },
    services: { min: 1, description: 'Services' },
  };

  // Tables importantes
  const importantTables = [
    'statistics',
    'zones',
    'reasons',
    'testimonials',
    'company_history',
    'values',
    'team_members',
    'certifications',
    'process_steps',
    'portfolio_projects',
  ];

  let allOk = true;

  console.log('📋 Tables Critiques:');
  console.log('-'.repeat(50));

  // Vérifier les tables critiques
  for (const [table, { min, description }] of Object.entries(criticalTables)) {
    try {
      const data = await client.query(`${table}:list`, {});
      const count = Array.isArray(data) ? data.length : 0;
      
      if (count >= min) {
        console.log(`✅ ${table}: ${count} documents (min: ${min}) - ${description}`);
      } else {
        console.log(`⚠️  ${table}: ${count} documents (min: ${min}) - ${description}`);
        allOk = false;
      }
    } catch (error) {
      console.log(`❌ ${table}: Erreur - ${error.message}`);
      allOk = false;
    }
  }

  console.log('\n📋 Tables Importantes:');
  console.log('-'.repeat(50));

  // Vérifier les tables importantes
  for (const table of importantTables) {
    try {
      const data = await client.query(`${table}:list`, {});
      const count = Array.isArray(data) ? data.length : 0;
      
      if (count > 0) {
        console.log(`✅ ${table}: ${count} documents`);
      } else {
        console.log(`⚠️  ${table}: 0 documents`);
      }
    } catch (error) {
      console.log(`⚠️  ${table}: Erreur ou table vide - ${error.message}`);
    }
  }

  // Vérifications spécifiques
  console.log('\n🔍 Vérifications Spécifiques:');
  console.log('-'.repeat(50));

  // Vérifier qu'il y a au moins un admin
  try {
    const users = await client.query('users:list', {});
    const admins = Array.isArray(users) ? users.filter(u => u.role === 'admin') : [];
    
    if (admins.length > 0) {
      console.log(`✅ Administrateurs: ${admins.length} trouvé(s)`);
      admins.forEach((admin, idx) => {
        console.log(`   ${idx + 1}. ${admin.email || 'N/A'} (${admin.name || 'N/A'})`);
      });
    } else {
      console.log('⚠️  Administrateurs: Aucun trouvé');
      allOk = false;
    }
  } catch (error) {
    console.log(`⚠️  Administrateurs: Erreur - ${error.message}`);
  }

  // Vérifier la config du site
  try {
    const configs = await client.query('site_config:list', {});
    const configKeys = ['booking_config', 'contact_config', 'appearance_config'];
    const missing = configKeys.filter(key => 
      !Array.isArray(configs) || !configs.find(c => c.key === key)
    );
    
    if (missing.length === 0) {
      console.log('✅ Configuration du site: Complète');
    } else {
      console.log(`⚠️  Configuration du site: Manquante - ${missing.join(', ')}`);
    }
  } catch (error) {
    console.log(`⚠️  Configuration du site: Erreur - ${error.message}`);
  }

  // Résultat final
  console.log('\n' + '='.repeat(50));
  if (allOk) {
    console.log('✅ Vérification terminée: Tout est OK !');
  } else {
    console.log('⚠️  Vérification terminée: Certains problèmes détectés');
  }
  console.log('='.repeat(50));
}

// Exécuter
verifyData().catch(error => {
  console.error('❌ Erreur lors de la vérification:', error);
  process.exit(1);
});

