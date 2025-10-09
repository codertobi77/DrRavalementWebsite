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

async function checkDataIntegrity() {
  console.log("🔍 Vérification de l'intégrité des données CMS...\n");

  try {
    // Vérifier les statistiques
    console.log("📊 Statistiques:");
    const stats = await client.query("cms:getStatistics");
    console.log(`  - Nombre total: ${stats.length}`);
    
    const statKeys = stats.map(s => s.key);
    const duplicateKeys = statKeys.filter((key, index) => statKeys.indexOf(key) !== index);
    if (duplicateKeys.length > 0) {
      console.log(`  ❌ Clés dupliquées: ${duplicateKeys.join(', ')}`);
    } else {
      console.log("  ✅ Aucune clé dupliquée");
    }

    // Vérifier les services
    console.log("\n🛠️ Services:");
    const services = await client.query("cms:getServices");
    console.log(`  - Nombre total: ${services.length}`);
    
    const serviceTitles = services.map(s => s.title);
    const duplicateTitles = serviceTitles.filter((title, index) => serviceTitles.indexOf(title) !== index);
    if (duplicateTitles.length > 0) {
      console.log(`  ❌ Titres dupliqués: ${duplicateTitles.join(', ')}`);
    } else {
      console.log("  ✅ Aucun titre dupliqué");
    }

    // Vérifier les zones
    console.log("\n📍 Zones:");
    const zones = await client.query("cms:getZones");
    console.log(`  - Nombre total: ${zones.length}`);
    
    const zoneNames = zones.map(z => z.name);
    const duplicateZones = zoneNames.filter((name, index) => zoneNames.indexOf(name) !== index);
    if (duplicateZones.length > 0) {
      console.log(`  ❌ Noms dupliqués: ${duplicateZones.join(', ')}`);
    } else {
      console.log("  ✅ Aucun nom dupliqué");
    }

    // Vérifier les raisons
    console.log("\n💡 Raisons:");
    const reasons = await client.query("cms:getReasons");
    console.log(`  - Nombre total: ${reasons.length}`);
    
    const reasonTitles = reasons.map(r => r.title);
    const duplicateReasons = reasonTitles.filter((title, index) => reasonTitles.indexOf(title) !== index);
    if (duplicateReasons.length > 0) {
      console.log(`  ❌ Titres dupliqués: ${duplicateReasons.join(', ')}`);
    } else {
      console.log("  ✅ Aucun titre dupliqué");
    }

    // Vérifier les témoignages
    console.log("\n💬 Témoignages:");
    const testimonials = await client.query("cms:getTestimonials");
    console.log(`  - Nombre total: ${testimonials.length}`);
    
    const testimonialTexts = testimonials.map(t => t.text);
    const duplicateTestimonials = testimonialTexts.filter((text, index) => testimonialTexts.indexOf(text) !== index);
    if (duplicateTestimonials.length > 0) {
      console.log(`  ❌ Textes dupliqués: ${duplicateTestimonials.length} occurrences`);
    } else {
      console.log("  ✅ Aucun texte dupliqué");
    }

    console.log("\n✅ Vérification terminée!");

  } catch (error) {
    console.error("❌ Erreur lors de la vérification:", error);
  }
}

checkDataIntegrity();
