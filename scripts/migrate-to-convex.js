#!/usr/bin/env node

/**
 * Script de migration automatique de Supabase vers Convex
 * Exécuter avec: node migrate-to-convex.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mappings des remplacements
const replacements = [
  // Imports Supabase
  {
    from: /import\s*{\s*supabase\s*}\s*from\s*['"]\.\.?\/.*supabase['"];?/g,
    to: 'import { useQuery, useMutation } from "convex/react";\nimport { api } from "../../convex/_generated/api";'
  },
  {
    from: /import\s*{\s*PageContentService\s*}\s*from\s*['"]\.\.?\/.*page-content['"];?/g,
    to: 'import { usePageBySlug, useAllPages, useCreatePage, useUpdatePage, useDeletePage } from \'../lib/page-content-convex\';'
  },
  {
    from: /import\s*{\s*BookingService\s*}\s*from\s*['"]\.\.?\/.*booking['"];?/g,
    to: 'import { useBookings, useCreateBooking, useUpdateBooking, useDeleteBooking } from \'../lib/booking-convex\';'
  },
  {
    from: /import\s*{\s*SiteConfigService\s*}\s*from\s*['"]\.\.?\/.*site-config['"];?/g,
    to: 'import { useConfigByKey, useSetConfig } from \'../lib/site-config-convex\';'
  },
  
  // Remplacements des appels de service
  {
    from: /PageContentService\.getAllPages\(\)/g,
    to: 'useQuery(api.pages.getAllPages)'
  },
  {
    from: /PageContentService\.getPageBySlug\(([^)]+)\)/g,
    to: 'useQuery(api.pages.getPageBySlug, { slug: $1 })'
  },
  {
    from: /BookingService\.getBookings\(\)/g,
    to: 'useQuery(api.bookings.getBookings)'
  },
  {
    from: /SiteConfigService\.getBookingConfig\(\)/g,
    to: 'useQuery(api.siteConfig.getConfigByKey, { key: "booking_config" })'
  },
  {
    from: /SiteConfigService\.getContactConfig\(\)/g,
    to: 'useQuery(api.siteConfig.getConfigByKey, { key: "contact_config" })'
  },
  
  // Remplacements des IDs
  {
    from: /\.id\b/g,
    to: '._id'
  },
  
  // Remplacements des états de chargement
  {
    from: /const\s*\[\s*loading\s*,\s*setLoading\s*\]\s*=\s*useState\(true\);?/g,
    to: '// Loading state handled by Convex hooks'
  },
  {
    from: /if\s*\(\s*loading\s*\)\s*\{[\s\S]*?\}/g,
    to: 'if (data === undefined) { return <div>Loading...</div>; }'
  },
  
  // Remplacements des useEffect
  {
    from: /useEffect\(\(\)\s*=>\s*\{[\s\S]*?loadData\(\);[\s\S]*?\},\s*\[\]\);?/g,
    to: '// Data loading handled by Convex hooks'
  }
];

// Fonction pour traiter un fichier
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Appliquer les remplacements
    for (const replacement of replacements) {
      const newContent = content.replace(replacement.from, replacement.to);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }
    
    // Sauvegarder si modifié
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Migré: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Erreur lors du traitement de ${filePath}:`, error.message);
    return false;
  }
}

// Fonction pour parcourir récursivement les dossiers
function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  let processedCount = 0;
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Ignorer node_modules et autres dossiers
      if (!['node_modules', '.git', 'dist', 'build'].includes(item)) {
        processedCount += processDirectory(itemPath);
      }
    } else if (stat.isFile() && item.endsWith('.tsx')) {
      if (processFile(itemPath)) {
        processedCount++;
      }
    }
  }
  
  return processedCount;
}

// Fonction principale
function main() {
  console.log('🚀 Début de la migration Supabase → Convex\n');
  
  const srcDir = path.join(__dirname, 'src');
  
  if (!fs.existsSync(srcDir)) {
    console.error('❌ Dossier src non trouvé');
    process.exit(1);
  }
  
  console.log('📁 Traitement des fichiers TypeScript/React...');
  const processedCount = processDirectory(srcDir);
  
  console.log(`\n✅ Migration terminée: ${processedCount} fichiers traités`);
  console.log('\n📋 Prochaines étapes:');
  console.log('   1. Vérifiez les fichiers modifiés');
  console.log('   2. Testez l\'application');
  console.log('   3. Ajustez manuellement si nécessaire');
  console.log('   4. Supprimez les dépendances Supabase');
}

// Gestion des erreurs
process.on('unhandledRejection', (error) => {
  console.error('❌ Erreur non gérée:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Exception non capturée:', error);
  process.exit(1);
});

main();
