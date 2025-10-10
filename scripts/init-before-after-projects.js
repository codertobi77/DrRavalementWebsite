import { ConvexHttpClient } from "convex/browser";

// Configuration Convex
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://acoustic-ox-512.convex.cloud";

const client = new ConvexHttpClient(CONVEX_URL);

// Données d'exemple pour les projets avant-après
const beforeAfterProjects = [
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
  },
  {
    title: "Ravalement Couleur - Immeuble Haussmannien",
    category: "ravalement",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    before_image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    after_image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    description: "Mise en couleur d'un immeuble haussmannien avec respect de l'architecture d'origine.",
    details: "Surface: 300m² • Durée: 4 semaines • Style: Haussmannien • Couleur: Pierre de Paris",
    order_index: 3,
    is_active: true,
    is_before_after: true
  },
  {
    title: "Rénovation Toiture - Villa Individuelle",
    category: "couverture",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    before_image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    after_image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    description: "Refaire complètement la toiture avec des tuiles modernes et isolation renforcée.",
    details: "Surface: 150m² • Durée: 1 semaine • Matériau: Tuiles terre cuite • Isolation: Laine de verre",
    order_index: 4,
    is_active: true,
    is_before_after: true
  },
  {
    title: "Ravalement Enduit Décoratif - Maison de Campagne",
    category: "ravalement",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    before_image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    after_image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    description: "Application d'un enduit décoratif avec effet de relief pour une maison de campagne.",
    details: "Surface: 200m² • Durée: 2 semaines • Technique: Enduit décoratif • Effet: Relief texturé",
    order_index: 5,
    is_active: true,
    is_before_after: true
  },
  {
    title: "Restauration Pierre de Taille - Château",
    category: "maconnerie",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    before_image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    after_image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    description: "Restauration complète de la pierre de taille d'un château historique.",
    details: "Surface: 500m² • Durée: 8 semaines • Pierre: Calcaire • Technique: Taille traditionnelle",
    order_index: 6,
    is_active: true,
    is_before_after: true
  }
];

async function initBeforeAfterProjects() {
  console.log("🚀 Initialisation des projets avant-après...");
  
  try {
    // Vérifier si des projets avant-après existent déjà
    const existingProjects = await client.query("cms:getBeforeAfterProjects");
    
    if (existingProjects && existingProjects.length > 0) {
      console.log(`✅ ${existingProjects.length} projets avant-après existent déjà`);
      return;
    }

    // Ajouter les projets avant-après
    for (const project of beforeAfterProjects) {
      try {
        const projectId = await client.mutation("cms:createPortfolioProject", project);
        console.log(`✅ Projet créé: ${project.title} (ID: ${projectId})`);
      } catch (error) {
        console.error(`❌ Erreur lors de la création du projet ${project.title}:`, error);
      }
    }

    console.log("🎉 Initialisation des projets avant-après terminée !");
    
    // Vérifier le résultat
    const finalProjects = await client.query("cms:getBeforeAfterProjects");
    console.log(`📊 Total des projets avant-après: ${finalProjects.length}`);
    
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation:", error);
  }
}

// Exécuter le script
initBeforeAfterProjects()
  .then(() => {
    console.log("✅ Script terminé");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erreur fatale:", error);
    process.exit(1);
  });

export { initBeforeAfterProjects };
