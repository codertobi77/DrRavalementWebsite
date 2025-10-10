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

async function testSimpleAuth() {
  console.log("🧪 Test d'authentification simple...");
  console.log(`📡 Connexion à: ${CONVEX_URL}`);

  try {
    // Test 1: Vérifier la connexion
    console.log("\n1️⃣ Test de connexion Convex...");
    const allUsers = await convexClient.query("auth:getAllUsers");
    console.log("✅ Connexion Convex réussie");
    console.log(`📊 ${allUsers.length} utilisateurs trouvés`);

    // Test 2: Tester l'authentification simple
    console.log("\n2️⃣ Test d'authentification simple...");
    try {
      const loginResult = await convexClient.mutation("auth:authenticateUserSimple", {
        email: "admin@dr-ravalement.fr",
        password: "admin123"
      });
      
      console.log("✅ Authentification simple réussie");
      console.log(`👤 Utilisateur: ${loginResult.user.email} (${loginResult.user.role})`);
      console.log(`🔑 Token: ${loginResult.session.token.substring(0, 20)}...`);
      
      // Test 3: Vérifier la session
      console.log("\n3️⃣ Test de validation de session...");
      const sessionResult = await convexClient.query("auth:validateSession", {
        token: loginResult.session.token
      });
      
      if (sessionResult) {
        console.log("✅ Session valide");
        console.log(`👤 Utilisateur connecté: ${sessionResult.user.email}`);
        console.log(`⏰ Expire le: ${sessionResult.session.expires_at}`);
      } else {
        console.log("❌ Session invalide");
      }
      
      // Test 4: Test de déconnexion
      console.log("\n4️⃣ Test de déconnexion...");
      const logoutResult = await convexClient.mutation("auth:logout", {
        token: loginResult.session.token
      });
      
      if (logoutResult.success) {
        console.log("✅ Déconnexion réussie");
      } else {
        console.log("❌ Erreur de déconnexion");
      }
      
    } catch (error) {
      console.error("❌ Erreur lors de l'authentification:", error.message);
    }

    console.log("\n🎉 Test d'authentification simple terminé !");

  } catch (error) {
    console.error("❌ Erreur lors des tests:", error);
    process.exit(1);
  }
}

// Exécuter les tests
testSimpleAuth();
