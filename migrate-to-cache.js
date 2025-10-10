/**
 * Script de migration pour mettre à jour les composants CMS vers le système de cache
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SRC_DIR = './src';
const COMPONENTS_DIR = path.join(SRC_DIR, 'components');
const PAGES_DIR = path.join(SRC_DIR, 'pages');

// Patterns de remplacement
const replacements = [
  // Import statements
  {
    pattern: /import\s*{\s*useQuery\s*}\s*from\s*["']convex\/react["'];\s*\nimport\s*{\s*api\s*}\s*from\s*["'][^"']*\/convex\/_generated\/api["'];?/g,
    replacement: `import { useCachedServices, useCachedStatistics, useCachedZones, useCachedReasons, useCachedTestimonials } from '../../lib/cms-cache';`
  },
  
  // useQuery patterns
  {
    pattern: /const\s+(\w+)\s*=\s*useQuery\(api\.cms\.get(\w+)\);/g,
    replacement: (match, varName, queryType) => {
      const hookMap = {
        'Statistics': 'useCachedStatistics',
        'Services': 'useCachedServices',
        'Zones': 'useCachedZones',
        'Reasons': 'useCachedReasons',
        'Testimonials': 'useCachedTestimonials'
      };
      
      const hookName = hookMap[queryType];
      if (hookName) {
        return `const { data: ${varName}, isLoading: ${varName}Loading, isCached: ${varName}Cached } = ${hookName}();`;
      }
      return match;
    }
  },

  // Validation patterns
  {
    pattern: /const\s+(\w+)\s*=\s*validateCmsData\(\s*(\w+),\s*deduplicate(\w+),\s*["'][^"']*["']\s*\);/g,
    replacement: `const $1 = validateCmsData($2, deduplicate$3, "Aucune donnée disponible");`
  },

  // Loading states
  {
    pattern: /if\s*\(\s*!\s*(\w+)\s*\)\s*{/g,
    replacement: `if (!$1 || $1Loading) {`
  }
];

// Fonction pour traiter un fichier
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Appliquer les remplacements
    replacements.forEach(({ pattern, replacement }) => {
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });

    // Ajouter les indicateurs de cache si nécessaire
    if (content.includes('useCached') && !content.includes('isCached')) {
      // Ajouter des indicateurs de cache dans le JSX
      content = content.replace(
        /(<div[^>]*className="[^"]*grid[^"]*"[^>]*>)/g,
        '$1\n        {isCached && (\n          <div className="col-span-full text-center text-sm text-gray-500 mt-2">\n            <i className="ri-database-line mr-1"></i>\n            Données chargées depuis le cache\n          </div>\n        )}'
      );
      modified = true;
    }

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

// Fonction pour parcourir récursivement les répertoires
function walkDirectory(dir, extensions = ['.tsx', '.ts']) {
  const results = [];
  
  try {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        results.push(...walkDirectory(filePath, extensions));
      } else if (extensions.some(ext => file.endsWith(ext))) {
        results.push(filePath);
      }
    }
  } catch (error) {
    console.error(`❌ Erreur lors de la lecture du répertoire ${dir}:`, error.message);
  }
  
  return results;
}

// Fonction principale
function migrateToCache() {
  console.log('🚀 Migration vers le système de cache CMS\n');

  // Trouver tous les fichiers à traiter
  const componentFiles = walkDirectory(COMPONENTS_DIR);
  const pageFiles = walkDirectory(PAGES_DIR);
  const allFiles = [...componentFiles, ...pageFiles];

  console.log(`📁 ${allFiles.length} fichiers trouvés\n`);

  let migratedCount = 0;
  let errorCount = 0;

  // Traiter chaque fichier
  allFiles.forEach(filePath => {
    try {
      if (processFile(filePath)) {
        migratedCount++;
      }
    } catch (error) {
      console.error(`❌ Erreur avec ${filePath}:`, error.message);
      errorCount++;
    }
  });

  // Résultats
  console.log('\n📊 Résultats de la migration:');
  console.log(`✅ Fichiers migrés: ${migratedCount}`);
  console.log(`❌ Erreurs: ${errorCount}`);
  console.log(`📁 Total traité: ${allFiles.length}`);

  if (migratedCount > 0) {
    console.log('\n🎉 Migration terminée !');
    console.log('\n📝 Prochaines étapes:');
    console.log('1. Vérifiez les fichiers migrés');
    console.log('2. Testez les composants');
    console.log('3. Ajustez les indicateurs de cache si nécessaire');
    console.log('4. Lancez les tests de performance');
  } else {
    console.log('\n⚠️  Aucun fichier n\'a été migré. Vérifiez les patterns de recherche.');
  }

  return migratedCount > 0;
}

// Fonction pour créer un backup
function createBackup() {
  const backupDir = './backup-before-cache-migration';
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log('💾 Création d\'un backup...');
  
  try {
    // Copier les répertoires importants
    const dirsToBackup = ['src/components', 'src/pages'];
    
    dirsToBackup.forEach(dir => {
      if (fs.existsSync(dir)) {
        const destDir = path.join(backupDir, dir);
        fs.mkdirSync(destDir, { recursive: true });
        
        // Copier récursivement
        const files = walkDirectory(dir);
        files.forEach(file => {
          const relativePath = path.relative(dir, file);
          const destPath = path.join(destDir, relativePath);
          const destDirPath = path.dirname(destPath);
          
          if (!fs.existsSync(destDirPath)) {
            fs.mkdirSync(destDirPath, { recursive: true });
          }
          
          fs.copyFileSync(file, destPath);
        });
      }
    });
    
    console.log(`✅ Backup créé dans ${backupDir}`);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la création du backup:', error.message);
    return false;
  }
}

// Exécuter la migration
if (require.main === module) {
  console.log('🔧 Script de migration vers le système de cache CMS\n');
  
  // Créer un backup
  if (createBackup()) {
    // Lancer la migration
    const success = migrateToCache();
    
    if (success) {
      console.log('\n✨ Migration réussie ! Votre application utilise maintenant le système de cache CMS.');
    } else {
      console.log('\n⚠️  Migration partielle. Vérifiez les erreurs ci-dessus.');
    }
  } else {
    console.log('\n❌ Impossible de créer un backup. Migration annulée.');
    process.exit(1);
  }
}

module.exports = { migrateToCache, createBackup };
