import { mutation } from "./_generated/server";

// Initialiser les données par défaut
export const initializeDefaultData = mutation({
  handler: async (ctx) => {
    // Créer les pages principales
    const homePage = await ctx.db.insert("pages", {
      slug: "home",
      title: "Accueil",
      meta_title: "DR RAVALEMENT - Expert Façades & Maçonnerie en Seine-et-Marne",
      meta_description: "Spécialiste du ravalement de façades par projection machine et maçonnerie générale en Seine-et-Marne depuis 2008. Devis gratuit.",
      content: {},
      status: "published",
    });

    const aboutPage = await ctx.db.insert("pages", {
      slug: "about",
      title: "À Propos",
      meta_title: "À Propos - DR RAVALEMENT | Votre Expert Façades",
      meta_description: "Découvrez l'histoire de DR RAVALEMENT, votre spécialiste du ravalement de façades en Seine-et-Marne. Plus de 15 ans d'expérience.",
      content: {},
      status: "published",
    });

    const servicesPage = await ctx.db.insert("pages", {
      slug: "services",
      title: "Services",
      meta_title: "Nos Services - DR RAVALEMENT | Ravalement & Maçonnerie",
      meta_description: "Découvrez tous nos services : ravalement de façades, projection machine, maçonnerie générale, couverture, clôtures et isolation thermique.",
      content: {},
      status: "published",
    });

    const portfolioPage = await ctx.db.insert("pages", {
      slug: "portfolio",
      title: "Réalisations",
      meta_title: "Nos Réalisations - DR RAVALEMENT | Galerie de Projets",
      meta_description: "Consultez notre galerie de réalisations : ravalements de façades, projets de maçonnerie et rénovations en Seine-et-Marne.",
      content: {},
      status: "published",
    });

    // Créer les sections de la page d'accueil
    await ctx.db.insert("page_sections", {
      page_id: homePage,
      section_key: "hero",
      section_type: "hero",
      title: "DR RAVALEMENT",
      content: {
        headline: "Expert Façades & Maçonnerie",
        subtitle: "Spécialiste du ravalement de façades par projection machine et maçonnerie générale en Seine-et-Marne depuis 2008",
        cta_text: "Demander un devis gratuit",
        cta_link: "/booking",
        background_image: "/images/hero-facade.jpg"
      },
      order_index: 1,
      is_active: true,
    });

    await ctx.db.insert("page_sections", {
      page_id: homePage,
      section_key: "why-choose",
      section_type: "text",
      title: "Pourquoi choisir DR RAVALEMENT ?",
      content: {
        content: "Avec plus de 15 ans d'expérience, DR RAVALEMENT s'est imposé comme le spécialiste du ravalement de façades en Seine-et-Marne. Notre expertise technique, notre savoir-faire artisanal et notre engagement qualité nous permettent de réaliser des projets d'exception qui valorisent votre patrimoine.",
        features: [
          { icon: "ri-award-line", title: "15+ ans d'expérience", description: "Une expertise reconnue dans le domaine du ravalement" },
          { icon: "ri-tools-line", title: "Matériel professionnel", description: "Projection machine et équipements de pointe" },
          { icon: "ri-shield-check-line", title: "Garantie décennale", description: "Assurance et garanties complètes" },
          { icon: "ri-map-pin-line", title: "Zone d'intervention", description: "Seine-et-Marne et Île-de-France" }
        ]
      },
      order_index: 2,
      is_active: true,
    });

    await ctx.db.insert("page_sections", {
      page_id: homePage,
      section_key: "services",
      section_type: "services",
      title: "Nos Services",
      content: {
        services: [
          { title: "Ravalement de Façades", description: "Rénovation complète de vos façades avec projection machine", icon: "ri-building-line", link: "/services" },
          { title: "Projection Machine", description: "Technique professionnelle pour un rendu parfait", icon: "ri-tools-line", link: "/services" },
          { title: "Maçonnerie Générale", description: "Tous travaux de maçonnerie et réparations", icon: "ri-hammer-line", link: "/services" },
          { title: "Isolation Thermique", description: "Amélioration de l'efficacité énergétique", icon: "ri-home-line", link: "/services" }
        ]
      },
      order_index: 3,
      is_active: true,
    });

    // Créer les sections de la page à propos
    await ctx.db.insert("page_sections", {
      page_id: aboutPage,
      section_key: "history",
      section_type: "text",
      title: "Notre Histoire",
      content: {
        content: "DR RAVALEMENT a été fondée en 2008 par des professionnels passionnés du bâtiment. Depuis plus de 15 ans, nous nous sommes spécialisés dans le ravalement de façades et la maçonnerie générale, développant une expertise reconnue en Seine-et-Marne. Notre engagement : offrir des solutions durables et esthétiques qui valorisent votre patrimoine immobilier.",
        image: "/images/equipe-dr-ravalement.jpg"
      },
      order_index: 1,
      is_active: true,
    });

    // Créer les sections de la page services
    await ctx.db.insert("page_sections", {
      page_id: servicesPage,
      section_key: "main-services",
      section_type: "services",
      title: "Nos Services Principaux",
      content: {
        services: [
          {
            title: "Ravalement de Façades",
            description: "Rénovation complète de vos façades avec projection machine pour un rendu professionnel et durable.",
            features: ["Préparation de la façade", "Projection machine enduit", "Peinture décorative", "Finitions soignées"],
            image: "/images/ravalement-facade.jpg",
            price_range: "À partir de 80€/m²"
          },
          {
            title: "Projection Machine",
            description: "Technique professionnelle de projection d'enduit pour une finition parfaite et uniforme.",
            features: ["Enduits monocouches", "Enduits décoratifs", "Isolants thermiques", "Résines de protection"],
            image: "/images/projection-machine.jpg",
            price_range: "À partir de 60€/m²"
          }
        ]
      },
      order_index: 1,
      is_active: true,
    });

    // Créer les sections de la page réalisations
    await ctx.db.insert("page_sections", {
      page_id: portfolioPage,
      section_key: "gallery",
      section_type: "gallery",
      title: "Nos Réalisations",
      content: {
        projects: [
          {
            title: "Ravalement Maison Individuelle",
            location: "Meaux",
            year: "2024",
            description: "Ravalement complet d'une maison de 150m² avec projection machine et peinture décorative.",
            images: ["/images/projet1-avant.jpg", "/images/projet1-apres.jpg"],
            category: "Ravalement"
          },
          {
            title: "Rénovation Immeuble Collectif",
            location: "Chelles",
            year: "2024",
            description: "Rénovation de la façade d'un immeuble de 5 étages avec isolation thermique par l'extérieur.",
            images: ["/images/projet2-avant.jpg", "/images/projet2-apres.jpg"],
            category: "Isolation"
          }
        ]
      },
      order_index: 1,
      is_active: true,
    });

    // Créer un utilisateur admin par défaut
    const adminUser = await ctx.db.insert("users", {
      email: "admin@dr-ravalement.fr",
      name: "Administrateur Principal",
      role: "admin",
      status: "active",
    });

    // Créer les configurations par défaut
    await ctx.db.insert("site_config", {
      key: "booking_config",
      value: {
        maxAdvanceDays: 30,
        workingDays: { start: 1, end: 5 },
        timeSlots: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
        services: [
          { id: "ravalement", name: "Ravalement de Façade", duration: 120, description: "Rénovation complète de façade" },
          { id: "projection", name: "Projection Machine", duration: 90, description: "Enduit par projection" },
          { id: "maconnerie", name: "Maçonnerie Générale", duration: 60, description: "Travaux de maçonnerie" },
          { id: "isolation", name: "Isolation Thermique", duration: 150, description: "ITE par l'extérieur" }
        ]
      },
      description: "Configuration des réservations",
      category: "booking",
      is_public: true,
    });

    await ctx.db.insert("site_config", {
      key: "contact_config",
      value: {
        email: "contact@dr-ravalement.fr",
        phone: "+33 1 39 58 90 15",
        address: "Seine-et-Marne & Île-de-France",
        hours: "Lun-Ven: 8h-18h | Sam: 9h-12h"
      },
      description: "Informations de contact",
      category: "contact",
      is_public: true,
    });

    await ctx.db.insert("site_config", {
      key: "appearance_config",
      value: {
        siteName: "DR RAVALEMENT",
        tagline: "Expert Façades & Maçonnerie",
        primaryColor: "#ea580c",
        secondaryColor: "#f97316",
        logo: "/images/logo-dr-ravalement.png"
      },
      description: "Configuration de l'apparence",
      category: "appearance",
      is_public: true,
    });

    return {
      success: true,
      pages: 4,
      sections: 6,
      configs: 3,
      adminUser: adminUser,
    };
  },
});
