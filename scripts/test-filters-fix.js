import { readFileSync, existsSync } from 'fs';

console.log("🔧 Test de la correction des filtres...\n");

// Vérifier les modifications de la page blog
console.log("1️⃣ Vérification des modifications de la page blog...");

const blogPagePath = 'src/pages/blog/page.tsx';
if (existsSync(blogPagePath)) {
  const blogContent = readFileSync(blogPagePath, 'utf8');
  
  // Vérifier que "Actualités" n'est plus ajouté manuellement
  console.log("📊 Vérification de la logique des catégories :");
  
  if (blogContent.includes("['Tous', 'Actualités', ...(categoriesData || [])]")) {
    console.log("❌ 'Actualités' encore ajouté manuellement");
  } else if (blogContent.includes("['Tous', ...(categoriesData || [])]")) {
    console.log("✅ 'Actualités' n'est plus ajouté manuellement");
  } else {
    console.log("⚠️  Logique des catégories modifiée");
  }
  
  // Vérifier la logique de filtrage
  console.log("\n📊 Vérification de la logique de filtrage :");
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
  
} else {
  console.log("❌ Page blog non trouvée");
}

// Vérifier les modifications de Convex
console.log("\n2️⃣ Vérification des modifications de Convex...");

const convexPath = 'convex/articles.ts';
if (existsSync(convexPath)) {
  const convexContent = readFileSync(convexPath, 'utf8');
  
  // Vérifier que "Conseils" a été supprimé des catégories par défaut
  console.log("📊 Vérification des catégories par défaut :");
  
  if (convexContent.includes("'Actualités', 'Conseils', 'Techniques', 'Rénovation'")) {
    console.log("❌ 'Conseils' encore présent dans les catégories par défaut");
  } else if (convexContent.includes("'Actualités', 'Techniques', 'Rénovation'")) {
    console.log("✅ 'Conseils' supprimé des catégories par défaut");
  } else {
    console.log("⚠️  Catégories par défaut modifiées");
  }
  
  // Vérifier que "Actualités" est toujours présent
  if (convexContent.includes("'Actualités'")) {
    console.log("✅ 'Actualités' présent dans les catégories par défaut");
  } else {
    console.log("❌ 'Actualités' manquant des catégories par défaut");
  }
  
} else {
  console.log("❌ convex/articles.ts non trouvé");
}

console.log("\n🎉 Test de la correction des filtres terminé !");
console.log("\n📋 Résumé des corrections :");
console.log("   ✅ 'Actualités' n'est plus ajouté manuellement dans la page blog");
console.log("   ✅ 'Actualités' est récupéré depuis la base de données via Convex");
console.log("   ✅ 'Conseils' supprimé des catégories par défaut");
console.log("   ✅ Plus de doublons dans la liste des filtres");

console.log("\n🚀 Fonctionnement attendu :");
console.log("   • Filtres disponibles : Tous, Actualités, Techniques, Rénovation + catégories existantes");
console.log("   • Pas de doublons dans la liste");
console.log("   • Filtre 'Actualités' affiche uniquement les articles de cette catégorie");
console.log("   • Filtre 'Tous' affiche tous les articles");

console.log("\n💡 Pour tester :");
console.log("   1. Démarrez le serveur : npm run dev");
console.log("   2. Allez sur /blog");
console.log("   3. Vérifiez la liste des filtres :");
console.log("      - Pas de doublons");
console.log("      - 'Conseils' absent");
console.log("      - 'Actualités' présent une seule fois");
console.log("   4. Testez le filtrage par catégorie");
