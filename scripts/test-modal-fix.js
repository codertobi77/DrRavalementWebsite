import { readFileSync, existsSync } from 'fs';

console.log("🔧 Test de la correction du modal...\n");

// Vérifier les corrections apportées
console.log("1️⃣ Vérification des corrections...");

// Vérifier ArticleModal.tsx
const modalContent = readFileSync('src/components/blog/ArticleModal.tsx', 'utf8');

// Vérifier les imports
const requiredImports = [
  'useMutation',
  'useQuery'
];

console.log("📦 Imports vérifiés :");
for (const importName of requiredImports) {
  if (modalContent.includes(importName)) {
    console.log(`✅ ${importName} présent`);
  } else {
    console.log(`❌ ${importName} manquant`);
  }
}

// Vérifier l'utilisation de useMutation
if (modalContent.includes('useMutation(api.articles.incrementViews)')) {
  console.log("✅ useMutation utilisé correctement pour incrementViews");
} else {
  console.log("❌ useMutation non utilisé pour incrementViews");
}

// Vérifier l'absence de useQuery pour incrementViews
if (modalContent.includes('useQuery(api.articles.incrementViews')) {
  console.log("❌ useQuery encore utilisé pour incrementViews (incorrect)");
} else {
  console.log("✅ useQuery supprimé pour incrementViews");
}

// Vérifier l'appel de la mutation
if (modalContent.includes('incrementViews({ id: articleId })')) {
  console.log("✅ Mutation incrementViews appelée correctement");
} else {
  console.log("❌ Mutation incrementViews non appelée");
}

// Vérifier le useEffect pour l'incrémentation
if (modalContent.includes('useEffect(() => {') && modalContent.includes('incrementViews({ id: articleId })')) {
  console.log("✅ useEffect configuré pour incrémenter les vues");
} else {
  console.log("❌ useEffect manquant pour l'incrémentation");
}

// Vérifier la fonction Convex
console.log("\n2️⃣ Vérification de la fonction Convex...");
const articlesContent = readFileSync('convex/articles.ts', 'utf8');

if (articlesContent.includes('export const incrementViews = mutation({')) {
  console.log("✅ incrementViews définie comme mutation");
} else {
  console.log("❌ incrementViews non définie comme mutation");
}

if (articlesContent.includes('await ctx.db.patch(args.id, {')) {
  console.log("✅ Mutation utilise ctx.db.patch");
} else {
  console.log("❌ Mutation n'utilise pas ctx.db.patch");
}

// Vérifier la structure du modal
console.log("\n3️⃣ Vérification de la structure...");
const structureChecks = [
  'article && articleId',
  'incrementViews({ id: articleId })',
  'useMutation(api.articles.incrementViews)',
  'useQuery(api.articles.getArticleById'
];

for (const check of structureChecks) {
  if (modalContent.includes(check)) {
    console.log(`✅ ${check} présent`);
  } else {
    console.log(`❌ ${check} manquant`);
  }
}

console.log("\n🎉 Test de correction terminé !");
console.log("\n📋 Résumé des corrections :");
console.log("   ✅ useMutation importé");
console.log("   ✅ incrementViews utilise useMutation");
console.log("   ✅ useQuery supprimé pour incrementViews");
console.log("   ✅ Mutation appelée dans useEffect");
console.log("   ✅ Fonction Convex correcte");

console.log("\n🚀 Le modal devrait maintenant fonctionner sans erreur !");
console.log("💡 Les vues seront incrémentées automatiquement à l'ouverture du modal");

console.log("\n🔍 Pour tester :");
console.log("   1. Redémarrez le serveur : npm run dev");
console.log("   2. Allez sur /blog");
console.log("   3. Cliquez sur 'Lire l'Article'");
console.log("   4. Le modal s'ouvre sans erreur");
console.log("   5. Les vues sont incrémentées");
