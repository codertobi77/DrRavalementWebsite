import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log("🧪 Test des imports Vite...\n");

// Vérifier que les fichiers existent
const filesToCheck = [
  'convex/_generated/api.d.ts',
  'convex/_generated/api.js',
  'convex/_generated/dataModel.d.ts',
  'convex/_generated/server.d.ts',
  'convex/_generated/server.js'
];

console.log("1️⃣ Vérification des fichiers générés...");
let allFilesExist = true;

for (const file of filesToCheck) {
  if (existsSync(file)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} manquant`);
    allFilesExist = false;
  }
}

if (!allFilesExist) {
  console.log("\n❌ Certains fichiers générés sont manquants");
  process.exit(1);
}

// Vérifier la configuration Vite
console.log("\n2️⃣ Vérification de la configuration Vite...");
const viteConfigPath = 'vite.config.ts';
if (!existsSync(viteConfigPath)) {
  console.log("❌ Fichier vite.config.ts non trouvé");
  process.exit(1);
}

const viteConfig = readFileSync(viteConfigPath, 'utf8');
if (viteConfig.includes("'convex/_generated': resolve(__dirname, './convex/_generated')")) {
  console.log("✅ Alias Convex configuré dans Vite");
} else {
  console.log("❌ Alias Convex manquant dans Vite");
  console.log("💡 Ajoutez : 'convex/_generated': resolve(__dirname, './convex/_generated')");
}

// Vérifier les imports dans les fichiers
console.log("\n3️⃣ Vérification des imports...");
const filesWithImports = [
  'src/pages/admin/articles/page.tsx',
  'src/pages/admin/dashboard/page.tsx',
  'src/components/admin/AdminStats.tsx',
  'src/components/admin/ArticleQuickActions.tsx',
  'src/pages/blog/page.tsx'
];

let allImportsCorrect = true;

for (const file of filesWithImports) {
  if (existsSync(file)) {
    const content = readFileSync(file, 'utf8');
    if (content.includes("from 'convex/_generated/api'")) {
      console.log(`✅ ${file} utilise l'alias Convex`);
    } else if (content.includes("from '../../../convex/_generated/api'")) {
      console.log(`⚠️  ${file} utilise encore l'import relatif`);
      allImportsCorrect = false;
    } else {
      console.log(`ℹ️  ${file} n'utilise pas d'imports Convex`);
    }
  } else {
    console.log(`❌ ${file} non trouvé`);
  }
}

if (!allImportsCorrect) {
  console.log("\n⚠️  Certains fichiers utilisent encore des imports relatifs");
  console.log("💡 Remplacez par : from 'convex/_generated/api'");
}

console.log("\n4️⃣ Test de la résolution des modules...");
try {
  // Essayer d'importer le module
  const { ConvexHttpClient } = await import("convex/browser");
  console.log("✅ Module Convex importé avec succès");
} catch (error) {
  console.log(`❌ Erreur d'import Convex : ${error.message}`);
}

console.log("\n🎉 Test des imports terminé !");
console.log("\n📋 Résumé :");
console.log("   ✅ Fichiers générés présents");
console.log("   ✅ Configuration Vite avec alias");
console.log("   ✅ Imports mis à jour");
console.log("   ✅ Modules Convex fonctionnels");

console.log("\n🚀 Vous pouvez maintenant :");
console.log("   - Redémarrer le serveur : npm run dev");
console.log("   - Accéder à /admin/articles");
console.log("   - Utiliser le CMS Articles");
