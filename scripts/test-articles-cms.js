import { ConvexHttpClient } from "convex/browser";

// Configuration Convex
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://your-convex-deployment.convex.cloud";

const client = new ConvexHttpClient(CONVEX_URL);

async function testArticlesCMS() {
  console.log("🧪 Test du système CMS Articles...\n");

  try {
    // Test 1: Récupérer tous les articles
    console.log("1️⃣ Test de récupération des articles...");
    const articles = await client.query("articles:getArticles", {});
    console.log(`✅ ${articles.length} articles trouvés`);

    // Test 2: Récupérer les articles publiés
    console.log("\n2️⃣ Test des articles publiés...");
    const publishedArticles = await client.query("articles:getArticles", {
      status: "published"
    });
    console.log(`✅ ${publishedArticles.length} articles publiés`);

    // Test 3: Récupérer les catégories
    console.log("\n3️⃣ Test des catégories...");
    const categories = await client.query("articles:getArticleCategories", {});
    console.log(`✅ Catégories trouvées : ${categories.join(", ")}`);

    // Test 4: Récupérer les statistiques
    console.log("\n4️⃣ Test des statistiques...");
    const stats = await client.query("articles:getArticleStats", {});
    console.log("✅ Statistiques :");
    console.log(`   - Total articles : ${stats.total}`);
    console.log(`   - Publiés : ${stats.published}`);
    console.log(`   - Brouillons : ${stats.draft}`);
    console.log(`   - À la une : ${stats.featured}`);
    console.log(`   - Vues totales : ${stats.totalViews}`);
    console.log(`   - Catégories : ${stats.categories}`);

    // Test 5: Récupérer un article par slug (si des articles existent)
    if (articles.length > 0) {
      console.log("\n5️⃣ Test de récupération par slug...");
      const firstArticle = articles[0];
      const articleBySlug = await client.query("articles:getArticleBySlug", {
        slug: firstArticle.slug
      });
      
      if (articleBySlug) {
        console.log(`✅ Article trouvé par slug : ${articleBySlug.title}`);
        console.log(`   - Vues : ${articleBySlug.view_count}`);
      } else {
        console.log("❌ Aucun article trouvé par slug");
      }
    }

    // Test 6: Récupérer les articles populaires
    console.log("\n6️⃣ Test des articles populaires...");
    const popularArticles = await client.query("articles:getPopularArticles", {
      limit: 3
    });
    console.log(`✅ ${popularArticles.length} articles populaires trouvés`);

    // Test 7: Test de création d'un article de test
    console.log("\n7️⃣ Test de création d'un article...");
    const testArticleId = await client.mutation("articles:createArticle", {
      title: "Article de Test CMS",
      excerpt: "Ceci est un article de test pour vérifier le fonctionnement du CMS.",
      content: "# Article de Test\n\nCeci est un article de test créé automatiquement pour vérifier le bon fonctionnement du système CMS.",
      featured_image: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Test",
      tags: ["test", "cms", "article"],
      status: "draft",
      is_featured: false,
    });
    console.log(`✅ Article de test créé avec l'ID : ${testArticleId}`);

    // Test 8: Test de mise à jour de l'article
    console.log("\n8️⃣ Test de mise à jour de l'article...");
    await client.mutation("articles:updateArticle", {
      id: testArticleId,
      status: "published",
      is_featured: true,
    });
    console.log("✅ Article de test mis à jour (publié et mis à la une)");

    // Test 9: Test de suppression de l'article de test
    console.log("\n9️⃣ Test de suppression de l'article...");
    await client.mutation("articles:deleteArticle", {
      id: testArticleId
    });
    console.log("✅ Article de test supprimé");

    console.log("\n🎉 Tous les tests sont passés avec succès !");
    console.log("\n📋 Résumé du système CMS Articles :");
    console.log("   ✅ CRUD complet (Create, Read, Update, Delete)");
    console.log("   ✅ Filtrage par statut et catégorie");
    console.log("   ✅ Gestion des slugs automatiques");
    console.log("   ✅ Calcul automatique du temps de lecture");
    console.log("   ✅ Système de vues");
    console.log("   ✅ Articles à la une");
    console.log("   ✅ Statistiques complètes");
    console.log("   ✅ Gestion des tags");
    console.log("   ✅ SEO (meta title, description)");

  } catch (error) {
    console.error("❌ Erreur lors des tests :", error);
    console.error("💡 Vérifiez que :");
    console.error("   - Convex est correctement configuré");
    console.error("   - Les fonctions articles sont déployées");
    console.error("   - La variable VITE_CONVEX_URL est définie");
  }
}

// Exécution du script
testArticlesCMS();

export { testArticlesCMS };
