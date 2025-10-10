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

const CONVEX_URL = envVars.VITE_CONVEX_URL;

if (!CONVEX_URL || CONVEX_URL.includes("your-convex-deployment")) {
  console.error("❌ VITE_CONVEX_URL non configuré dans .env");
  process.exit(1);
}

const convexClient = new ConvexHttpClient(CONVEX_URL);

// Utilisateurs par défaut
const defaultUsers = [
  {
    email: "admin@dr-ravalement.fr",
    password: "admin123",
    name: "Administrateur Principal",
    role: "admin"
  },
  {
    email: "editor@dr-ravalement.fr", 
    password: "editor123",
    name: "Éditeur de Contenu",
    role: "editor"
  },
  {
    email: "viewer@dr-ravalement.fr",
    password: "viewer123", 
    name: "Visualiseur",
    role: "viewer"
  }
];

async function initializeAdminUsers() {
  console.log("🚀 Initialisation des utilisateurs admin...");
  console.log(`📡 Connexion à: ${CONVEX_URL}`);

  try {
    // Vérifier la connexion
    console.log("🔍 Test de connexion...");
    const testResult = await convexClient.query("auth:getAllUsers");
    console.log("✅ Connexion Convex réussie");

    // Créer chaque utilisateur
    for (const userData of defaultUsers) {
      console.log(`\n👤 Création de l'utilisateur ${userData.email}...`);
      
      try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await convexClient.query("auth:getUserByEmail", { 
          email: userData.email 
        });
        
        if (existingUser) {
          console.log(`  ⚠️  ${userData.email} existe déjà, ignoré`);
          continue;
        }

        // Créer l'utilisateur
        const result = await convexClient.action("authActions:createAdminUser", {
          email: userData.email,
          password: userData.password,
          name: userData.name,
          role: userData.role
        });

        console.log(`  ✅ ${userData.email} créé avec succès (ID: ${result.userId})`);
      } catch (error) {
        console.error(`  ❌ Erreur lors de la création de ${userData.email}:`, error.message);
      }
    }

    console.log("\n🎉 Initialisation des utilisateurs terminée !");
    console.log("\n📊 Vérification des utilisateurs...");
    
    // Vérifier que tous les utilisateurs ont été créés
    const allUsers = await convexClient.query("auth:getAllUsers");
    console.log(`✅ ${allUsers.length} utilisateurs disponibles:`);
    
    for (const user of allUsers) {
      console.log(`  👤 ${user.email} (${user.role}) - ${user.status}`);
    }

    console.log("\n🔐 Comptes de test créés:");
    console.log("  📧 admin@dr-ravalement.fr / admin123 (Admin)");
    console.log("  📧 editor@dr-ravalement.fr / editor123 (Éditeur)");
    console.log("  📧 viewer@dr-ravalement.fr / viewer123 (Visualiseur)");

  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation:", error);
    process.exit(1);
  }
}

// Exécuter l'initialisation
initializeAdminUsers();
