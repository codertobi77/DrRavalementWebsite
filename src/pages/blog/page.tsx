
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

export default function Blog() {
  const articles = [
    {
      id: 1,
      title: 'Comment choisir la finition de votre ravalement de façade ?',
      excerpt: 'Découvrez les différentes finitions disponibles pour votre ravalement : grattée, talochée, lissée. Chaque finition a ses avantages selon votre style architectural.',
      image: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=600',
      date: '15 Mars 2024',
      category: 'Ravalement',
      readTime: '5 min'
    },
    {
      id: 2,
      title: 'Les avantages de la projection machine pour vos façades',
      excerpt: 'La technique de projection machine révolutionne le ravalement de façades. Découvrez pourquoi cette méthode moderne offre un rendu supérieur.',
      image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=600',
      date: '10 Mars 2024',
      category: 'Techniques',
      readTime: '7 min'
    },
    {
      id: 3,
      title: 'Isolation thermique par l\'extérieur : guide complet',
      excerpt: 'L\'ITE améliore considérablement les performances énergétiques de votre habitat. Tout ce qu\'il faut savoir sur cette solution d\'isolation.',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600',
      date: '5 Mars 2024',
      category: 'Isolation',
      readTime: '8 min'
    },
    {
      id: 4,
      title: 'Quand faut-il rénover sa toiture ?',
      excerpt: 'Signes d\'usure, infiltrations, tuiles cassées... Apprenez à identifier les signaux qui indiquent qu\'il est temps de rénover votre toiture.',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600',
      date: '28 Février 2024',
      category: 'Couverture',
      readTime: '6 min'
    },
    {
      id: 5,
      title: 'Construction de murs en parpaing : les étapes clés',
      excerpt: 'De la préparation des fondations à la finition, découvrez toutes les étapes pour construire un mur en parpaing durable et esthétique.',
      image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=600',
      date: '20 Février 2024',
      category: 'Maçonnerie',
      readTime: '9 min'
    },
    {
      id: 6,
      title: 'Entretien de façade : conseils pour préserver votre investissement',
      excerpt: 'Un entretien régulier prolonge la durée de vie de votre façade. Nos conseils d\'experts pour maintenir l\'éclat de vos murs extérieurs.',
      image: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=600',
      date: '15 Février 2024',
      category: 'Entretien',
      readTime: '4 min'
    }
  ];

  const categories = ['Tous', 'Ravalement', 'Techniques', 'Isolation', 'Couverture', 'Maçonnerie', 'Entretien'];

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
                  className="px-6 py-3 rounded-full font-medium transition-all duration-300 bg-white text-gray-700 hover:bg-orange-100 hover:text-orange-600 text-small"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Article Principal */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  Article à la Une
                </span>
                <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-6">
                  {articles[0].title}
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  {articles[0].excerpt}
                </p>
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-orange-600 font-medium">{articles[0].category}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{articles[0].date}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{articles[0].readTime} de lecture</span>
                </div>
                <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors whitespace-nowrap">
                  Lire l'Article
                </button>
              </div>
              <div className="relative">
                <img 
                  src={articles[0].image} 
                  alt={articles[0].title}
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Grille d'Articles */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Derniers Articles</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Restez informé des dernières tendances et techniques en ravalement et rénovation
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.slice(1).map((article) => (
                <article key={article.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={article.image} 
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
                      <span>{article.date}</span>
                      <span>{article.readTime} de lecture</span>
                    </div>
                    <button className="flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                      <span>Lire la suite</span>
                      <i className="ri-arrow-right-line ml-2"></i>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

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
    </div>
  );
}
