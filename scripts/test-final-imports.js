import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log("🧪 Test final des imports...\n");

// Vérifier la configuration Vite
console.log("1️⃣ Vérification de la configuration Vite...");
const viteConfigPath = 'vite.config.ts';
if (!existsSync(viteConfigPath)) {
  console.log("❌ Fichier vite.config.ts non trouvé");
  process.exit(1);
}

const viteConfig = readFileSync(viteConfigPath, 'utf8');
if (viteConfig.includes("'convex/_generated': resolve(__dirname, './convex/_generated')")) {
  console.log("✅ Alias Convex/_generated configuré");
} else {
  console.log("❌ Alias Convex/_generated manquant");
  process.exit(1);
}

// Vérifier que convex/react n'est pas aliasé
if (viteConfig.includes("'convex': resolve(__dirname, './convex')")) {
  console.log("❌ Alias 'convex' global détecté - cela interfère avec convex/react");
  console.log("💡 Utilisez 'convex/_generated' au lieu de 'convex'");
  process.exit(1);
} else {
  console.log("✅ Pas d'alias 'convex' global - convex/react fonctionnera");
}

// Vérifier les fichiers générés
console.log("\n2️⃣ Vérification des fichiers générés...");
const generatedFiles = [
  'convex/_generated/api.d.ts',
  'convex/_generated/api.js',
  'convex/_generated/dataModel.d.ts'
];

for (const file of generatedFiles) {
  if (existsSync(file)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} manquant`);
    process.exit(1);
  }
}

// Vérifier les imports dans App.tsx
console.log("\n3️⃣ Vérification des imports dans App.tsx...");
const appPath = 'src/App.tsx';
if (!existsSync(appPath)) {
  console.log("❌ src/App.tsx non trouvé");
  process.exit(1);
}

const appContent = readFileSync(appPath, 'utf8');
if (appContent.includes("from 'convex/react'")) {
  console.log("✅ Import convex/react correct");
} else {
  console.log("❌ Import convex/react manquant ou incorrect");
  process.exit(1);
}

// Vérifier les imports dans les pages admin
console.log("\n4️⃣ Vérification des imports admin...");
const adminFiles = [
  'src/pages/admin/articles/page.tsx',
  'src/pages/blog/page.tsx'
];

for (const file of adminFiles) {
  if (existsSync(file)) {
    const content = readFileSync(file, 'utf8');
    if (content.includes("from 'convex/_generated/api'")) {
      console.log(`✅ ${file} utilise l'alias correct`);
    } else {
      console.log(`❌ ${file} n'utilise pas l'alias correct`);
      process.exit(1);
    }
  }
}

// Test de résolution des modules
console.log("\n5️⃣ Test de résolution des modules...");
try {
  // Test convex/react
  const { ConvexProvider } = await import("convex/react");
  console.log("✅ convex/react résolu correctement");
} catch (error) {
  console.log(`❌ Erreur convex/react : ${error.message}`);
  process.exit(1);
}

try {
  // Test convex/_generated
  const { api } = await import("convex/_generated/api");
  console.log("✅ convex/_generated/api résolu correctement");
} catch (error) {
  console.log(`❌ Erreur convex/_generated : ${error.message}`);
  process.exit(1);
}

console.log("\n🎉 Tous les tests sont passés !");
console.log("\n📋 Configuration validée :");
console.log("   ✅ Alias 'convex/_generated' configuré");
console.log("   ✅ Pas d'alias 'convex' global");
console.log("   ✅ convex/react fonctionne");
console.log("   ✅ convex/_generated fonctionne");
console.log("   ✅ Fichiers générés présents");

console.log("\n🚀 Le serveur devrait maintenant démarrer sans erreur !");
console.log("💡 Exécutez : npm run dev");
