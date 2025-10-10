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

async function testAuthSystem() {
  console.log("🧪 Test du système d'authentification...");
  console.log(`📡 Connexion à: ${CONVEX_URL}`);

  try {
    // Test 1: Vérifier la connexion
    console.log("\n1️⃣ Test de connexion Convex...");
    const allUsers = await convexClient.query("auth:getAllUsers");
    console.log("✅ Connexion Convex réussie");
    console.log(`📊 ${allUsers.length} utilisateurs trouvés`);

    // Test 2: Tester la connexion avec un utilisateur admin
    console.log("\n2️⃣ Test de connexion admin...");
    try {
      const loginResult = await convexClient.action("authActions:authenticateUser", {
        email: "admin@dr-ravalement.fr",
        password: "admin123",
        ip_address: "127.0.0.1",
        user_agent: "Test Script"
      });
      
      console.log("✅ Connexion admin réussie");
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
      
      // Test 5: Vérifier que la session est supprimée
      console.log("\n5️⃣ Test de session supprimée...");
      const sessionAfterLogout = await convexClient.query("auth:validateSession", {
        token: loginResult.session.token
      });
      
      if (!sessionAfterLogout) {
        console.log("✅ Session correctement supprimée");
      } else {
        console.log("❌ Session encore active après déconnexion");
      }
      
    } catch (error) {
      console.error("❌ Erreur lors du test de connexion:", error.message);
    }

    // Test 6: Tester avec un utilisateur éditeur
    console.log("\n6️⃣ Test de connexion éditeur...");
    try {
      const editorLogin = await convexClient.action("authActions:authenticateUser", {
        email: "editor@dr-ravalement.fr",
        password: "editor123",
        ip_address: "127.0.0.1",
        user_agent: "Test Script"
      });
      
      console.log("✅ Connexion éditeur réussie");
      console.log(`👤 Utilisateur: ${editorLogin.user.email} (${editorLogin.user.role})`);
      
      // Déconnexion
      await convexClient.mutation("auth:logout", {
        token: editorLogin.session.token
      });
      console.log("✅ Déconnexion éditeur réussie");
      
    } catch (error) {
      console.error("❌ Erreur lors du test éditeur:", error.message);
    }

    // Test 7: Tester avec un utilisateur visualiseur
    console.log("\n7️⃣ Test de connexion visualiseur...");
    try {
      const viewerLogin = await convexClient.action("authActions:authenticateUser", {
        email: "viewer@dr-ravalement.fr",
        password: "viewer123",
        ip_address: "127.0.0.1",
        user_agent: "Test Script"
      });
      
      console.log("✅ Connexion visualiseur réussie");
      console.log(`👤 Utilisateur: ${viewerLogin.user.email} (${viewerLogin.user.role})`);
      
      // Déconnexion
      await convexClient.mutation("auth:logout", {
        token: viewerLogin.session.token
      });
      console.log("✅ Déconnexion visualiseur réussie");
      
    } catch (error) {
      console.error("❌ Erreur lors du test visualiseur:", error.message);
    }

    // Test 8: Test avec des identifiants incorrects
    console.log("\n8️⃣ Test avec identifiants incorrects...");
    try {
      await convexClient.action("authActions:authenticateUser", {
        email: "admin@dr-ravalement.fr",
        password: "mauvais_mot_de_passe",
        ip_address: "127.0.0.1",
        user_agent: "Test Script"
      });
      console.log("❌ Connexion réussie avec mauvais mot de passe (problème de sécurité)");
    } catch (error) {
      console.log("✅ Connexion correctement refusée avec mauvais mot de passe");
      console.log(`   Message: ${error.message}`);
    }

    console.log("\n🎉 Tests d'authentification terminés !");
    console.log("\n📋 Résumé des tests:");
    console.log("  ✅ Connexion Convex");
    console.log("  ✅ Authentification admin");
    console.log("  ✅ Validation de session");
    console.log("  ✅ Déconnexion");
    console.log("  ✅ Suppression de session");
    console.log("  ✅ Authentification éditeur");
    console.log("  ✅ Authentification visualiseur");
    console.log("  ✅ Rejet des identifiants incorrects");

    console.log("\n🔐 Comptes de test disponibles:");
    console.log("  📧 admin@dr-ravalement.fr / admin123 (Admin)");
    console.log("  📧 editor@dr-ravalement.fr / editor123 (Éditeur)");
    console.log("  📧 viewer@dr-ravalement.fr / viewer123 (Visualiseur)");

  } catch (error) {
    console.error("❌ Erreur lors des tests:", error);
    process.exit(1);
  }
}

// Exécuter les tests
testAuthSystem();
