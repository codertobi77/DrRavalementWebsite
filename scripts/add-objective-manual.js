/**
 * Script simple pour ajouter un objectif à un service spécifique
 * 
 * Usage: node add-objective-manual.js "Titre du service" "Objectif du service"
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const CONVEX_URL = process.env.CONVEX_URL || "https://your-convex-deployment.convex.cloud";

async function addObjectiveToService(serviceTitle, objective) {
  const client = new ConvexHttpClient(CONVEX_URL);
  
  try {
    console.log(`🔍 Recherche du service "${serviceTitle}"...`);
    
    // Récupérer tous les services
    const services = await client.query(api.cms.getServices, {});
    
    // Chercher le service par titre
    const service = services.find(s => 
      s.title.toLowerCase().includes(serviceTitle.toLowerCase())
    );
    
    if (!service) {
      console.log(`❌ Service "${serviceTitle}" non trouvé`);
      console.log("Services disponibles:");
      services.forEach(s => console.log(`  - ${s.title}`));
      return;
    }
    
    console.log(`✅ Service trouvé: ${service.title}`);
    console.log(`   Objectif actuel: ${service.objective || 'Aucun'}`);
    console.log(`   Nouvel objectif: ${objective}`);
    
    // Mettre à jour le service
    await client.mutation(api.cms.updateService, {
      id: service._id,
      objective: objective
    });
    
    console.log(`✅ Objectif ajouté avec succès au service "${service.title}"`);
    
  } catch (error) {
    console.error("❌ Erreur:", error);
  }
}

// Fonction principale
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log("Usage: node add-objective-manual.js \"Titre du service\" \"Objectif du service\"");
    console.log("\nExemples:");
    console.log('  node add-objective-manual.js "Ravalement" "Améliorer l\'esthétique de votre façade"');
    console.log('  node add-objective-manual.js "Maçonnerie" "Renforcer la structure de votre bâtiment"');
    return;
  }
  
  const serviceTitle = args[0];
  const objective = args.slice(1).join(' '); // Permet les objectifs avec espaces
  
  console.log("🚀 Ajout d'objectif manuel\n");
  
  await addObjectiveToService(serviceTitle, objective);
}

main().catch(console.error);
