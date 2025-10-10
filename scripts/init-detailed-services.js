import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL || "https://acoustic-ox-512.convex.cloud");

// Services détaillés avec toutes les informations
const detailedServices = [
  {
    title: "Ravalement de Façade",
    description: "Rénovation complète de votre façade pour un rendu impeccable et durable.",
    detailedDescription: "Le ravalement de façade est notre spécialité principale. Nous offrons une rénovation complète qui transforme l'apparence de votre bâtiment tout en le protégeant des intempéries. Notre équipe d'experts utilise les meilleures techniques et matériaux pour garantir un résultat exceptionnel qui dure dans le temps.",
    image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200",
    features: [
      "Nettoyage haute pression",
      "Réparation des fissures",
      "Application d'enduit décoratif",
      "Protection hydrofuge"
    ],
    benefits: [
      "Améliore l'isolation thermique",
      "Augmente la valeur du bien",
      "Protection contre les intempéries",
      "Résultat durable 10+ ans"
    ],
    process: [
      "Inspection et diagnostic complet",
      "Préparation et protection des abords",
      "Nettoyage et décapage de l'ancien enduit",
      "Réparation des fissures et défauts",
      "Application du nouvel enduit",
      "Finitions et nettoyage final"
    ],
    materials: [
      "Enduit monocouche",
      "Enduit traditionnel",
      "Peinture façade",
      "Hydrofuge protecteur"
    ],
    duration: "3-7 jours selon la surface",
    price: "À partir de 50€/m²",
    order_index: 1,
    is_active: true
  },
  {
    title: "Maçonnerie Générale",
    description: "Tous travaux de maçonnerie pour construction, rénovation et réparation.",
    detailedDescription: "Notre expertise en maçonnerie couvre tous vos besoins, de la construction neuve aux réparations d'urgence. Nous travaillons avec tous types de matériaux : briques, pierres, parpaings, et proposons des solutions sur mesure pour chaque projet.",
    image: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1200",
    features: [
      "Construction neuve",
      "Rénovation existante",
      "Réparations d'urgence",
      "Tous matériaux"
    ],
    benefits: [
      "Expertise technique reconnue",
      "Matériaux de qualité",
      "Respect des normes",
      "Garantie travaux"
    ],
    process: [
      "Étude du projet et devis",
      "Préparation du chantier",
      "Travaux de maçonnerie",
      "Finitions et nettoyage",
      "Réception des travaux"
    ],
    materials: [
      "Briques traditionnelles",
      "Parpaings",
      "Pierres naturelles",
      "Mortier et ciment"
    ],
    duration: "Variable selon le projet",
    price: "Devis personnalisé",
    order_index: 2,
    is_active: true
  },
  {
    title: "Couverture et Toiture",
    description: "Installation, réparation et entretien de tous types de toitures.",
    detailedDescription: "Spécialistes de la couverture, nous intervenons sur tous types de toitures : tuiles, ardoises, zinc, shingle. Notre équipe qualifiée assure l'étanchéité et la durabilité de votre toit avec les meilleures techniques du marché.",
    image: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1200",
    features: [
      "Pose de toiture neuve",
      "Réparation de fuites",
      "Changement de couverture",
      "Entretien préventif"
    ],
    benefits: [
      "Étanchéité garantie",
      "Isolation optimale",
      "Esthétique préservée",
      "Durabilité maximale"
    ],
    process: [
      "Diagnostic de l'existant",
      "Démolition si nécessaire",
      "Pose de l'écran sous-toiture",
      "Installation de la couverture",
      "Pose des accessoires",
      "Tests d'étanchéité"
    ],
    materials: [
      "Tuiles terre cuite",
      "Ardoises naturelles",
      "Zinc",
      "Shingle bitumineux"
    ],
    duration: "2-5 jours selon la surface",
    price: "À partir de 80€/m²",
    order_index: 3,
    is_active: true
  }
];

async function initDetailedServices() {
  try {
    console.log("🚀 Initialisation des services détaillés...");

    // Supprimer les anciens services
    console.log("🗑️ Suppression des anciens services...");
    const existingServices = await client.query("cms:getServices");
    for (const service of existingServices) {
      await client.mutation("cms:deleteService", { id: service._id });
    }

    // Ajouter les nouveaux services détaillés
    console.log("➕ Ajout des services détaillés...");
    for (const service of detailedServices) {
      await client.mutation("cms:createService", service);
      console.log(`✅ Service ajouté: ${service.title}`);
    }

    console.log("🎉 Services détaillés initialisés avec succès !");
    console.log(`📊 ${detailedServices.length} services créés`);

  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation des services:", error);
  }
}

// Exécuter le script
initDetailedServices();
