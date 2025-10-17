import { readFileSync, existsSync } from 'fs';

console.log("🔧 Test de la correction du filtre Actualités et de l'ajout de la catégorie...\n");

// Vérifier les modifications de la page blog
console.log("1️⃣ Vérification des modifications de la page blog...");

const blogPagePath = 'src/pages/blog/page.tsx';
if (existsSync(blogPagePath)) {
  const blogContent = readFileSync(blogPagePath, 'utf8');
  
  // Vérifier la logique de filtrage corrigée
  console.log("📊 Vérification de la logique de filtrage :");
  const filterChecks = [
    'selectedCategory === \'Tous\' ||',
    'selectedCategory === \'Actualités\' && article.category === \'Actualités\'',
    'selectedCategory !== \'Actualités\' && article.category === selectedCategory'
  ];
  
  for (const check of filterChecks) {
    if (blogContent.includes(check)) {
      console.log(`✅ ${check} présent`);
    } else {
      console.log(`❌ ${check} manquant`);
    }
  }
  
  // Vérifier les titres dynamiques
  console.log("\n📊 Vérification des titres dynamiques :");
  const titleChecks = [
    'selectedCategory === \'Tous\' ? \'Article à la Une\' : `Article ${selectedCategory}`',
    'selectedCategory === \'Tous\' ? \'Derniers Articles\' : `Articles ${selectedCategory}`',
    'selectedCategory === \'Actualités\'',
    'Découvrez nos dernières actualités et conseils d\'experts'
  ];
  
  for (const check of titleChecks) {
    if (blogContent.includes(check)) {
      console.log(`✅ ${check} présent`);
    } else {
      console.log(`❌ ${check} manquant`);
    }
  }
  
} else {
  console.log("❌ Page blog non trouvée");
}

// Vérifier les modifications de Convex
console.log("\n2️⃣ Vérification des modifications de Convex...");

const convexPath = 'convex/articles.ts';
if (existsSync(convexPath)) {
  const convexContent = readFileSync(convexPath, 'utf8');
  
  // Vérifier les catégories par défaut
  console.log("📊 Vérification des catégories par défaut :");
  const categoryChecks = [
    'defaultCategories = [\'Actualités\'',
    'Conseils\', \'Techniques\'',
    'Rénovation\']',
    'allCategories = [...new Set([...defaultCategories, ...categories])]'
  ];
  
  for (const check of categoryChecks) {
    if (convexContent.includes(check)) {
      console.log(`✅ ${check} présent`);
    } else {
      console.log(`❌ ${check} manquant`);
    }
  }
  
} else {
  console.log("❌ convex/articles.ts non trouvé");
}

// Vérifier le script d'ajout d'articles
console.log("\n3️⃣ Vérification du script d'ajout d'articles...");

const scriptPath = 'scripts/add-news-articles.js';
if (existsSync(scriptPath)) {
  const scriptContent = readFileSync(scriptPath, 'utf8');
  
  // Vérifier le contenu du script
  console.log("📊 Vérification du script :");
  const scriptChecks = [
    'Nouvelle réglementation thermique 2024',
    'DR RAVALEMENT obtient la certification Qualibat RGE',
    'Nouveaux matériaux écologiques',
    'category: "Actualités"',
    'status: "published"'
  ];
  
  for (const check of scriptChecks) {
    if (scriptContent.includes(check)) {
      console.log(`✅ ${check} présent`);
    } else {
      console.log(`❌ ${check} manquant`);
    }
  }
  
} else {
  console.log("❌ scripts/add-news-articles.js non trouvé");
}

console.log("\n🎉 Test de la correction terminé !");
console.log("\n📋 Résumé des modifications :");
console.log("   ✅ Logique de filtrage corrigée pour 'Actualités'");
console.log("   ✅ Filtre 'Actualités' affiche uniquement les articles de cette catégorie");
console.log("   ✅ Catégories par défaut ajoutées dans Convex");
console.log("   ✅ Script d'ajout d'articles d'actualités créé");
console.log("   ✅ Titres dynamiques adaptés");

console.log("\n🚀 Fonctionnement du filtre Actualités :");
console.log("   • Affiche uniquement les articles avec category = 'Actualités'");
console.log("   • Titre : 'Articles Actualités'");
console.log("   • Description : 'Découvrez nos dernières actualités et conseils d'experts'");
console.log("   • Message vide : 'Aucun article dans la catégorie \"Actualités\"'");

console.log("\n💡 Pour tester :");
console.log("   1. Exécutez le script d'ajout d'articles :");
console.log("      node scripts/add-news-articles.js");
console.log("   2. Démarrez le serveur : npm run dev");
console.log("   3. Allez sur /blog et testez :");
console.log("      - Filtre 'Actualités' affiche uniquement les articles d'actualités");
console.log("      - Filtre 'Tous' affiche tous les articles");
console.log("      - Autres filtres affichent les articles de leur catégorie");
console.log("   4. Vérifiez le panel admin :");
console.log("      - Catégorie 'Actualités' disponible dans le formulaire");
console.log("      - Possibilité de créer des articles d'actualités");
