import { ConvexHttpClient } from "convex/browser";

// Configuration Convex
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://acoustic-ox-512.convex.cloud";

const client = new ConvexHttpClient(CONVEX_URL);

async function testGalleryIssue() {
  console.log("🔍 Test du problème de la galerie...");
  
  try {
    // 1. Tester la fonction getPortfolioProjects
    console.log("\n1. Test de getPortfolioProjects...");
    const allProjects = await client.query("cms:getPortfolioProjects");
    console.log(`✅ Total projets: ${allProjects.length}`);

    // 2. Tester la fonction getBeforeAfterProjects
    console.log("\n2. Test de getBeforeAfterProjects...");
    const beforeAfterProjects = await client.query("cms:getBeforeAfterProjects");
    console.log(`✅ Projets avant-après: ${beforeAfterProjects.length}`);

    // 3. Vérifier le filtrage côté client
    console.log("\n3. Test du filtrage côté client...");
    const filteredProjects = allProjects.filter(project => 
      project.is_before_after && project.before_image && project.after_image
    );
    console.log(`✅ Projets filtrés: ${filteredProjects.length}`);

    // 4. Comparer les résultats
    console.log("\n4. Comparaison des résultats:");
    console.log(`- getBeforeAfterProjects: ${beforeAfterProjects.length}`);
    console.log(`- Filtrage client: ${filteredProjects.length}`);
    
    if (beforeAfterProjects.length !== filteredProjects.length) {
      console.log("⚠️ Différence détectée entre les deux méthodes!");
      
      // Analyser les différences
      const beforeAfterIds = new Set(beforeAfterProjects.map(p => p._id));
      const filteredIds = new Set(filteredProjects.map(p => p._id));
      
      const onlyInFunction = beforeAfterProjects.filter(p => !filteredIds.has(p._id));
      const onlyInFilter = filteredProjects.filter(p => !beforeAfterIds.has(p._id));
      
      if (onlyInFunction.length > 0) {
        console.log("Projets uniquement dans getBeforeAfterProjects:");
        onlyInFunction.forEach(p => {
          console.log(`  - ${p.title} (${p._id})`);
          console.log(`    is_before_after: ${p.is_before_after}`);
          console.log(`    before_image: ${p.before_image ? '✅' : '❌'}`);
          console.log(`    after_image: ${p.after_image ? '✅' : '❌'}`);
        });
      }
      
      if (onlyInFilter.length > 0) {
        console.log("Projets uniquement dans le filtrage client:");
        onlyInFilter.forEach(p => {
          console.log(`  - ${p.title} (${p._id})`);
          console.log(`    is_before_after: ${p.is_before_after}`);
          console.log(`    before_image: ${p.before_image ? '✅' : '❌'}`);
          console.log(`    after_image: ${p.after_image ? '✅' : '❌'}`);
        });
      }
    } else {
      console.log("✅ Les deux méthodes donnent le même résultat");
    }

    // 5. Vérifier les données détaillées
    console.log("\n5. Détails des projets avant-après:");
    beforeAfterProjects.forEach((project, index) => {
      console.log(`\n   Projet ${index + 1}:`);
      console.log(`   - ID: ${project._id}`);
      console.log(`   - Titre: ${project.title}`);
      console.log(`   - Catégorie: ${project.category}`);
      console.log(`   - is_before_after: ${project.is_before_after}`);
      console.log(`   - before_image: ${project.before_image ? '✅' : '❌'}`);
      console.log(`   - after_image: ${project.after_image ? '✅' : '❌'}`);
      console.log(`   - is_active: ${project.is_active}`);
    });

    // 6. Proposer des solutions
    console.log("\n6. Solutions possibles:");
    console.log("   a) Vider le cache du navigateur");
    console.log("   b) Utiliser directement getBeforeAfterProjects au lieu du filtrage");
    console.log("   c) Vérifier la configuration du cache CMS");
    console.log("   d) Redémarrer le serveur de développement");

  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  }
}

// Exécuter le test
testGalleryIssue()
  .then(() => {
    console.log("\n✅ Test terminé");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erreur fatale:", error);
    process.exit(1);
  });

export { testGalleryIssue };
