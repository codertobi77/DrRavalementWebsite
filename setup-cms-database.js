#!/usr/bin/env node

/**
 * Script pour initialiser la base de données CMS
 * Exécuter avec: node setup-cms-database.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes:');
  console.error('   VITE_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSQLFile(filename) {
  try {
    const filePath = path.join(process.cwd(), filename);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    console.log(`📄 Exécution de ${filename}...`);
    
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error(`❌ Erreur lors de l'exécution de ${filename}:`, error.message);
      return false;
    }
    
    console.log(`✅ ${filename} exécuté avec succès`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur lors de la lecture de ${filename}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Initialisation de la base de données CMS...\n');

  // Vérifier si les tables existent déjà
  const { data: existingTables, error: tablesError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .in('table_name', ['pages', 'page_sections', 'articles', 'media_files']);

  if (tablesError) {
    console.error('❌ Erreur lors de la vérification des tables:', tablesError.message);
    process.exit(1);
  }

  if (existingTables && existingTables.length > 0) {
    console.log('⚠️  Des tables CMS existent déjà:');
    existingTables.forEach(table => console.log(`   - ${table.table_name}`));
    console.log('\nVoulez-vous continuer ? (y/N)');
    
    // En mode non-interactif, on continue
    console.log('Mode non-interactif détecté, continuation...\n');
  }

  // Exécuter les scripts SQL
  const scripts = [
    'create-content-tables.sql',
    'init-page-content.sql'
  ];

  let allSuccess = true;

  for (const script of scripts) {
    const success = await executeSQLFile(script);
    if (!success) {
      allSuccess = false;
    }
    console.log(''); // Ligne vide
  }

  if (allSuccess) {
    console.log('🎉 Base de données CMS initialisée avec succès !');
    console.log('\n📋 Prochaines étapes:');
    console.log('   1. Vérifiez les données dans Supabase Dashboard');
    console.log('   2. Testez l\'interface d\'administration');
    console.log('   3. Modifiez le contenu des pages selon vos besoins');
  } else {
    console.log('❌ Certains scripts ont échoué. Vérifiez les erreurs ci-dessus.');
    process.exit(1);
  }
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (error) => {
  console.error('❌ Erreur non gérée:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Exception non capturée:', error);
  process.exit(1);
});

main().catch((error) => {
  console.error('❌ Erreur lors de l\'initialisation:', error);
  process.exit(1);
});
