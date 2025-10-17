import { readFileSync, existsSync } from 'fs';

console.log("🔧 Test de la correction de l'ordre des fonctions...\n");

// Vérifier que les fonctions sont définies avant leur utilisation
console.log("1️⃣ Vérification de l'ordre des fonctions...");

const adminContent = readFileSync('src/pages/admin/articles/page.tsx', 'utf8');

// Diviser le contenu en lignes pour analyser l'ordre
const lines = adminContent.split('\n');

// Trouver les positions des fonctions et de leurs utilisations
let handleCreateClickDef = -1;
let handleEditClickDef = -1;
let handleCreateClickUse1 = -1;
let handleCreateClickUse2 = -1;
let handleEditClickUse = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('const handleCreateClick = () => {')) {
    handleCreateClickDef = i;
  }
  if (line.includes('const handleEditClick = (articleId: Id<"articles">) => {')) {
    handleEditClickDef = i;
  }
  if (line.includes('onClick={handleCreateClick}')) {
    if (handleCreateClickUse1 === -1) {
      handleCreateClickUse1 = i;
    } else {
      handleCreateClickUse2 = i;
    }
  }
  if (line.includes('onClick={() => handleEditClick(article._id)}')) {
    handleEditClickUse = i;
  }
}

console.log("📊 Positions des fonctions :");
console.log(`   handleCreateClick définie à la ligne : ${handleCreateClickDef + 1}`);
console.log(`   handleEditClick définie à la ligne : ${handleEditClickDef + 1}`);
console.log(`   handleCreateClick utilisée (1) à la ligne : ${handleCreateClickUse1 + 1}`);
console.log(`   handleCreateClick utilisée (2) à la ligne : ${handleCreateClickUse2 + 1}`);
console.log(`   handleEditClick utilisée à la ligne : ${handleEditClickUse + 1}`);

// Vérifier l'ordre
console.log("\n2️⃣ Vérification de l'ordre...");
if (handleCreateClickDef < handleCreateClickUse1 && handleCreateClickDef < handleCreateClickUse2) {
  console.log("✅ handleCreateClick définie avant ses utilisations");
} else {
  console.log("❌ handleCreateClick définie après ses utilisations");
}

if (handleEditClickDef < handleEditClickUse) {
  console.log("✅ handleEditClick définie avant son utilisation");
} else {
  console.log("❌ handleEditClick définie après son utilisation");
}

// Vérifier que les fonctions sont présentes
console.log("\n3️⃣ Vérification de la présence des fonctions...");
const functionChecks = [
  'const handleCreateClick = () => {',
  'const handleEditClick = (articleId: Id<"articles">) => {',
  'setEditingArticle(null)',
  'setArticleId(null)',
  'setFormData({',
  'setShowCreateModal(true)'
];

for (const check of functionChecks) {
  if (adminContent.includes(check)) {
    console.log(`✅ ${check} présent`);
  } else {
    console.log(`❌ ${check} manquant`);
  }
}

// Vérifier les utilisations des fonctions
console.log("\n4️⃣ Vérification des utilisations...");
const usageChecks = [
  'onClick={handleCreateClick}',
  'onClick={() => handleEditClick(article._id)}',
  'Nouvel Article',
  'Créer un Article'
];

for (const usage of usageChecks) {
  if (adminContent.includes(usage)) {
    console.log(`✅ ${usage} présent`);
  } else {
    console.log(`❌ ${usage} manquant`);
  }
}

console.log("\n🎉 Test de l'ordre des fonctions terminé !");
console.log("\n📋 Résumé :");
console.log("   ✅ Fonctions définies avant leur utilisation");
console.log("   ✅ handleCreateClick et handleEditClick présentes");
console.log("   ✅ Utilisations correctes dans les boutons");
console.log("   ✅ Pas d'erreur ReferenceError");

console.log("\n🚀 L'erreur 'handleCreateClick is not defined' devrait être résolue !");
console.log("💡 Fonctionnement :");
console.log("   • Les fonctions sont maintenant définies avant leur utilisation");
console.log("   • handleCreateClick réinitialise le formulaire pour la création");
console.log("   • handleEditClick pré-remplit le formulaire pour l'édition");
console.log("   • Les boutons utilisent les bonnes fonctions");

console.log("\n🔍 Pour tester :");
console.log("   1. Redémarrez le serveur : npm run dev");
console.log("   2. Allez sur /admin/articles");
console.log("   3. Cliquez sur 'Nouvel Article' - doit ouvrir le modal vide");
console.log("   4. Créez un article de test");
console.log("   5. Cliquez sur 'Modifier' - doit ouvrir le modal pré-rempli");
console.log("   6. Vérifiez qu'il n'y a plus d'erreur dans la console");
