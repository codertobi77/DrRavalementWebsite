import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  status: 'draft' | 'published';
  read_time: string;
  created_at: string;
  updated_at: string;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState<'articles' | 'pages'>('articles');
  const [articles, setArticles] = useState<Article[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      // TODO: Remplacer par de vraies données de l'API
      // Simuler le chargement des données
      setTimeout(() => {
        setArticles([
          {
            id: '1',
            title: 'Guide complet du ravalement de façade',
            excerpt: 'Découvrez tout ce qu\'il faut savoir sur le ravalement de façade...',
            content: 'Contenu complet de l\'article...',
            category: 'Conseils',
            image: '/images/article1.jpg',
            status: 'published',
            read_time: '5 min',
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:00:00Z'
          },
          {
            id: '2',
            title: 'Les nouvelles techniques de projection',
            excerpt: 'Les dernières innovations en matière de projection machine...',
            content: 'Contenu complet de l\'article...',
            category: 'Technique',
            image: '/images/article2.jpg',
            status: 'draft',
            read_time: '3 min',
            created_at: '2024-01-10T14:30:00Z',
            updated_at: '2024-01-12T09:15:00Z'
          }
        ]);

        setPages([
          {
            id: '1',
            title: 'À propos',
            slug: 'about',
            content: 'Contenu de la page à propos...',
            status: 'published',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          },
          {
            id: '2',
            title: 'Mentions légales',
            slug: 'legal',
            content: 'Contenu des mentions légales...',
            status: 'published',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          }
        ]);

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading content:', error);
      setError('Erreur lors du chargement du contenu');
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Publié';
      case 'draft': return 'Brouillon';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* En-tête */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Gestion du contenu
                </h1>
                <p className="text-gray-600">
                  Gérez les articles de blog et les pages du site
                </p>
              </div>
              <Link
                to="/admin"
                className="flex items-center text-gray-600 hover:text-orange-600 transition-colors"
              >
                <i className="ri-arrow-left-line mr-2"></i>
                Retour au tableau de bord
              </Link>
            </div>
          </div>

          {/* Messages d'erreur */}
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <i className="ri-error-warning-line mr-2"></i>
                {error}
              </div>
            </div>
          )}

          {/* Onglets */}
          <div className="mb-6 bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('articles')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'articles'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-article-line mr-2"></i>
                  Articles ({articles.length})
                </button>
                <button
                  onClick={() => setActiveTab('pages')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'pages'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-file-text-line mr-2"></i>
                  Pages ({pages.length})
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Actions rapides */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-3">
                  <Button
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <i className="ri-add-line mr-2"></i>
                    {activeTab === 'articles' ? 'Nouvel article' : 'Nouvelle page'}
                  </Button>
                  <Button
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <i className="ri-upload-line mr-2"></i>
                    Importer
                  </Button>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  </div>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option>Tous les statuts</option>
                    <option>Publié</option>
                    <option>Brouillon</option>
                  </select>
                </div>
              </div>

              {/* Contenu des onglets */}
              {activeTab === 'articles' && (
                <ArticlesList articles={articles} />
              )}

              {activeTab === 'pages' && (
                <PagesList pages={pages} />
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

// Composant pour la liste des articles
function ArticlesList({ articles }: { articles: Article[] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Publié';
      case 'draft': return 'Brouillon';
      default: return status;
    }
  };

  return (
    <div className="space-y-4">
      {articles.length === 0 ? (
        <div className="text-center py-12">
          <i className="ri-article-line text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun article trouvé
          </h3>
          <p className="text-gray-600">
            Commencez par créer votre premier article
          </p>
        </div>
      ) : (
        articles.map((article) => (
          <div key={article.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {article.title}
                  </h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(article.status)}`}>
                    {getStatusLabel(article.status)}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{article.excerpt}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <i className="ri-folder-line mr-1"></i>
                    {article.category}
                  </span>
                  <span className="flex items-center">
                    <i className="ri-time-line mr-1"></i>
                    {article.read_time}
                  </span>
                  <span className="flex items-center">
                    <i className="ri-calendar-line mr-1"></i>
                    {new Date(article.updated_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button className="p-2 text-gray-400 hover:text-orange-600 transition-colors">
                  <i className="ri-eye-line"></i>
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                  <i className="ri-edit-line"></i>
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// Composant pour la liste des pages
function PagesList({ pages }: { pages: Page[] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Publié';
      case 'draft': return 'Brouillon';
      default: return status;
    }
  };

  return (
    <div className="space-y-4">
      {pages.length === 0 ? (
        <div className="text-center py-12">
          <i className="ri-file-text-line text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucune page trouvée
          </h3>
          <p className="text-gray-600">
            Commencez par créer votre première page
          </p>
        </div>
      ) : (
        pages.map((page) => (
          <div key={page.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {page.title}
                  </h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(page.status)}`}>
                    {getStatusLabel(page.status)}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">/{page.slug}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <i className="ri-calendar-line mr-1"></i>
                    {new Date(page.updated_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button className="p-2 text-gray-400 hover:text-orange-600 transition-colors">
                  <i className="ri-eye-line"></i>
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                  <i className="ri-edit-line"></i>
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
