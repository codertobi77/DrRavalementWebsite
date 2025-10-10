import { ConvexHttpClient } from "convex/browser";

const CONVEX_URL = "https://acoustic-ox-512.convex.cloud";

const client = new ConvexHttpClient(CONVEX_URL);

async function fixPortfolioProjects() {
  try {
    console.log("🔍 Vérification des projets de portfolio...");
    
    // Récupérer tous les projets
    const allProjects = await client.query("cms:getPortfolioProjects");
    console.log(`📊 Total des projets: ${allProjects.length}`);
    
    // Récupérer les projets avant-après
    const beforeAfterProjects = await client.query("cms:getBeforeAfterProjects");
    console.log(`📊 Projets avant-après: ${beforeAfterProjects.length}`);
    
    // Vérifier les projets qui n'ont pas is_before_after = true
    const projectsToFix = allProjects.filter(project => 
      !project.is_before_after || 
      !project.before_image || 
      !project.after_image
    );
    
    console.log(`🔧 Projets à corriger: ${projectsToFix.length}`);
    
    if (projectsToFix.length > 0) {
      console.log("📝 Projets nécessitant une correction:");
      projectsToFix.forEach((project, index) => {
        console.log(`${index + 1}. ${project.title}`);
        console.log(`   - is_before_after: ${project.is_before_after}`);
        console.log(`   - before_image: ${project.before_image ? '✅' : '❌'}`);
        console.log(`   - after_image: ${project.after_image ? '✅' : '❌'}`);
        console.log(`   - image: ${project.image ? '✅' : '❌'}`);
        console.log("");
      });
      
      console.log("⚠️  Ces projets ne s'afficheront pas car ils ne respectent pas la nouvelle structure avant-après.");
      console.log("💡 Vous devez les modifier via l'interface admin pour ajouter les images avant et après.");
    } else {
      console.log("✅ Tous les projets respectent la nouvelle structure avant-après!");
    }
    
  } catch (error) {
    console.error("❌ Erreur lors de la vérification:", error);
  }
}

fixPortfolioProjects();
