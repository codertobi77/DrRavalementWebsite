import { ConvexHttpClient } from "convex/browser";
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log("🧪 Test des imports et de la configuration...\n");

// Vérifier que les fichiers générés existent
const generatedFiles = [
  'convex/_generated/api.d.ts',
  'convex/_generated/api.js',
  'convex/_generated/dataModel.d.ts',
  'convex/_generated/server.d.ts',
  'convex/_generated/server.js'
];

console.log("1️⃣ Vérification des fichiers générés...");
let allFilesExist = true;

for (const file of generatedFiles) {
  if (existsSync(file)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} manquant`);
    allFilesExist = false;
  }
}

if (!allFilesExist) {
  console.log("\n❌ Certains fichiers générés sont manquants");
  console.log("💡 Exécutez : npx convex dev --once");
  process.exit(1);
}

// Vérifier la configuration Convex
console.log("\n2️⃣ Vérification de la configuration Convex...");
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
  process.exit(1);
}

console.log(`✅ URL Convex : ${convexUrl}`);

// Tester la connexion
console.log("\n3️⃣ Test de la connexion Convex...");
const client = new ConvexHttpClient(convexUrl);

try {
  const articles = await client.query("articles:getArticles", {});
  console.log(`✅ Connexion réussie ! ${articles.length} articles trouvés`);
  
  const stats = await client.query("articles:getArticleStats", {});
  console.log(`✅ Statistiques : ${stats.total} total, ${stats.published} publiés`);
  
} catch (error) {
  console.log(`❌ Erreur de connexion : ${error.message}`);
  process.exit(1);
}

console.log("\n🎉 Tous les tests sont passés !");
console.log("\n📋 Configuration vérifiée :");
console.log("   ✅ Fichiers générés par Convex");
console.log("   ✅ Configuration .env");
console.log("   ✅ Connexion Convex");
console.log("   ✅ Fonctions articles disponibles");

console.log("\n🚀 Le système est prêt !");
console.log("💡 Vous pouvez maintenant :");
console.log("   - Démarrer le serveur : npm run dev");
console.log("   - Accéder à /admin/articles");
console.log("   - Utiliser le CMS Articles");
