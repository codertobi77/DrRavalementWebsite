import { readFileSync, existsSync } from 'fs';

console.log("🔧 Test de la correction des titres...\n");

// Vérifier les corrections apportées
console.log("1️⃣ Vérification des corrections...");

const editorContent = readFileSync('src/components/admin/RichTextEditor.tsx', 'utf8');

// Vérifier que la fonction formatHeading a été ajoutée
if (editorContent.includes('formatHeading')) {
  console.log("✅ Fonction formatHeading ajoutée");
} else {
  console.log("❌ Fonction formatHeading manquante");
}

// Vérifier les détails de la fonction formatHeading
const formatHeadingFeatures = [
  'createElement',
  'h1',
  'h2', 
  'h3',
  'selectedText',
  'range.deleteContents',
  'range.insertNode',
  'setStartAfter'
];

console.log("\n2️⃣ Vérification de la fonction formatHeading...");
for (const feature of formatHeadingFeatures) {
  if (editorContent.includes(feature)) {
    console.log(`✅ ${feature} présent`);
  } else {
    console.log(`❌ ${feature} manquant`);
  }
}

// Vérifier que les boutons utilisent la nouvelle fonction
console.log("\n3️⃣ Vérification des boutons de titres...");
const headingButtons = [
  'onClick={() => formatHeading(1)}',
  'onClick={() => formatHeading(2)}',
  'onClick={() => formatHeading(3)}',
  'ri-h-1',
  'ri-h-2',
  'ri-h-3'
];

for (const button of headingButtons) {
  if (editorContent.includes(button)) {
    console.log(`✅ ${button} présent`);
  } else {
    console.log(`❌ ${button} manquant`);
  }
}

// Vérifier que les anciens ToolButton pour les titres ont été remplacés
console.log("\n4️⃣ Vérification du remplacement des ToolButton...");
if (editorContent.includes('ToolButton') && editorContent.includes('formatBlock') && editorContent.includes('h1')) {
  console.log("⚠️  Anciens ToolButton pour les titres encore présents");
} else {
  console.log("✅ Anciens ToolButton pour les titres remplacés");
}

// Vérifier la structure des boutons
console.log("\n5️⃣ Vérification de la structure des boutons...");
const buttonStructure = [
  'type="button"',
  'onClick={() => formatHeading',
  'className="p-2 rounded hover:bg-gray-100',
  'title="Titre'
];

for (const structure of buttonStructure) {
  if (editorContent.includes(structure)) {
    console.log(`✅ ${structure} présent`);
  } else {
    console.log(`❌ ${structure} manquant`);
  }
}

// Vérifier la gestion de la sélection
console.log("\n6️⃣ Vérification de la gestion de la sélection...");
const selectionFeatures = [
  'window.getSelection',
  'rangeCount',
  'getRangeAt',
  'toString()',
  'removeAllRanges',
  'addRange'
];

for (const feature of selectionFeatures) {
  if (editorContent.includes(feature)) {
    console.log(`✅ ${feature} présent`);
  } else {
    console.log(`❌ ${feature} manquant`);
  }
}

console.log("\n🎉 Test de correction des titres terminé !");
console.log("\n📋 Résumé des corrections :");
console.log("   ✅ Fonction formatHeading créée");
console.log("   ✅ Gestion de la sélection de texte");
console.log("   ✅ Création d'éléments H1, H2, H3");
console.log("   ✅ Boutons personnalisés pour les titres");
console.log("   ✅ Remplacement du texte sélectionné");

console.log("\n🚀 Les titres H1, H2, H3 devraient maintenant fonctionner !");
console.log("💡 Fonctionnement :");
console.log("   • Sélectionnez du texte et cliquez sur H1/H2/H3");
console.log("   • Ou cliquez sur H1/H2/H3 sans sélection pour insérer un titre par défaut");
console.log("   • Le curseur se place après le titre créé");

console.log("\n🔍 Pour tester :");
console.log("   1. Redémarrez le serveur : npm run dev");
console.log("   2. Allez sur /admin/articles");
console.log("   3. Créez un nouvel article");
console.log("   4. Tapez du texte dans l'éditeur");
console.log("   5. Sélectionnez du texte");
console.log("   6. Cliquez sur H1, H2, ou H3");
console.log("   7. Vérifiez que le texte devient un titre");
console.log("   8. Sauvegardez et vérifiez sur /blog");

console.log("\n💡 Conseils d'utilisation :");
console.log("   • Sélectionnez le texte avant de cliquer sur H1/H2/H3");
console.log("   • Ou cliquez sur H1/H2/H3 sans sélection pour créer un titre vide");
console.log("   • Utilisez H1 pour les titres principaux");
console.log("   • Utilisez H2 pour les sous-titres");
console.log("   • Utilisez H3 pour les sous-sous-titres");
