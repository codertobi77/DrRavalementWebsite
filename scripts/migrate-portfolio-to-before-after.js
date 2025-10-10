import { ConvexHttpClient } from "convex/browser";

const CONVEX_URL = "https://acoustic-ox-512.convex.cloud";

const client = new ConvexHttpClient(CONVEX_URL);

async function migratePortfolioProjects() {
  try {
    console.log("🔄 Migration des projets vers la structure avant-après...");
    
    // Récupérer tous les projets
    const allProjects = await client.query("cms:getPortfolioProjects");
    console.log(`📊 Total des projets à migrer: ${allProjects.length}`);
    
    let migratedCount = 0;
    let errorCount = 0;
    
    for (const project of allProjects) {
      try {
        console.log(`\n🔄 Migration: ${project.title}`);
        
        // Utiliser l'image existante comme image "après"
        const afterImage = project.image || 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1200';
        
        // Créer une image placeholder pour "avant" (image en noir et blanc ou floue)
        const beforeImage = 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1200&blur=2';
        
        // Mettre à jour le projet
        await client.mutation("cms:updatePortfolioProject", {
          id: project._id,
          before_image: beforeImage,
          after_image: afterImage,
          is_before_after: true
        });
        
        console.log(`✅ Migré: ${project.title}`);
        migratedCount++;
        
      } catch (error) {
        console.error(`❌ Erreur pour ${project.title}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Résumé de la migration:`);
    console.log(`✅ Projets migrés: ${migratedCount}`);
    console.log(`❌ Erreurs: ${errorCount}`);
    
    if (migratedCount > 0) {
      console.log(`\n🎉 Migration terminée! Les projets devraient maintenant s'afficher.`);
    }
    
  } catch (error) {
    console.error("❌ Erreur lors de la migration:", error);
  }
}

migratePortfolioProjects();
