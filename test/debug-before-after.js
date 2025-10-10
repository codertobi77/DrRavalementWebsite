import { ConvexHttpClient } from "convex/browser";

// Configuration Convex
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://acoustic-ox-512.convex.cloud";

const client = new ConvexHttpClient(CONVEX_URL);

async function debugBeforeAfter() {
  console.log("🔍 Debug de la galerie avant-après...");
  
  try {
    // 1. Récupérer tous les projets de portfolio
    console.log("\n1. Récupération de tous les projets de portfolio...");
    const allProjects = await client.query("cms:getPortfolioProjects");
    console.log(`📊 Total des projets: ${allProjects.length}`);
    
    // Afficher les détails de chaque projet
    allProjects.forEach((project, index) => {
      console.log(`\n   Projet ${index + 1}:`);
      console.log(`   - ID: ${project._id}`);
      console.log(`   - Titre: ${project.title}`);
      console.log(`   - Catégorie: ${project.category}`);
      console.log(`   - Actif: ${project.is_active}`);
      console.log(`   - Avant-après: ${project.is_before_after}`);
      console.log(`   - Image avant: ${project.before_image ? '✅' : '❌'}`);
      console.log(`   - Image après: ${project.after_image ? '✅' : '❌'}`);
    });

    // 2. Filtrer les projets avant-après
    console.log("\n2. Filtrage des projets avant-après...");
    const beforeAfterProjects = allProjects.filter(project => 
      project.is_before_after && project.before_image && project.after_image
    );
    console.log(`🖼️ Projets avant-après filtrés: ${beforeAfterProjects.length}`);
    
    // Afficher les détails des projets avant-après
    beforeAfterProjects.forEach((project, index) => {
      console.log(`\n   Projet avant-après ${index + 1}:`);
      console.log(`   - ID: ${project._id}`);
      console.log(`   - Titre: ${project.title}`);
      console.log(`   - Catégorie: ${project.category}`);
    });

    // 3. Vérifier la fonction spécifique
    console.log("\n3. Test de la fonction getBeforeAfterProjects...");
    const beforeAfterFromFunction = await client.query("cms:getBeforeAfterProjects");
    console.log(`🖼️ Projets depuis getBeforeAfterProjects: ${beforeAfterFromFunction.length}`);
    
    // 4. Vérifier les catégories
    console.log("\n4. Répartition par catégorie:");
    const categories = ['ravalement', 'maconnerie', 'couverture'];
    for (const category of categories) {
      const categoryProjects = allProjects.filter(p => p.category === category);
      const beforeAfterInCategory = categoryProjects.filter(p => p.is_before_after);
      console.log(`   ${category}: ${categoryProjects.length} projets (${beforeAfterInCategory.length} avant-après)`);
    }

    // 5. Vérifier les champs manquants
    console.log("\n5. Vérification des champs manquants:");
    const projectsWithMissingFields = allProjects.filter(project => 
      project.is_before_after && (!project.before_image || !project.after_image)
    );
    
    if (projectsWithMissingFields.length > 0) {
      console.log(`⚠️ ${projectsWithMissingFields.length} projets avant-après avec des champs manquants:`);
      projectsWithMissingFields.forEach((project, index) => {
        console.log(`   ${index + 1}. ${project.title}`);
        console.log(`      - Image avant: ${project.before_image ? '✅' : '❌'}`);
        console.log(`      - Image après: ${project.after_image ? '✅' : '❌'}`);
      });
    } else {
      console.log("✅ Tous les projets avant-après ont les champs requis");
    }

  } catch (error) {
    console.error("❌ Erreur lors du debug:", error);
  }
}

// Exécuter le debug
debugBeforeAfter()
  .then(() => {
    console.log("\n✅ Debug terminé");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erreur fatale:", error);
    process.exit(1);
  });

export { debugBeforeAfter };
