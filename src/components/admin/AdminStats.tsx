import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

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
      title: 'Cette semaine',
      value: thisWeekBookings,
      icon: 'ri-calendar-week-line',
      color: 'bg-purple-500'
    }
  ];

  const isLoading = bookingStats === undefined || allBookings === undefined;

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
