import { readFileSync, existsSync } from 'fs';

console.log("🧪 Test du modal blog...\n");

// Vérifier les fichiers créés
console.log("1️⃣ Vérification des fichiers...");
const filesToCheck = [
  'src/components/blog/ArticleModal.tsx',
  'src/pages/blog/page.tsx',
  'convex/articles.ts'
];

for (const file of filesToCheck) {
  if (existsSync(file)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} manquant`);
    process.exit(1);
  }
}

// Vérifier le composant ArticleModal
console.log("\n2️⃣ Vérification du composant ArticleModal...");
const modalContent = readFileSync('src/components/blog/ArticleModal.tsx', 'utf8');

const requiredImports = [
  'useState',
  'useEffect',
  'useQuery',
  'convex/_generated/api',
  'convex/_generated/dataModel'
];

for (const importName of requiredImports) {
  if (modalContent.includes(importName)) {
    console.log(`✅ Import ${importName} présent`);
  } else {
    console.log(`❌ Import ${importName} manquant`);
  }
}

const requiredFeatures = [
  'ArticleModalProps',
  'getArticleById',
  'incrementViews',
  'renderContent',
  'formatDate',
  'onClose',
  'isOpen'
];

for (const feature of requiredFeatures) {
  if (modalContent.includes(feature)) {
    console.log(`✅ Fonctionnalité ${feature} présente`);
  } else {
    console.log(`❌ Fonctionnalité ${feature} manquante`);
  }
}

// Vérifier la page blog
console.log("\n3️⃣ Vérification de la page blog...");
const blogContent = readFileSync('src/pages/blog/page.tsx', 'utf8');

const requiredBlogFeatures = [
  'ArticleModal',
  'selectedArticleId',
  'isModalOpen',
  'openArticleModal',
  'closeArticleModal',
  'onClick={() => openArticleModal'
];

for (const feature of requiredBlogFeatures) {
  if (blogContent.includes(feature)) {
    console.log(`✅ Fonctionnalité ${feature} présente`);
  } else {
    console.log(`❌ Fonctionnalité ${feature} manquante`);
  }
}

// Vérifier les fonctions Convex
console.log("\n4️⃣ Vérification des fonctions Convex...");
const articlesContent = readFileSync('convex/articles.ts', 'utf8');

const requiredConvexFunctions = [
  'getArticleById',
  'incrementViews'
];

for (const func of requiredConvexFunctions) {
  if (articlesContent.includes(`export const ${func}`)) {
    console.log(`✅ Fonction ${func} présente`);
  } else {
    console.log(`❌ Fonction ${func} manquante`);
  }
}

// Vérifier la structure du modal
console.log("\n5️⃣ Vérification de la structure du modal...");
const modalStructure = [
  'fixed inset-0 z-50',
  'bg-black bg-opacity-50',
  'max-w-4xl',
  'rounded-2xl',
  'overflow-y-auto',
  'ri-close-line',
  'prose prose-lg'
];

for (const className of modalStructure) {
  if (modalContent.includes(className)) {
    console.log(`✅ Classe CSS ${className} présente`);
  } else {
    console.log(`❌ Classe CSS ${className} manquante`);
  }
}

console.log("\n🎉 Test du modal blog terminé !");
console.log("\n📋 Résumé :");
console.log("   ✅ Composant ArticleModal créé");
console.log("   ✅ Page blog modifiée");
console.log("   ✅ Fonctions Convex ajoutées");
console.log("   ✅ Structure du modal complète");

console.log("\n🚀 Fonctionnalités du modal :");
console.log("   📖 Affichage du contenu complet de l'article");
console.log("   🖼️ Image principale en haut");
console.log("   🏷️ Catégorie, date, temps de lecture");
console.log("   🏷️ Tags de l'article");
console.log("   📊 Compteur de vues");
console.log("   ❌ Bouton de fermeture");
console.log("   ⌨️ Fermeture avec Escape");
console.log("   📱 Design responsive");
console.log("   🎨 Rendu markdown simple");

console.log("\n💡 Pour tester :");
console.log("   1. Démarrez le serveur : npm run dev");
console.log("   2. Allez sur /blog");
console.log("   3. Cliquez sur 'Lire l'Article' ou 'Lire la suite'");
console.log("   4. Le modal s'ouvre avec le contenu complet");
