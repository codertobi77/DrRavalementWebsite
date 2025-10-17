import { readFileSync, existsSync } from 'fs';

console.log("🧪 Test spécifique Vite...\n");

// Vérifier la configuration Vite
console.log("1️⃣ Vérification de la configuration Vite...");
const viteConfigPath = 'vite.config.ts';
if (!existsSync(viteConfigPath)) {
  console.log("❌ Fichier vite.config.ts non trouvé");
  process.exit(1);
}

const viteConfig = readFileSync(viteConfigPath, 'utf8');

// Vérifier l'alias convex/_generated
if (viteConfig.includes("'convex/_generated': resolve(__dirname, './convex/_generated')")) {
  console.log("✅ Alias 'convex/_generated' configuré");
} else {
  console.log("❌ Alias 'convex/_generated' manquant");
  console.log("💡 Ajoutez : 'convex/_generated': resolve(__dirname, './convex/_generated')");
  process.exit(1);
}

// Vérifier qu'il n'y a pas d'alias 'convex' global
if (viteConfig.includes("'convex': resolve(__dirname, './convex')")) {
  console.log("❌ Alias 'convex' global détecté - cela interfère avec convex/react");
  console.log("💡 Supprimez l'alias 'convex' global");
  process.exit(1);
} else {
  console.log("✅ Pas d'alias 'convex' global - convex/react fonctionnera");
}

// Vérifier les fichiers générés
console.log("\n2️⃣ Vérification des fichiers générés...");
const generatedFiles = [
  'convex/_generated/api.d.ts',
  'convex/_generated/api.js',
  'convex/_generated/dataModel.d.ts',
  'convex/_generated/server.d.ts',
  'convex/_generated/server.js'
];

for (const file of generatedFiles) {
  if (existsSync(file)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} manquant`);
    process.exit(1);
  }
}

// Vérifier les imports dans les fichiers
console.log("\n3️⃣ Vérification des imports...");
const filesToCheck = [
  { file: 'src/App.tsx', shouldHave: "from 'convex/react'", description: "convex/react" },
  { file: 'src/pages/admin/articles/page.tsx', shouldHave: "from 'convex/_generated/api'", description: "convex/_generated/api" },
  { file: 'src/pages/blog/page.tsx', shouldHave: "from 'convex/_generated/api'", description: "convex/_generated/api" }
];

for (const { file, shouldHave, description } of filesToCheck) {
  if (existsSync(file)) {
    const content = readFileSync(file, 'utf8');
    if (content.includes(shouldHave)) {
      console.log(`✅ ${file} utilise ${description}`);
    } else {
      console.log(`❌ ${file} n'utilise pas ${description}`);
      console.log(`💡 Cherché : ${shouldHave}`);
      process.exit(1);
    }
  } else {
    console.log(`❌ ${file} non trouvé`);
    process.exit(1);
  }
}

// Vérifier la structure des dossiers
console.log("\n4️⃣ Vérification de la structure...");
const requiredDirs = [
  'src',
  'convex',
  'convex/_generated',
  'src/pages/admin',
  'src/components/admin'
];

for (const dir of requiredDirs) {
  if (existsSync(dir)) {
    console.log(`✅ ${dir}/ existe`);
  } else {
    console.log(`❌ ${dir}/ manquant`);
    process.exit(1);
  }
}

console.log("\n🎉 Configuration Vite validée !");
console.log("\n📋 Résumé :");
console.log("   ✅ Alias 'convex/_generated' configuré");
console.log("   ✅ Pas d'alias 'convex' global");
console.log("   ✅ Fichiers générés présents");
console.log("   ✅ Imports corrects dans tous les fichiers");
console.log("   ✅ Structure des dossiers correcte");

console.log("\n🚀 Vite devrait maintenant résoudre tous les imports correctement !");
console.log("💡 Exécutez : npm run dev");
console.log("🌐 Accédez à : http://localhost:3000");
