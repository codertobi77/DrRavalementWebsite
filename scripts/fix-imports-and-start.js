import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

console.log("🔧 Correction des imports et démarrage du serveur...\n");

async function fixImportsAndStart() {
  try {
    // 1. Vérifier la configuration Convex
    console.log("1️⃣ Vérification de la configuration Convex...");
    const envPath = join(process.cwd(), '.env');
    if (!existsSync(envPath)) {
      console.log("❌ Fichier .env non trouvé");
      process.exit(1);
    }

    const envContent = readFileSync(envPath, 'utf8');
    const convexUrlMatch = envContent.match(/VITE_CONVEX_URL=(.+)/);
    const convexUrl = convexUrlMatch ? convexUrlMatch[1].trim() : null;

    if (!convexUrl || convexUrl.includes('your-convex-deployment')) {
      console.log("❌ URL Convex non configurée");
      console.log("💡 Exécutez : node scripts/setup-convex-url.js");
      process.exit(1);
    }

    console.log("✅ Configuration Convex OK");

    // 2. Déployer Convex
    console.log("\n2️⃣ Déploiement Convex...");
    try {
      execSync('npx convex dev --once', { stdio: 'pipe' });
      console.log("✅ Convex déployé");
    } catch (error) {
      console.log("⚠️  Erreur lors du déploiement Convex, mais continuons...");
    }

    // 3. Vérifier les fichiers générés
    console.log("\n3️⃣ Vérification des fichiers générés...");
    const generatedFiles = [
      'convex/_generated/api.d.ts',
      'convex/_generated/api.js',
      'convex/_generated/dataModel.d.ts'
    ];

    let allFilesExist = true;
    for (const file of generatedFiles) {
      if (!existsSync(file)) {
        console.log(`❌ ${file} manquant`);
        allFilesExist = false;
      }
    }

    if (!allFilesExist) {
      console.log("❌ Fichiers générés manquants");
      process.exit(1);
    }

    console.log("✅ Fichiers générés présents");

    // 4. Vérifier la configuration Vite
    console.log("\n4️⃣ Vérification de la configuration Vite...");
    const viteConfigPath = 'vite.config.ts';
    if (!existsSync(viteConfigPath)) {
      console.log("❌ Fichier vite.config.ts non trouvé");
      process.exit(1);
    }

    const viteConfig = readFileSync(viteConfigPath, 'utf8');
    if (!viteConfig.includes("'convex': resolve(__dirname, './convex')")) {
      console.log("❌ Alias Convex manquant dans Vite");
      console.log("💡 Ajoutez : 'convex': resolve(__dirname, './convex')");
      process.exit(1);
    }

    console.log("✅ Configuration Vite OK");

    // 5. Tester la connexion
    console.log("\n5️⃣ Test de la connexion...");
    try {
      const { ConvexHttpClient } = await import("convex/browser");
      const client = new ConvexHttpClient(convexUrl);
      const articles = await client.query("articles:getArticles", {});
      console.log(`✅ Connexion réussie ! ${articles.length} articles trouvés`);
    } catch (error) {
      console.log(`❌ Erreur de connexion : ${error.message}`);
      process.exit(1);
    }

    console.log("\n🎉 Tous les tests sont passés !");
    console.log("\n📋 Configuration validée :");
    console.log("   ✅ Fichiers générés par Convex");
    console.log("   ✅ Configuration .env");
    console.log("   ✅ Alias Vite configuré");
    console.log("   ✅ Connexion Convex");
    console.log("   ✅ Fonctions articles disponibles");

    console.log("\n🚀 Démarrage du serveur de développement...");
    console.log("💡 Le serveur va démarrer sur http://localhost:3000");
    console.log("📱 Accédez à :");
    console.log("   - /admin pour le dashboard");
    console.log("   - /admin/articles pour le CMS");
    console.log("   - /blog pour le blog public");

    // Démarrer le serveur
    execSync('npm run dev', { stdio: 'inherit' });

  } catch (error) {
    console.error("❌ Erreur lors de la correction :", error.message);
    process.exit(1);
  }
}

fixImportsAndStart();
