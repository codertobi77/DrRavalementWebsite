#!/usr/bin/env node

/**
 * Script de vérification de la configuration CMS
 * Exécuter avec: node check-cms-setup.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement manquantes:');
  console.error('   VITE_SUPABASE_URL');
  console.error('   VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  console.log('🔍 Vérification des tables CMS...');
  
  const tables = ['pages', 'page_sections', 'articles', 'media_files'];
  const results = {};

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        results[table] = { exists: false, error: error.message };
      } else {
        results[table] = { exists: true, count: data ? data.length : 0 };
      }
    } catch (err) {
      results[table] = { exists: false, error: err.message };
    }
  }

  return results;
}

async function checkPageContent() {
  console.log('📄 Vérification du contenu des pages...');
  
  try {
    const { data: pages, error } = await supabase
      .from('pages')
      .select('slug, title, status')
      .eq('status', 'published');

    if (error) {
      console.error('❌ Erreur lors de la récupération des pages:', error.message);
      return [];
    }

    return pages || [];
  } catch (err) {
    console.error('❌ Erreur lors de la vérification des pages:', err.message);
    return [];
  }
}

async function checkPageSections() {
  console.log('🧩 Vérification des sections de pages...');
  
  try {
    const { data: sections, error } = await supabase
      .from('page_sections')
      .select('page_id, section_key, section_type, is_active')
      .eq('is_active', true);

    if (error) {
      console.error('❌ Erreur lors de la récupération des sections:', error.message);
      return [];
    }

    return sections || [];
  } catch (err) {
    console.error('❌ Erreur lors de la vérification des sections:', err.message);
    return [];
  }
}

async function main() {
  console.log('🔧 Vérification de la configuration CMS\n');

  // Vérifier les tables
  const tableResults = await checkTables();
  
  console.log('\n📊 Résultats des tables:');
  Object.entries(tableResults).forEach(([table, result]) => {
    if (result.exists) {
      console.log(`   ✅ ${table}: OK (${result.count} enregistrements)`);
    } else {
      console.log(`   ❌ ${table}: ERREUR - ${result.error}`);
    }
  });

  // Vérifier le contenu des pages
  const pages = await checkPageContent();
  console.log(`\n📄 Pages trouvées: ${pages.length}`);
  pages.forEach(page => {
    console.log(`   - ${page.title} (/${page.slug})`);
  });

  // Vérifier les sections
  const sections = await checkPageSections();
  console.log(`\n🧩 Sections trouvées: ${sections.length}`);
  
  // Grouper par page
  const sectionsByPage = sections.reduce((acc, section) => {
    if (!acc[section.page_id]) acc[section.page_id] = [];
    acc[section.page_id].push(section);
    return acc;
  }, {});

  Object.entries(sectionsByPage).forEach(([pageId, pageSections]) => {
    console.log(`   Page ${pageId}: ${pageSections.length} sections`);
    pageSections.forEach(section => {
      console.log(`     - ${section.section_key} (${section.section_type})`);
    });
  });

  // Résumé
  const allTablesExist = Object.values(tableResults).every(result => result.exists);
  const hasContent = pages.length > 0 && sections.length > 0;

  console.log('\n📋 Résumé:');
  if (allTablesExist && hasContent) {
    console.log('   ✅ Configuration CMS complète et fonctionnelle');
    console.log('   🚀 Vous pouvez maintenant utiliser l\'interface d\'administration');
  } else if (allTablesExist) {
    console.log('   ⚠️  Tables créées mais contenu manquant');
    console.log('   💡 Exécutez: node setup-cms-database.js');
  } else {
    console.log('   ❌ Configuration incomplète');
    console.log('   💡 Vérifiez les erreurs ci-dessus et réessayez');
  }
}

main().catch((error) => {
  console.error('❌ Erreur lors de la vérification:', error);
  process.exit(1);
});
