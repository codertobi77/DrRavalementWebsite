import { ConvexHttpClient } from "convex/browser";

// Configuration Convex
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://acoustic-ox-512.convex.cloud";

const client = new ConvexHttpClient(CONVEX_URL);

async function testGalleryFix() {
  console.log("🔧 Test de la correction de la galerie...");
  
  try {
    // 1. Tester la fonction getBeforeAfterProjects
    console.log("\n1. Test de getBeforeAfterProjects...");
    const beforeAfterProjects = await client.query("cms:getBeforeAfterProjects");
    console.log(`✅ Projets avant-après: ${beforeAfterProjects.length}`);

    if (beforeAfterProjects.length === 0) {
      console.log("❌ Aucun projet avant-après trouvé!");
      return;
    }

    // 2. Vérifier que tous les projets ont les champs requis
    console.log("\n2. Vérification des champs requis...");
    const validProjects = beforeAfterProjects.filter(project => 
      project.is_before_after && project.before_image && project.after_image
    );
    
    console.log(`✅ Projets valides: ${validProjects.length}/${beforeAfterProjects.length}`);
    
    if (validProjects.length !== beforeAfterProjects.length) {
      console.log("⚠️ Certains projets n'ont pas tous les champs requis:");
      beforeAfterProjects.forEach((project, index) => {
        const isValid = project.is_before_after && project.before_image && project.after_image;
        if (!isValid) {
          console.log(`   ${index + 1}. ${project.title}`);
          console.log(`      - is_before_after: ${project.is_before_after}`);
          console.log(`      - before_image: ${project.before_image ? '✅' : '❌'}`);
          console.log(`      - after_image: ${project.after_image ? '✅' : '❌'}`);
        }
      });
    }

    // 3. Afficher les détails des projets valides
    console.log("\n3. Détails des projets valides:");
    validProjects.forEach((project, index) => {
      console.log(`\n   Projet ${index + 1}:`);
      console.log(`   - ID: ${project._id}`);
      console.log(`   - Titre: ${project.title}`);
      console.log(`   - Catégorie: ${project.category}`);
      console.log(`   - Description: ${project.description.substring(0, 50)}...`);
      console.log(`   - Détails: ${project.details}`);
    });

    // 4. Instructions pour tester
    console.log("\n4. Instructions pour tester:");
    console.log("   🌐 Ouvrez votre navigateur et allez sur:");
    console.log("      - http://localhost:5173/before-after");
    console.log("      - http://localhost:5173/before-after-test (test direct)");
    console.log("\n   🔍 Vérifiez dans la console du navigateur:");
    console.log("      - Les logs de debug du composant");
    console.log("      - Le nombre de projets récupérés");
    console.log("      - Les détails des projets");

    // 5. Solutions si le problème persiste
    console.log("\n5. Solutions si le problème persiste:");
    console.log("   a) Vider le cache du navigateur (F12 > Application > Storage > Clear)");
    console.log("   b) Redémarrer le serveur de développement");
    console.log("   c) Vérifier que Convex est bien déployé");
    console.log("   d) Utiliser la page de test: /before-after-test");

  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  }
}

// Exécuter le test
testGalleryFix()
  .then(() => {
    console.log("\n✅ Test terminé");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erreur fatale:", error);
    process.exit(1);
  });

export { testGalleryFix };
