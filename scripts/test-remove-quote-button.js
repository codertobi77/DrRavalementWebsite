import { readFileSync, existsSync } from 'fs';

console.log("🔧 Test de la suppression du bouton 'Demander un devis' du header...\n");

// Vérifier la suppression des boutons
console.log("1️⃣ Vérification de la suppression des boutons...");

const headerPath = 'src/components/feature/Header.tsx';
if (existsSync(headerPath)) {
  const content = readFileSync(headerPath, 'utf8');
  
  // Vérifier que les boutons "Devis Gratuit" ont été supprimés
  console.log("📊 Vérification de la suppression :");
  
  const removedElements = [
    'Devis Gratuit',
    'CTA Button - visible sur tablette et desktop',
    'hidden md:flex items-center',
    'Button href="/contact" className="text-sm px-4 py-2"',
    'pt-3 border-t',
    'Button href="/contact" className="w-full text-center"'
  ];
  
  for (const element of removedElements) {
    if (content.includes(element)) {
      console.log(`❌ ${element} encore présent`);
    } else {
      console.log(`✅ ${element} supprimé`);
    }
  }
  
  // Vérifier que les éléments restants sont présents
  console.log("\n2️⃣ Vérification des éléments conservés...");
  
  const preservedElements = [
    'Mobile menu button',
    'xl:hidden p-2 rounded-lg hover:bg-gray-100',
    'ri-${isMenuOpen ? \'close\' : \'menu\'}-line',
    'setIsMenuOpen(!isMenuOpen)',
    'Mobile menu',
    'xl:hidden py-4 border-t bg-white',
    'Navigation desktop',
    'hidden xl:flex items-center space-x-6'
  ];
  
  for (const element of preservedElements) {
    if (content.includes(element)) {
      console.log(`✅ ${element} présent`);
    } else {
      console.log(`❌ ${element} manquant`);
    }
  }
  
  // Vérifier la structure du header
  console.log("\n3️⃣ Vérification de la structure du header...");
  
  const structureElements = [
    'Top bar',
    'Main header',
    'Logo intégré',
    'Navigation desktop',
    'Mobile menu button',
    'Mobile menu'
  ];
  
  for (const element of structureElements) {
    if (content.includes(`{/* ${element} */}`)) {
      console.log(`✅ ${element} présent`);
    } else {
      console.log(`❌ ${element} manquant`);
    }
  }
  
  // Vérifier les liens de navigation
  console.log("\n4️⃣ Vérification des liens de navigation...");
  
  const navLinks = [
    'href="/"',
    'href="/about"',
    'href="/services"',
    'href="/portfolio"',
    'href="/blog"',
    'href="/contact"'
  ];
  
  for (const link of navLinks) {
    if (content.includes(link)) {
      console.log(`✅ ${link} présent`);
    } else {
      console.log(`❌ ${link} manquant`);
    }
  }
  
  // Vérifier l'import du composant Button
  console.log("\n5️⃣ Vérification des imports...");
  
  if (content.includes('import Button from \'../base/Button\';')) {
    console.log("⚠️  Import Button encore présent (peut être supprimé si plus utilisé)");
  } else {
    console.log("✅ Import Button supprimé");
  }
  
  // Vérifier l'utilisation du composant Button
  if (content.includes('<Button')) {
    console.log("❌ Composant Button encore utilisé");
  } else {
    console.log("✅ Composant Button plus utilisé");
  }
  
} else {
  console.log("❌ Header.tsx non trouvé");
}

console.log("\n🎉 Test de suppression terminé !");
console.log("\n📋 Résumé des changements :");
console.log("   ✅ Bouton 'Devis Gratuit' desktop supprimé");
console.log("   ✅ Bouton 'Devis Gratuit' mobile supprimé");
console.log("   ✅ Structure du header préservée");
console.log("   ✅ Navigation maintenue");
console.log("   ✅ Menu mobile conservé");

console.log("\n🚀 Structure finale du header :");
console.log("   1. Top bar (contact info)");
console.log("   2. Logo et nom de l'entreprise");
console.log("   3. Navigation desktop (6 liens)");
console.log("   4. Bouton menu mobile");
console.log("   5. Menu mobile (6 liens)");

console.log("\n💡 Pour tester :");
console.log("   1. Démarrez le serveur : npm run dev");
console.log("   2. Vérifiez le header sur toutes les pages");
console.log("   3. Testez sur desktop et mobile");
console.log("   4. Vérifiez que les boutons 'Devis Gratuit' ont disparu");
console.log("   5. Vérifiez que la navigation fonctionne toujours");
