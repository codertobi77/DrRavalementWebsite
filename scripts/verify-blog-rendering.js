import { ConvexHttpClient } from "convex/browser";
import { readFileSync, existsSync } from 'fs';

console.log("🔍 Vérification du rendu des articles sur la page blog...\n");

async function verifyBlogRendering() {
  try {
    // Vérifier la configuration Convex
    const envPath = '.env';
    if (!existsSync(envPath)) {
      console.log("❌ Fichier .env non trouvé");
      return;
    }

    const envContent = readFileSync(envPath, 'utf8');
    const convexUrlMatch = envContent.match(/VITE_CONVEX_URL=(.+)/);
    const convexUrl = convexUrlMatch ? convexUrlMatch[1].trim() : null;

    if (!convexUrl || convexUrl.includes('your-convex-deployment')) {
      console.log("❌ URL Convex non configurée dans .env");
      return;
    }

    console.log("✅ Configuration Convex trouvée");

    // Connexion à Convex
    const client = new ConvexHttpClient(convexUrl);
    console.log("✅ Connexion à Convex établie");

    // Récupérer les articles publiés
    console.log("\n📖 Récupération des articles publiés...");
    const articles = await client.query("articles:getArticles", { 
      status: 'published',
      limit: 10 
    });
    console.log(`✅ ${articles.length} articles publiés trouvés`);

    if (articles.length === 0) {
      console.log("ℹ️  Aucun article publié trouvé");
      return;
    }

    // Analyser le contenu des articles
    console.log("\n🔍 Analyse du contenu des articles...");
    let validHtmlCount = 0;
    let invalidContentCount = 0;
    let emptyContentCount = 0;

    for (const article of articles) {
      console.log(`\n📄 Article: "${article.title}"`);
      console.log(`   • ID: ${article._id}`);
      console.log(`   • Catégorie: ${article.category}`);
      console.log(`   • Statut: ${article.status}`);
      console.log(`   • Vues: ${article.view_count}`);
      
      if (!article.content || article.content.trim() === '') {
        console.log(`   ❌ Contenu vide`);
        emptyContentCount++;
        continue;
      }

      // Vérifier si le contenu est du HTML valide
      const hasHtmlTags = article.content.includes('<') && article.content.includes('>');
      const hasValidStructure = article.content.includes('<p') || 
                               article.content.includes('<h1') || 
                               article.content.includes('<h2') || 
                               article.content.includes('<h3') ||
                               article.content.includes('<ul') ||
                               article.content.includes('<ol');

      if (hasHtmlTags && hasValidStructure) {
        console.log(`   ✅ Contenu HTML valide`);
        validHtmlCount++;
        
        // Afficher un extrait du contenu
        const excerpt = article.content.substring(0, 200) + '...';
        console.log(`   📝 Extrait: ${excerpt.replace(/\n/g, ' ')}`);
      } else {
        console.log(`   ⚠️  Contenu non-HTML ou structure invalide`);
        console.log(`   📝 Contenu: ${article.content.substring(0, 100)}...`);
        invalidContentCount++;
      }
    }

    // Vérifier les composants de rendu
    console.log("\n🔧 Vérification des composants de rendu...");
    
    // Vérifier FormattedContent
    const formattedContentPath = 'src/components/blog/FormattedContent.tsx';
    if (existsSync(formattedContentPath)) {
      const formattedContent = readFileSync(formattedContentPath, 'utf8');
      if (formattedContent.includes('dangerouslySetInnerHTML')) {
        console.log("✅ FormattedContent utilise dangerouslySetInnerHTML");
      } else {
        console.log("❌ FormattedContent n'utilise pas dangerouslySetInnerHTML");
      }
    } else {
      console.log("❌ FormattedContent.tsx non trouvé");
    }

    // Vérifier ArticleModal
    const articleModalPath = 'src/components/blog/ArticleModal.tsx';
    if (existsSync(articleModalPath)) {
      const articleModal = readFileSync(articleModalPath, 'utf8');
      if (articleModal.includes('FormattedContent')) {
        console.log("✅ ArticleModal utilise FormattedContent");
      } else {
        console.log("❌ ArticleModal n'utilise pas FormattedContent");
      }
    } else {
      console.log("❌ ArticleModal.tsx non trouvé");
    }

    // Vérifier la page blog
    const blogPagePath = 'src/pages/blog/page.tsx';
    if (existsSync(blogPagePath)) {
      const blogPage = readFileSync(blogPagePath, 'utf8');
      if (blogPage.includes('ArticleModal')) {
        console.log("✅ Page blog utilise ArticleModal");
      } else {
        console.log("❌ Page blog n'utilise pas ArticleModal");
      }
    } else {
      console.log("❌ Page blog non trouvée");
    }

    // Résumé
    console.log("\n📊 Résumé de la vérification :");
    console.log(`   • Articles analysés : ${articles.length}`);
    console.log(`   • Contenu HTML valide : ${validHtmlCount}`);
    console.log(`   • Contenu invalide : ${invalidContentCount}`);
    console.log(`   • Contenu vide : ${emptyContentCount}`);

    if (validHtmlCount > 0) {
      console.log("\n✅ Le rendu des articles devrait fonctionner correctement !");
      console.log("💡 Pour tester :");
      console.log("   1. Démarrez le serveur : npm run dev");
      console.log("   2. Allez sur http://localhost:3000/blog");
      console.log("   3. Cliquez sur 'Lire l'Article' pour voir le contenu HTML");
    } else {
      console.log("\n⚠️  Aucun article avec contenu HTML valide trouvé");
      console.log("💡 Exécutez d'abord : node scripts/convert-markdown-to-html.js");
    }

  } catch (error) {
    console.error("❌ Erreur lors de la vérification :", error.message);
  }
}

// Exécuter la vérification
verifyBlogRendering();
