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

async function cleanDuplicateData() {
  console.log("🧹 Nettoyage des données dupliquées CMS...\n");

  try {
    // Nettoyer les statistiques dupliquées
    console.log("📊 Nettoyage des statistiques...");
    const stats = await client.query("cms:getStatistics");
    const uniqueStats = [];
    const seenKeys = new Set();
    
    for (const stat of stats) {
      if (!seenKeys.has(stat.key)) {
        seenKeys.add(stat.key);
        uniqueStats.push(stat);
      } else {
        console.log(`  - Suppression de la statistique dupliquée: ${stat.key}`);
        await client.mutation("cms:deleteStatistic", { id: stat._id });
      }
    }
    console.log(`  ✅ ${stats.length - uniqueStats.length} statistiques dupliquées supprimées`);

    // Nettoyer les services dupliqués
    console.log("\n🛠️ Nettoyage des services...");
    const services = await client.query("cms:getServices");
    const uniqueServices = [];
    const seenTitles = new Set();
    
    for (const service of services) {
      if (!seenTitles.has(service.title)) {
        seenTitles.add(service.title);
        uniqueServices.push(service);
      } else {
        console.log(`  - Suppression du service dupliqué: ${service.title}`);
        await client.mutation("cms:deleteService", { id: service._id });
      }
    }
    console.log(`  ✅ ${services.length - uniqueServices.length} services dupliqués supprimés`);

    // Nettoyer les zones dupliquées
    console.log("\n📍 Nettoyage des zones...");
    const zones = await client.query("cms:getZones");
    const uniqueZones = [];
    const seenNames = new Set();
    
    for (const zone of zones) {
      if (!seenNames.has(zone.name)) {
        seenNames.add(zone.name);
        uniqueZones.push(zone);
      } else {
        console.log(`  - Suppression de la zone dupliquée: ${zone.name}`);
        await client.mutation("cms:deleteZone", { id: zone._id });
      }
    }
    console.log(`  ✅ ${zones.length - uniqueZones.length} zones dupliquées supprimées`);

    // Nettoyer les raisons dupliquées
    console.log("\n💡 Nettoyage des raisons...");
    const reasons = await client.query("cms:getReasons");
    const uniqueReasons = [];
    const seenReasonTitles = new Set();
    
    for (const reason of reasons) {
      if (!seenReasonTitles.has(reason.title)) {
        seenReasonTitles.add(reason.title);
        uniqueReasons.push(reason);
      } else {
        console.log(`  - Suppression de la raison dupliquée: ${reason.title}`);
        await client.mutation("cms:deleteReason", { id: reason._id });
      }
    }
    console.log(`  ✅ ${reasons.length - uniqueReasons.length} raisons dupliquées supprimées`);

    // Nettoyer les témoignages dupliqués
    console.log("\n💬 Nettoyage des témoignages...");
    const testimonials = await client.query("cms:getTestimonials");
    const uniqueTestimonials = [];
    const seenTexts = new Set();
    
    for (const testimonial of testimonials) {
      if (!seenTexts.has(testimonial.text)) {
        seenTexts.add(testimonial.text);
        uniqueTestimonials.push(testimonial);
      } else {
        console.log(`  - Suppression du témoignage dupliqué: ${testimonial.text.substring(0, 50)}...`);
        await client.mutation("cms:deleteTestimonial", { id: testimonial._id });
      }
    }
    console.log(`  ✅ ${testimonials.length - uniqueTestimonials.length} témoignages dupliqués supprimés`);

    console.log("\n✅ Nettoyage terminé avec succès!");

  } catch (error) {
    console.error("❌ Erreur lors du nettoyage:", error);
  }
}

cleanDuplicateData();
