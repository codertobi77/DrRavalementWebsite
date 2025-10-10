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

const client = new ConvexHttpClient(envVars.VITE_CONVEX_URL);

async function initializeCMSData() {
  console.log("🚀 Initialisation des données CMS...");

  try {
    // 1. Statistiques
    console.log("📊 Création des statistiques...");
    const statistics = [
      { key: "facades_renovees", value: "500+", label: "Façades Rénovées", order_index: 1 },
      { key: "annees_experience", value: "15+", label: "Années d'Expérience", order_index: 2 },
      { key: "clients_satisfaits", value: "98%", label: "Clients Satisfaits", order_index: 3 },
      { key: "communes_servies", value: "25+", label: "Communes Servies", order_index: 4 }
    ];

    for (const stat of statistics) {
      await client.mutation("cms:createStatistic", stat);
      console.log(`✅ Statistique créée: ${stat.label}`);
    }

    // 2. Services
    console.log("🔧 Création des services...");
    const services = [
      {
        title: "Ravalement de Façades",
        description: "Rénovation complète de façades avec techniques modernes de projection machine et finitions variées.",
        image: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=600",
        features: [
          "Projection machine",
          "Finitions grattée, talochée, lissée",
          "Isolation thermique",
          "Nettoyage haute pression"
        ],
        order_index: 1
      },
      {
        title: "Maçonnerie Générale",
        description: "Travaux de maçonnerie pour constructions neuves, extensions et réparations de structures.",
        image: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=600",
        features: [
          "Murs en parpaing",
          "Clôtures et murets",
          "Fondations",
          "Réparations structurelles"
        ],
        order_index: 2
      },
      {
        title: "Couverture & Étanchéité",
        description: "Services complets de couverture, réparation de toitures et solutions d'étanchéité.",
        image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600",
        features: [
          "Réfection de toiture",
          "Étanchéité terrasse",
          "Zinguerie",
          "Isolation toiture"
        ],
        order_index: 3
      }
    ];

    for (const service of services) {
      await client.mutation("cms:createService", service);
      console.log(`✅ Service créé: ${service.title}`);
    }

    // 3. Zones d'intervention
    console.log("📍 Création des zones d'intervention...");
    const zones = [
      { name: "Le Pecq", order_index: 1 },
      { name: "Seine-et-Marne", order_index: 2 },
      { name: "Yvelines", order_index: 3 },
      { name: "Val-d'Oise", order_index: 4 },
      { name: "Essonne", order_index: 5 },
      { name: "Hauts-de-Seine", order_index: 6 }
    ];

    for (const zone of zones) {
      await client.mutation("cms:createZone", zone);
      console.log(`✅ Zone créée: ${zone.name}`);
    }

    // 4. Raisons (Pourquoi nous choisir)
    console.log("👍 Création des raisons...");
    const reasons = [
      {
        title: "Spécialiste Façades",
        description: "Expert en ravalement par projection machine avec toutes finitions",
        icon: "ri-building-line",
        order_index: 1
      },
      {
        title: "Maçonnerie Complète",
        description: "Travaux de maçonnerie générale, murs, clôtures et fondations",
        icon: "ri-hammer-line",
        order_index: 2
      },
      {
        title: "Garantie Qualité",
        description: "Assurance décennale et garantie sur tous nos travaux",
        icon: "ri-shield-check-line",
        order_index: 3
      }
    ];

    for (const reason of reasons) {
      await client.mutation("cms:createReason", reason);
      console.log(`✅ Raison créée: ${reason.title}`);
    }

    // 5. Témoignages
    console.log("💬 Création des témoignages...");
    const testimonials = [
      {
        text: "RénoVision Pro a transformé notre maison au-delà de nos attentes. Leur expertise technologique et leur attention aux détails sont remarquables. Le projet a été livré dans les temps et le budget respecté.",
        author: "Marie Dubois",
        role: "Propriétaire",
        project: "Rénovation complète maison 200m²",
        image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
        order_index: 1
      },
      {
        text: "Excellent travail de ravalement sur notre façade. L'équipe DR RAVALEMENT est professionnelle et respecte les délais. Je recommande vivement leurs services.",
        author: "Jean Martin",
        role: "Propriétaire",
        project: "Ravalement façade 150m²",
        image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
        order_index: 2
      },
      {
        text: "Travaux de maçonnerie impeccables. DR RAVALEMENT a su répondre à toutes nos exigences avec un savoir-faire remarquable. Très satisfait du résultat final.",
        author: "Sophie Laurent",
        role: "Propriétaire",
        project: "Extension maison 80m²",
        image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
        order_index: 3
      }
    ];

    for (const testimonial of testimonials) {
      await client.mutation("cms:createTestimonial", testimonial);
      console.log(`✅ Témoignage créé: ${testimonial.author}`);
    }

    // 6. Histoire de l'entreprise
    console.log("📖 Création de l'histoire de l'entreprise...");
    const companyHistory = {
      title: "Notre Histoire",
      paragraphs: [
        "Fondée en 2008, DR RAVALEMENT est née de la passion de son dirigeant pour les métiers du bâtiment et de la rénovation. Spécialisés dans le ravalement de façades par projection machine, nous avons développé notre expertise pour devenir une référence en Seine-et-Marne.",
        "Au fil des années, nous avons élargi nos compétences à la maçonnerie générale et à la couverture, permettant à nos clients de bénéficier d'un service complet pour tous leurs projets de rénovation."
      ],
      statistics: [
        { value: "500+", label: "Façades Rénovées" },
        { value: "15+", label: "Années d'Expérience" }
      ],
      image: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800"
    };

    await client.mutation("cms:createCompanyHistory", companyHistory);
    console.log("✅ Histoire de l'entreprise créée");

    // 7. Valeurs
    console.log("💎 Création des valeurs...");
    const values = [
      {
        title: "Qualité",
        description: "Nous utilisons uniquement des matériaux de première qualité et appliquons les techniques les plus modernes pour garantir la durabilité de nos travaux.",
        icon: "ri-shield-check-line",
        order_index: 1
      },
      {
        title: "Ponctualité",
        description: "Respect des délais convenus et communication transparente tout au long du projet. Votre temps est précieux, nous le respectons.",
        icon: "ri-time-line",
        order_index: 2
      },
      {
        title: "Service",
        description: "Accompagnement personnalisé de A à Z, conseils d'experts et service après-vente pour votre entière satisfaction.",
        icon: "ri-customer-service-2-line",
        order_index: 3
      }
    ];

    for (const value of values) {
      await client.mutation("cms:createValue", value);
      console.log(`✅ Valeur créée: ${value.title}`);
    }

    // 8. Membres de l'équipe
    console.log("👥 Création des membres de l'équipe...");
    const teamMembers = [
      {
        name: "David Rodriguez",
        role: "Directeur & Fondateur",
        description: "15 ans d'expérience dans le ravalement et la maçonnerie. Passionné par l'innovation et la qualité.",
        image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
        order_index: 1
      },
      {
        name: "Marc Dubois",
        role: "Chef d'Équipe Ravalement",
        description: "Expert en projection machine et finitions façades. Garant de la qualité sur tous nos chantiers.",
        image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
        order_index: 2
      },
      {
        name: "Sophie Martin",
        role: "Responsable Commerciale",
        description: "Votre interlocutrice privilégiée pour tous vos projets. Conseil personnalisé et suivi client.",
        image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
        order_index: 3
      }
    ];

    for (const member of teamMembers) {
      await client.mutation("cms:createTeamMember", member);
      console.log(`✅ Membre créé: ${member.name}`);
    }

    // 9. Certifications
    console.log("🏆 Création des certifications...");
    const certifications = [
      {
        title: "Assurance Décennale",
        description: "Protection complète sur tous nos travaux",
        icon: "ri-shield-check-line",
        order_index: 1
      },
      {
        title: "Qualibat",
        description: "Certification qualité reconnue",
        icon: "ri-award-line",
        order_index: 2
      },
      {
        title: "RGE",
        description: "Reconnu Garant de l'Environnement",
        icon: "ri-leaf-line",
        order_index: 3
      },
      {
        title: "98% Satisfaction",
        description: "Clients satisfaits de nos services",
        icon: "ri-user-star-line",
        order_index: 4
      }
    ];

    for (const cert of certifications) {
      await client.mutation("cms:createCertification", cert);
      console.log(`✅ Certification créée: ${cert.title}`);
    }

    // 10. Étapes du processus
    console.log("🔄 Création des étapes du processus...");
    const processSteps = [
      {
        title: "Devis Gratuit",
        description: "Visite sur site, étude du projet, devis détaillé gratuit",
        order_index: 1
      },
      {
        title: "Planification",
        description: "Définition du planning, commande des matériaux, organisation",
        order_index: 2
      },
      {
        title: "Réalisation",
        description: "Travaux par équipes qualifiées, suivi quotidien",
        order_index: 3
      },
      {
        title: "Livraison",
        description: "Contrôle qualité, nettoyage, garantie travaux",
        order_index: 4
      }
    ];

    for (const step of processSteps) {
      await client.mutation("cms:createProcessStep", step);
      console.log(`✅ Étape créée: ${step.title}`);
    }

    // 11. Filtres de projets
    console.log("🔍 Création des filtres de projets...");
    const projectFilters = [
      { key: "tous", label: "Tous les Projets", order_index: 1 },
      { key: "ravalement", label: "Ravalement", order_index: 2 },
      { key: "maconnerie", label: "Maçonnerie", order_index: 3 },
      { key: "couverture", label: "Couverture", order_index: 4 }
    ];

    for (const filter of projectFilters) {
      await client.mutation("cms:createProjectFilter", filter);
      console.log(`✅ Filtre créé: ${filter.label}`);
    }

    // 12. Projets de réalisation
    console.log("🏗️ Création des projets de réalisation...");
    const portfolioProjects = [
      {
        title: "Ravalement Maison Individuelle - Le Pecq",
        category: "ravalement",
        image: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800",
        description: "Rénovation complète de façade avec projection machine et finition grattée.",
        details: "Surface: 180m² • Durée: 2 semaines • Finition: Grattée",
        order_index: 1
      },
      {
        title: "Construction Mur Clôture - Meaux",
        category: "maconnerie",
        image: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800",
        description: "Édification d'un mur de clôture en parpaing avec finition enduit.",
        details: "Longueur: 45m • Hauteur: 2m • Matériau: Parpaing",
        order_index: 2
      },
      {
        title: "Réfection Toiture - Chelles",
        category: "couverture",
        image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800",
        description: "Rénovation complète de toiture avec isolation thermique.",
        details: "Surface: 120m² • Matériau: Tuiles • Isolation: Laine de roche",
        order_index: 3
      },
      {
        title: "Ravalement Immeuble - Torcy",
        category: "ravalement",
        image: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800",
        description: "Rénovation de façade d'immeuble avec isolation thermique extérieure.",
        details: "Surface: 450m² • Étages: 4 • ITE: 10cm",
        order_index: 4
      },
      {
        title: "Extension Maison - Melun",
        category: "maconnerie",
        image: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800",
        description: "Construction d'une extension avec fondations et élévation.",
        details: "Surface: 35m² • Fondations: Béton armé • Murs: Parpaing",
        order_index: 5
      },
      {
        title: "Étanchéité Terrasse - Yvelines",
        category: "couverture",
        image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800",
        description: "Réfection complète d'étanchéité de terrasse accessible.",
        details: "Surface: 80m² • Membrane: EPDM • Isolation: Polyuréthane",
        order_index: 6
      }
    ];

    for (const project of portfolioProjects) {
      await client.mutation("cms:createPortfolioProject", project);
      console.log(`✅ Projet créé: ${project.title}`);
    }

    console.log("🎉 Initialisation des données CMS terminée avec succès !");
    console.log("📊 Statistiques: 4 créées");
    console.log("🔧 Services: 3 créés");
    console.log("📍 Zones: 6 créées");
    console.log("👍 Raisons: 3 créées");
    console.log("💬 Témoignages: 3 créés");
    console.log("📖 Histoire: 1 créée");
    console.log("💎 Valeurs: 3 créées");
    console.log("👥 Équipe: 3 membres créés");
    console.log("🏆 Certifications: 4 créées");
    console.log("🔄 Processus: 4 étapes créées");
    console.log("🔍 Filtres: 4 créés");
    console.log("🏗️ Projets: 6 créés");

  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation des données CMS:", error);
  }
}

// Exécuter l'initialisation
initializeCMSData();
