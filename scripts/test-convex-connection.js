/**
 * Script pour tester la connexion Convex et initialiser les services
 */

import { ConvexHttpClient } from "convex/browser";
import { readFileSync } from 'fs';

// Lire le fichier .env
const envContent = readFileSync('.env', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const CONVEX_URL = envVars.VITE_CONVEX_URL;

if (!CONVEX_URL || CONVEX_URL.includes("your-convex-deployment")) {
  console.error("❌ VITE_CONVEX_URL non configuré dans .env");
  console.log("💡 Configurez VITE_CONVEX_URL dans votre fichier .env");
  process.exit(1);
}

async function testConvexConnection() {
  const client = new ConvexHttpClient(CONVEX_URL);
  
  try {
    console.log("🔄 Test de connexion à Convex...");
    console.log(`📍 URL: ${CONVEX_URL}`);
    
    // Tester la connexion en récupérant les services
    const services = await client.query('cms:getServices', {});
    
    if (services && Array.isArray(services)) {
      console.log(`✅ Connexion réussie! ${services.length} service(s) trouvé(s)`);
      
      if (services.length === 0) {
        console.log("⚠️  Aucun service trouvé dans la base de données");
        console.log("💡 Vous pouvez utiliser les scripts d'initialisation pour ajouter des services");
      } else {
        console.log("\n📋 Services disponibles:");
        services.forEach((service, index) => {
          console.log(`   ${index + 1}. ${service.title} (${service.is_active ? 'Actif' : 'Inactif'})`);
        });
      }
    } else {
      console.log("⚠️  Réponse inattendue de Convex");
    }
    
  } catch (error) {
    console.error("❌ Erreur de connexion à Convex:", error.message);
    
    if (error.message.includes("Failed to fetch")) {
      console.log("💡 Vérifiez que:");
      console.log("   - Le serveur Convex est démarré (npx convex dev)");
      console.log("   - L'URL Convex est correcte");
      console.log("   - Votre connexion internet fonctionne");
    } else if (error.message.includes("Function not found")) {
      console.log("💡 La fonction 'cms:getServices' n'existe pas");
      console.log("   Vérifiez que le fichier convex/cms.ts contient cette fonction");
    }
  }
}

// Exécuter le test
testConvexConnection().catch(console.error);
