import fs from 'fs';
import path from 'path';

// Script pour mettre à jour les chemins dans les scripts déplacés
console.log("🔄 Mise à jour des chemins dans les scripts...");

const scriptsDir = './scripts';
const testDir = './test';
const documentationDir = './documentation';

// Fonction pour mettre à jour les chemins dans un fichier
function updatePathsInFile(filePath, fromDir, toDir) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Mettre à jour les références aux scripts
    if (content.includes('node scripts/')) {
      content = content.replace(/node scripts\//g, 'node ../scripts/');
      updated = true;
    }

    if (content.includes('node test/')) {
      content = content.replace(/node test\//g, 'node ../test/');
      updated = true;
    }

    // Mettre à jour les références aux fichiers de documentation
    if (content.includes('documentation/')) {
      content = content.replace(/documentation\//g, '../documentation/');
      updated = true;
    }

    if (updated) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Mis à jour: ${filePath}`);
    } else {
      console.log(`⏭️  Aucun changement: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Erreur avec ${filePath}:`, error.message);
  }
}

// Mettre à jour les scripts dans le dossier test
console.log("\n📁 Mise à jour des scripts de test...");
const testFiles = fs.readdirSync(testDir).filter(file => file.endsWith('.js'));
testFiles.forEach(file => {
  updatePathsInFile(path.join(testDir, file), 'scripts', '../scripts');
});

// Mettre à jour les scripts dans le dossier scripts
console.log("\n📁 Mise à jour des scripts d'initialisation...");
const scriptFiles = fs.readdirSync(scriptsDir).filter(file => file.endsWith('.js'));
scriptFiles.forEach(file => {
  updatePathsInFile(path.join(scriptsDir, file), 'test', '../test');
});

console.log("\n✅ Mise à jour des chemins terminée !");
console.log("\n📋 Instructions pour utiliser les scripts:");
console.log("   - Depuis la racine: node scripts/nom-du-script.js");
console.log("   - Depuis la racine: node test/nom-du-test.js");
console.log("   - Depuis scripts/: node ../test/nom-du-test.js");
console.log("   - Depuis test/: node ../scripts/nom-du-script.js");
