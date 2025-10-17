import { ConvexHttpClient } from "convex/browser";
import { readFileSync } from 'fs';
import { join } from 'path';

console.log("🧪 Test de création d'article simple...\n");

// Lire la configuration
const envPath = join(process.cwd(), '.env');
const envContent = readFileSync(envPath, 'utf8');
const convexUrlMatch = envContent.match(/VITE_CONVEX_URL=(.+)/);
const convexUrl = convexUrlMatch ? convexUrlMatch[1].trim() : null;

const client = new ConvexHttpClient(convexUrl);

async function testSimpleArticle() {
  try {
    console.log("📝 Test avec des données minimales...");
    
    const articleId = await client.mutation("articles:createArticle", {
      title: "Test Simple",
      excerpt: "Ceci est un test simple",
      content: "# Test\n\nCeci est un test simple.",
      featured_image: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Test",
      tags: ["test"],
      status: "draft",
      is_featured: false,
    });
    
    console.log(`✅ Article simple créé avec succès (ID: ${articleId})`);
    
    // Récupérer l'article pour vérifier
    const article = await client.query("articles:getArticleById", { id: articleId });
    console.log("📖 Article récupéré :", {
      title: article.title,
      slug: article.slug,
      category: article.category,
      status: article.status
    });
    
    // Nettoyer
    await client.mutation("articles:deleteArticle", { id: articleId });
    console.log("🧹 Article de test supprimé");
    
    console.log("\n✅ Test simple réussi !");
    
  } catch (error) {
    console.error("❌ Erreur lors du test simple :", error);
    console.error("Détails de l'erreur :", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
  }
}

testSimpleArticle();
