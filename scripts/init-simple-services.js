import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL || "https://acoustic-ox-512.convex.cloud");

// Services simples avec les champs existants
const simpleServices = [
  {
    title: "Ravalement de Façade",
    description: "Rénovation complète de votre façade pour un rendu impeccable et durable. Notre équipe d'experts utilise les meilleures techniques et matériaux pour garantir un résultat exceptionnel qui dure dans le temps.",
    image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200",
    features: [
      "Nettoyage haute pression",
      "Réparation des fissures",
      "Application d'enduit décoratif",
      "Protection hydrofuge",
      "Améliore l'isolation thermique",
      "Augmente la valeur du bien"
    ],
    order_index: 1,
    is_active: true
  },
  {
    title: "Maçonnerie Générale",
    description: "Tous travaux de maçonnerie pour construction, rénovation et réparation. Notre expertise couvre tous vos besoins, de la construction neuve aux réparations d'urgence avec tous types de matériaux.",
    image: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1200",
    features: [
      "Construction neuve",
      "Rénovation existante",
      "Réparations d'urgence",
      "Tous matériaux",
      "Expertise technique reconnue",
      "Garantie travaux"
    ],
    order_index: 2,
    is_active: true
  },
  {
    title: "Couverture et Toiture",
    description: "Installation, réparation et entretien de tous types de toitures. Spécialistes de la couverture, nous intervenons sur tous types de toitures avec les meilleures techniques du marché.",
    image: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1200",
    features: [
      "Pose de toiture neuve",
      "Réparation de fuites",
      "Changement de couverture",
      "Entretien préventif",
      "Étanchéité garantie",
      "Isolation optimale"
    ],
    order_index: 3,
    is_active: true
  }
];

async function initSimpleServices() {
  try {
    console.log("🚀 Initialisation des services simples...");

    // Supprimer les anciens services
    console.log("🗑️ Suppression des anciens services...");
    const existingServices = await client.query("cms:getServices");
    for (const service of existingServices) {
      await client.mutation("cms:deleteService", { id: service._id });
    }

    // Ajouter les nouveaux services
    console.log("➕ Ajout des services...");
    for (const service of simpleServices) {
      await client.mutation("cms:createService", service);
      console.log(`✅ Service ajouté: ${service.title}`);
    }

    console.log("🎉 Services initialisés avec succès !");
    console.log(`📊 ${simpleServices.length} services créés`);

  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation des services:", error);
  }
}

// Exécuter le script
initSimpleServices();
