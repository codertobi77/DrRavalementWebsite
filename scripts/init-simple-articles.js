import { ConvexHttpClient } from "convex/browser";
import { readFileSync } from 'fs';
import { join } from 'path';

console.log("🚀 Initialisation d'articles simplifiés...\n");

// Lire la configuration
const envPath = join(process.cwd(), '.env');
const envContent = readFileSync(envPath, 'utf8');
const convexUrlMatch = envContent.match(/VITE_CONVEX_URL=(.+)/);
const convexUrl = convexUrlMatch ? convexUrlMatch[1].trim() : null;

const client = new ConvexHttpClient(convexUrl);

// Articles simplifiés
const simpleArticles = [
  {
    title: "Comment choisir la finition de votre ravalement de façade ?",
    excerpt: "Découvrez les différentes finitions disponibles pour votre ravalement : grattée, talochée, lissée. Chaque finition a ses avantages selon votre style architectural.",
    content: "# Comment choisir la finition de votre ravalement de façade ?\n\nLe choix de la finition de votre ravalement de façade est crucial pour l'esthétique et la durabilité de votre habitation.\n\n## Les différentes finitions disponibles\n\n### 1. Finition grattée\nLa finition grattée est obtenue en grattant l'enduit frais avec une règle à gratter.\n\n### 2. Finition talochée\nLa finition talochée est réalisée avec une taloche en bois ou en plastique.\n\n### 3. Finition lissée\nLa finition lissée est obtenue par lissage à la lisseuse.\n\n## Comment choisir ?\n\nLe choix de la finition dépend de plusieurs facteurs :\n- Le style architectural de votre maison\n- L'exposition aux intempéries\n- Votre budget\n- Vos préférences esthétiques\n\n## Conclusion\n\nChaque finition a ses avantages. N'hésitez pas à demander conseil à nos experts pour faire le choix le plus adapté à votre projet.",
    featured_image: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "Ravalement",
    tags: ["ravalement", "finition", "façade", "enduit"],
    status: "published",
    is_featured: true,
    meta_title: "Finition ravalement façade : guide complet pour choisir",
    meta_description: "Découvrez comment choisir la finition de votre ravalement de façade : grattée, talochée ou lissée. Guide complet avec conseils d'experts."
  },
  {
    title: "Les avantages de la projection machine pour vos façades",
    excerpt: "La technique de projection machine révolutionne le ravalement de façades. Découvrez pourquoi cette méthode moderne offre un rendu supérieur.",
    content: "# Les avantages de la projection machine pour vos façades\n\nLa projection machine est une technique moderne qui révolutionne le ravalement de façades.\n\n## Qu'est-ce que la projection machine ?\n\nLa projection machine consiste à projeter l'enduit sur la façade à l'aide d'une machine spécialisée.\n\n## Les avantages principaux\n\n### 1. Qualité supérieure\n- Application uniforme sur toute la surface\n- Absence de joints et de raccords visibles\n- Finition impeccable\n\n### 2. Rapidité d'exécution\n- Réduction du temps de chantier de 50%\n- Moins de main-d'œuvre nécessaire\n- Délais respectés\n\n### 3. Économies\n- Réduction des coûts de main-d'œuvre\n- Moins de gaspillage de matériaux\n- Chantier plus court\n\n## Conclusion\n\nLa projection machine est la solution moderne pour un ravalement de qualité.",
    featured_image: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "Techniques",
    tags: ["projection", "machine", "technique", "ravalement"],
    status: "published",
    is_featured: false,
    meta_title: "Projection machine façade : avantages et techniques",
    meta_description: "Découvrez les avantages de la projection machine pour le ravalement de façades : qualité, rapidité et économies garanties."
  },
  {
    title: "Isolation thermique par l'extérieur : guide complet",
    excerpt: "L'ITE améliore considérablement les performances énergétiques de votre habitat. Tout ce qu'il faut savoir sur cette solution d'isolation.",
    content: "# Isolation thermique par l'extérieur : guide complet\n\nL'isolation thermique par l'extérieur (ITE) est une solution performante pour améliorer l'efficacité énergétique de votre habitation.\n\n## Qu'est-ce que l'ITE ?\n\nL'ITE consiste à isoler les murs extérieurs de votre maison en appliquant un isolant sur la façade, puis en le recouvrant d'un enduit décoratif.\n\n## Les avantages de l'ITE\n\n### 1. Performances énergétiques\n- Réduction des déperditions thermiques\n- Économies sur la facture de chauffage\n- Confort thermique amélioré\n\n### 2. Avantages techniques\n- Suppression des ponts thermiques\n- Protection de la structure\n- Amélioration de l'étanchéité\n\n### 3. Bénéfices esthétiques\n- Rénovation complète de la façade\n- Choix de finitions variées\n- Valorisation du patrimoine\n\n## Conclusion\n\nL'ITE est un investissement rentable qui améliore le confort et réduit les coûts énergétiques.",
    featured_image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "Isolation",
    tags: ["isolation", "ITE", "thermique", "énergie"],
    status: "published",
    is_featured: false,
    meta_title: "Isolation thermique extérieure : guide complet ITE",
    meta_description: "Guide complet sur l'isolation thermique par l'extérieur (ITE) : avantages, matériaux et techniques pour améliorer l'efficacité énergétique."
  },
  {
    title: "Quand faut-il rénover sa toiture ?",
    excerpt: "Signes d'usure, infiltrations, tuiles cassées... Apprenez à identifier les signaux qui indiquent qu'il est temps de rénover votre toiture.",
    content: "# Quand faut-il rénover sa toiture ?\n\nLa toiture est l'élément le plus exposé de votre habitation. Savoir identifier les signes d'usure est essentiel pour éviter les dégâts.\n\n## Les signes d'usure à surveiller\n\n### 1. Signes visuels\n- Tuiles cassées ou manquantes\n- Décoloration ou mousse\n- Déformation de la charpente\n- Gouttières bouchées\n\n### 2. Signes d'infiltration\n- Taches d'humidité au plafond\n- Odeurs de moisi\n- Peinture qui s'écaille\n- Isolation humide\n\n## Les causes principales\n\n- Vieillissement naturel\n- Intempéries (vent, grêle, neige)\n- Manque d'entretien\n- Problèmes de ventilation\n\n## Quand intervenir ?\n\nIl est recommandé de rénover votre toiture :\n- Tous les 20-30 ans\n- Dès les premiers signes d'usure\n- Après des intempéries importantes\n- Avant la vente de votre bien\n\n## Conclusion\n\nUne toiture bien entretenue protège votre habitation. N'attendez pas les dégâts pour agir !",
    featured_image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "Couverture",
    tags: ["toiture", "rénovation", "entretien", "infiltration"],
    status: "published",
    is_featured: false,
    meta_title: "Rénovation toiture : quand et comment intervenir",
    meta_description: "Apprenez à identifier les signes d'usure de votre toiture et découvrez quand il est temps de rénover pour éviter les dégâts."
  },
  {
    title: "Construction de murs en parpaing : les étapes clés",
    excerpt: "De la préparation des fondations à la finition, découvrez toutes les étapes pour construire un mur en parpaing durable et esthétique.",
    content: "# Construction de murs en parpaing : les étapes clés\n\nLa construction de murs en parpaing nécessite une méthode rigoureuse pour garantir solidité et esthétique.\n\n## Préparation du chantier\n\n### 1. Fondations\n- Creusement des fondations\n- Mise en place du béton armé\n- Contrôle de l'horizontalité\n- Temps de séchage respecté\n\n### 2. Préparation des matériaux\n- Parpaings de qualité\n- Mortier adapté\n- Outils nécessaires\n- Protection des matériaux\n\n## Les étapes de construction\n\n### 1. Premier rang\n- Pose du premier rang de parpaings\n- Contrôle de l'alignement\n- Vérification de l'horizontalité\n- Réglage si nécessaire\n\n### 2. Rangs suivants\n- Pose des rangs suivants\n- Joints décalés\n- Contrôle permanent\n- Nettoyage des joints\n\n### 3. Finitions\n- Joints de finition\n- Nettoyage de la surface\n- Protection temporaire\n- Contrôle final\n\n## Conclusion\n\nUne construction soignée garantit la durabilité de votre mur. Faites appel à des professionnels pour un résultat optimal.",
    featured_image: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "Maçonnerie",
    tags: ["parpaing", "construction", "mur", "maçonnerie"],
    status: "published",
    is_featured: false,
    meta_title: "Construction mur parpaing : étapes et conseils",
    meta_description: "Guide complet pour construire un mur en parpaing : étapes, conseils pratiques et techniques pour un résultat durable."
  },
  {
    title: "Entretien de façade : conseils pour préserver votre investissement",
    excerpt: "Un entretien régulier prolonge la durée de vie de votre façade. Nos conseils d'experts pour maintenir l'éclat de vos murs extérieurs.",
    content: "# Entretien de façade : conseils pour préserver votre investissement\n\nL'entretien régulier de votre façade est essentiel pour préserver votre investissement et maintenir l'esthétique de votre habitation.\n\n## Pourquoi entretenir sa façade ?\n\n### 1. Protection de l'investissement\n- Préservation de la valeur du bien\n- Éviter les réparations coûteuses\n- Maintien de l'esthétique\n- Conformité réglementaire\n\n### 2. Prévention des dégâts\n- Éviter les infiltrations\n- Prévenir les fissures\n- Limiter l'usure prématurée\n- Maintenir l'isolation\n\n## Les opérations d'entretien\n\n### 1. Nettoyage régulier\n- Lavage à l'eau claire\n- Détartrage des joints\n- Nettoyage des gouttières\n- Élimination de la végétation\n\n### 2. Contrôles périodiques\n- Inspection visuelle\n- Détection des fissures\n- Vérification de l'étanchéité\n- Contrôle des joints\n\n### 3. Réparations mineures\n- Rejointoiement\n- Réparation des fissures\n- Remplacement des éléments défectueux\n- Application de produits protecteurs\n\n## Conclusion\n\nUn entretien régulier est un investissement rentable qui préserve votre patrimoine.",
    featured_image: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "Entretien",
    tags: ["entretien", "façade", "maintenance", "prévention"],
    status: "published",
    is_featured: false,
    meta_title: "Entretien façade : conseils pour préserver votre investissement",
    meta_description: "Conseils d'experts pour l'entretien de votre façade : nettoyage, contrôles et réparations pour préserver votre investissement."
  }
];

async function initSimpleArticles() {
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < simpleArticles.length; i++) {
    const article = simpleArticles[i];
    console.log(`\n📝 Création de l'article ${i + 1}/${simpleArticles.length} : ${article.title}`);
    
    try {
      const articleId = await client.mutation("articles:createArticle", {
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
      
      console.log(`✅ Article créé avec succès (ID: ${articleId})`);
      successCount++;
      
    } catch (error) {
      console.error(`❌ Erreur lors de la création de l'article "${article.title}" :`, error.message);
      errorCount++;
      continue;
    }
  }

  console.log(`\n📊 Résumé :`);
  console.log(`   ✅ Articles créés : ${successCount}`);
  console.log(`   ❌ Erreurs : ${errorCount}`);
  
  if (successCount > 0) {
    console.log("🎉 Initialisation terminée avec succès !");
    console.log("🚀 Vous pouvez maintenant :");
    console.log("   - Visiter /blog pour voir les articles");
    console.log("   - Aller sur /admin/articles pour les gérer");
  } else {
    console.log("❌ Aucun article n'a pu être créé");
  }
}

initSimpleArticles();
