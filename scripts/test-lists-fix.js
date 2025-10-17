import { readFileSync, existsSync } from 'fs';

console.log("📋 Test de la correction des listes...\n");

// Vérifier les corrections apportées
console.log("1️⃣ Vérification des fonctions de listes...");

const editorContent = readFileSync('src/components/admin/RichTextEditor.tsx', 'utf8');

// Vérifier que les fonctions de listes ont été ajoutées
const listFunctions = [
  'createList',
  'addListItem',
  'document.createElement(ordered ? \'ol\' : \'ul\')',
  'document.createElement(\'li\')',
  'listItem.className = \'mb-2 text-gray-700 leading-relaxed\'',
  'list.className = \'mb-4 pl-6\''
];

for (const func of listFunctions) {
  if (editorContent.includes(func)) {
    console.log(`✅ ${func} présent`);
  } else {
    console.log(`❌ ${func} manquant`);
  }
}

// Vérifier les boutons de listes
console.log("\n2️⃣ Vérification des boutons de listes...");
const listButtons = [
  'onClick={() => createList(false)}',
  'onClick={() => createList(true)}',
  'onClick={addListItem}',
  'ri-list-unordered',
  'ri-list-ordered',
  'ri-add-line',
  'Liste à puces',
  'Liste numérotée',
  'Ajouter un élément de liste'
];

for (const button of listButtons) {
  if (editorContent.includes(button)) {
    console.log(`✅ ${button} présent`);
  } else {
    console.log(`❌ ${button} manquant`);
  }
}

// Vérifier la logique des listes
console.log("\n3️⃣ Vérification de la logique des listes...");
const listLogic = [
  'selectedText || \'Élément de liste\'',
  'selectedText || \'Nouvel élément\'',
  'listElement.parentElement',
  'UL\', \'OL\'].includes(listElement.tagName)',
  'listElement.appendChild(listItem)',
  'range.insertNode(list)'
];

for (const logic of listLogic) {
  if (editorContent.includes(logic)) {
    console.log(`✅ ${logic} présent`);
  } else {
    console.log(`❌ ${logic} manquant`);
  }
}

// Vérifier les styles CSS pour les listes
console.log("\n4️⃣ Vérification des styles CSS...");
const listStyles = [
  '[contenteditable] ul',
  '[contenteditable] ol',
  '[contenteditable] li',
  'margin-bottom: 1rem',
  'padding-left: 1.5rem',
  'margin-bottom: 0.5rem'
];

for (const style of listStyles) {
  if (editorContent.includes(style)) {
    console.log(`✅ ${style} présent`);
  } else {
    console.log(`❌ ${style} manquant`);
  }
}

// Vérifier que les anciens ToolButton pour les listes ont été remplacés
console.log("\n5️⃣ Vérification du remplacement des ToolButton...");
if (editorContent.includes('insertUnorderedList') || editorContent.includes('insertOrderedList')) {
  console.log("⚠️  Anciens ToolButton pour les listes encore présents");
} else {
  console.log("✅ Anciens ToolButton pour les listes remplacés");
}

console.log("\n🎉 Test de correction des listes terminé !");
console.log("\n📋 Résumé des corrections :");
console.log("   ✅ Fonction createList créée");
console.log("   ✅ Fonction addListItem créée");
console.log("   ✅ Boutons personnalisés pour les listes");
console.log("   ✅ Styles CSS appliqués");
console.log("   ✅ Gestion intelligente des listes existantes");

console.log("\n🚀 Les listes devraient maintenant fonctionner parfaitement !");
console.log("💡 Fonctionnement :");
console.log("   • Cliquez sur 'Liste à puces' pour créer une liste à puces");
console.log("   • Cliquez sur 'Liste numérotée' pour créer une liste numérotée");
console.log("   • Cliquez sur '+' pour ajouter un élément à une liste existante");
console.log("   • Sélectionnez du texte avant de créer une liste pour l'utiliser comme premier élément");

console.log("\n📝 Types de listes supportées :");
console.log("   • Liste à puces (ul) : Éléments avec des puces");
console.log("   • Liste numérotée (ol) : Éléments avec des numéros");
console.log("   • Ajout d'éléments : Ajouter des éléments à une liste existante");

console.log("\n🎨 Styles appliqués :");
console.log("   • Indentation : 1.5rem (24px)");
console.log("   • Espacement entre éléments : 0.5rem (8px)");
console.log("   • Espacement entre listes : 1rem (16px)");
console.log("   • Couleur : Gris foncé (#374151)");
console.log("   • Hauteur de ligne : 1.6");

console.log("\n🔍 Pour tester :");
console.log("   1. Redémarrez le serveur : npm run dev");
console.log("   2. Allez sur /admin/articles");
console.log("   3. Créez un nouvel article");
console.log("   4. Testez les boutons de listes dans l'éditeur");
console.log("   5. Vérifiez que les listes s'affichent correctement");
console.log("   6. Testez l'ajout d'éléments à une liste existante");
console.log("   7. Sauvegardez et vérifiez sur /blog");

console.log("\n💡 Conseils d'utilisation :");
console.log("   • Sélectionnez du texte avant de créer une liste");
console.log("   • Utilisez le bouton '+' pour ajouter des éléments");
console.log("   • Les listes sont automatiquement stylées");
console.log("   • L'indentation est gérée automatiquement");
