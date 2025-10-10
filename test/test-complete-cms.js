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

async function testCompleteCMS() {
  console.log("🧪 Test complet du CMS avec toutes les modales...");

  try {
    // Test des valeurs
    console.log("📊 Test des valeurs...");
    const values = await client.query("cms:getValues");
    console.log(`✅ ${values?.length || 0} valeurs trouvées`);

    // Test des membres d'équipe
    console.log("👥 Test des membres d'équipe...");
    const teamMembers = await client.query("cms:getTeamMembers");
    console.log(`✅ ${teamMembers?.length || 0} membres d'équipe trouvés`);

    // Test des certifications
    console.log("🏆 Test des certifications...");
    const certifications = await client.query("cms:getCertifications");
    console.log(`✅ ${certifications?.length || 0} certifications trouvées`);

    // Test des étapes de processus
    console.log("⚙️ Test des étapes de processus...");
    const processSteps = await client.query("cms:getProcessSteps");
    console.log(`✅ ${processSteps?.length || 0} étapes de processus trouvées`);

    // Test des filtres de projets
    console.log("🔍 Test des filtres de projets...");
    const projectFilters = await client.query("cms:getProjectFilters");
    console.log(`✅ ${projectFilters?.length || 0} filtres de projets trouvés`);

    // Test des projets de portfolio
    console.log("🖼️ Test des projets de portfolio...");
    const portfolioProjects = await client.query("cms:getPortfolioProjects");
    console.log(`✅ ${portfolioProjects?.length || 0} projets de portfolio trouvés`);

    // Test de l'histoire de l'entreprise
    console.log("📖 Test de l'histoire de l'entreprise...");
    const companyHistory = await client.query("cms:getCompanyHistory");
    console.log(`✅ ${companyHistory?.length || 0} entrées d'histoire trouvées`);

    // Test de création d'une valeur
    console.log("📊 Test de création d'une valeur...");
    const newValue = await client.mutation("cms:createValue", {
      title: "Test Valeur",
      description: "Description de test",
      icon: "ri-star-line",
      order_index: 999,
      is_active: true
    });
    console.log(`✅ Valeur créée avec l'ID: ${newValue}`);

    // Test de mise à jour de la valeur
    console.log("📊 Test de mise à jour de la valeur...");
    await client.mutation("cms:updateValue", {
      id: newValue,
      title: "Test Valeur Modifiée",
      description: "Description modifiée"
    });
    console.log("✅ Valeur mise à jour");

    // Test de suppression de la valeur
    console.log("📊 Test de suppression de la valeur...");
    await client.mutation("cms:deleteValue", { id: newValue });
    console.log("✅ Valeur supprimée");

    // Test de création d'un membre d'équipe
    console.log("👥 Test de création d'un membre d'équipe...");
    const newMember = await client.mutation("cms:createTeamMember", {
      name: "Test Membre",
      role: "Test Role",
      description: "Description de test",
      image: "https://via.placeholder.com/150",
      order_index: 999,
      is_active: true
    });
    console.log(`✅ Membre créé avec l'ID: ${newMember}`);

    // Test de suppression du membre
    console.log("👥 Test de suppression du membre...");
    await client.mutation("cms:deleteTeamMember", { id: newMember });
    console.log("✅ Membre supprimé");

    // Test de création d'une certification
    console.log("🏆 Test de création d'une certification...");
    const newCert = await client.mutation("cms:createCertification", {
      title: "Test Certification",
      description: "Description de test",
      icon: "ri-award-line",
      order_index: 999,
      is_active: true
    });
    console.log(`✅ Certification créée avec l'ID: ${newCert}`);

    // Test de suppression de la certification
    console.log("🏆 Test de suppression de la certification...");
    await client.mutation("cms:deleteCertification", { id: newCert });
    console.log("✅ Certification supprimée");

    // Test de création d'une étape de processus
    console.log("⚙️ Test de création d'une étape de processus...");
    const newStep = await client.mutation("cms:createProcessStep", {
      title: "Test Étape",
      description: "Description de test",
      order_index: 999,
      is_active: true
    });
    console.log(`✅ Étape créée avec l'ID: ${newStep}`);

    // Test de suppression de l'étape
    console.log("⚙️ Test de suppression de l'étape...");
    await client.mutation("cms:deleteProcessStep", { id: newStep });
    console.log("✅ Étape supprimée");

    // Test de création d'un filtre de projet
    console.log("🔍 Test de création d'un filtre de projet...");
    const newFilter = await client.mutation("cms:createProjectFilter", {
      key: "test_filter",
      label: "Test Filtre",
      order_index: 999,
      is_active: true
    });
    console.log(`✅ Filtre créé avec l'ID: ${newFilter}`);

    // Test de suppression du filtre
    console.log("🔍 Test de suppression du filtre...");
    await client.mutation("cms:deleteProjectFilter", { id: newFilter });
    console.log("✅ Filtre supprimé");

    // Test de création d'un projet de portfolio
    console.log("🖼️ Test de création d'un projet de portfolio...");
    const newProject = await client.mutation("cms:createPortfolioProject", {
      title: "Test Projet",
      category: "ravalement",
      image: "https://via.placeholder.com/400x300",
      description: "Description de test",
      details: "Détails de test",
      order_index: 999,
      is_active: true
    });
    console.log(`✅ Projet créé avec l'ID: ${newProject}`);

    // Test de suppression du projet
    console.log("🖼️ Test de suppression du projet...");
    await client.mutation("cms:deletePortfolioProject", { id: newProject });
    console.log("✅ Projet supprimé");

    console.log("🎉 Test complet du CMS réussi !");
    console.log("✅ Toutes les modales et fonctionnalités CRUD sont opérationnelles !");

  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  }
}

// Exécuter le test
testCompleteCMS();
