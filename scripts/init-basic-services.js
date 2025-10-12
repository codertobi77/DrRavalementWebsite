/**
 * Script pour initialiser des services de base dans Convex
 */

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

// Services de base à créer
const BASIC_SERVICES = [
  {
    title: "Ravalement de Façades",
    description: "Ravalement complet de façades avec enduit décoratif et peinture de qualité professionnelle",
    objective: "Améliorer l'esthétique et la durabilité de votre façade tout en la protégeant contre les intempéries",
    image: "https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=800&h=600&fit=crop",
    features: [
      "Nettoyage et préparation de la façade",
      "Application d'enduit décoratif",
      "Peinture de finition haute qualité",
      "Protection contre les intempéries"
    ],
    order_index: 1,
    is_active: true
  },
  {
    title: "Projection Machine",
    description: "Enduit par projection machine pour un rendu uniforme et professionnel",
    objective: "Appliquer un enduit décoratif de manière uniforme et efficace avec une projection machine",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop",
    features: [
      "Projection d'enduit par machine",
      "Rendu uniforme et lisse",
      "Gain de temps considérable",
      "Qualité professionnelle garantie"
    ],
    order_index: 2,
    is_active: true
  },
  {
    title: "Maçonnerie Générale",
    description: "Tous travaux de maçonnerie : réparation, construction, rénovation",
    objective: "Renforcer la structure et réparer les éléments de maçonnerie pour assurer la solidité du bâtiment",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop",
    features: [
      "Réparation de murs",
      "Construction de clôtures",
      "Rénovation de cheminées",
      "Travaux de pierre de taille"
    ],
    order_index: 3,
    is_active: true
  },
  {
    title: "Couverture",
    description: "Travaux de couverture et d'étanchéité pour protéger votre toit",
    objective: "Protéger votre toit contre les intempéries et améliorer l'isolation thermique",
    image: "https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=800&h=600&fit=crop",
    features: [
      "Réparation de toiture",
      "Pose de tuiles",
      "Étanchéité complète",
      "Isolation thermique"
    ],
    order_index: 4,
    is_active: true
  },
  {
    title: "Clôtures Parpaing",
    description: "Construction de clôtures en parpaing pour délimiter votre propriété",
    objective: "Construire une clôture solide et durable pour sécuriser et délimiter votre propriété",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop",
    features: [
      "Construction en parpaing",
      "Fondations solides",
      "Enduit décoratif",
      "Portail intégré possible"
    ],
    order_index: 5,
    is_active: true
  },
  {
    title: "Isolation Thermique",
    description: "Isolation thermique par l'extérieur pour améliorer l'efficacité énergétique",
    objective: "Améliorer l'efficacité énergétique et le confort thermique de votre habitation",
    image: "https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=800&h=600&fit=crop",
    features: [
      "Isolation par l'extérieur",
      "Réduction des déperditions",
      "Économies d'énergie",
      "Confort thermique amélioré"
    ],
    order_index: 6,
    is_active: true
  }
];

async function initBasicServices() {
  const client = new ConvexHttpClient(CONVEX_URL);
  
  try {
    console.log("🔄 Vérification des services existants...");
    
    // Vérifier s'il y a déjà des services
    const existingServices = await client.query('cms:getServices', {});
    
    if (existingServices && existingServices.length > 0) {
      console.log(`✅ ${existingServices.length} service(s) déjà présents dans la base de données`);
      console.log("📋 Services existants:");
      existingServices.forEach((service, index) => {
        console.log(`   ${index + 1}. ${service.title} (${service.is_active ? 'Actif' : 'Inactif'})`);
      });
      
      const createNew = process.argv.includes('--force');
      if (!createNew) {
        console.log("\n💡 Utilisez --force pour créer de nouveaux services malgré l'existence de services");
        return;
      }
    }
    
    console.log("\n🔄 Création des services de base...");
    
    let createdCount = 0;
    let errorCount = 0;
    
    for (const service of BASIC_SERVICES) {
      try {
        console.log(`   Création: ${service.title}...`);
        
        await client.mutation('cms:createService', service);
        
        console.log(`   ✅ ${service.title} créé avec succès`);
        createdCount++;
        
        // Petite pause entre les créations
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`   ❌ Erreur lors de la création de ${service.title}:`, error.message);
        errorCount++;
      }
    }
    
    console.log("\n📊 Résumé de l'opération:");
    console.log(`   ✅ Services créés: ${createdCount}`);
    console.log(`   ❌ Erreurs: ${errorCount}`);
    console.log(`   📋 Total traité: ${BASIC_SERVICES.length}`);
    
    if (createdCount > 0) {
      console.log("\n🎉 Services initialisés avec succès!");
      console.log("💡 Vous pouvez maintenant voir les services dans le footer de votre site");
    }
    
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation des services:", error.message);
    
    if (error.message.includes("Function not found")) {
      console.log("💡 La fonction 'cms:createService' n'existe pas");
      console.log("   Vérifiez que le fichier convex/cms.ts contient cette fonction");
    }
  }
}

// Exécuter l'initialisation
initBasicServices().catch(console.error);
