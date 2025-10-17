import { ConvexHttpClient } from "convex/browser";
import { readFileSync, existsSync } from 'fs';

console.log("📰 Ajout d'articles d'actualités...\n");

// Articles d'actualités à ajouter
const newsArticles = [
  {
    title: "Réglementation thermique 2024 : les nouvelles normes pour vos travaux",
    excerpt: "Découvrez les nouvelles normes thermiques qui entrent en vigueur en 2024 et leurs implications pour vos projets de rénovation énergétique.",
    content: `
      <h1>Nouvelle réglementation thermique 2024 : ce qui change pour vos travaux</h1>
      
      <p>La réglementation thermique évolue constamment pour s'adapter aux enjeux environnementaux et énergétiques. En 2024, de nouvelles normes entrent en vigueur qui impacteront directement vos projets de rénovation.</p>
      
      <h2>Les principales nouveautés</h2>
      
      <p>Parmi les changements majeurs, on note :</p>
      
      <ul>
        <li>Renforcement des exigences d'isolation thermique</li>
        <li>Nouveaux critères de performance énergétique</li>
        <li>Obligations renforcées pour les bâtiments existants</li>
        <li>Nouvelles aides financières disponibles</li>
      </ul>
      
      <h2>Impact sur vos projets</h2>
      
      <p>Ces nouvelles réglementations nécessitent une approche plus rigoureuse dans la planification de vos travaux. Nos experts sont formés aux dernières normes et peuvent vous accompagner dans vos démarches.</p>
      
      <p>N'hésitez pas à nous contacter pour un conseil personnalisé sur l'impact de ces nouvelles réglementations sur votre projet.</p>
    `,
    featured_image: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "Actualités",
    tags: ["réglementation", "thermique", "2024", "rénovation"],
    status: "published",
    is_featured: true,
    meta_title: "Réglementation thermique 2024 - DR RAVALEMENT",
    meta_description: "Découvrez les nouvelles normes thermiques 2024 et leurs impacts sur vos projets de rénovation énergétique."
  },
  {
    title: "DR RAVALEMENT certifié Qualibat RGE : qualité garantie",
    excerpt: "Nous sommes fiers d'annoncer l'obtention de la certification Qualibat RGE, garantissant la qualité de nos prestations et l'éligibilité aux aides financières.",
    content: `
      <h1>DR RAVALEMENT obtient la certification Qualibat RGE</h1>
      
      <p>Nous avons le plaisir de vous annoncer que DR RAVALEMENT a obtenu la certification Qualibat RGE (Reconnu Garant de l'Environnement). Cette certification atteste de notre expertise et de notre engagement en faveur de la qualité.</p>
      
      <h2>Qu'est-ce que la certification RGE ?</h2>
      
      <p>La certification RGE est un label de qualité qui garantit :</p>
      
      <ul>
        <li>La compétence technique de nos équipes</li>
        <li>Le respect des normes de qualité</li>
        <li>L'éligibilité aux aides financières (MaPrimeRénov', CEE, etc.)</li>
        <li>La traçabilité de nos interventions</li>
      </ul>
      
      <h2>Avantages pour nos clients</h2>
      
      <p>Cette certification vous permet de bénéficier de :</p>
      
      <ul>
        <li>Réductions d'impôts sur les travaux de rénovation énergétique</li>
        <li>Primes de l'État pour vos projets d'isolation</li>
        <li>Garantie de qualité sur nos prestations</li>
        <li>Accompagnement dans vos démarches administratives</li>
      </ul>
      
      <p>Contactez-nous pour découvrir comment cette certification peut vous faire économiser sur vos travaux de rénovation !</p>
    `,
    featured_image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "Actualités",
    tags: ["certification", "RGE", "qualité", "aides financières"],
    status: "published",
    is_featured: false,
    meta_title: "Certification RGE Qualibat - DR RAVALEMENT",
    meta_description: "DR RAVALEMENT obtient la certification Qualibat RGE pour garantir la qualité de ses prestations et l'éligibilité aux aides financières."
  },
  {
    title: "Matériaux écologiques innovants pour la rénovation durable",
    excerpt: "Découvrez les dernières innovations en matière de matériaux écologiques pour vos projets de rénovation durable et respectueuse de l'environnement.",
    content: `
      <h1>Nouveaux matériaux écologiques : l'avenir de la rénovation</h1>
      
      <p>L'innovation dans le secteur de la rénovation ne cesse de progresser. De nouveaux matériaux écologiques voient le jour, offrant des performances exceptionnelles tout en respectant l'environnement.</p>
      
      <h2>Les matériaux d'avenir</h2>
      
      <p>Parmi les innovations les plus prometteuses :</p>
      
      <ul>
        <li>Isolants biosourcés (fibres de bois, chanvre, lin)</li>
        <li>Enduits à base de terre crue</li>
        <li>Peintures naturelles sans COV</li>
        <li>Matériaux recyclés et recyclables</li>
      </ul>
      
      <h2>Avantages des matériaux écologiques</h2>
      
      <p>Ces nouveaux matériaux présentent de nombreux avantages :</p>
      
      <ul>
        <li>Réduction de l'empreinte carbone</li>
        <li>Amélioration de la qualité de l'air intérieur</li>
        <li>Performances thermiques et acoustiques optimisées</li>
        <li>Durabilité accrue</li>
      </ul>
      
      <h2>Notre engagement</h2>
      
      <p>Chez DR RAVALEMENT, nous nous engageons à vous proposer les solutions les plus respectueuses de l'environnement. Nous nous formons continuellement aux nouvelles techniques et matériaux pour vous offrir des prestations de qualité.</p>
      
      <p>Découvrez nos solutions écologiques lors de votre prochain projet de rénovation !</p>
    `,
    featured_image: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1200",
    category: "Actualités",
    tags: ["écologie", "matériaux", "innovation", "durabilité"],
    status: "published",
    is_featured: false,
    meta_title: "Matériaux écologiques pour rénovation - DR RAVALEMENT",
    meta_description: "Découvrez les nouveaux matériaux écologiques pour vos projets de rénovation durable avec DR RAVALEMENT."
  }
];

async function addNewsArticles() {
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

    // Ajouter les articles d'actualités
    console.log(`\n📰 Ajout de ${newsArticles.length} articles d'actualités...`);
    let addedCount = 0;
    let errorCount = 0;

    for (const article of newsArticles) {
      try {
        console.log(`\n📄 Ajout de "${article.title}"...`);
        
        await client.mutation("articles:createArticle", {
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          featured_image: article.featured_image,
          meta_title: article.meta_title,
          meta_description: article.meta_description,
          category: article.category,
          tags: article.tags,
          status: article.status,
          is_featured: article.is_featured,
        });

        console.log(`   ✅ Article ajouté avec succès`);
        addedCount++;
      } catch (error) {
        console.log(`   ❌ Erreur lors de l'ajout : ${error.message}`);
        errorCount++;
      }
    }

    console.log(`\n🎉 Ajout des articles terminé !`);
    console.log(`📊 Résultats :`);
    console.log(`   • Articles ajoutés : ${addedCount}`);
    console.log(`   • Erreurs : ${errorCount}`);
    console.log(`   • Total traité : ${addedCount + errorCount}`);

    // Vérifier les catégories disponibles
    console.log(`\n🔍 Vérification des catégories...`);
    const categories = await client.query("articles:getArticleCategories");
    console.log(`✅ Catégories disponibles : ${categories.join(', ')}`);

    // Vérifier les articles d'actualités
    console.log(`\n📰 Vérification des articles d'actualités...`);
    const actualitesArticles = await client.query("articles:getArticles", { 
      category: "Actualités",
      status: "published"
    });
    console.log(`✅ ${actualitesArticles.length} articles d'actualités trouvés`);

  } catch (error) {
    console.error("❌ Erreur lors de l'ajout des articles :", error.message);
  }
}

// Exécuter l'ajout des articles
addNewsArticles();
