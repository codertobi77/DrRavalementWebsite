import { ConvexHttpClient } from "convex/browser";

// Configuration Convex
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://acoustic-ox-512.convex.cloud";

const client = new ConvexHttpClient(CONVEX_URL);

async function startBeforeAfterDemo() {
  console.log("🚀 Démarrage de la démonstration galerie avant-après...");
  
  try {
    // 1. Vérifier la connexion Convex
    console.log("\n1. Vérification de la connexion Convex...");
    const stats = await client.query("cms:getStatistics");
    console.log(`✅ Connexion Convex OK (${stats.length} statistiques trouvées)`);

    // 2. Vérifier les projets existants
    console.log("\n2. Vérification des projets de portfolio...");
    const allProjects = await client.query("cms:getPortfolioProjects");
    console.log(`📊 Total des projets: ${allProjects.length}`);

    // 3. Vérifier les projets avant-après
    console.log("\n3. Vérification des projets avant-après...");
    const beforeAfterProjects = await client.query("cms:getBeforeAfterProjects");
    console.log(`🖼️ Projets avant-après: ${beforeAfterProjects.length}`);

    if (beforeAfterProjects.length === 0) {
      console.log("\n⚠️ Aucun projet avant-après trouvé. Initialisation...");
      
      // Ajouter quelques projets d'exemple
      const sampleProjects = [
        {
          title: "Ravalement Façade Moderne - Paris 15ème",
          category: "ravalement",
          image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
          before_image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
          after_image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
          description: "Transformation complète d'une façade ancienne en style moderne avec enduit gratté et couleurs contemporaines.",
          details: "Surface: 180m² • Durée: 3 semaines • Finition: Enduit gratté • Couleur: Beige moderne",
          order_index: 1,
          is_active: true,
          is_before_after: true
        },
        {
          title: "Rénovation Maçonnerie - Maison de Ville",
          category: "maconnerie",
          image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
          before_image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
          after_image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
          description: "Restauration complète de la maçonnerie avec remplacement des pierres endommagées et rejointoiement.",
          details: "Surface: 120m² • Durée: 2 semaines • Technique: Pierre de taille • Finition: Rejointoiement traditionnel",
          order_index: 2,
          is_active: true,
          is_before_after: true
        }
      ];

      for (const project of sampleProjects) {
        try {
          const projectId = await client.mutation("cms:createPortfolioProject", project);
          console.log(`✅ Projet créé: ${project.title} (ID: ${projectId})`);
        } catch (error) {
          console.error(`❌ Erreur lors de la création du projet ${project.title}:`, error);
        }
      }
    }

    // 4. Afficher les instructions
    console.log("\n4. Instructions pour tester la galerie:");
    console.log("   🌐 Ouvrez votre navigateur et allez sur:");
    console.log("      - http://localhost:5173/before-after (galerie complète)");
    console.log("      - http://localhost:5173/before-after-demo (démonstration)");
    console.log("\n   🖱️ Interactions disponibles:");
    console.log("      - Glissez la souris sur les images pour voir avant/après");
    console.log("      - Sur mobile: glissez votre doigt");
    console.log("      - Laissez la souris pour revenir au centre");

    // 5. Vérifier le statut final
    console.log("\n5. Statut final:");
    const finalProjects = await client.query("cms:getBeforeAfterProjects");
    console.log(`✅ ${finalProjects.length} projets avant-après disponibles`);
    
    if (finalProjects.length > 0) {
      console.log("🎉 La galerie avant-après est prête à être utilisée !");
    } else {
      console.log("⚠️ Aucun projet avant-après disponible. Vérifiez la configuration.");
    }

  } catch (error) {
    console.error("❌ Erreur lors du démarrage:", error);
    console.log("\n🔧 Solutions possibles:");
    console.log("   1. Vérifiez que Convex est déployé: npx convex deploy");
    console.log("   2. Vérifiez la variable VITE_CONVEX_URL");
    console.log("   3. Vérifiez la connexion internet");
  }
}

// Exécuter le script
startBeforeAfterDemo()
  .then(() => {
    console.log("\n✅ Script de démarrage terminé");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erreur fatale:", error);
    process.exit(1);
  });

export { startBeforeAfterDemo };
