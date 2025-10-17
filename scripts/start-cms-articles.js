import { ConvexHttpClient } from "convex/browser";
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log("🚀 DR RAVALEMENT - Système CMS Articles");
console.log("==========================================\n");

// Lire la configuration
const envPath = join(process.cwd(), '.env');
if (!existsSync(envPath)) {
  console.log("❌ Fichier .env non trouvé");
  console.log("💡 Exécutez d'abord : node scripts/setup-convex-url.js");
  process.exit(1);
}

const envContent = readFileSync(envPath, 'utf8');
const convexUrlMatch = envContent.match(/VITE_CONVEX_URL=(.+)/);
const convexUrl = convexUrlMatch ? convexUrlMatch[1].trim() : null;

if (!convexUrl || convexUrl.includes('your-convex-deployment')) {
  console.log("❌ URL Convex non configurée");
  console.log("💡 Exécutez d'abord : node scripts/setup-convex-url.js");
  process.exit(1);
}

const client = new ConvexHttpClient(convexUrl);

async function startCMSArticles() {
  try {
    console.log("🔍 Vérification du système...");
    
    // Vérifier la connexion
    const articles = await client.query("articles:getArticles", {});
    const stats = await client.query("articles:getArticleStats", {});
    
    console.log("✅ Système opérationnel !");
    console.log(`📊 ${articles.length} articles dans la base de données`);
    console.log(`📈 ${stats.published} articles publiés`);
    console.log(`⭐ ${stats.featured} article(s) à la une`);
    
    console.log("\n🎯 Fonctionnalités disponibles :");
    console.log("   ✅ Création et édition d'articles");
    console.log("   ✅ Gestion des catégories et tags");
    console.log("   ✅ Système de publication (brouillon/publié)");
    console.log("   ✅ Articles à la une");
    console.log("   ✅ Statistiques et métriques");
    console.log("   ✅ SEO optimisé");
    console.log("   ✅ Interface responsive");
    
    console.log("\n📱 Accès aux interfaces :");
    console.log("   🔧 Administration : /admin/articles");
    console.log("   📖 Blog public : /blog");
    
    console.log("\n📚 Documentation :");
    console.log("   📖 Guide complet : documentation/CMS-ARTICLES-GUIDE.md");
    console.log("   🛠️  Scripts : scripts/README-CMS-ARTICLES.md");
    
    console.log("\n🎉 Le système CMS Articles est prêt à être utilisé !");
    console.log("\n💡 Prochaines étapes :");
    console.log("   1. Accédez à /admin/articles pour gérer vos articles");
    console.log("   2. Créez de nouveaux articles via l'interface");
    console.log("   3. Visitez /blog pour voir le résultat");
    console.log("   4. Personnalisez selon vos besoins");
    
  } catch (error) {
    console.error("❌ Erreur lors de la vérification :", error.message);
    console.log("\n🔧 Solutions possibles :");
    console.log("   - Vérifiez votre URL Convex dans .env");
    console.log("   - Déployez Convex : npx convex dev");
    console.log("   - Consultez la documentation");
  }
}

startCMSArticles();
