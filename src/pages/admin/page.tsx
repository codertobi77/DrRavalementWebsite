
import { useState, useEffect } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import { useAuth } from '../../lib/auth';
import { CMSService } from '../../lib/cms';

interface AdminStats {
  totalArticles: number;
  totalPages: number;
  totalImages: number;
  totalVideos: number;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  date: string;
  status: 'published' | 'draft';
  readTime: string;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'published' | 'draft';
  lastModified: string;
}

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  size: string;
  uploadDate: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'articles' | 'pages' | 'media' | 'settings'>('dashboard');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [stats, setStats] = useState<AdminStats>({
    totalArticles: 0,
    totalPages: 0,
    totalImages: 0,
    totalVideos: 0
  });

  const { user, loading: authLoading, signIn, signOut, isAdmin } = useAuth();

  // Charger les statistiques
  useEffect(() => {
    if (user && isAdmin) {
      loadStats();
    }
  }, [user, isAdmin]);

  const loadStats = async () => {
    try {
      const cmsStats = await CMSService.getCMSStats();
      setStats({
        totalArticles: cmsStats.totalArticles,
        totalPages: cmsStats.totalPages,
        totalImages: 0, // À implémenter
        totalVideos: 0 // À implémenter
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const [articles, setArticles] = useState<Article[]>([
    {
      id: '1',
      title: 'Comment choisir la finition de votre ravalement de façade ?',
      excerpt: 'Découvrez les différentes finitions disponibles...',
      content: 'Contenu complet de l\'article...',
      category: 'Ravalement',
      image: 'https://readdy.ai/api/search-image?query=facade%20renovation%20finishes%2C%20building%20exterior%20coating%2C%20construction%20materials%2C%20professional%20renovation%20work%2C%20realistic%20photography%2C%20natural%20lighting&width=400&height=300&seq=admin1&orientation=landscape',
      date: '2024-03-15',
      status: 'published',
      readTime: '5 min'
    },
    {
      id: '2',
      title: 'Les avantages de la projection machine',
      excerpt: 'La technique de projection machine révolutionne...',
      content: 'Contenu complet de l\'article...',
      category: 'Techniques',
      image: 'https://readdy.ai/api/search-image?query=machine%20projection%20technique%2C%20construction%20equipment%2C%20facade%20renovation%20technology%2C%20professional%20building%20work%2C%20realistic%20photography&width=400&height=300&seq=admin2&orientation=landscape',
      date: '2024-03-10',
      status: 'draft',
      readTime: '7 min'
    }
  ]);

  const [pages, setPages] = useState<Page[]>([
    {
      id: '1',
      title: 'À Propos',
      slug: 'about',
      content: 'Contenu de la page à propos...',
      status: 'published',
      lastModified: '2024-03-15'
    },
    {
      id: '2',
      title: 'Services',
      slug: 'services',
      content: 'Contenu de la page services...',
      status: 'published',
      lastModified: '2024-03-12'
    }
  ]);

  const [mediaFiles] = useState<MediaFile[]>([
    {
      id: '1',
      name: 'facade-renovation-1.jpg',
      type: 'image',
      url: 'https://readdy.ai/api/search-image?query=facade%20renovation%20before%20after%2C%20building%20exterior%20transformation%2C%20construction%20project%20results%2C%20professional%20renovation%20work&width=300&height=200&seq=media1&orientation=landscape',
      size: '2.3 MB',
      uploadDate: '2024-03-15'
    },
    {
      id: '2',
      name: 'technique-projection.mp4',
      type: 'video',
      url: '#',
      size: '15.7 MB',
      uploadDate: '2024-03-10'
    }
  ]);

  // Fonction de connexion réelle
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signIn(loginForm.email, loginForm.password);
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      setArticles(articles.filter(article => article.id !== id));
    }
  };

  const handleDeletePage = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette page ?')) {
      setPages(pages.filter(page => page.id !== id));
    }
  };

  const handleSaveArticle = (articleData: any) => {
    if (editingItem) {
      setArticles(articles.map(article => 
        article.id === editingItem.id ? { ...article, ...articleData } : article
      ));
    } else {
      const newArticle = {
        id: Date.now().toString(),
        ...articleData,
        date: new Date().toISOString().split('T')[0]
      };
      setArticles([...articles, newArticle]);
    }
    setShowAddModal(false);
    setEditingItem(null);
  };

  const handleSavePage = (pageData: any) => {
    if (editingItem) {
      setPages(pages.map(page => 
        page.id === editingItem.id ? { ...page, ...pageData, lastModified: new Date().toISOString().split('T')[0] } : page
      ));
    } else {
      const newPage = {
        id: Date.now().toString(),
        ...pageData,
        lastModified: new Date().toISOString().split('T')[0]
      };
      setPages([...pages, newPage]);
    }
    setShowAddModal(false);
    setEditingItem(null);
  };

  // Afficher le loading pendant l'authentification
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Vérifier si l'utilisateur est admin
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="py-16">
          <div className="max-w-md mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-admin-line text-2xl text-orange-600"></i>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Administration
                </h1>
                <p className="text-gray-600">
                  Accès réservé aux administrateurs
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="admin@dr-ravalement.fr"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </button>
              </form>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <i className="ri-information-line mr-2"></i>
                  Accès réservé aux administrateurs
                </p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Administration
              </h1>
              <p className="text-gray-600">
                Gérez le contenu de votre site web
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800 flex items-center"
            >
              <i className="ri-logout-box-line mr-2"></i>
              Déconnexion
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full text-left p-3 rounded-lg flex items-center transition-colors ${
                      activeTab === 'dashboard' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    <i className="ri-dashboard-line mr-3"></i>
                    Tableau de bord
                  </button>
                  <button
                    onClick={() => setActiveTab('articles')}
                    className={`w-full text-left p-3 rounded-lg flex items-center transition-colors ${
                      activeTab === 'articles' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    <i className="ri-article-line mr-3"></i>
                    Articles de blog
                  </button>
                  <button
                    onClick={() => setActiveTab('pages')}
                    className={`w-full text-left p-3 rounded-lg flex items-center transition-colors ${
                      activeTab === 'pages' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    <i className="ri-pages-line mr-3"></i>
                    Pages
                  </button>
                  <button
                    onClick={() => setActiveTab('media')}
                    className={`w-full text-left p-3 rounded-lg flex items-center transition-colors ${
                      activeTab === 'media' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    <i className="ri-image-line mr-3"></i>
                    Médias
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full text-left p-3 rounded-lg flex items-center transition-colors ${
                      activeTab === 'settings' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    <i className="ri-settings-line mr-3"></i>
                    Paramètres
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Dashboard */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <i className="ri-article-line text-xl text-blue-600"></i>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{stats.totalArticles}</div>
                          <div className="text-sm text-gray-600">Articles</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                          <i className="ri-pages-line text-xl text-green-600"></i>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{stats.totalPages}</div>
                          <div className="text-sm text-gray-600">Pages</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                          <i className="ri-image-line text-xl text-purple-600"></i>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{stats.totalImages}</div>
                          <div className="text-sm text-gray-600">Images</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                          <i className="ri-video-line text-xl text-orange-600"></i>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{stats.totalVideos}</div>
                          <div className="text-sm text-gray-600">Vidéos</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Activité récente</h2>
                    <div className="space-y-4">
                      <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <i className="ri-article-line text-blue-600 mr-3"></i>
                        <div className="flex-1">
                          <div className="font-medium">Nouvel article publié</div>
                          <div className="text-sm text-gray-600">Comment choisir la finition de votre ravalement</div>
                        </div>
                        <div className="text-sm text-gray-500">Il y a 2 heures</div>
                      </div>
                      <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <i className="ri-image-line text-green-600 mr-3"></i>
                        <div className="flex-1">
                          <div className="font-medium">Images ajoutées</div>
                          <div className="text-sm text-gray-600">5 nouvelles images dans la galerie</div>
                        </div>
                        <div className="text-sm text-gray-500">Hier</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Articles */}
              {activeTab === 'articles' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Articles de blog</h2>
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setShowAddModal(true);
                      }}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center whitespace-nowrap"
                    >
                      <i className="ri-add-line mr-2"></i>
                      Nouvel article
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {articles.map((article) => (
                            <tr key={article.id}>
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <img src={article.image} alt="" className="w-12 h-12 rounded-lg object-cover mr-4" />
                                  <div>
                                    <div className="font-medium text-gray-900">{article.title}</div>
                                    <div className="text-sm text-gray-500">{article.excerpt.substring(0, 50)}...</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">{article.category}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  article.status === 'published' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {article.status === 'published' ? 'Publié' : 'Brouillon'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">{article.date}</td>
                              <td className="px-6 py-4 text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => {
                                      setEditingItem(article);
                                      setShowAddModal(true);
                                    }}
                                    className="text-orange-600 hover:text-orange-900"
                                  >
                                    <i className="ri-edit-line"></i>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteArticle(article.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <i className="ri-delete-bin-line"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Pages */}
              {activeTab === 'pages' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Pages</h2>
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setShowAddModal(true);
                      }}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center whitespace-nowrap"
                    >
                      <i className="ri-add-line mr-2"></i>
                      Nouvelle page
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modifiée</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {pages.map((page) => (
                            <tr key={page.id}>
                              <td className="px-6 py-4 font-medium text-gray-900">{page.title}</td>
                              <td className="px-6 py-4 text-sm text-gray-500">/{page.slug}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  page.status === 'published' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {page.status === 'published' ? 'Publié' : 'Brouillon'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">{page.lastModified}</td>
                              <td className="px-6 py-4 text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => {
                                      setEditingItem(page);
                                      setShowAddModal(true);
                                    }}
                                    className="text-orange-600 hover:text-orange-900"
                                  >
                                    <i className="ri-edit-line"></i>
                                  </button>
                                  <button
                                    onClick={() => handleDeletePage(page.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <i className="ri-delete-bin-line"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Media */}
              {activeTab === 'media' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Bibliothèque de médias</h2>
                    <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center whitespace-nowrap">
                      <i className="ri-upload-line mr-2"></i>
                      Ajouter des fichiers
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {mediaFiles.map((file) => (
                        <div key={file.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          {file.type === 'image' ? (
                            <img src={file.url} alt={file.name} className="w-full h-32 object-cover" />
                          ) : (
                            <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                              <i className="ri-video-line text-3xl text-gray-400"></i>
                            </div>
                          )}
                          <div className="p-3">
                            <div className="font-medium text-sm truncate">{file.name}</div>
                            <div className="text-xs text-gray-500">{file.size}</div>
                            <div className="text-xs text-gray-500">{file.uploadDate}</div>
                            <div className="flex justify-between mt-2">
                              <button className="text-orange-600 hover:text-orange-700 text-sm">
                                <i className="ri-edit-line"></i>
                              </button>
                              <button className="text-red-600 hover:text-red-700 text-sm">
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Settings */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Paramètres</h2>
                  
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Paramètres généraux</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom du site
                        </label>
                        <input
                          type="text"
                          defaultValue="DR RAVALEMENT"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          defaultValue="Expert en ravalement de façades, maçonnerie et couverture en Seine-et-Marne"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email de contact
                        </label>
                        <input
                          type="email"
                          defaultValue="contact@dr-ravalement.fr"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          defaultValue="+33 1 39 58 90 15"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap">
                        Sauvegarder
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal pour ajouter/éditer */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                  {activeTab === 'articles' 
                    ? (editingItem ? 'Modifier l\'article' : 'Nouvel article')
                    : (editingItem ? 'Modifier la page' : 'Nouvelle page')
                  }
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              {activeTab === 'articles' ? (
                <ArticleForm 
                  article={editingItem} 
                  onSave={handleSaveArticle}
                  onCancel={() => setShowAddModal(false)}
                />
              ) : (
                <PageForm 
                  page={editingItem} 
                  onSave={handleSavePage}
                  onCancel={() => setShowAddModal(false)}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

// Composant formulaire article
function ArticleForm({ article, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    title: article?.title || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    category: article?.category || '',
    image: article?.image || '',
    status: article?.status || 'draft',
    readTime: article?.readTime || '5 min'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Extrait</label>
        <textarea
          value={formData.excerpt}
          onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Contenu</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          rows={8}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 pr-8"
            required
          >
            <option value="">Sélectionner</option>
            <option value="Ravalement">Ravalement</option>
            <option value="Techniques">Techniques</option>
            <option value="Isolation">Isolation</option>
            <option value="Couverture">Couverture</option>
            <option value="Maçonnerie">Maçonnerie</option>
            <option value="Entretien">Entretien</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Temps de lecture</label>
          <input
            type="text"
            value={formData.readTime}
            onChange={(e) => setFormData({...formData, readTime: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder="5 min"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">URL de l'image</label>
        <input
          type="url"
          value={formData.image}
          onChange={(e) => setFormData({...formData, image: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          placeholder="https://..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value as 'published' | 'draft'})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 pr-8"
        >
          <option value="draft">Brouillon</option>
          <option value="published">Publié</option>
        </select>
      </div>
      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap"
        >
          Sauvegarder
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors whitespace-nowrap"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

// Composant formulaire page
function PageForm({ page, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    title: page?.title || '',
    slug: page?.slug || '',
    content: page?.content || '',
    status: page?.status || 'draft'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">URL (slug)</label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({...formData, slug: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          placeholder="ma-page"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Contenu</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          rows={12}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value as 'published' | 'draft'})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 pr-8"
        >
          <option value="draft">Brouillon</option>
          <option value="published">Publié</option>
        </select>
      </div>
      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap"
        >
          Sauvegarder
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors whitespace-nowrap"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
