import { readFileSync, existsSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

console.log("🔧 Diagnostic et correction du problème de build...\n");

// Vérifier les fichiers Convex générés
console.log("1️⃣ Vérification des fichiers Convex générés...");

const generatedFiles = [
  'convex/_generated/api.d.ts',
  'convex/_generated/api.js',
  'convex/_generated/dataModel.d.ts',
  'convex/_generated/dataModel.js',
  'convex/_generated/server.d.ts',
  'convex/_generated/server.js'
];

for (const file of generatedFiles) {
  if (existsSync(file)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} manquant`);
  }
}

// Vérifier les imports dans les fichiers source
console.log("\n2️⃣ Vérification des imports...");

const sourceFiles = [
  'src/pages/blog/page.tsx',
  'src/pages/admin/articles/page.tsx',
  'src/components/blog/ArticleModal.tsx'
];

for (const file of sourceFiles) {
  if (existsSync(file)) {
    const content = readFileSync(file, 'utf8');
    if (content.includes("from 'convex/_generated/dataModel'")) {
      console.log(`❌ ${file} utilise l'ancien import`);
    } else if (content.includes("from 'convex/_generated/dataModel.js'")) {
      console.log(`✅ ${file} utilise le bon import`);
    } else {
      console.log(`⚠️  ${file} n'importe pas dataModel`);
    }
  } else {
    console.log(`❌ ${file} non trouvé`);
  }
}

// Vérifier la configuration Vite
console.log("\n3️⃣ Vérification de la configuration Vite...");

if (existsSync('vite.config.ts')) {
  const viteConfig = readFileSync('vite.config.ts', 'utf8');
  if (viteConfig.includes("'convex/_generated': resolve(__dirname, './convex/_generated')")) {
    console.log("✅ Alias Convex configuré dans Vite");
  } else {
    console.log("❌ Alias Convex manquant dans Vite");
  }
} else {
  console.log("❌ vite.config.ts non trouvé");
}

// Vérifier la configuration Convex
console.log("\n4️⃣ Vérification de la configuration Convex...");

if (existsSync('convex.json')) {
  console.log("✅ convex.json existe");
} else {
  console.log("❌ convex.json manquant");
}

// Essayer de régénérer les fichiers Convex
console.log("\n5️⃣ Tentative de régénération des fichiers Convex...");

try {
  console.log("🔄 Exécution de npx convex dev --once...");
  execSync('npx convex dev --once', { stdio: 'pipe' });
  console.log("✅ Fichiers Convex régénérés");
} catch (error) {
  console.log(`❌ Erreur lors de la régénération : ${error.message}`);
}

// Vérifier à nouveau les fichiers après régénération
console.log("\n6️⃣ Vérification après régénération...");

for (const file of generatedFiles) {
  if (existsSync(file)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} manquant`);
  }
}

// Essayer de construire le projet
console.log("\n7️⃣ Tentative de build...");

try {
  console.log("🔄 Exécution de npm run build...");
  execSync('npm run build', { stdio: 'pipe' });
  console.log("✅ Build réussi !");
} catch (error) {
  console.log(`❌ Erreur de build : ${error.message}`);
  
  // Afficher les dernières lignes de l'erreur
  const errorLines = error.message.split('\n');
  const lastLines = errorLines.slice(-10);
  console.log("\n📋 Dernières lignes de l'erreur :");
  lastLines.forEach(line => console.log(line));
}

console.log("\n🎉 Diagnostic terminé !");
console.log("\n💡 Solutions possibles :");
console.log("   1. Vérifiez que Convex est correctement configuré");
console.log("   2. Régénérez les fichiers avec : npx convex dev --once");
console.log("   3. Vérifiez que tous les imports utilisent l'extension .js");
console.log("   4. Redémarrez le serveur de développement");
