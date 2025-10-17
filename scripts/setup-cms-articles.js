import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

console.log("🚀 Configuration du CMS Articles - DR RAVALEMENT\n");

async function setupCMSArticles() {
  try {
    // 1. Vérifier la configuration Convex
    console.log("1️⃣ Vérification de la configuration Convex...");
    
    const envPath = join(process.cwd(), '.env');
    if (!existsSync(envPath)) {
      console.log("❌ Fichier .env non trouvé");
      console.log("💡 Exécutez d'abord : node scripts/setup-convex-url.js");
      return;
    }

    const envContent = require('fs').readFileSync(envPath, 'utf8');
    if (envContent.includes('your-convex-deployment')) {
      console.log("❌ URL Convex non configurée");
      console.log("💡 Exécutez d'abord : node scripts/setup-convex-url.js");
      return;
    }

    console.log("✅ Configuration Convex OK");

    // 2. Vérifier si Convex est déployé
    console.log("\n2️⃣ Vérification du déploiement Convex...");
    try {
      execSync('npx convex dev --once', { stdio: 'pipe' });
      console.log("✅ Convex déployé");
    } catch (error) {
      console.log("⚠️  Convex non déployé ou erreur de connexion");
      console.log("💡 Exécutez : npx convex dev");
      return;
    }

    // 3. Tester la connexion
    console.log("\n3️⃣ Test de la connexion...");
    try {
      const { testArticlesCMS } = await import('./test-articles-cms.js');
      console.log("✅ Connexion OK");
    } catch (error) {
      console.log("❌ Erreur de connexion :", error.message);
      return;
    }

    // 4. Initialiser les articles d'exemple
    console.log("\n4️⃣ Initialisation des articles d'exemple...");
    try {
      const { initSampleArticles } = await import('./init-sample-articles.js');
      console.log("✅ Articles d'exemple créés");
    } catch (error) {
      console.log("❌ Erreur lors de la création des articles :", error.message);
      return;
    }

    // 5. Test final
    console.log("\n5️⃣ Test final du système...");
    try {
      const { testArticlesCMS } = await import('./test-articles-cms.js');
      console.log("✅ Système CMS Articles opérationnel !");
    } catch (error) {
      console.log("❌ Erreur lors du test final :", error.message);
      return;
    }

    console.log("\n🎉 Configuration terminée avec succès !");
    console.log("\n📋 Prochaines étapes :");
    console.log("   1. Accédez à /admin/articles pour gérer les articles");
    console.log("   2. Visitez /blog pour voir les articles publiés");
    console.log("   3. Créez vos propres articles via l'interface admin");
    console.log("\n📚 Documentation : documentation/CMS-ARTICLES-GUIDE.md");

  } catch (error) {
    console.error("❌ Erreur lors de la configuration :", error.message);
    console.log("\n💡 Solutions possibles :");
    console.log("   - Vérifiez que Convex est installé : npm install convex");
    console.log("   - Vérifiez votre URL Convex dans .env");
    console.log("   - Déployez Convex : npx convex dev");
    console.log("   - Consultez la documentation : documentation/CMS-ARTICLES-GUIDE.md");
  }
}

setupCMSArticles();
