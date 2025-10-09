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

async function testImageDisplay() {
  console.log("🖼️ Test de l'affichage des images...");

  try {
    // Test des membres d'équipe avec images
    console.log("👥 Test des membres d'équipe...");
    const teamMembers = await client.query("cms:getTeamMembers");
    console.log(`✅ ${teamMembers?.length || 0} membres d'équipe trouvés`);
    
    if (teamMembers && teamMembers.length > 0) {
      teamMembers.forEach((member, index) => {
        console.log(`\n👤 Membre ${index + 1}:`);
        console.log(`   - Nom: ${member.name}`);
        console.log(`   - Rôle: ${member.role}`);
        console.log(`   - Image: ${member.image}`);
        console.log(`   - Type d'image: ${member.image.startsWith('data:') ? 'Data URL (Base64)' : 'URL externe'}`);
        console.log(`   - Taille de l'URL: ${member.image.length} caractères`);
        if (member.image.startsWith('data:')) {
          console.log(`   - Format: ${member.image.split(';')[0].split(':')[1]}`);
        }
      });
    }

    // Test des projets de portfolio avec images
    console.log("\n🖼️ Test des projets de portfolio...");
    const portfolioProjects = await client.query("cms:getPortfolioProjects");
    console.log(`✅ ${portfolioProjects?.length || 0} projets de portfolio trouvés`);
    
    if (portfolioProjects && portfolioProjects.length > 0) {
      portfolioProjects.forEach((project, index) => {
        console.log(`\n🏗️ Projet ${index + 1}:`);
        console.log(`   - Titre: ${project.title}`);
        console.log(`   - Catégorie: ${project.category}`);
        console.log(`   - Image: ${project.image}`);
        console.log(`   - Type d'image: ${project.image.startsWith('data:') ? 'Data URL (Base64)' : 'URL externe'}`);
        console.log(`   - Taille de l'URL: ${project.image.length} caractères`);
        if (project.image.startsWith('data:')) {
          console.log(`   - Format: ${project.image.split(';')[0].split(':')[1]}`);
        }
      });
    }

    // Test de création d'un membre avec image de test
    console.log("\n🧪 Test de création d'un membre avec image de test...");
    const testImageUrl = "https://via.placeholder.com/150x150/FF6B35/FFFFFF?text=Test+Member";
    
    const newMember = await client.mutation("cms:createTeamMember", {
      name: "Test Image Display",
      role: "Test Role",
      description: "Test de l'affichage d'image",
      image: testImageUrl,
      order_index: 999,
      is_active: true
    });
    console.log(`✅ Membre de test créé avec l'ID: ${newMember}`);

    // Vérifier que le membre a été créé
    const updatedMembers = await client.query("cms:getTeamMembers");
    const testMember = updatedMembers.find(m => m._id === newMember);
    
    if (testMember) {
      console.log("✅ Membre de test trouvé:");
      console.log(`   - Nom: ${testMember.name}`);
      console.log(`   - Image: ${testMember.image}`);
      console.log(`   - Image accessible: ${testMember.image.startsWith('http') ? 'Oui (URL externe)' : 'Non (URL locale)'}`);
    }

    // Nettoyer le membre de test
    console.log("\n🗑️ Nettoyage du membre de test...");
    await client.mutation("cms:deleteTeamMember", { id: newMember });
    console.log("✅ Membre de test supprimé");

    console.log("\n🎉 Test de l'affichage des images terminé !");

  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  }
}

// Exécuter le test
testImageDisplay();
