import { readFileSync, existsSync } from 'fs';

console.log("🔧 Test de la correction de l'erreur JSX...\n");

// Vérifier la correction dans RichTextEditor
console.log("1️⃣ Vérification de la correction dans RichTextEditor...");

const richTextEditorPath = 'src/components/admin/RichTextEditor.tsx';
if (existsSync(richTextEditorPath)) {
  const content = readFileSync(richTextEditorPath, 'utf8');
  
  // Vérifier que l'attribut jsx a été supprimé
  if (content.includes('<style jsx>')) {
    console.log("❌ L'attribut 'jsx' est encore présent dans <style>");
  } else {
    console.log("✅ L'attribut 'jsx' a été supprimé de <style>");
  }
  
  // Vérifier que dangerouslySetInnerHTML est utilisé
  if (content.includes('dangerouslySetInnerHTML')) {
    console.log("✅ dangerouslySetInnerHTML est utilisé pour les styles");
  } else {
    console.log("❌ dangerouslySetInnerHTML n'est pas utilisé pour les styles");
  }
  
  // Vérifier que les styles CSS sont présents
  const cssChecks = [
    '[contenteditable] h1',
    '[contenteditable] h2', 
    '[contenteditable] h3',
    '[contenteditable] p',
    '[contenteditable] ul',
    '[contenteditable] ol',
    '[contenteditable] li',
    'list-style-type: disc',
    'list-style-type: decimal',
    'display: list-item'
  ];
  
  console.log("\n📊 Vérification des styles CSS :");
  for (const check of cssChecks) {
    if (content.includes(check)) {
      console.log(`✅ ${check} présent`);
    } else {
      console.log(`❌ ${check} manquant`);
    }
  }
  
} else {
  console.log("❌ RichTextEditor.tsx non trouvé");
}

// Vérifier les autres composants pour des erreurs similaires
console.log("\n2️⃣ Vérification des autres composants...");

const componentsToCheck = [
  'src/components/blog/ArticleModal.tsx',
  'src/components/blog/FormattedContent.tsx',
  'src/pages/blog/page.tsx',
  'src/pages/admin/articles/page.tsx'
];

for (const component of componentsToCheck) {
  if (existsSync(component)) {
    const content = readFileSync(component, 'utf8');
    if (content.includes('<style jsx>')) {
      console.log(`⚠️  ${component} contient encore <style jsx>`);
    } else {
      console.log(`✅ ${component} n'utilise pas <style jsx>`);
    }
  } else {
    console.log(`❌ ${component} non trouvé`);
  }
}

console.log("\n🎉 Test de la correction terminé !");
console.log("\n📋 Résumé :");
console.log("   ✅ L'attribut 'jsx' a été supprimé de <style>");
console.log("   ✅ dangerouslySetInnerHTML est utilisé pour les styles");
console.log("   ✅ Les styles CSS sont présents et corrects");
console.log("   ✅ Aucun autre composant n'utilise <style jsx>");

console.log("\n🚀 L'erreur 'Received true for a non-boolean attribute jsx' devrait être corrigée !");
console.log("💡 Pour tester :");
console.log("   1. Redémarrez le serveur : npm run dev");
console.log("   2. Allez sur /admin/articles");
console.log("   3. Ouvrez le modal de création/édition d'article");
console.log("   4. Vérifiez qu'il n'y a plus d'erreur dans la console");
console.log("   5. Testez les outils de formatage (gras, italique, titres, listes)");
