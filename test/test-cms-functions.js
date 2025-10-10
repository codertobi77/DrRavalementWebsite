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

async function testCMSFunctions() {
  console.log("🧪 Test des fonctions CMS...");

  try {
    // Test des statistiques
    console.log("📊 Test des statistiques...");
    const statistics = await client.query("cms:getStatistics");
    console.log(`✅ Statistiques: ${statistics.length} trouvées`);

    // Test des services
    console.log("🔧 Test des services...");
    const services = await client.query("cms:getServices");
    console.log(`✅ Services: ${services.length} trouvés`);

    // Test des zones
    console.log("📍 Test des zones...");
    const zones = await client.query("cms:getZones");
    console.log(`✅ Zones: ${zones.length} trouvées`);

    // Test des raisons
    console.log("👍 Test des raisons...");
    const reasons = await client.query("cms:getReasons");
    console.log(`✅ Raisons: ${reasons.length} trouvées`);

    // Test des témoignages
    console.log("💬 Test des témoignages...");
    const testimonials = await client.query("cms:getTestimonials");
    console.log(`✅ Témoignages: ${testimonials.length} trouvés`);

    // Test de l'histoire
    console.log("📖 Test de l'histoire...");
    const history = await client.query("cms:getCompanyHistory");
    console.log(`✅ Histoire: ${history ? 'Trouvée' : 'Non trouvée'}`);

    // Test des valeurs
    console.log("💎 Test des valeurs...");
    const values = await client.query("cms:getValues");
    console.log(`✅ Valeurs: ${values.length} trouvées`);

    // Test des membres d'équipe
    console.log("👥 Test des membres d'équipe...");
    const teamMembers = await client.query("cms:getTeamMembers");
    console.log(`✅ Membres d'équipe: ${teamMembers.length} trouvés`);

    // Test des certifications
    console.log("🏆 Test des certifications...");
    const certifications = await client.query("cms:getCertifications");
    console.log(`✅ Certifications: ${certifications.length} trouvées`);

    // Test des étapes de processus
    console.log("🔄 Test des étapes de processus...");
    const processSteps = await client.query("cms:getProcessSteps");
    console.log(`✅ Étapes de processus: ${processSteps.length} trouvées`);

    // Test des filtres de projets
    console.log("🔍 Test des filtres de projets...");
    const projectFilters = await client.query("cms:getProjectFilters");
    console.log(`✅ Filtres de projets: ${projectFilters.length} trouvés`);

    // Test des projets de portfolio
    console.log("🏗️ Test des projets de portfolio...");
    const portfolioProjects = await client.query("cms:getPortfolioProjects");
    console.log(`✅ Projets de portfolio: ${portfolioProjects.length} trouvés`);

    // Test des projets par catégorie
    console.log("🏗️ Test des projets par catégorie...");
    const ravalementProjects = await client.query("cms:getPortfolioProjectsByCategory", { category: "ravalement" });
    console.log(`✅ Projets de ravalement: ${ravalementProjects.length} trouvés`);

    const maconnerieProjects = await client.query("cms:getPortfolioProjectsByCategory", { category: "maconnerie" });
    console.log(`✅ Projets de maçonnerie: ${maconnerieProjects.length} trouvés`);

    const couvertureProjects = await client.query("cms:getPortfolioProjectsByCategory", { category: "couverture" });
    console.log(`✅ Projets de couverture: ${couvertureProjects.length} trouvés`);

    console.log("🎉 Tous les tests sont passés avec succès !");
    console.log("\n📊 Résumé des données :");
    console.log(`- Statistiques: ${statistics.length}`);
    console.log(`- Services: ${services.length}`);
    console.log(`- Zones: ${zones.length}`);
    console.log(`- Raisons: ${reasons.length}`);
    console.log(`- Témoignages: ${testimonials.length}`);
    console.log(`- Histoire: ${history ? 'Oui' : 'Non'}`);
    console.log(`- Valeurs: ${values.length}`);
    console.log(`- Membres d'équipe: ${teamMembers.length}`);
    console.log(`- Certifications: ${certifications.length}`);
    console.log(`- Étapes de processus: ${processSteps.length}`);
    console.log(`- Filtres de projets: ${projectFilters.length}`);
    console.log(`- Projets de portfolio: ${portfolioProjects.length}`);

  } catch (error) {
    console.error("❌ Erreur lors des tests:", error);
  }
}

// Exécuter les tests
testCMSFunctions();
