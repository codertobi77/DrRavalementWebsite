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

async function checkCMSData() {
  console.log("🔍 Vérification des données CMS...");

  try {
    // Vérifier les statistiques
    console.log("📊 Vérification des statistiques...");
    const statistics = await client.query("cms:getStatistics");
    console.log(`✅ ${statistics?.length || 0} statistiques trouvées`);
    if (statistics && statistics.length > 0) {
      statistics.forEach(stat => {
        console.log(`   - ${stat.label}: ${stat.value} (${stat.is_active ? 'Actif' : 'Inactif'})`);
      });
    }

    // Vérifier les services
    console.log("🔧 Vérification des services...");
    const services = await client.query("cms:getServices");
    console.log(`✅ ${services?.length || 0} services trouvés`);
    if (services && services.length > 0) {
      services.forEach(service => {
        console.log(`   - ${service.title} (${service.is_active ? 'Actif' : 'Inactif'})`);
      });
    }

    // Vérifier les zones
    console.log("📍 Vérification des zones...");
    const zones = await client.query("cms:getZones");
    console.log(`✅ ${zones?.length || 0} zones trouvées`);
    if (zones && zones.length > 0) {
      zones.forEach(zone => {
        console.log(`   - ${zone.name} (${zone.is_active ? 'Actif' : 'Inactif'})`);
      });
    }

    // Vérifier les raisons
    console.log("💡 Vérification des raisons...");
    const reasons = await client.query("cms:getReasons");
    console.log(`✅ ${reasons?.length || 0} raisons trouvées`);
    if (reasons && reasons.length > 0) {
      reasons.forEach(reason => {
        console.log(`   - ${reason.title} (${reason.is_active ? 'Actif' : 'Inactif'})`);
      });
    }

    // Vérifier les témoignages
    console.log("💬 Vérification des témoignages...");
    const testimonials = await client.query("cms:getTestimonials");
    console.log(`✅ ${testimonials?.length || 0} témoignages trouvés`);
    if (testimonials && testimonials.length > 0) {
      testimonials.forEach(testimonial => {
        console.log(`   - ${testimonial.author} (${testimonial.is_active ? 'Actif' : 'Inactif'})`);
      });
    }

    // Vérifier les valeurs
    console.log("⭐ Vérification des valeurs...");
    const values = await client.query("cms:getValues");
    console.log(`✅ ${values?.length || 0} valeurs trouvées`);
    if (values && values.length > 0) {
      values.forEach(value => {
        console.log(`   - ${value.title} (${value.is_active ? 'Actif' : 'Inactif'})`);
      });
    }

    // Vérifier les membres d'équipe
    console.log("👥 Vérification des membres d'équipe...");
    const teamMembers = await client.query("cms:getTeamMembers");
    console.log(`✅ ${teamMembers?.length || 0} membres d'équipe trouvés`);
    if (teamMembers && teamMembers.length > 0) {
      teamMembers.forEach(member => {
        console.log(`   - ${member.name} - ${member.role} (${member.is_active ? 'Actif' : 'Inactif'})`);
      });
    }

    // Vérifier les certifications
    console.log("🏆 Vérification des certifications...");
    const certifications = await client.query("cms:getCertifications");
    console.log(`✅ ${certifications?.length || 0} certifications trouvées`);
    if (certifications && certifications.length > 0) {
      certifications.forEach(cert => {
        console.log(`   - ${cert.title} (${cert.is_active ? 'Actif' : 'Inactif'})`);
      });
    }

    // Vérifier les étapes de processus
    console.log("⚙️ Vérification des étapes de processus...");
    const processSteps = await client.query("cms:getProcessSteps");
    console.log(`✅ ${processSteps?.length || 0} étapes de processus trouvées`);
    if (processSteps && processSteps.length > 0) {
      processSteps.forEach(step => {
        console.log(`   - ${step.title} (${step.is_active ? 'Actif' : 'Inactif'})`);
      });
    }

    // Vérifier les filtres de projets
    console.log("🔍 Vérification des filtres de projets...");
    const projectFilters = await client.query("cms:getProjectFilters");
    console.log(`✅ ${projectFilters?.length || 0} filtres de projets trouvés`);
    if (projectFilters && projectFilters.length > 0) {
      projectFilters.forEach(filter => {
        console.log(`   - ${filter.label} (${filter.is_active ? 'Actif' : 'Inactif'})`);
      });
    }

    // Vérifier les projets de portfolio
    console.log("🖼️ Vérification des projets de portfolio...");
    const portfolioProjects = await client.query("cms:getPortfolioProjects");
    console.log(`✅ ${portfolioProjects?.length || 0} projets de portfolio trouvés`);
    if (portfolioProjects && portfolioProjects.length > 0) {
      portfolioProjects.forEach(project => {
        console.log(`   - ${project.title} - ${project.category} (${project.is_active ? 'Actif' : 'Inactif'})`);
      });
    }

    // Vérifier l'histoire de l'entreprise
    console.log("📖 Vérification de l'histoire de l'entreprise...");
    const companyHistory = await client.query("cms:getCompanyHistory");
    console.log(`✅ ${companyHistory?.length || 0} entrées d'histoire trouvées`);
    if (companyHistory && companyHistory.length > 0) {
      companyHistory.forEach(history => {
        console.log(`   - ${history.title} (${history.is_active ? 'Actif' : 'Inactif'})`);
      });
    }

    console.log("\n🎯 Résumé des données CMS:");
    console.log(`📊 Statistiques: ${statistics?.length || 0}`);
    console.log(`🔧 Services: ${services?.length || 0}`);
    console.log(`📍 Zones: ${zones?.length || 0}`);
    console.log(`💡 Raisons: ${reasons?.length || 0}`);
    console.log(`💬 Témoignages: ${testimonials?.length || 0}`);
    console.log(`⭐ Valeurs: ${values?.length || 0}`);
    console.log(`👥 Équipe: ${teamMembers?.length || 0}`);
    console.log(`🏆 Certifications: ${certifications?.length || 0}`);
    console.log(`⚙️ Processus: ${processSteps?.length || 0}`);
    console.log(`🔍 Filtres: ${projectFilters?.length || 0}`);
    console.log(`🖼️ Projets: ${portfolioProjects?.length || 0}`);
    console.log(`📖 Histoire: ${companyHistory?.length || 0}`);

    const totalData = (statistics?.length || 0) + (services?.length || 0) + (zones?.length || 0) + 
                     (reasons?.length || 0) + (testimonials?.length || 0) + (values?.length || 0) + 
                     (teamMembers?.length || 0) + (certifications?.length || 0) + (processSteps?.length || 0) + 
                     (projectFilters?.length || 0) + (portfolioProjects?.length || 0) + (companyHistory?.length || 0);

    if (totalData === 0) {
      console.log("\n⚠️ Aucune donnée CMS trouvée !");
      console.log("💡 Exécutez 'node init-cms-data.js' pour initialiser les données par défaut.");
    } else {
      console.log(`\n✅ Total: ${totalData} éléments de contenu trouvés`);
    }

  } catch (error) {
    console.error("❌ Erreur lors de la vérification:", error);
  }
}

// Exécuter la vérification
checkCMSData();
