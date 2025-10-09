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

const convexClient = new ConvexHttpClient(CONVEX_URL);

// Configurations par défaut
const defaultConfigs = {
  booking_config: {
    maxAdvanceDays: 30,
    workingDays: { start: 1, end: 5 },
    timeSlots: [
      "08:00", "09:00", "10:00", "11:00",
      "14:00", "15:00", "16:00", "17:00"
    ],
    services: [
      {
        id: "ravalement",
        name: "Ravalement de façade",
        duration: 120,
        description: "Ravalement complet de façade"
      },
      {
        id: "maçonnerie",
        name: "Maçonnerie générale",
        duration: 180,
        description: "Travaux de maçonnerie divers"
      },
      {
        id: "couverture",
        name: "Couverture",
        duration: 240,
        description: "Travaux de couverture et toiture"
      },
      {
        id: "isolation",
        name: "Isolation thermique",
        duration: 300,
        description: "Isolation extérieure et intérieure"
      }
    ]
  },
  contact_config: {
    companyName: "DR RAVALEMENT",
    email: "contact@dr-ravalement.fr",
    phone: "+33 1 39 58 90 15",
    website: "https://dr-ravalement.fr",
    address: "123 Rue de la Maçonnerie",
    city: "Seine-et-Marne",
    postalCode: "77000",
    country: "Île-de-France",
    hours: "Lun-Ven: 8h-18h, Sam: 8h-12h",
    socialMedia: {
      facebook: "https://www.facebook.com/dr-ravalement",
      linkedin: "https://www.linkedin.com/company/dr-ravalement",
      instagram: "https://www.instagram.com/dr_ravalement",
      twitter: "https://www.twitter.com/dr_ravalement"
    }
  },
  email_config: {
    ownerEmail: "contact@dr-ravalement.fr",
    fromName: "DR RAVALEMENT",
    fromEmail: "noreply@dr-ravalement.fr",
    replyTo: "contact@dr-ravalement.fr",
    templates: {
      bookingConfirmation: {
        subject: "Confirmation de réservation - DR RAVALEMENT",
        body: "Votre réservation a été confirmée pour le {{date}} à {{time}}."
      },
      bookingReminder: {
        subject: "Rappel de réservation - DR RAVALEMENT",
        body: "Rappel : Votre rendez-vous est prévu demain à {{time}}."
      },
      quoteRequest: {
        subject: "Demande de devis reçue - DR RAVALEMENT",
        body: "Nous avons bien reçu votre demande de devis et vous recontacterons sous 24h."
      }
    }
  },
  appearance_config: {
    siteName: "DR RAVALEMENT",
    tagline: "Expert en ravalement de façades",
    primaryColor: "#f97316",
    secondaryColor: "#ea580c",
    logo: "/logo.png"
  }
};

async function initializeSiteConfig() {
  console.log("🚀 Initialisation de la configuration du site dans Convex...");
  console.log(`📡 Connexion à: ${CONVEX_URL}`);

  try {
    // Vérifier la connexion
    console.log("🔍 Test de connexion...");
    const testResult = await convexClient.query("siteConfig:getPublicConfigs");
    console.log("✅ Connexion Convex réussie");

    // Initialiser chaque configuration
    for (const [key, value] of Object.entries(defaultConfigs)) {
      console.log(`\n📝 Initialisation de ${key}...`);
      
      try {
        // Vérifier si la configuration existe déjà
        const existing = await convexClient.query("siteConfig:getConfigByKey", { key });
        
        if (existing) {
          console.log(`  ⚠️  ${key} existe déjà, mise à jour...`);
        } else {
          console.log(`  ➕ Création de ${key}...`);
        }

        // Créer ou mettre à jour la configuration
        await convexClient.mutation("siteConfig:setConfig", {
          key,
          value,
          description: getDescription(key),
          category: key.split('_')[0],
          is_public: true
        });

        console.log(`  ✅ ${key} initialisé avec succès`);
      } catch (error) {
        console.error(`  ❌ Erreur lors de l'initialisation de ${key}:`, error.message);
      }
    }

    console.log("\n🎉 Initialisation terminée !");
    console.log("\n📊 Vérification des configurations...");
    
    // Vérifier que tout a été créé
    const allConfigs = await convexClient.query("siteConfig:getPublicConfigs");
    console.log(`✅ ${allConfigs.length} configurations disponibles:`);
    
    // Créer un objet avec les clés pour faciliter la vérification
    const configsByKey = {};
    allConfigs.forEach(config => {
      configsByKey[config.key] = config;
    });
    
    for (const key of Object.keys(defaultConfigs)) {
      if (configsByKey[key]) {
        console.log(`  ✅ ${key}`);
      } else {
        console.log(`  ❌ ${key} - MANQUANT`);
      }
    }

  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation:", error);
    process.exit(1);
  }
}

function getDescription(key) {
  const descriptions = {
    booking_config: "Configuration des réservations et créneaux",
    contact_config: "Informations de contact de l'entreprise",
    email_config: "Configuration des emails et notifications",
    appearance_config: "Configuration de l'apparence du site"
  };
  return descriptions[key] || "Configuration du site";
}

// Exécuter l'initialisation
initializeSiteConfig();
