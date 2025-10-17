
import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel.d.ts';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import ArticleModal from '../../components/blog/ArticleModal';

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedArticleId, setSelectedArticleId] = useState<Id<"articles"> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Récupérer les articles publiés
  const articles = useQuery(api.articles.getArticles, {
    status: 'published',
    limit: 10
  });

  // Récupérer les catégories
  const categoriesData = useQuery(api.articles.getArticleCategories);

  // Préparer les catégories avec "Tous" en premier, puis les catégories de la base de données
  const categories = ['Tous', ...(categoriesData || [])];

  // Filtrer les articles par catégorie
  const filteredArticles = articles?.filter(article => 
    selectedCategory === 'Tous' || 
    (selectedCategory === 'Actualités' && article.category === 'Actualités') ||
    (selectedCategory !== 'Actualités' && article.category === selectedCategory)
  ) || [];

  // Article à la une (premier article filtré ou article featured)
  const featuredArticle = filteredArticles?.find(article => article.is_featured) || filteredArticles?.[0];
  const otherArticles = filteredArticles?.filter(article => article._id !== featuredArticle?._id) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Fonction pour ouvrir le modal avec un article
  const openArticleModal = (articleId: Id<"articles">) => {
    setSelectedArticleId(articleId);
    setIsModalOpen(true);
  };

  // Fonction pour fermer le modal
  const closeArticleModal = () => {
    setIsModalOpen(false);
    setSelectedArticleId(null);
  };

  // État de chargement
  if (!articles || !categoriesData) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-orange-900 via-orange-800 to-red-900">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Blog <span className="text-orange-400">DR RAVALEMENT</span>
              </h1>
              <p className="text-large text-orange-100 max-w-3xl mx-auto">
                Conseils d'experts, actualités et guides pratiques pour tous vos projets de ravalement et rénovation
              </p>
            </div>
          </div>
        </section>

        {/* Catégories */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 text-small ${
                    selectedCategory === category
                      ? 'bg-orange-600 text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-700 hover:bg-orange-100 hover:text-orange-600 hover:shadow-md'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Article Principal */}
        {featuredArticle && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
                <div>
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedCategory === 'Tous' ? 'Article à la Une' : `Article ${selectedCategory}`}
                  </span>
                  <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-6">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="text-orange-600 font-medium">{featuredArticle.category}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">
                      {featuredArticle.published_at ? formatDate(featuredArticle.published_at) : 'Non publié'}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{featuredArticle.read_time} min de lecture</span>
                  </div>
                  <button 
                    onClick={() => openArticleModal(featuredArticle._id)}
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors whitespace-nowrap"
                  >
                    Lire l'Article
                  </button>
                </div>
                <div className="relative">
                  <img 
                    src={featuredArticle.featured_image} 
                    alt={featuredArticle.title}
                    className="rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Grille d'Articles - Affichée seulement s'il y a d'autres articles */}
        {otherArticles.length > 0 && (
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  {selectedCategory === 'Tous' ? 'Derniers Articles' : `Articles ${selectedCategory}`}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {selectedCategory === 'Tous' 
                    ? "Restez informé des dernières tendances et techniques en ravalement et rénovation"
                    : selectedCategory === 'Actualités'
                    ? "Découvrez nos dernières actualités et conseils d'experts"
                    : `Découvrez tous nos articles sur le thème ${selectedCategory.toLowerCase()}`
                  }
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherArticles.map((article) => (
                  <article key={article._id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={article.featured_image} 
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>
                          {article.published_at ? formatDate(article.published_at) : 'Non publié'}
                        </span>
                        <span>{article.read_time} min de lecture</span>
                      </div>
                      <button 
                        onClick={() => openArticleModal(article._id)}
                        className="flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                      >
                        <span>Lire la suite</span>
                        <i className="ri-arrow-right-line ml-2"></i>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Message si aucun article trouvé */}
        {filteredArticles.length === 0 && (
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center py-12">
                <i className="ri-article-line text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun article trouvé</h3>
                <p className="text-gray-600">
                  {selectedCategory === 'Tous' 
                    ? 'Aucun article n\'a encore été publié.' 
                    : `Aucun article dans la catégorie "${selectedCategory}".`}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Newsletter */}
        <section className="py-16 bg-orange-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Restez Informé</h2>
            <p className="text-orange-100 mb-8">
              Recevez nos derniers articles et conseils d'experts directement dans votre boîte mail
            </p>
            <form className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input 
                    type="email" 
                    placeholder="Votre adresse email" 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-200 whitespace-nowrap">
                  S'abonner
                </button>
              </div>
              <p className="text-orange-100 text-sm mt-3">
                Nous respectons votre vie privée. Désabonnement possible à tout moment.
              </p>
            </form>
          </div>
        </section>

        {/* Conseils Rapides */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Conseils Rapides</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Des astuces pratiques pour l'entretien et la rénovation de votre habitat
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-eye-line text-2xl text-orange-600"></i>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Inspection Annuelle</h3>
                <p className="text-gray-600 text-sm">
                  Vérifiez l'état de votre façade chaque année pour détecter les problèmes précocement.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-drop-line text-2xl text-orange-600"></i>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Nettoyage Régulier</h3>
                <p className="text-gray-600 text-sm">
                  Un nettoyage doux prolonge la durée de vie de votre ravalement de plusieurs années.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-plant-line text-2xl text-orange-600"></i>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Végétation</h3>
                <p className="text-gray-600 text-sm">
                  Éloignez la végétation des murs pour éviter l'humidité et les dégradations.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-calendar-line text-2xl text-orange-600"></i>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Planification</h3>
                <p className="text-gray-600 text-sm">
                  Planifiez vos travaux de ravalement tous les 10-15 ans selon l'exposition.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-900 to-red-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Besoin de Conseils Personnalisés ?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Nos experts sont à votre disposition pour répondre à toutes vos questions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="bg-white text-orange-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
              >
                Nous Contacter
              </a>
              <a 
                href="tel:+33139589015" 
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-orange-900 transition-all duration-300 whitespace-nowrap"
              >
                Appeler Maintenant
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      {/* Modal pour afficher l'article complet */}
      <ArticleModal 
        articleId={selectedArticleId}
        isOpen={isModalOpen}
        onClose={closeArticleModal}
      />
    </div>
  );
}
