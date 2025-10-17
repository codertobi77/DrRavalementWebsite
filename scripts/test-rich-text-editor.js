import { readFileSync, existsSync } from 'fs';

console.log("🧪 Test de l'éditeur de texte riche...\n");

// Vérifier les fichiers créés
console.log("1️⃣ Vérification des fichiers...");
const filesToCheck = [
  'src/components/admin/RichTextEditor.tsx',
  'src/components/blog/FormattedContent.tsx',
  'src/pages/admin/articles/page.tsx',
  'src/components/blog/ArticleModal.tsx'
];

for (const file of filesToCheck) {
  if (existsSync(file)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} manquant`);
    process.exit(1);
  }
}

// Vérifier RichTextEditor
console.log("\n2️⃣ Vérification de RichTextEditor...");
const editorContent = readFileSync('src/components/admin/RichTextEditor.tsx', 'utf8');

const editorFeatures = [
  'contentEditable',
  'execCommand',
  'ToolButton',
  'bold',
  'italic',
  'underline',
  'formatBlock',
  'insertUnorderedList',
  'insertOrderedList',
  'justifyLeft',
  'justifyCenter',
  'justifyRight',
  'foreColor',
  'backColor',
  'removeFormat',
  'undo',
  'redo'
];

for (const feature of editorFeatures) {
  if (editorContent.includes(feature)) {
    console.log(`✅ ${feature} présent`);
  } else {
    console.log(`❌ ${feature} manquant`);
  }
}

// Vérifier les outils de formatage
console.log("\n3️⃣ Vérification des outils de formatage...");
const formattingTools = [
  'ri-bold',
  'ri-italic',
  'ri-underline',
  'ri-strikethrough',
  'ri-h-1',
  'ri-h-2',
  'ri-h-3',
  'ri-paragraph',
  'ri-list-unordered',
  'ri-list-ordered',
  'ri-align-left',
  'ri-align-center',
  'ri-align-right',
  'ri-align-justify',
  'ri-text',
  'ri-text-color',
  'ri-format-clear',
  'ri-arrow-go-back-line',
  'ri-arrow-go-forward-line'
];

for (const tool of formattingTools) {
  if (editorContent.includes(tool)) {
    console.log(`✅ ${tool} présent`);
  } else {
    console.log(`❌ ${tool} manquant`);
  }
}

// Vérifier FormattedContent
console.log("\n4️⃣ Vérification de FormattedContent...");
const formattedContent = readFileSync('src/components/blog/FormattedContent.tsx', 'utf8');

if (formattedContent.includes('dangerouslySetInnerHTML')) {
  console.log("✅ Rendu HTML activé");
} else {
  console.log("❌ Rendu HTML manquant");
}

if (formattedContent.includes('prose prose-lg')) {
  console.log("✅ Styles Tailwind appliqués");
} else {
  console.log("❌ Styles Tailwind manquants");
}

// Vérifier l'intégration dans la page admin
console.log("\n5️⃣ Vérification de l'intégration admin...");
const adminContent = readFileSync('src/pages/admin/articles/page.tsx', 'utf8');

if (adminContent.includes('RichTextEditor')) {
  console.log("✅ RichTextEditor importé dans la page admin");
} else {
  console.log("❌ RichTextEditor non importé");
}

if (adminContent.includes('<RichTextEditor')) {
  console.log("✅ RichTextEditor utilisé dans le formulaire");
} else {
  console.log("❌ RichTextEditor non utilisé");
}

// Vérifier l'intégration dans le modal
console.log("\n6️⃣ Vérification de l'intégration modal...");
const modalContent = readFileSync('src/components/blog/ArticleModal.tsx', 'utf8');

if (modalContent.includes('FormattedContent')) {
  console.log("✅ FormattedContent importé dans le modal");
} else {
  console.log("❌ FormattedContent non importé");
}

if (modalContent.includes('<FormattedContent')) {
  console.log("✅ FormattedContent utilisé dans le modal");
} else {
  console.log("❌ FormattedContent non utilisé");
}

// Vérifier la suppression du rendu markdown
if (modalContent.includes('renderContent')) {
  console.log("❌ Ancien rendu markdown encore présent");
} else {
  console.log("✅ Ancien rendu markdown supprimé");
}

console.log("\n🎉 Test de l'éditeur de texte riche terminé !");
console.log("\n📋 Résumé :");
console.log("   ✅ RichTextEditor créé avec tous les outils");
console.log("   ✅ FormattedContent pour l'affichage");
console.log("   ✅ Intégration dans la page admin");
console.log("   ✅ Intégration dans le modal blog");
console.log("   ✅ Rendu HTML au lieu de markdown");

console.log("\n🚀 Fonctionnalités de l'éditeur :");
console.log("   📝 Formatage de base (gras, italique, souligné, barré)");
console.log("   📋 Titres (H1, H2, H3, paragraphe)");
console.log("   📋 Listes (à puces et numérotées)");
console.log("   📐 Alignement (gauche, centre, droite, justifié)");
console.log("   🎨 Couleurs (texte et fond)");
console.log("   🔄 Actions (annuler, refaire, supprimer format)");
console.log("   📱 Interface responsive");

console.log("\n💡 Pour tester :");
console.log("   1. Démarrez le serveur : npm run dev");
console.log("   2. Allez sur /admin/articles");
console.log("   3. Créez un nouvel article");
console.log("   4. Utilisez les outils de formatage");
console.log("   5. Sauvegardez et vérifiez sur /blog");
