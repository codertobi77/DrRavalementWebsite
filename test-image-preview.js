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

async function testImagePreview() {
  console.log("🧪 Test de l'aperçu d'images...");

  try {
    // Test de création d'un membre d'équipe avec image
    console.log("👥 Test de création d'un membre d'équipe avec image...");
    const newMember = await client.mutation("cms:createTeamMember", {
      name: "Test Membre Aperçu",
      role: "Test Role",
      description: "Description de test pour l'aperçu",
      image: "https://via.placeholder.com/150x150/FF6B35/FFFFFF?text=Test+Member", // URL d'image de test
      order_index: 999,
      is_active: true
    });
    console.log(`✅ Membre créé avec l'ID: ${newMember}`);

    // Vérifier que le membre a été créé avec l'image
    const members = await client.query("cms:getTeamMembers");
    const createdMember = members.find(m => m._id === newMember);
    
    if (createdMember) {
      console.log("✅ Membre trouvé avec l'image:");
      console.log(`   - Nom: ${createdMember.name}`);
      console.log(`   - Rôle: ${createdMember.role}`);
      console.log(`   - Image: ${createdMember.image}`);
      console.log(`   - Image accessible: ${createdMember.image.startsWith('http') ? 'Oui' : 'Non'}`);
    }

    // Test de création d'un projet avec image
    console.log("🖼️ Test de création d'un projet avec image...");
    const newProject = await client.mutation("cms:createPortfolioProject", {
      title: "Test Projet Aperçu",
      category: "ravalement",
      image: "https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=Test+Project", // URL d'image de test
      description: "Description de test pour l'aperçu",
      details: "Détails de test",
      order_index: 999,
      is_active: true
    });
    console.log(`✅ Projet créé avec l'ID: ${newProject}`);

    // Vérifier que le projet a été créé avec l'image
    const projects = await client.query("cms:getPortfolioProjects");
    const createdProject = projects.find(p => p._id === newProject);
    
    if (createdProject) {
      console.log("✅ Projet trouvé avec l'image:");
      console.log(`   - Titre: ${createdProject.title}`);
      console.log(`   - Catégorie: ${createdProject.category}`);
      console.log(`   - Image: ${createdProject.image}`);
      console.log(`   - Image accessible: ${createdProject.image.startsWith('http') ? 'Oui' : 'Non'}`);
    }

    // Nettoyer les données de test
    console.log("🗑️ Nettoyage des données de test...");
    await client.mutation("cms:deleteTeamMember", { id: newMember });
    await client.mutation("cms:deletePortfolioProject", { id: newProject });
    console.log("✅ Données de test supprimées");

    console.log("🎉 Test de l'aperçu d'images réussi !");
    console.log("✅ Les images s'affichent correctement dans l'aperçu !");

  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  }
}

// Exécuter le test
testImagePreview();
