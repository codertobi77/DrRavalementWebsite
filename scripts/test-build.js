import { execSync } from 'child_process';

console.log("🔧 Test du build...\n");

try {
  console.log("🔄 Exécution de npm run build...");
  const output = execSync('npm run build', { 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log("✅ Build réussi !");
  console.log("\n📋 Sortie du build :");
  console.log(output);
  
} catch (error) {
  console.log("❌ Erreur de build :");
  console.log(error.message);
  
  // Afficher les détails de l'erreur
  if (error.stdout) {
    console.log("\n📤 Sortie standard :");
    console.log(error.stdout);
  }
  
  if (error.stderr) {
    console.log("\n📤 Sortie d'erreur :");
    console.log(error.stderr);
  }
}
