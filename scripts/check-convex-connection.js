import { ConvexHttpClient } from "convex/browser";
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log("🔍 Vérification de la connexion Convex...\n");

// Lire la configuration
const envPath = join(process.cwd(), '.env');
if (!existsSync(envPath)) {
  console.log("❌ Fichier .env non trouvé");
  process.exit(1);
}

const envContent = readFileSync(envPath, 'utf8');
const convexUrlMatch = envContent.match(/VITE_CONVEX_URL=(.+)/);
const convexUrl = convexUrlMatch ? convexUrlMatch[1].trim() : null;

if (!convexUrl || convexUrl.includes('your-convex-deployment')) {
  console.log("❌ URL Convex non configurée ou invalide");
  console.log("💡 Configurez VITE_CONVEX_URL dans le fichier .env");
  process.exit(1);
}

console.log(`📡 URL Convex : ${convexUrl}`);

// Tester la connexion
const client = new ConvexHttpClient(convexUrl);

async function testConnection() {
  try {
    console.log("🔄 Test de connexion...");
    
    // Essayer de récupérer les articles (même s'il n'y en a pas)
    const articles = await client.query("articles:getArticles", {});
    console.log(`✅ Connexion réussie ! ${articles.length} articles trouvés`);
    
    // Tester les statistiques
    const stats = await client.query("articles:getArticleStats", {});
    console.log("📊 Statistiques :");
    console.log(`   - Total articles : ${stats.total}`);
    console.log(`   - Publiés : ${stats.published}`);
    console.log(`   - Brouillons : ${stats.draft}`);
    
    return true;
  } catch (error) {
    console.log("❌ Erreur de connexion :", error.message);
    
    if (error.message.includes('404')) {
      console.log("💡 Les fonctions articles ne sont pas déployées");
      console.log("   Exécutez : npx convex dev");
    } else if (error.message.includes('401') || error.message.includes('403')) {
      console.log("💡 Problème d'authentification ou de permissions");
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.log("💡 URL Convex invalide ou service indisponible");
      console.log(`   Vérifiez que l'URL est correcte : ${convexUrl}`);
    }
    
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    console.log("\n🎉 Connexion Convex opérationnelle !");
    console.log("🚀 Vous pouvez maintenant exécuter :");
    console.log("   node scripts/init-sample-articles.js");
  } else {
    console.log("\n❌ Connexion Convex échouée");
    console.log("🔧 Actions à effectuer :");
    console.log("   1. Vérifiez votre URL Convex dans .env");
    console.log("   2. Déployez Convex : npx convex dev");
    console.log("   3. Vérifiez que les fonctions articles sont déployées");
  }
});
