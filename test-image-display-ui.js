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

async function testImageDisplayUI() {
  console.log("🖼️ Test de l'affichage des images dans l'UI admin...");

  try {
    // Créer une image de test avec Data URL
    console.log("📸 Création d'une image de test avec Data URL...");
    const testImageDataUrl = "data:image/svg+xml;base64," + Buffer.from(`
      <svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="150" height="150" fill="#FF6B35"/>
        <text x="75" y="75" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="14">
          Test Image
        </text>
      </svg>
    `).toString('base64');

    console.log("✅ Data URL générée:", testImageDataUrl.substring(0, 100) + "...");

    // Créer un membre d'équipe avec l'image de test
    console.log("👥 Création d'un membre d'équipe avec image de test...");
    const newMember = await client.mutation("cms:createTeamMember", {
      name: "Test Image Display",
      role: "Test Role",
      description: "Test de l'affichage d'image dans l'UI admin",
      image: testImageDataUrl,
      order_index: 999,
      is_active: true
    });
    console.log(`✅ Membre créé avec l'ID: ${newMember}`);

    // Vérifier que le membre a été créé avec l'image
    const teamMembers = await client.query("cms:getTeamMembers");
    const testMember = teamMembers.find(m => m._id === newMember);
    
    if (testMember) {
      console.log("✅ Membre de test trouvé:");
      console.log(`   - Nom: ${testMember.name}`);
      console.log(`   - Rôle: ${testMember.role}`);
      console.log(`   - Image: ${testMember.image.substring(0, 50)}...`);
      console.log(`   - Type: ${testMember.image.startsWith('data:') ? 'Data URL' : 'URL externe'}`);
      console.log(`   - Taille: ${testMember.image.length} caractères`);
      
      // Vérifier que c'est une Data URL valide
      if (testMember.image.startsWith('data:image/')) {
        console.log("✅ Data URL valide détectée");
        const [header, data] = testMember.image.split(',');
        console.log(`   - Header: ${header}`);
        console.log(`   - Data size: ${data.length} caractères`);
      } else {
        console.log("❌ Data URL invalide");
      }
    }

    // Créer un projet avec l'image de test
    console.log("\n🖼️ Création d'un projet avec image de test...");
    const newProject = await client.mutation("cms:createPortfolioProject", {
      title: "Test Image Display Project",
      category: "ravalement",
      image: testImageDataUrl,
      description: "Test de l'affichage d'image dans l'UI admin",
      details: "Détails de test",
      order_index: 999,
      is_active: true
    });
    console.log(`✅ Projet créé avec l'ID: ${newProject}`);

    // Vérifier que le projet a été créé avec l'image
    const portfolioProjects = await client.query("cms:getPortfolioProjects");
    const testProject = portfolioProjects.find(p => p._id === newProject);
    
    if (testProject) {
      console.log("✅ Projet de test trouvé:");
      console.log(`   - Titre: ${testProject.title}`);
      console.log(`   - Catégorie: ${testProject.category}`);
      console.log(`   - Image: ${testProject.image.substring(0, 50)}...`);
      console.log(`   - Type: ${testProject.image.startsWith('data:') ? 'Data URL' : 'URL externe'}`);
      console.log(`   - Taille: ${testProject.image.length} caractères`);
    }

    console.log("\n🎯 Instructions pour tester l'affichage:");
    console.log("1. Aller sur /admin/content");
    console.log("2. Cliquer sur l'onglet 'Équipe'");
    console.log("3. Chercher 'Test Image Display' - l'image devrait s'afficher");
    console.log("4. Cliquer sur l'onglet 'Projets'");
    console.log("5. Chercher 'Test Image Display Project' - l'image devrait s'afficher");
    console.log("6. Vérifier la console du navigateur pour les logs de chargement");

    // Nettoyer les données de test
    console.log("\n🗑️ Nettoyage des données de test...");
    await client.mutation("cms:deleteTeamMember", { id: newMember });
    await client.mutation("cms:deletePortfolioProject", { id: newProject });
    console.log("✅ Données de test supprimées");

    console.log("\n🎉 Test de l'affichage des images terminé !");
    console.log("✅ Les images Data URL devraient maintenant s'afficher dans l'UI admin !");

  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  }
}

// Exécuter le test
testImageDisplayUI();

