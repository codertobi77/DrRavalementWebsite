import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import AdminNavigation from '../../../components/admin/AdminNavigation';
import AdminStats from '../../../components/admin/AdminStats';
import RecentActivity from '../../../components/admin/RecentActivity';

export default function AdminDashboard() {
  // Hooks Convex pour les données
  const bookingStats = useQuery(api.bookings.getBookingStats);
  const allBookings = useQuery(api.bookings.getBookings);
  const allPages = useQuery(api.pages.getAllPages);
  const allArticles = useQuery(api.articles.getAllArticles);

  // Loading state
  const isLoading = bookingStats === undefined || allBookings === undefined || 
                   allPages === undefined || allArticles === undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-64 bg-gray-300 rounded"></div>
                  <div className="h-48 bg-gray-300 rounded"></div>
                </div>
                <div className="space-y-6">
                  <div className="h-48 bg-gray-300 rounded"></div>
                  <div className="h-32 bg-gray-300 rounded"></div>
                </div>
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
        <div className="max-w-7xl mx-auto">
          {/* En-tête */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Tableau de bord
                </h1>
                <p className="text-gray-600">
                  Gérez votre site web et vos activités
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Dernière connexion</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date().toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <i className="ri-user-line text-orange-600"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Navigation et statistiques */}
            <div className="lg:col-span-2 space-y-8">
              {/* Navigation par catégories */}
              <AdminNavigation />
              
              {/* Statistiques */}
              <AdminStats />
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Activité récente */}
              <RecentActivity />

              {/* Actions rapides */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Actions rapides
                </h3>
                <div className="space-y-3">
                  <a
                    href="/admin/pages"
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-orange-200 hover:bg-orange-50 transition-colors group"
                  >
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3 group-hover:bg-blue-200 transition-colors">
                      <i className="ri-file-text-line"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Nouvelle page</p>
                      <p className="text-xs text-gray-500">Créer une page du site</p>
                    </div>
                  </a>

                  <a
                    href="/admin/content"
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-orange-200 hover:bg-orange-50 transition-colors group"
                  >
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg mr-3 group-hover:bg-indigo-200 transition-colors">
                      <i className="ri-article-line"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Nouvel article</p>
                      <p className="text-xs text-gray-500">Publier un article de blog</p>
                    </div>
                  </a>

                  <a
                    href="/admin/bookings"
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-orange-200 hover:bg-orange-50 transition-colors group"
                  >
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg mr-3 group-hover:bg-green-200 transition-colors">
                      <i className="ri-calendar-line"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Voir réservations</p>
                      <p className="text-xs text-gray-500">Gérer les rendez-vous</p>
                    </div>
                  </a>

                  <a
                    href="/admin/config"
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-orange-200 hover:bg-orange-50 transition-colors group"
                  >
                    <div className="p-2 bg-gray-100 text-gray-600 rounded-lg mr-3 group-hover:bg-gray-200 transition-colors">
                      <i className="ri-settings-line"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Configuration</p>
                      <p className="text-xs text-gray-500">Paramètres du site</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Informations système */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informations système
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Version</span>
                    <span className="text-sm font-medium text-gray-900">v1.0.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Base de données</span>
                    <span className="text-sm font-medium text-green-600">Convex</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Statut</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                      En ligne
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
