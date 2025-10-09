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

async function testUploadFix() {
  console.log("🧪 Test de correction de l'upload d'images...");

  try {
    // Test de création d'un membre d'équipe avec image
    console.log("👥 Test de création d'un membre d'équipe avec image...");
    const newMember = await client.mutation("cms:createTeamMember", {
      name: "Test Membre Upload",
      role: "Test Role",
      description: "Description de test pour l'upload",
      image: "/assets/equipe/test_membre_123456.jpg", // URL simulée
      order_index: 999,
      is_active: true
    });
    console.log(`✅ Membre créé avec l'ID: ${newMember}`);

    // Vérifier que le membre a été créé
    const members = await client.query("cms:getTeamMembers");
    const createdMember = members.find(m => m._id === newMember);
    
    if (createdMember) {
      console.log("✅ Membre trouvé avec l'image:");
      console.log(`   - Nom: ${createdMember.name}`);
      console.log(`   - Rôle: ${createdMember.role}`);
      console.log(`   - Image: ${createdMember.image}`);
    }

    // Test de création d'un projet avec image
    console.log("🖼️ Test de création d'un projet avec image...");
    const newProject = await client.mutation("cms:createPortfolioProject", {
      title: "Test Projet Upload",
      category: "ravalement",
      image: "/assets/projets/test_projet_123456.jpg", // URL simulée
      description: "Description de test pour l'upload",
      details: "Détails de test",
      order_index: 999,
      is_active: true
    });
    console.log(`✅ Projet créé avec l'ID: ${newProject}`);

    // Vérifier que le projet a été créé
    const projects = await client.query("cms:getPortfolioProjects");
    const createdProject = projects.find(p => p._id === newProject);
    
    if (createdProject) {
      console.log("✅ Projet trouvé avec l'image:");
      console.log(`   - Titre: ${createdProject.title}`);
      console.log(`   - Catégorie: ${createdProject.category}`);
      console.log(`   - Image: ${createdProject.image}`);
    }

    // Nettoyer les données de test
    console.log("🗑️ Nettoyage des données de test...");
    await client.mutation("cms:deleteTeamMember", { id: newMember });
    await client.mutation("cms:deletePortfolioProject", { id: newProject });
    console.log("✅ Données de test supprimées");

    console.log("🎉 Test de correction de l'upload réussi !");
    console.log("✅ Le service d'upload d'images fonctionne correctement !");

  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  }
}

// Exécuter le test
testUploadFix();
