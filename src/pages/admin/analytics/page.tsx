import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import Button from '../../../components/base/Button';
import { useToast } from '../../../contexts/ToastContext';

interface AnalyticsData {
  overview: {
    totalVisitors: number;
    totalPageViews: number;
    bounceRate: number;
    avgSessionDuration: string;
    newVisitors: number;
    returningVisitors: number;
  };
  topPages: Array<{
    page: string;
    views: number;
    uniqueVisitors: number;
    bounceRate: number;
  }>;
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
  deviceStats: Array<{
    device: string;
    visitors: number;
    percentage: number;
  }>;
  monthlyStats: Array<{
    month: string;
    visitors: number;
    pageViews: number;
    bookings: number;
  }>;
  recentBookings: Array<{
    id: string;
    clientName: string;
    service: string;
    date: string;
    amount: number;
  }>;
}

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Hooks pour les toasters
  const { showSuccess, showError, showInfo } = useToast();

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    // TODO: Remplacer par de vraies données de l'API
    setTimeout(() => {
      try {
        setAnalyticsData({
          overview: {
            totalVisitors: 12450,
            totalPageViews: 45680,
            bounceRate: 42.5,
            avgSessionDuration: '3m 24s',
            newVisitors: 8930,
            returningVisitors: 3520
          },
          topPages: [
            { page: '/', views: 12500, uniqueVisitors: 8900, bounceRate: 35.2 },
            { page: '/services', views: 8900, uniqueVisitors: 6200, bounceRate: 28.5 },
            { page: '/portfolio', views: 6700, uniqueVisitors: 4800, bounceRate: 45.8 },
            { page: '/contact', views: 4200, uniqueVisitors: 3800, bounceRate: 52.3 },
            { page: '/booking', views: 3800, uniqueVisitors: 3200, bounceRate: 38.7 }
          ],
          trafficSources: [
            { source: 'Recherche organique', visitors: 5200, percentage: 41.8 },
            { source: 'Direct', visitors: 3200, percentage: 25.7 },
            { source: 'Réseaux sociaux', visitors: 2100, percentage: 16.9 },
            { source: 'Référencement payant', visitors: 1200, percentage: 9.6 },
            { source: 'Autres', visitors: 750, percentage: 6.0 }
          ],
          deviceStats: [
            { device: 'Mobile', visitors: 7200, percentage: 57.8 },
            { device: 'Desktop', visitors: 4200, percentage: 33.7 },
            { device: 'Tablet', visitors: 1050, percentage: 8.5 }
          ],
          monthlyStats: [
            { month: 'Jan 2024', visitors: 8500, pageViews: 32000, bookings: 12 },
            { month: 'Fév 2024', visitors: 9200, pageViews: 35000, bookings: 15 },
            { month: 'Mar 2024', visitors: 10800, pageViews: 41000, bookings: 18 },
            { month: 'Avr 2024', visitors: 12450, pageViews: 45680, bookings: 22 }
          ],
          recentBookings: [
            { id: '1', clientName: 'Jean Dupont', service: 'Ravalement façade', date: '2024-01-20', amount: 15000 },
            { id: '2', clientName: 'Marie Martin', service: 'Isolation thermique', date: '2024-01-19', amount: 25000 },
            { id: '3', clientName: 'Pierre Durand', service: 'Maçonnerie générale', date: '2024-01-18', amount: 3500 },
            { id: '4', clientName: 'Sophie Bernard', service: 'Ravalement façade', date: '2024-01-17', amount: 18000 },
            { id: '5', clientName: 'Marc Leroy', service: 'Couverture', date: '2024-01-16', amount: 12000 }
          ]
        });
        setLoading(false);
        showSuccess('Données chargées', 'Les données analytiques ont été mises à jour.');
      } catch (error) {
        console.error('Error loading analytics data:', error);
        setError('Erreur lors du chargement des données analytiques');
        setLoading(false);
        showError('Erreur de chargement', 'Impossible de charger les données analytiques.');
      }
    }, 1000);
  };  };
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!analyticsData) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <i className="ri-bar-chart-line text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune donnée disponible
          </h3>
          <p className="text-gray-600">
            Les données analytiques ne sont pas encore disponibles
          </p>
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
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Analytique</h1>
            <p className="text-gray-600 mt-2">Analysez les performances de votre site web</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">90 derniers jours</option>
              <option value="1y">1 an</option>
            </select>
            <Button
              onClick={() => {
                loadAnalyticsData();
                showInfo('Rafraîchissement', 'Chargement des dernières données...');
              }}
              className="bg-gray-600 text-white hover:bg-gray-700"
            >
              <i className="ri-refresh-line mr-2"></i>
              Rafraîchir
            </Button>
          </div>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <i className="ri-error-warning-line mr-2"></i>
              {error}
            </div>
          </div>
        )}

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Visiteurs totaux"
            value={formatNumber(analyticsData.overview.totalVisitors)}
            icon="ri-user-line"
            color="blue"
            change="+12.5%"
            changeType="positive"
          />
          <MetricCard
            title="Pages vues"
            value={formatNumber(analyticsData.overview.totalPageViews)}
            icon="ri-eye-line"
            color="green"
            change="+8.3%"
            changeType="positive"
          />
          <MetricCard
            title="Taux de rebond"
            value={`${analyticsData.overview.bounceRate}%`}
            icon="ri-refresh-line"
            color="yellow"
            change="-2.1%"
            changeType="positive"
          />
          <MetricCard
            title="Durée moyenne"
            value={analyticsData.overview.avgSessionDuration}
            icon="ri-time-line"
            color="purple"
            change="+15s"
            changeType="positive"
          />
        </div>

        {/* Graphiques et tableaux */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pages les plus visitées */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Pages les plus visitées
            </h3>
            <div className="space-y-4">
              {analyticsData.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{page.page}</p>
                    <p className="text-xs text-gray-500">
                      {formatNumber(page.uniqueVisitors)} visiteurs uniques
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatNumber(page.views)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {page.bounceRate}% rebond
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sources de trafic */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Sources de trafic
            </h3>
            <div className="space-y-4">
              {analyticsData.trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{source.source}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatNumber(source.visitors)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {source.percentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statistiques des appareils et réservations récentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appareils */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Appareils utilisés
            </h3>
            <div className="space-y-4">
              {analyticsData.deviceStats.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <i className={`ri-${device.device === 'Mobile' ? 'smartphone' : device.device === 'Desktop' ? 'computer' : 'tablet'}-line text-2xl text-gray-400 mr-3`}></i>
                    <span className="text-sm font-medium text-gray-900">{device.device}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatNumber(device.visitors)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {device.percentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Réservations récentes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Réservations récentes
            </h3>
            <div className="space-y-3">
              {analyticsData.recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{booking.clientName}</p>
                    <p className="text-xs text-gray-500">{booking.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(booking.amount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(booking.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Évolution mensuelle */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Évolution mensuelle
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mois
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visiteurs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pages vues
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Réservations
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyticsData.monthlyStats.map((stat, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {stat.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatNumber(stat.visitors)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatNumber(stat.pageViews)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.bookings}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// Composant pour les cartes de métriques
function MetricCard({ 
  title, 
  value, 
  icon, 
  color, 
  change, 
  changeType 
}: {
  title: string;
  value: string;
  icon: string;
  color: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
}) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'purple': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${getColorClasses(color)}`}>
          <i className={`${icon} text-white text-xl`}></i>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          <p className={`text-sm ${getChangeColor(changeType)}`}>
            {change} vs période précédente
          </p>
        </div>
      </div>
    </div>
  );
}