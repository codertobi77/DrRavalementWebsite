/**
 * Script pour ajouter des objectifs aux services existants
 * 
 * Ce script met à jour les services existants en ajoutant des objectifs appropriés
 * basés sur le titre et la description de chaque service.
 */


import { api } from "../convex/_generated/api.js";

// Configuration
import { ConvexHttpClient } from "convex/browser";
import { readFileSync } from 'fs';

// Lire le fichier .env
const envContent = readFileSync('.env', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const CONVEX_URL = envVars.VITE_CONVEX_URL;

if (!CONVEX_URL || CONVEX_URL.includes("your-convex-deployment")) {
  console.error("❌ VITE_CONVEX_URL non configuré dans .env");
  process.exit(1);
}
// Objectifs prédéfinis basés sur les types de services
const SERVICE_OBJECTIVES = {
  // Services de ravalement
  "ravalement": "Améliorer l'esthétique et la durabilité de votre façade tout en la protégeant contre les intempéries",
  "façade": "Protéger et embellir votre façade pour préserver la valeur de votre bien immobilier",
  "enduit": "Appliquer un enduit décoratif pour transformer l'apparence de votre bâtiment",
  "peinture": "Donner une nouvelle vie à votre façade avec une peinture de qualité professionnelle",
  
  // Services de maçonnerie
  "maçonnerie": "Renforcer la structure et réparer les éléments de maçonnerie pour assurer la solidité du bâtiment",
  "mur": "Réparer et consolider les murs pour garantir la stabilité de la construction",
  "pierre": "Restaurer la beauté et l'intégrité des éléments en pierre de taille",
  "brique": "Réparer et entretenir les structures en brique pour maintenir leur solidité",
  
  // Services de couverture
  "couverture": "Protéger votre toit contre les intempéries et améliorer l'isolation thermique",
  "toiture": "Assurer l'étanchéité et la durabilité de votre toiture",
  "toit": "Maintenir l'intégrité de votre toit pour protéger votre habitation",
  "tuile": "Remplacer et réparer les tuiles pour garantir l'étanchéité",
  
  // Services d'isolation
  "isolation": "Améliorer l'efficacité énergétique et le confort thermique de votre habitation",
  "thermique": "Réduire les déperditions de chaleur pour diminuer vos factures énergétiques",
  "isoler": "Créer une barrière thermique efficace pour un meilleur confort",
  
  // Services de rénovation
  "rénovation": "Transformer et moderniser votre espace pour améliorer votre qualité de vie",
  "renovation": "Remettre à neuf votre bâtiment en respectant les normes actuelles",
  "restauration": "Préserver le caractère authentique tout en modernisant les installations",
  
  // Services généraux
  "réparation": "Réparer et entretenir les éléments défectueux pour maintenir la qualité",
  "reparation": "Corriger les problèmes existants pour assurer la durabilité",
  "entretien": "Maintenir en bon état les éléments de votre bâtiment",
  "maintenance": "Prévenir les dégradations et prolonger la durée de vie des installations"
};

// Objectifs par défaut si aucun mot-clé n'est trouvé
const DEFAULT_OBJECTIVES = [
  "Améliorer la qualité et la durabilité de votre installation",
  "Assurer la protection et l'esthétique de votre bâtiment",
  "Optimiser les performances et l'efficacité de votre système",
  "Renforcer la structure et préserver la valeur de votre bien",
  "Moderniser et améliorer le confort de votre espace"
];

/**
 * Génère un objectif basé sur le titre et la description du service
 */
function generateObjective(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  
  // Chercher des mots-clés dans le texte
  for (const [keyword, objective] of Object.entries(SERVICE_OBJECTIVES)) {
    if (text.includes(keyword)) {
      return objective;
    }
  }
  
  // Si aucun mot-clé n'est trouvé, utiliser un objectif par défaut
  const randomIndex = Math.floor(Math.random() * DEFAULT_OBJECTIVES.length);
  return DEFAULT_OBJECTIVES[randomIndex];
}

/**
 * Met à jour les services existants avec des objectifs
 */
async function updateServicesWithObjectives() {
  const client = new ConvexHttpClient(CONVEX_URL);
  
  try {
    console.log("🔄 Récupération des services existants...");
    
    // Récupérer tous les services
    const services = await client.query(api.cms.getServices, {});
    
    if (!services || services.length === 0) {
      console.log("❌ Aucun service trouvé dans la base de données");
      return;
    }
    
    console.log(`📋 ${services.length} service(s) trouvé(s)`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const service of services) {
      // Vérifier si le service a déjà un objectif
      if (service.objective && service.objective.trim() !== '') {
        console.log(`⏭️  Service "${service.title}" a déjà un objectif, ignoré`);
        skippedCount++;
        continue;
      }
      
      // Générer un objectif
      const objective = generateObjective(service.title, service.description);
      
      console.log(`🔄 Mise à jour du service "${service.title}"...`);
      console.log(`   Objectif: ${objective}`);
      
      try {
        // Mettre à jour le service
        await client.mutation(api.cms.updateService, {
          id: service._id,
          objective: objective
        });
        
        console.log(`✅ Service "${service.title}" mis à jour avec succès`);
        updatedCount++;
        
        // Petite pause pour éviter de surcharger l'API
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Erreur lors de la mise à jour du service "${service.title}":`, error);
      }
    }
    
    console.log("\n📊 Résumé de l'opération:");
    console.log(`   ✅ Services mis à jour: ${updatedCount}`);
    console.log(`   ⏭️  Services ignorés: ${skippedCount}`);
    console.log(`   📋 Total traité: ${services.length}`);
    
  } catch (error) {
    console.error("❌ Erreur lors de l'exécution du script:", error);
    process.exit(1);
  }
}

/**
 * Affiche les services existants sans les modifier (mode preview)
 */
async function previewServices() {
  const client = new ConvexHttpClient(CONVEX_URL);
  
  try {
    console.log("🔍 Mode preview - Affichage des services existants...\n");
    
    const services = await client.query(api.cms.getServices, {});
    
    if (!services || services.length === 0) {
      console.log("❌ Aucun service trouvé dans la base de données");
      return;
    }
    
    services.forEach((service, index) => {
      console.log(`${index + 1}. ${service.title}`);
      console.log(`   Description: ${service.description.substring(0, 100)}...`);
      console.log(`   Objectif actuel: ${service.objective || 'Aucun'}`);
      console.log(`   Objectif proposé: ${generateObjective(service.title, service.description)}`);
      console.log("---");
    });
    
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des services:", error);
  }
}

// Fonction principale
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  console.log("🚀 Script de mise à jour des objectifs des services\n");
  
  if (command === 'preview') {
    await previewServices();
  } else if (command === 'update') {
    console.log("⚠️  ATTENTION: Cette opération va modifier la base de données!");
    console.log("   Appuyez sur Ctrl+C pour annuler, ou attendez 5 secondes...\n");
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    await updateServicesWithObjectives();
  } else {
    console.log("Usage:");
    console.log("  node update-services-objectives.js preview  - Afficher les services sans les modifier");
    console.log("  node update-services-objectives.js update   - Mettre à jour les services");
    console.log("\nExemples:");
    console.log("  npm run update-objectives preview");
    console.log("  npm run update-objectives update");
  }
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Erreur non gérée:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Exception non capturée:', error);
  process.exit(1);
});

// Exécuter le script
main().catch(console.error);
