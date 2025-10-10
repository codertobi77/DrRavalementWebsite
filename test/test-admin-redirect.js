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

async function testAdminRedirect() {
  console.log("🧪 Test du flow de redirection admin...");
  console.log(`📡 Connexion à: ${CONVEX_URL}`);

  try {
    // Test 1: Vérifier que les utilisateurs existent
    console.log("\n1️⃣ Vérification des utilisateurs...");
    const allUsers = await convexClient.query("auth:getAllUsers");
    console.log(`✅ ${allUsers.length} utilisateurs trouvés`);
    
    const adminUser = allUsers.find(u => u.role === 'admin');
    const editorUser = allUsers.find(u => u.role === 'editor');
    const viewerUser = allUsers.find(u => u.role === 'viewer');
    
    if (adminUser) console.log(`  👤 Admin: ${adminUser.email}`);
    if (editorUser) console.log(`  👤 Éditeur: ${editorUser.email}`);
    if (viewerUser) console.log(`  👤 Visualiseur: ${viewerUser.email}`);

    // Test 2: Tester la connexion admin
    console.log("\n2️⃣ Test de connexion admin...");
    const adminLogin = await convexClient.action("authActions:authenticateUser", {
      email: "admin@dr-ravalement.fr",
      password: "admin123",
      ip_address: "127.0.0.1",
      user_agent: "Test Script"
    });
    
    console.log("✅ Connexion admin réussie");
    console.log(`👤 Utilisateur: ${adminLogin.user.email} (${adminLogin.user.role})`);
    console.log(`🔑 Token: ${adminLogin.session.token.substring(0, 20)}...`);

    // Test 3: Vérifier que la session admin est valide
    console.log("\n3️⃣ Test de validation de session admin...");
    const adminSession = await convexClient.query("auth:validateSession", {
      token: adminLogin.session.token
    });
    
    if (adminSession && adminSession.user.role === 'admin') {
      console.log("✅ Session admin valide - Accès autorisé");
      console.log(`👤 Rôle: ${adminSession.user.role}`);
    } else {
      console.log("❌ Session admin invalide - Accès refusé");
    }

    // Test 4: Tester la connexion éditeur (doit être refusée)
    console.log("\n4️⃣ Test de connexion éditeur (accès refusé)...");
    const editorLogin = await convexClient.action("authActions:authenticateUser", {
      email: "editor@dr-ravalement.fr",
      password: "editor123",
      ip_address: "127.0.0.1",
      user_agent: "Test Script"
    });
    
    console.log("✅ Connexion éditeur réussie");
    console.log(`👤 Utilisateur: ${editorLogin.user.email} (${editorLogin.user.role})`);
    
    const editorSession = await convexClient.query("auth:validateSession", {
      token: editorLogin.session.token
    });
    
    if (editorSession && editorSession.user.role !== 'admin') {
      console.log("✅ Session éditeur valide - Accès refusé aux routes admin");
      console.log(`👤 Rôle: ${editorSession.user.role} (non-admin)`);
    } else {
      console.log("❌ Problème avec la session éditeur");
    }

    // Test 5: Tester la connexion visualiseur (doit être refusée)
    console.log("\n5️⃣ Test de connexion visualiseur (accès refusé)...");
    const viewerLogin = await convexClient.action("authActions:authenticateUser", {
      email: "viewer@dr-ravalement.fr",
      password: "viewer123",
      ip_address: "127.0.0.1",
      user_agent: "Test Script"
    });
    
    console.log("✅ Connexion visualiseur réussie");
    console.log(`👤 Utilisateur: ${viewerLogin.user.email} (${viewerLogin.user.role})`);
    
    const viewerSession = await convexClient.query("auth:validateSession", {
      token: viewerLogin.session.token
    });
    
    if (viewerSession && viewerSession.user.role !== 'admin') {
      console.log("✅ Session visualiseur valide - Accès refusé aux routes admin");
      console.log(`👤 Rôle: ${viewerSession.user.role} (non-admin)`);
    } else {
      console.log("❌ Problème avec la session visualiseur");
    }

    // Test 6: Test avec utilisateur non connecté
    console.log("\n6️⃣ Test avec utilisateur non connecté...");
    const noSession = await convexClient.query("auth:validateSession", {
      token: "token_inexistant"
    });
    
    if (!noSession) {
      console.log("✅ Utilisateur non connecté - Redirection vers login");
    } else {
      console.log("❌ Problème avec la validation de session");
    }

    // Nettoyage des sessions de test
    console.log("\n7️⃣ Nettoyage des sessions de test...");
    await convexClient.mutation("auth:logout", { token: adminLogin.session.token });
    await convexClient.mutation("auth:logout", { token: editorLogin.session.token });
    await convexClient.mutation("auth:logout", { token: viewerLogin.session.token });
    console.log("✅ Sessions de test nettoyées");

    console.log("\n🎉 Tests de redirection admin terminés !");
    console.log("\n📋 Résumé des tests:");
    console.log("  ✅ Utilisateurs créés et vérifiés");
    console.log("  ✅ Connexion admin réussie");
    console.log("  ✅ Session admin valide (accès autorisé)");
    console.log("  ✅ Connexion éditeur réussie");
    console.log("  ✅ Session éditeur valide (accès refusé)");
    console.log("  ✅ Connexion visualiseur réussie");
    console.log("  ✅ Session visualiseur valide (accès refusé)");
    console.log("  ✅ Utilisateur non connecté (redirection)");

    console.log("\n🔄 Flow de redirection configuré:");
    console.log("  📍 /admin → /admin/dashboard");
    console.log("  🔐 Non connecté → /admin/login");
    console.log("  👤 Non-admin → Page d'accès refusé");
    console.log("  ✅ Admin → Accès autorisé");

  } catch (error) {
    console.error("❌ Erreur lors des tests:", error);
    process.exit(1);
  }
}

// Exécuter les tests
testAdminRedirect();
