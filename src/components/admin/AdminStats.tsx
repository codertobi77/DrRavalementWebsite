import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";

interface StatCardProps {
  title: string;
  value: number;
  change?: number;
  icon: string;
  color: string;
  loading?: boolean;
}

function StatCard({ title, value, change, icon, color, loading = false }: StatCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="h-8 w-8 bg-gray-300 rounded"></div>
          </div>
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className={`p-2 rounded-lg ${color} text-white`}>
          <i className={`${icon} text-lg`}></i>
        </div>
      </div>
      
      <div className="flex items-baseline justify-between">
        <p className="text-2xl font-semibold text-gray-900">
          {value.toLocaleString()}
        </p>
        
        {change !== undefined && (
          <div className={`flex items-center text-sm ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <i className={`mr-1 ${change >= 0 ? 'ri-arrow-up-line' : 'ri-arrow-down-line'}`}></i>
            {Math.abs(change)}%
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminStats() {
  const bookingStats = useQuery(api.bookings.getBookingStats);
  const allBookings = useQuery(api.bookings.getBookings);
  const articleStats = useQuery(api.articles.getArticleStats);

  // Calculer les statistiques dérivées
  const totalBookings = bookingStats?.total || 0;
  const pendingBookings = bookingStats?.pending || 0;
  const confirmedBookings = bookingStats?.confirmed || 0;

  // Calculer les réservations de cette semaine
  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);
  const thisWeekBookings = allBookings?.filter(booking => 
    new Date(booking.booking_date) >= thisWeek
  ).length || 0;

  const stats = [
    {
      title: 'Réservations totales',
      value: totalBookings,
      icon: 'ri-calendar-line',
      color: 'bg-blue-500'
    },
    {
      title: 'En attente',
      value: pendingBookings,
      icon: 'ri-time-line',
      color: 'bg-yellow-500'
    },
    {
      title: 'Confirmées',
      value: confirmedBookings,
      icon: 'ri-check-line',
      color: 'bg-green-500'
    },
    {
      title: 'Articles publiés',
      value: articleStats?.published || 0,
      icon: 'ri-article-line',
      color: 'bg-orange-500'
    },
    {
      title: 'Brouillons',
      value: articleStats?.draft || 0,
      icon: 'ri-draft-line',
      color: 'bg-gray-500'
    },
    {
      title: 'Vues totales',
      value: articleStats?.totalViews || 0,
      icon: 'ri-eye-line',
      color: 'bg-purple-500'
    }
  ];

  const isLoading = bookingStats === undefined || allBookings === undefined || articleStats === undefined;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Statistiques générales
        </h2>
        <p className="text-sm text-gray-600">
          Vue d'ensemble de votre activité
        </p>
      </div>

      {/* Grille des statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            loading={isLoading}
          />
        ))}
      </div>

      {/* Section Articles - Lien rapide */}
      {!isLoading && articleStats && articleStats.total > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-orange-900 mb-2">
                Gestion des Articles
              </h3>
              <p className="text-orange-700 text-sm mb-4">
                Gérez votre contenu blog et vos articles publiés
              </p>
              <div className="flex items-center space-x-4 text-sm text-orange-600">
                <span className="flex items-center">
                  <i className="ri-article-line mr-1"></i>
                  {articleStats.published} publiés
                </span>
                <span className="flex items-center">
                  <i className="ri-draft-line mr-1"></i>
                  {articleStats.draft} brouillons
                </span>
                <span className="flex items-center">
                  <i className="ri-eye-line mr-1"></i>
                  {articleStats.totalViews} vues
                </span>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <a
                href="/admin/articles"
                className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
              >
                <i className="ri-edit-line mr-2"></i>
                Gérer les articles
              </a>
              <a
                href="/blog"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-white text-orange-600 text-sm font-medium rounded-lg border border-orange-300 hover:bg-orange-50 transition-colors"
              >
                <i className="ri-external-link-line mr-2"></i>
                Voir le blog
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Graphique simple des réservations par statut */}
      {!isLoading && totalBookings > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Répartition des réservations
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Confirmées</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {confirmedBookings} ({totalBookings > 0 ? Math.round((confirmedBookings / totalBookings) * 100) : 0}%)
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">En attente</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {pendingBookings} ({totalBookings > 0 ? Math.round((pendingBookings / totalBookings) * 100) : 0}%)
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Annulées</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {bookingStats?.cancelled || 0} ({totalBookings > 0 ? Math.round(((bookingStats?.cancelled || 0) / totalBookings) * 100) : 0}%)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
