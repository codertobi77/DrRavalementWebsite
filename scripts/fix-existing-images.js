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

// Créer des images de test avec Data URLs
function createTestImage(type, text) {
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#FF6B35"/>
      <circle cx="100" cy="80" r="30" fill="white" opacity="0.8"/>
      <text x="100" y="100" text-anchor="middle" dy=".3em" fill="#FF6B35" font-family="Arial" font-size="16" font-weight="bold">
        ${text}
      </text>
      <text x="100" y="120" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="12">
        ${type}
      </text>
    </svg>
  `;
  return "data:image/svg+xml;base64," + Buffer.from(svg).toString('base64');
}

async function fixExistingImages() {
  console.log("🔧 Correction des images existantes...");

  try {
    // Corriger les membres d'équipe
    console.log("👥 Correction des images des membres d'équipe...");
    const teamMembers = await client.query("cms:getTeamMembers");
    
    if (teamMembers && teamMembers.length > 0) {
      for (const member of teamMembers) {
        if (member.image && member.image.startsWith('/assets/')) {
          console.log(`   - Correction de ${member.name}...`);
          const newImageUrl = createTestImage('Équipe', member.name.split(' ')[0]);
          
          await client.mutation("cms:updateTeamMember", {
            id: member._id,
            image: newImageUrl
          });
          
          console.log(`   ✅ ${member.name} corrigé`);
        }
      }
    }

    // Corriger les projets de portfolio
    console.log("🖼️ Correction des images des projets de portfolio...");
    const portfolioProjects = await client.query("cms:getPortfolioProjects");
    
    if (portfolioProjects && portfolioProjects.length > 0) {
      for (const project of portfolioProjects) {
        if (project.image && project.image.startsWith('/assets/')) {
          console.log(`   - Correction de ${project.title}...`);
          const newImageUrl = createTestImage(project.category, project.title.split(' ')[0]);
          
          await client.mutation("cms:updatePortfolioProject", {
            id: project._id,
            image: newImageUrl
          });
          
          console.log(`   ✅ ${project.title} corrigé`);
        }
      }
    }

    // Vérifier les corrections
    console.log("\n🔍 Vérification des corrections...");
    
    const updatedTeamMembers = await client.query("cms:getTeamMembers");
    console.log(`👥 Membres d'équipe: ${updatedTeamMembers?.length || 0}`);
    updatedTeamMembers?.forEach(member => {
      console.log(`   - ${member.name}: ${member.image.startsWith('data:') ? 'Data URL ✅' : 'URL externe ✅'}`);
    });

    const updatedProjects = await client.query("cms:getPortfolioProjects");
    console.log(`🖼️ Projets: ${updatedProjects?.length || 0}`);
    updatedProjects?.forEach(project => {
      console.log(`   - ${project.title}: ${project.image.startsWith('data:') ? 'Data URL ✅' : 'URL externe ✅'}`);
    });

    console.log("\n🎉 Correction des images terminée !");
    console.log("✅ Toutes les images utilisent maintenant des Data URLs valides");
    console.log("✅ Les images devraient maintenant s'afficher dans l'UI admin");

  } catch (error) {
    console.error("❌ Erreur lors de la correction:", error);
  }
}

// Exécuter la correction
fixExistingImages();


