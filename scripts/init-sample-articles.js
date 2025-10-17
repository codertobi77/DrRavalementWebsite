import { ConvexHttpClient } from "convex/browser";

// Configuration Convex
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://your-convex-deployment.convex.cloud";

const client = new ConvexHttpClient(CONVEX_URL);

// Articles d'exemple
const sampleArticles = [
  {
    title: "Comment choisir la finition de votre ravalement de façade ?",
    excerpt: "Découvrez les différentes finitions disponibles pour votre ravalement : grattée, talochée, lissée. Chaque finition a ses avantages selon votre style architectural.",
    content: `# Comment choisir la finition de votre ravalement de façade ?

Le choix de la finition de votre ravalement de façade est crucial pour l'esthétique et la durabilité de votre habitation. Voici un guide complet pour vous aider à faire le bon choix.

## Les différentes finitions disponibles

### 1. Finition grattée
La finition grattée est obtenue en grattant l'enduit frais avec une règle à gratter. Elle offre :
- Un aspect rustique et authentique
- Une excellente résistance aux intempéries
- Un entretien minimal

### 2. Finition talochée
La finition talochée est réalisée avec une taloche en bois ou en plastique. Elle présente :
- Un aspect lisse et moderne
- Une grande variété de textures possibles
- Une finition soignée et professionnelle

### 3. Finition lissée
La finition lissée est obtenue par lissage à la lisseuse. Elle offre :
- Un aspect très lisse et uniforme
- Une excellente résistance à la pollution
- Un entretien facile

## Comment choisir ?

Le choix de la finition dépend de plusieurs facteurs :
- Le style architectural de votre maison
- L'exposition aux intempéries
- Votre budget
- Vos préférences esthétiques

## Conclusion

Chaque finition a ses avantages. N'hésitez pas à demander conseil à nos experts pour faire le choix le plus adapté à votre projet.`,
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
    content: `# Les avantages de la projection machine pour vos façades

La projection machine est une technique moderne qui révolutionne le ravalement de façades. Cette méthode offre de nombreux avantages par rapport aux techniques traditionnelles.

## Qu'est-ce que la projection machine ?

La projection machine consiste à projeter l'enduit sur la façade à l'aide d'une machine spécialisée. Cette technique permet :
- Une application plus uniforme
- Un gain de temps considérable
- Une meilleure adhérence

## Les avantages principaux

### 1. Qualité supérieure
- Application uniforme sur toute la surface
- Absence de joints et de raccords visibles
- Finition impeccable

### 2. Rapidité d'exécution
- Réduction du temps de chantier de 50%
- Moins de main-d'œuvre nécessaire
- Délais respectés

### 3. Économies
- Réduction des coûts de main-d'œuvre
- Moins de gaspillage de matériaux
- Chantier plus court

## Conclusion

La projection machine est la solution moderne pour un ravalement de qualité. Contactez-nous pour plus d'informations.`,
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
    content: `# Isolation thermique par l'extérieur : guide complet

L'isolation thermique par l'extérieur (ITE) est une solution performante pour améliorer l'efficacité énergétique de votre habitation.

## Qu'est-ce que l'ITE ?

L'ITE consiste à isoler les murs extérieurs de votre maison en appliquant un isolant sur la façade, puis en le recouvrant d'un enduit décoratif.

## Les avantages de l'ITE

### 1. Performances énergétiques
- Réduction des déperditions thermiques
- Économies sur la facture de chauffage
- Confort thermique amélioré

### 2. Avantages techniques
- Suppression des ponts thermiques
- Protection de la structure
- Amélioration de l'étanchéité

### 3. Bénéfices esthétiques
- Rénovation complète de la façade
- Choix de finitions variées
- Valorisation du patrimoine

## Les matériaux d'isolation

- Polystyrène expansé
- Laine de roche
- Polyuréthane
- Fibre de bois

## Conclusion

L'ITE est un investissement rentable qui améliore le confort et réduit les coûts énergétiques.`,
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
    content: `# Quand faut-il rénover sa toiture ?

La toiture est l'élément le plus exposé de votre habitation. Savoir identifier les signes d'usure est essentiel pour éviter les dégâts.

## Les signes d'usure à surveiller

### 1. Signes visuels
- Tuiles cassées ou manquantes
- Décoloration ou mousse
- Déformation de la charpente
- Gouttières bouchées

### 2. Signes d'infiltration
- Taches d'humidité au plafond
- Odeurs de moisi
- Peinture qui s'écaille
- Isolation humide

## Les causes principales

- Vieillissement naturel
- Intempéries (vent, grêle, neige)
- Manque d'entretien
- Problèmes de ventilation

## Quand intervenir ?

Il est recommandé de rénover votre toiture :
- Tous les 20-30 ans
- Dès les premiers signes d'usure
- Après des intempéries importantes
- Avant la vente de votre bien

## Conclusion

Une toiture bien entretenue protège votre habitation. N'attendez pas les dégâts pour agir !`,
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
    content: `# Construction de murs en parpaing : les étapes clés

La construction de murs en parpaing nécessite une méthode rigoureuse pour garantir solidité et esthétique.

## Préparation du chantier

### 1. Fondations
- Creusement des fondations
- Mise en place du béton armé
- Contrôle de l'horizontalité
- Temps de séchage respecté

### 2. Préparation des matériaux
- Parpaings de qualité
- Mortier adapté
- Outils nécessaires
- Protection des matériaux

## Les étapes de construction

### 1. Premier rang
- Pose du premier rang de parpaings
- Contrôle de l'alignement
- Vérification de l'horizontalité
- Réglage si nécessaire

### 2. Rangs suivants
- Pose des rangs suivants
- Joints décalés
- Contrôle permanent
- Nettoyage des joints

### 3. Finitions
- Joints de finition
- Nettoyage de la surface
- Protection temporaire
- Contrôle final

## Conseils pratiques

- Respecter les temps de séchage
- Protéger du gel
- Contrôler régulièrement
- Utiliser des matériaux de qualité

## Conclusion

Une construction soignée garantit la durabilité de votre mur. Faites appel à des professionnels pour un résultat optimal.`,
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
    content: `# Entretien de façade : conseils pour préserver votre investissement

L'entretien régulier de votre façade est essentiel pour préserver votre investissement et maintenir l'esthétique de votre habitation.

## Pourquoi entretenir sa façade ?

### 1. Protection de l'investissement
- Préservation de la valeur du bien
- Éviter les réparations coûteuses
- Maintien de l'esthétique
- Conformité réglementaire

### 2. Prévention des dégâts
- Éviter les infiltrations
- Prévenir les fissures
- Limiter l'usure prématurée
- Maintenir l'isolation

## Les opérations d'entretien

### 1. Nettoyage régulier
- Lavage à l'eau claire
- Détartrage des joints
- Nettoyage des gouttières
- Élimination de la végétation

### 2. Contrôles périodiques
- Inspection visuelle
- Détection des fissures
- Vérification de l'étanchéité
- Contrôle des joints

### 3. Réparations mineures
- Rejointoiement
- Réparation des fissures
- Remplacement des éléments défectueux
- Application de produits protecteurs

## Fréquence recommandée

- Nettoyage : 1 à 2 fois par an
- Contrôle : tous les 6 mois
- Réparation : selon les besoins
- Rénovation : tous les 10-15 ans

## Conclusion

Un entretien régulier est un investissement rentable qui préserve votre patrimoine.`,
    featured_image: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "Entretien",
    tags: ["entretien", "façade", "maintenance", "prévention"],
    status: "published",
    is_featured: false,
    meta_title: "Entretien façade : conseils pour préserver votre investissement",
    meta_description: "Conseils d'experts pour l'entretien de votre façade : nettoyage, contrôles et réparations pour préserver votre investissement."
  }
];

async function initSampleArticles() {
  console.log("🚀 Initialisation des articles d'exemple...");

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < sampleArticles.length; i++) {
    const article = sampleArticles[i];
    console.log(`\n📝 Création de l'article ${i + 1}/${sampleArticles.length} : ${article.title}`);
    
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
      
      // Continuer avec l'article suivant
      continue;
    }
  }

  console.log(`\n📊 Résumé :`);
  console.log(`   ✅ Articles créés : ${successCount}`);
  console.log(`   ❌ Erreurs : ${errorCount}`);
  
  if (successCount > 0) {
    console.log("🎉 Initialisation terminée avec succès !");
  } else {
    console.log("❌ Aucun article n'a pu être créé");
  }
}

// Exécution du script
initSampleArticles();

export { initSampleArticles, sampleArticles };
