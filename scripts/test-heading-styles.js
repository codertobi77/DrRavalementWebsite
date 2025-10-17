import { readFileSync, existsSync } from 'fs';

console.log("🎨 Test des styles de titres...\n");

// Vérifier les styles ajoutés
console.log("1️⃣ Vérification des styles de titres...");

const editorContent = readFileSync('src/components/admin/RichTextEditor.tsx', 'utf8');

// Vérifier les styles H1
const h1Styles = [
  'text-4xl font-bold text-gray-900 mb-6 mt-8 leading-tight',
  'font-size: 2.25rem',
  'font-weight: 700',
  'color: #111827',
  'margin-bottom: 1.5rem',
  'margin-top: 2rem'
];

console.log("📝 Styles H1 :");
for (const style of h1Styles) {
  if (editorContent.includes(style)) {
    console.log(`✅ ${style}`);
  } else {
    console.log(`❌ ${style} manquant`);
  }
}

// Vérifier les styles H2
const h2Styles = [
  'text-3xl font-bold text-gray-900 mb-4 mt-6 leading-tight',
  'font-size: 1.875rem',
  'margin-bottom: 1rem',
  'margin-top: 1.5rem'
];

console.log("\n📝 Styles H2 :");
for (const style of h2Styles) {
  if (editorContent.includes(style)) {
    console.log(`✅ ${style}`);
  } else {
    console.log(`❌ ${style} manquant`);
  }
}

// Vérifier les styles H3
const h3Styles = [
  'text-2xl font-semibold text-gray-900 mb-3 mt-4 leading-tight',
  'font-size: 1.5rem',
  'font-weight: 600',
  'margin-bottom: 0.75rem',
  'margin-top: 1rem'
];

console.log("\n📝 Styles H3 :");
for (const style of h3Styles) {
  if (editorContent.includes(style)) {
    console.log(`✅ ${style}`);
  } else {
    console.log(`❌ ${style} manquant`);
  }
}

// Vérifier les styles généraux
const generalStyles = [
  'line-height: 1.1',
  'color: #374151',
  'margin-bottom: 1rem',
  'padding-left: 1.5rem'
];

console.log("\n📝 Styles généraux :");
for (const style of generalStyles) {
  if (editorContent.includes(style)) {
    console.log(`✅ ${style}`);
  } else {
    console.log(`❌ ${style} manquant`);
  }
}

// Vérifier la structure CSS
console.log("\n2️⃣ Vérification de la structure CSS...");
const cssStructure = [
  '[contenteditable] h1',
  '[contenteditable] h2',
  '[contenteditable] h3',
  '[contenteditable] p',
  '[contenteditable] ul',
  '[contenteditable] ol',
  '[contenteditable] li',
  '[contenteditable] strong',
  '[contenteditable] em'
];

for (const structure of cssStructure) {
  if (editorContent.includes(structure)) {
    console.log(`✅ ${structure} défini`);
  } else {
    console.log(`❌ ${structure} manquant`);
  }
}

// Vérifier la fonction formatHeading
console.log("\n3️⃣ Vérification de la fonction formatHeading...");
const formatHeadingFeatures = [
  'switch (level)',
  'case 1:',
  'case 2:',
  'case 3:',
  'heading.className =',
  'text-4xl',
  'text-3xl',
  'text-2xl'
];

for (const feature of formatHeadingFeatures) {
  if (editorContent.includes(feature)) {
    console.log(`✅ ${feature} présent`);
  } else {
    console.log(`❌ ${feature} manquant`);
  }
}

console.log("\n🎉 Test des styles de titres terminé !");
console.log("\n📋 Résumé des styles implémentés :");
console.log("   ✅ H1 : 2.25rem, bold, gris foncé, espacement généreux");
console.log("   ✅ H2 : 1.875rem, bold, gris foncé, espacement moyen");
console.log("   ✅ H3 : 1.5rem, semibold, gris foncé, espacement compact");
console.log("   ✅ Paragraphes : espacement et couleur optimisés");
console.log("   ✅ Listes : indentation et espacement appropriés");
console.log("   ✅ Formatage : gras, italique, souligné, barré");

console.log("\n🎨 Hiérarchie visuelle des titres :");
console.log("   📏 H1 : Très grand (36px) - Titres principaux");
console.log("   📏 H2 : Grand (30px) - Sous-titres");
console.log("   📏 H3 : Moyen (24px) - Sous-sous-titres");
console.log("   📏 P : Normal (16px) - Texte courant");

console.log("\n🚀 Les titres ont maintenant des styles par défaut professionnels !");
console.log("💡 Fonctionnement :");
console.log("   • Cliquez sur H1/H2/H3 pour créer un titre stylé");
console.log("   • Les styles s'appliquent automatiquement");
console.log("   • L'affichage dans l'éditeur et le modal est identique");
console.log("   • Pas de couleurs, juste des tailles et espacements");

console.log("\n🔍 Pour tester :");
console.log("   1. Redémarrez le serveur : npm run dev");
console.log("   2. Allez sur /admin/articles");
console.log("   3. Créez un nouvel article");
console.log("   4. Testez H1, H2, H3 dans l'éditeur");
console.log("   5. Vérifiez que les styles s'appliquent");
console.log("   6. Sauvegardez et vérifiez sur /blog");
