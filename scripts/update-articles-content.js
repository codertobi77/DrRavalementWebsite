import { ConvexHttpClient } from "convex/browser";
import { readFileSync, existsSync } from 'fs';

console.log("🚀 Mise à jour du contenu des articles...\n");

// Fonction de conversion markdown vers HTML
function markdownToHtml(markdown) {
  if (!markdown) return '';
  
  let html = markdown;
  
  // Titres
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-4 leading-tight">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold text-gray-900 mb-4 mt-6 leading-tight">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold text-gray-900 mb-6 mt-8 leading-tight">$1</h1>');
  
  // Formatage de texte
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  html = html.replace(/~~(.*?)~~/g, '<s class="line-through">$1</s>');
  html = html.replace(/__(.*?)__/g, '<u class="underline">$1</u>');
  
  // Listes à puces
  html = html.replace(/^\* (.*$)/gim, '<li class="mb-2 text-gray-700 leading-relaxed">$1</li>');
  html = html.replace(/^- (.*$)/gim, '<li class="mb-2 text-gray-700 leading-relaxed">$1</li>');
  
  // Listes numérotées
  html = html.replace(/^\d+\. (.*$)/gim, '<li class="mb-2 text-gray-700 leading-relaxed">$1</li>');
  
  // Wrapper pour les listes
  html = html.replace(/(<li class="mb-2 text-gray-700 leading-relaxed">.*<\/li>)/gs, (match) => {
    if (match.includes('<ul') || match.includes('<ol')) {
      return match;
    }
    return `<ul class="mb-4 pl-6 list-disc list-inside">${match}</ul>`;
  });
  
  // Paragraphes
  html = html.replace(/^(?!<[h|u|o])(.*)$/gim, (match) => {
    if (match.trim() === '' || match.includes('<')) {
      return match;
    }
    return `<p class="mb-4 text-gray-700 leading-relaxed">${match}</p>`;
  });
  
  // Nettoyer les listes dupliquées
  html = html.replace(/<ul class="mb-4 pl-6 list-disc list-inside"><ul class="mb-4 pl-6 list-disc list-inside">/g, '<ul class="mb-4 pl-6 list-disc list-inside">');
  html = html.replace(/<\/ul><\/ul>/g, '</ul>');
  
  // Nettoyer les paragraphes vides
  html = html.replace(/<p class="mb-4 text-gray-700 leading-relaxed"><\/p>/g, '');
  
  return html;
}

async function updateArticlesContent() {
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
      console.log("💡 Configurez VITE_CONVEX_URL dans le fichier .env");
      return;
    }

    console.log("✅ Configuration Convex trouvée");
    console.log(`🔗 URL: ${convexUrl}`);

    // Connexion à Convex
    const client = new ConvexHttpClient(convexUrl);
    console.log("✅ Connexion à Convex établie");

    // Récupérer tous les articles
    console.log("\n📖 Récupération des articles...");
    const articles = await client.query("articles:getArticles", {});
    console.log(`✅ ${articles.length} articles trouvés`);

    if (articles.length === 0) {
      console.log("ℹ️  Aucun article à traiter");
      return;
    }

    // Analyser les articles
    console.log("\n🔍 Analyse des articles...");
    let markdownArticles = 0;
    let htmlArticles = 0;
    let emptyArticles = 0;

    for (const article of articles) {
      if (!article.content || article.content.trim() === '') {
        emptyArticles++;
      } else if (article.content.includes('<') && article.content.includes('>')) {
        htmlArticles++;
      } else {
        markdownArticles++;
      }
    }

    console.log(`📊 Analyse des articles :`);
    console.log(`   • Articles vides : ${emptyArticles}`);
    console.log(`   • Articles HTML : ${htmlArticles}`);
    console.log(`   • Articles Markdown : ${markdownArticles}`);

    if (markdownArticles === 0) {
      console.log("ℹ️  Aucun article markdown à convertir");
      console.log("✅ Tous les articles sont déjà en HTML");
      return;
    }

    // Convertir les articles markdown
    console.log(`\n🔄 Conversion de ${markdownArticles} articles...`);
    let convertedCount = 0;
    let errorCount = 0;

    for (const article of articles) {
      if (!article.content || article.content.trim() === '') {
        continue;
      }

      // Vérifier si c'est du markdown (pas de balises HTML)
      if (!article.content.includes('<') || !article.content.includes('>')) {
        try {
          console.log(`\n📄 Conversion de "${article.title}"...`);
          
          const originalContent = article.content;
          const htmlContent = markdownToHtml(article.content);
          
          console.log(`   • Contenu original (${originalContent.length} chars): ${originalContent.substring(0, 100)}...`);
          console.log(`   • Contenu HTML (${htmlContent.length} chars): ${htmlContent.substring(0, 100)}...`);
          
          // Mettre à jour l'article
          await client.mutation("articles:updateArticle", {
            id: article._id,
            title: article.title,
            excerpt: article.excerpt,
            content: htmlContent,
            featured_image: article.featured_image,
            meta_title: article.meta_title,
            meta_description: article.meta_description,
            category: article.category,
            tags: article.tags,
            status: article.status,
            is_featured: article.is_featured,
          });

          console.log(`   ✅ Article converti avec succès`);
          convertedCount++;
        } catch (error) {
          console.log(`   ❌ Erreur lors de la conversion : ${error.message}`);
          errorCount++;
        }
      }
    }

    console.log(`\n🎉 Conversion terminée !`);
    console.log(`📊 Résultats :`);
    console.log(`   • Articles convertis : ${convertedCount}`);
    console.log(`   • Erreurs : ${errorCount}`);
    console.log(`   • Total traité : ${convertedCount + errorCount}`);

    // Vérifier la conversion
    console.log(`\n🔍 Vérification de la conversion...`);
    const updatedArticles = await client.query("articles:getArticles", {});
    let newHtmlCount = 0;

    for (const article of updatedArticles) {
      if (article.content && article.content.includes('<') && article.content.includes('>')) {
        newHtmlCount++;
      }
    }

    console.log(`✅ ${newHtmlCount} articles avec contenu HTML après conversion`);

    // Vérifier le rendu sur la page blog
    console.log(`\n🔍 Vérification du rendu sur la page blog...`);
    
    // Vérifier les composants
    const components = [
      'src/components/blog/FormattedContent.tsx',
      'src/components/blog/ArticleModal.tsx',
      'src/pages/blog/page.tsx'
    ];

    let componentsValid = 0;
    for (const component of components) {
      if (existsSync(component)) {
        console.log(`✅ ${component} existe`);
        componentsValid++;
      } else {
        console.log(`❌ ${component} manquant`);
      }
    }

    if (componentsValid === components.length) {
      console.log("✅ Tous les composants de rendu sont présents");
    } else {
      console.log("⚠️  Certains composants de rendu sont manquants");
    }

    console.log(`\n🚀 Mise à jour terminée !`);
    console.log(`💡 Pour tester le rendu :`);
    console.log(`   1. Démarrez le serveur : npm run dev`);
    console.log(`   2. Allez sur http://localhost:3000/blog`);
    console.log(`   3. Cliquez sur 'Lire l'Article' pour voir le contenu HTML`);

  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour :", error.message);
  }
}

// Exécuter la mise à jour
updateArticlesContent();
