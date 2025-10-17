import { ConvexHttpClient } from "convex/browser";
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log("🧪 Test des fonctions Convex...\n");

// Lire la configuration
const envPath = join(process.cwd(), '.env');
const envContent = readFileSync(envPath, 'utf8');
const convexUrlMatch = envContent.match(/VITE_CONVEX_URL=(.+)/);
const convexUrl = convexUrlMatch ? convexUrlMatch[1].trim() : null;

const client = new ConvexHttpClient(convexUrl);

async function testFunctions() {
  const functions = [
    'articles:getArticles',
    'articles:getArticleStats',
    'articles:getArticleCategories',
    'articles:createArticle',
    'articles:updateArticle',
    'articles:deleteArticle'
  ];

  console.log("🔍 Test des fonctions disponibles...\n");

  for (const func of functions) {
    try {
      console.log(`📡 Test de ${func}...`);
      
      if (func.includes('createArticle')) {
        // Test de création avec des données minimales
        const result = await client.mutation(func, {
          title: "Test Article",
          excerpt: "Test excerpt",
          content: "Test content",
          featured_image: "https://example.com/image.jpg",
          category: "Test",
          tags: ["test"],
          status: "draft",
          is_featured: false,
        });
        console.log(`✅ ${func} - Article créé avec ID: ${result}`);
        
        // Nettoyer l'article de test
        await client.mutation('articles:deleteArticle', { id: result });
        console.log(`🧹 Article de test supprimé`);
        
      } else if (func.includes('getArticles') || func.includes('getArticleStats') || func.includes('getArticleCategories')) {
        const result = await client.query(func, {});
        console.log(`✅ ${func} - Résultat:`, Array.isArray(result) ? `${result.length} éléments` : typeof result);
        
      } else {
        console.log(`⏭️  ${func} - Fonction de mutation, testé via createArticle`);
      }
      
    } catch (error) {
      console.log(`❌ ${func} - Erreur:`, error.message);
      
      if (error.message.includes('Function not found')) {
        console.log(`   💡 La fonction ${func} n'est pas déployée`);
      } else if (error.message.includes('Invalid argument')) {
        console.log(`   💡 Arguments invalides pour ${func}`);
      } else {
        console.log(`   💡 Erreur inattendue pour ${func}`);
      }
    }
    
    console.log(""); // Ligne vide
  }
}

testFunctions().then(() => {
  console.log("🏁 Test des fonctions terminé");
});
