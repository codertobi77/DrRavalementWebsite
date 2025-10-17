import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log("🔧 Configuration de l'URL Convex...\n");

// Vérifier si le fichier .env existe
const envPath = join(process.cwd(), '.env');
const envExamplePath = join(process.cwd(), 'env.example');

if (!existsSync(envPath)) {
  if (existsSync(envExamplePath)) {
    console.log("📋 Création du fichier .env à partir de env.example...");
    const envExample = readFileSync(envExamplePath, 'utf8');
    writeFileSync(envPath, envExample);
    console.log("✅ Fichier .env créé");
  } else {
    console.log("📝 Création du fichier .env...");
    writeFileSync(envPath, `# Configuration Convex
VITE_CONVEX_URL=https://your-convex-deployment.convex.cloud
VITE_CONVEX_DEPLOYMENT=your-convex-deployment

# Remplacez 'your-convex-deployment' par votre vraie URL Convex
# Vous pouvez la trouver dans votre dashboard Convex
`);
    console.log("✅ Fichier .env créé avec des valeurs par défaut");
  }
} else {
  console.log("✅ Fichier .env existe déjà");
}

// Lire le fichier .env
const envContent = readFileSync(envPath, 'utf8');

// Vérifier si VITE_CONVEX_URL est définie
if (envContent.includes('VITE_CONVEX_URL=https://your-convex-deployment.convex.cloud')) {
  console.log("\n⚠️  ATTENTION : URL Convex non configurée !");
  console.log("📝 Veuillez :");
  console.log("   1. Ouvrir le fichier .env");
  console.log("   2. Remplacer 'your-convex-deployment' par votre vraie URL Convex");
  console.log("   3. Vous pouvez trouver votre URL dans le dashboard Convex");
  console.log("\n💡 Exemple :");
  console.log("   VITE_CONVEX_URL=https://happy-mouse-123.convex.cloud");
} else {
  console.log("✅ URL Convex configurée");
}

console.log("\n🚀 Une fois l'URL configurée, vous pouvez exécuter :");
console.log("   node scripts/init-sample-articles.js");
console.log("   node scripts/test-articles-cms.js");
