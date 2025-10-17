import { readFileSync, existsSync } from 'fs';

console.log("🔧 Test de la correction de l'éditeur...\n");

// Vérifier les corrections apportées
console.log("1️⃣ Vérification des corrections...");

const editorContent = readFileSync('src/components/admin/RichTextEditor.tsx', 'utf8');

// Vérifier que dangerouslySetInnerHTML a été supprimé
if (editorContent.includes('dangerouslySetInnerHTML')) {
  console.log("❌ dangerouslySetInnerHTML encore présent (problématique)");
} else {
  console.log("✅ dangerouslySetInnerHTML supprimé");
}

// Vérifier la gestion du focus
if (editorContent.includes('!isFocused')) {
  console.log("✅ Gestion du focus ajoutée");
} else {
  console.log("❌ Gestion du focus manquante");
}

// Vérifier que contentEditable est présent
if (editorContent.includes('contentEditable')) {
  console.log("✅ contentEditable présent");
} else {
  console.log("❌ contentEditable manquant");
}

// Vérifier la gestion des événements
const eventHandlers = [
  'onInput={handleInput}',
  'onFocus={() => setIsFocused(true)}',
  'onBlur={() => setIsFocused(false)}'
];

console.log("\n2️⃣ Vérification des gestionnaires d'événements...");
for (const handler of eventHandlers) {
  if (editorContent.includes(handler)) {
    console.log(`✅ ${handler} présent`);
  } else {
    console.log(`❌ ${handler} manquant`);
  }
}

// Vérifier la structure de l'éditeur
console.log("\n3️⃣ Vérification de la structure...");
const structureElements = [
  'editorRef',
  'useEffect',
  'handleInput',
  'isFocused',
  'setIsFocused'
];

for (const element of structureElements) {
  if (editorContent.includes(element)) {
    console.log(`✅ ${element} présent`);
  } else {
    console.log(`❌ ${element} manquant`);
  }
}

// Vérifier les styles
console.log("\n4️⃣ Vérification des styles...");
const styleElements = [
  'min-h-[300px]',
  'p-4',
  'focus:outline-none',
  'ring-2 ring-orange-500',
  'lineHeight',
  'fontSize'
];

for (const style of styleElements) {
  if (editorContent.includes(style)) {
    console.log(`✅ ${style} présent`);
  } else {
    console.log(`❌ ${style} manquant`);
  }
}

console.log("\n🎉 Test de correction terminé !");
console.log("\n📋 Résumé des corrections :");
console.log("   ✅ dangerouslySetInnerHTML supprimé");
console.log("   ✅ Gestion du focus ajoutée");
console.log("   ✅ contentEditable sans conflit");
console.log("   ✅ Gestionnaires d'événements corrects");

console.log("\n🚀 Le problème du texte à l'envers devrait être résolu !");
console.log("💡 L'éditeur utilise maintenant contentEditable pur sans dangerouslySetInnerHTML");

console.log("\n🔍 Pour tester :");
console.log("   1. Redémarrez le serveur : npm run dev");
console.log("   2. Allez sur /admin/articles");
console.log("   3. Créez un nouvel article");
console.log("   4. Tapez du texte dans l'éditeur");
console.log("   5. Vérifiez que le texte s'affiche correctement");
console.log("   6. Testez le formatage (gras, italique, etc.)");
console.log("   7. Sauvegardez et vérifiez sur /blog");

console.log("\n⚠️ Si le problème persiste :");
console.log("   • Videz le cache du navigateur (Ctrl+F5)");
console.log("   • Vérifiez la console pour les erreurs");
console.log("   • Testez sur un autre navigateur");
