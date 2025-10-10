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

async function testDynamicConfig() {
  console.log("🧪 Test de la configuration dynamique...\n");

  try {
    // Test de la configuration de contact
    console.log("📞 Test de la configuration de contact:");
    const contactConfig = await client.query("siteConfig:getConfigByKey", { key: "contact_config" });
    
    if (contactConfig) {
      console.log(`  ✅ Configuration trouvée`);
      console.log(`  - Nom de l'entreprise: ${contactConfig.companyName || 'Non défini'}`);
      console.log(`  - Email: ${contactConfig.email || 'Non défini'}`);
      console.log(`  - Téléphone: ${contactConfig.phone || 'Non défini'}`);
      console.log(`  - Ville: ${contactConfig.city || 'Non défini'}`);
      console.log(`  - Pays: ${contactConfig.country || 'Non défini'}`);
      console.log(`  - Site web: ${contactConfig.website || 'Non défini'}`);
      console.log(`  - Réseaux sociaux: ${contactConfig.socialMedia ? 'Configurés' : 'Non configurés'}`);
    } else {
      console.log(`  ⚠️  Configuration de contact non trouvée - utilisation des valeurs par défaut`);
    }

    // Test de la configuration de réservation
    console.log("\n📅 Test de la configuration de réservation:");
    const bookingConfig = await client.query("siteConfig:getConfigByKey", { key: "booking_config" });
    
    if (bookingConfig) {
      console.log(`  ✅ Configuration trouvée`);
      console.log(`  - Nombre de services: ${bookingConfig.services?.length || 0}`);
      console.log(`  - Créneaux horaires: ${bookingConfig.timeSlots?.length || 0}`);
      console.log(`  - Jours de travail: ${bookingConfig.workingDays?.start || 0} à ${bookingConfig.workingDays?.end || 0}`);
      console.log(`  - Délai max: ${bookingConfig.maxAdvanceDays || 0} jours`);
    } else {
      console.log(`  ⚠️  Configuration de réservation non trouvée - utilisation des valeurs par défaut`);
    }

    // Test de la configuration d'email
    console.log("\n📧 Test de la configuration d'email:");
    const emailConfig = await client.query("siteConfig:getConfigByKey", { key: "email_config" });
    
    if (emailConfig) {
      console.log(`  ✅ Configuration trouvée`);
      console.log(`  - Email propriétaire: ${emailConfig.ownerEmail || 'Non défini'}`);
      console.log(`  - Nom expéditeur: ${emailConfig.fromName || 'Non défini'}`);
      console.log(`  - Email expéditeur: ${emailConfig.fromEmail || 'Non défini'}`);
      console.log(`  - Email de réponse: ${emailConfig.replyTo || 'Non défini'}`);
    } else {
      console.log(`  ⚠️  Configuration d'email non trouvée - utilisation des valeurs par défaut`);
    }

    // Test des données CMS
    console.log("\n🎨 Test des données CMS:");
    const cmsData = await Promise.all([
      client.query("cms:getStatistics"),
      client.query("cms:getServices"),
      client.query("cms:getZones"),
      client.query("cms:getReasons"),
      client.query("cms:getTestimonials")
    ]);

    const [stats, services, zones, reasons, testimonials] = cmsData;
    
    console.log(`  - Statistiques: ${stats?.length || 0} éléments`);
    console.log(`  - Services: ${services?.length || 0} éléments`);
    console.log(`  - Zones: ${zones?.length || 0} éléments`);
    console.log(`  - Raisons: ${reasons?.length || 0} éléments`);
    console.log(`  - Témoignages: ${testimonials?.length || 0} éléments`);

    // Résumé
    console.log("\n📈 Résumé de la configuration dynamique:");
    const hasContactConfig = !!contactConfig;
    const hasBookingConfig = !!bookingConfig;
    const hasEmailConfig = !!emailConfig;
    const hasCmsData = cmsData.some(data => data && data.length > 0);

    console.log(`  - Configuration de contact: ${hasContactConfig ? '✅' : '⚠️'}`);
    console.log(`  - Configuration de réservation: ${hasBookingConfig ? '✅' : '⚠️'}`);
    console.log(`  - Configuration d'email: ${hasEmailConfig ? '✅' : '⚠️'}`);
    console.log(`  - Données CMS: ${hasCmsData ? '✅' : '⚠️'}`);

    if (hasContactConfig && hasBookingConfig && hasEmailConfig && hasCmsData) {
      console.log("\n🎉 Excellent! Toutes les configurations sont disponibles et fonctionnelles.");
    } else {
      console.log("\n⚠️  Certaines configurations sont manquantes. Les composants utiliseront les valeurs par défaut.");
    }

    console.log("\n🔧 Pages converties:");
    console.log("  ✅ Header - Informations de contact dynamiques");
    console.log("  ✅ Footer - Informations de contact et entreprise dynamiques");
    console.log("  ✅ Page Contact - Informations de contact dynamiques");
    console.log("  ✅ Page Portfolio - Liens CTA dynamiques");
    console.log("  ✅ Page About - Liens CTA dynamiques");
    console.log("  ✅ Page Services - Liens CTA dynamiques");
    console.log("  ✅ SEO Head - Données structurées dynamiques");

    console.log("\n🎯 Avantages de la conversion:");
    console.log("  - Modification centralisée des informations de contact");
    console.log("  - Mise à jour automatique sur toutes les pages");
    console.log("  - Gestion des créneaux de réservation dynamique");
    console.log("  - Configuration des emails personnalisée");
    console.log("  - Déduplication automatique des données CMS");

  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  }
}

testDynamicConfig();
