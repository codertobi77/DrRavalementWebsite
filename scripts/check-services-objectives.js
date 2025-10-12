/**
 * Script de vérification des objectifs des services
 * 
 * Affiche un rapport détaillé sur l'état des objectifs des services
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const CONVEX_URL = process.env.CONVEX_URL || "https://your-convex-deployment.convex.cloud";

async function checkServicesObjectives() {
  const client = new ConvexHttpClient(CONVEX_URL);
  
  try {
    console.log("🔍 Vérification des objectifs des services...\n");
    
    // Récupérer tous les services
    const services = await client.query(api.cms.getServices, {});
    
    if (!services || services.length === 0) {
      console.log("❌ Aucun service trouvé dans la base de données");
      return;
    }
    
    console.log(`📊 Rapport des objectifs des services (${services.length} service(s))\n`);
    
    let withObjective = 0;
    let withoutObjective = 0;
    
    services.forEach((service, index) => {
      const hasObjective = service.objective && service.objective.trim() !== '';
      const status = hasObjective ? '✅' : '❌';
      
      console.log(`${index + 1}. ${status} ${service.title}`);
      console.log(`   Description: ${service.description.substring(0, 80)}...`);
      
      if (hasObjective) {
        console.log(`   Objectif: ${service.objective}`);
        withObjective++;
      } else {
        console.log(`   Objectif: Aucun`);
        withoutObjective++;
      }
      
      console.log(`   Actif: ${service.is_active ? 'Oui' : 'Non'}`);
      console.log(`   Ordre: ${service.order_index}`);
      console.log("---");
    });
    
    console.log("\n📈 Statistiques:");
    console.log(`   ✅ Services avec objectif: ${withObjective}`);
    console.log(`   ❌ Services sans objectif: ${withoutObjective}`);
    console.log(`   📊 Pourcentage complet: ${Math.round((withObjective / services.length) * 100)}%`);
    
    if (withoutObjective > 0) {
      console.log("\n💡 Recommandations:");
      console.log("   - Utilisez 'npm run update-objectives preview' pour voir les objectifs proposés");
      console.log("   - Utilisez 'npm run update-objectives update' pour ajouter les objectifs automatiquement");
      console.log("   - Utilisez 'npm run add-objective \"Titre\" \"Objectif\"' pour ajouter manuellement");
    } else {
      console.log("\n🎉 Tous les services ont un objectif défini !");
    }
    
  } catch (error) {
    console.error("❌ Erreur lors de la vérification:", error);
  }
}

// Fonction principale
async function main() {
  console.log("🚀 Vérification des objectifs des services\n");
  
  await checkServicesObjectives();
}

main().catch(console.error);
