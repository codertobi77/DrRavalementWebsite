import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  totalProjects: number;
  activeProjects: number;
  totalQuotes: number;
  pendingQuotes: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    totalProjects: 0,
    activeProjects: 0,
    totalQuotes: 0,
    pendingQuotes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des statistiques
    // TODO: Remplacer par de vraies données de l'API
    setTimeout(() => {
      setStats({
        totalBookings: 24,
        pendingBookings: 8,
        confirmedBookings: 12,
        completedBookings: 4,
        totalProjects: 15,
        activeProjects: 6,
        totalQuotes: 32,
        pendingQuotes: 18
      });
      setLoading(false);
    }, 1000);
  }, []);

  const menuItems = [
    {
      title: 'Réservations',
      description: 'Gérer les rendez-vous et créneaux',
      icon: 'ri-calendar-line',
      color: 'bg-blue-500',
      link: '/admin/bookings',
      stats: stats.totalBookings
    },
    {
      title: 'Projets',
      description: 'Suivre les projets en cours',
      icon: 'ri-building-line',
      color: 'bg-green-500',
      link: '/admin/projects',
      stats: stats.activeProjects
    },
    {
      title: 'Devis',
      description: 'Gérer les demandes de devis',
      icon: 'ri-file-text-line',
      color: 'bg-yellow-500',
      link: '/admin/quotes',
      stats: stats.pendingQuotes
    },
    {
      title: 'Configuration',
      description: 'Modifier les paramètres du site',
      icon: 'ri-settings-line',
      color: 'bg-purple-500',
      link: '/admin/config',
      stats: null
    },
    {
      title: 'Contenu',
      description: 'Gérer les articles et pages',
      icon: 'ri-article-line',
      color: 'bg-indigo-500',
      link: '/admin/content',
      stats: null
    },
    {
      title: 'Médias',
      description: 'Gérer les images et fichiers',
      icon: 'ri-image-line',
      color: 'bg-pink-500',
      link: '/admin/media',
      stats: null
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow p-6">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tableau de bord administrateur
            </h1>
            <p className="text-gray-600">
              Gérez votre site web et vos données depuis cette interface
            </p>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <i className="ri-calendar-line text-2xl text-blue-600"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Réservations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <i className="ri-building-line text-2xl text-green-600"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Projets actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <i className="ri-file-text-line text-2xl text-yellow-600"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Devis en attente</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingQuotes}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <i className="ri-user-line text-2xl text-purple-600"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Clients</p>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                </div>
              </div>
            </div>
          </div>

          {/* Menu principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="group bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 ${item.color} rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                      <i className={`${item.icon} text-2xl text-white`}></i>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {item.title}
                      </h3>
                      {item.stats !== null && (
                        <div className="text-2xl font-bold text-gray-900">
                          {item.stats}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Actions rapides */}
          <div className="mt-12 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Actions rapides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <i className="ri-add-line text-xl text-orange-600 mr-3"></i>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Nouveau projet</div>
                  <div className="text-sm text-gray-600">Créer un nouveau projet</div>
                </div>
              </button>
              
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <i className="ri-calendar-check-line text-xl text-orange-600 mr-3"></i>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Confirmer réservations</div>
                  <div className="text-sm text-gray-600">Valider les RDV en attente</div>
                </div>
              </button>
              
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <i className="ri-settings-3-line text-xl text-orange-600 mr-3"></i>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Paramètres</div>
                  <div className="text-sm text-gray-600">Configurer le site</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
