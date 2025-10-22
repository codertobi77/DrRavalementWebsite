import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import AdminLayout from '../../../components/admin/AdminLayout';
import Button from '../../../components/base/Button';
import AdminNavigation from '../../../components/admin/AdminNavigation';
import AdminStats from '../../../components/admin/AdminStats';
import RecentActivity from '../../../components/admin/RecentActivity';
import ArticleQuickActions from '../../../components/admin/ArticleQuickActions';
import { useOptimizedAdminDashboardStats } from '../../../hooks/useOptimizedCmsData';
import { useToast } from '../../../contexts/ToastContext';

export default function AdminDashboard() {
  // Hooks pour les toasters
  const { showSuccess, showInfo } = useToast();

  // Utiliser les hooks optimisés avec cache
  const { data: dashboardStats, isLoading: dashboardStatsLoading, refresh: refreshDashboardStats } = useOptimizedAdminDashboardStats();
  
  // Hooks Convex pour les données supplémentaires
  const allBookings = useQuery(api.bookings.getBookings);

  // Loading state
  const isLoading = dashboardStatsLoading || allBookings === undefined;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
            <p className="text-gray-600 mt-2">Gérez votre site web et vos activités</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button
              onClick={() => {
                refreshDashboardStats();
                showInfo('Données rafraîchies', 'Les données du tableau de bord ont été mises à jour.');
              }}
              className="bg-gray-600 text-white hover:bg-gray-700"
            >
              <i className="ri-refresh-line mr-2"></i>
              Rafraîchir les données
            </Button>
            <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
              <div className="text-right">
                <p className="text-sm text-gray-500">Date actuelle</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Navigation et statistiques */}
          <div className="lg:col-span-2 space-y-6">
            {/* Navigation par catégories */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Navigation rapide
              </h3>
              <AdminNavigation />
            </div>
            
            {/* Statistiques détaillées */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Statistiques détaillées
              </h3>
              <AdminStats />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Articles & Blog */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Articles & Blog
              </h3>
              <ArticleQuickActions />
            </div>

            {/* Activité récente */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Activité récente
              </h3>
              <RecentActivity />
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Actions rapides
              </h3>
              <div className="space-y-3">
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

                <a
                  href="/admin/content"
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-orange-200 hover:bg-orange-50 transition-colors group"
                >
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3 group-hover:bg-blue-200 transition-colors">
                    <i className="ri-edit-line"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Contenu</p>
                    <p className="text-xs text-gray-500">Gérer le contenu</p>
                  </div>
                </a>

                <a
                  href="/admin/analytics"
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-orange-200 hover:bg-orange-50 transition-colors group"
                >
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg mr-3 group-hover:bg-purple-200 transition-colors">
                    <i className="ri-bar-chart-line"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Analytics</p>
                    <p className="text-xs text-gray-500">Statistiques du site</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Informations système */}
            <div className="bg-white rounded-lg shadow p-6">
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
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cache</span>
                  <span className="text-sm font-medium text-blue-600">Actif</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}