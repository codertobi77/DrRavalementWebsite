import { ConvexHttpClient } from "convex/browser";

// Configuration Convex
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://acoustic-ox-512.convex.cloud";

const client = new ConvexHttpClient(CONVEX_URL);

async function testBeforeAfterGallery() {
  console.log("🧪 Test de la galerie avant-après...");
  
  try {
    // 1. Tester la récupération des projets avant-après
    console.log("\n1. Récupération des projets avant-après...");
    const beforeAfterProjects = await client.query("cms:getBeforeAfterProjects");
    console.log(`✅ ${beforeAfterProjects.length} projets avant-après trouvés`);
    
    if (beforeAfterProjects.length > 0) {
      console.log("📋 Détails des projets:");
      beforeAfterProjects.forEach((project, index) => {
        console.log(`   ${index + 1}. ${project.title}`);
        console.log(`      - Catégorie: ${project.category}`);
        console.log(`      - Image avant: ${project.before_image ? '✅' : '❌'}`);
        console.log(`      - Image après: ${project.after_image ? '✅' : '❌'}`);
        console.log(`      - Actif: ${project.is_active ? '✅' : '❌'}`);
        console.log(`      - Avant-après: ${project.is_before_after ? '✅' : '❌'}`);
        console.log("");
      });
    }

    // 2. Tester la récupération de tous les projets de portfolio
    console.log("\n2. Récupération de tous les projets de portfolio...");
    const allProjects = await client.query("cms:getPortfolioProjects");
    console.log(`✅ ${allProjects.length} projets de portfolio trouvés`);
    
    // Compter les projets avant-après
    const beforeAfterCount = allProjects.filter(p => p.is_before_after).length;
    console.log(`📊 Projets avant-après: ${beforeAfterCount}/${allProjects.length}`);

    // 3. Tester la récupération par catégorie
    console.log("\n3. Test des catégories...");
    const categories = ['ravalement', 'maconnerie', 'couverture'];
    
    for (const category of categories) {
      const categoryProjects = await client.query("cms:getPortfolioProjectsByCategory", { category });
      const beforeAfterInCategory = categoryProjects.filter(p => p.is_before_after).length;
      console.log(`   ${category}: ${categoryProjects.length} projets (${beforeAfterInCategory} avant-après)`);
    }

    // 4. Vérifier la structure des données
    console.log("\n4. Vérification de la structure des données...");
    if (beforeAfterProjects.length > 0) {
      const sampleProject = beforeAfterProjects[0];
      const requiredFields = ['title', 'category', 'description', 'details', 'before_image', 'after_image', 'is_before_after'];
      
      console.log("🔍 Champs requis dans les projets avant-après:");
      requiredFields.forEach(field => {
        const hasField = sampleProject.hasOwnProperty(field);
        const value = sampleProject[field];
        console.log(`   ${field}: ${hasField ? '✅' : '❌'} ${value ? `(${typeof value})` : '(vide)'}`);
      });
    }

    console.log("\n🎉 Test de la galerie avant-après terminé avec succès !");
    
  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  }
}

// Exécuter le test
testBeforeAfterGallery()
  .then(() => {
    console.log("✅ Test terminé");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erreur fatale:", error);
    process.exit(1);
  });

export { testBeforeAfterGallery };
