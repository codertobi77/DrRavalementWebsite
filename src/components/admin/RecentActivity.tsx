import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ActivityItem {
  id: string;
  type: 'booking' | 'page' | 'article' | 'user';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
  icon: string;
  color: string;
}

export default function RecentActivity() {
  const allBookings = useQuery(api.bookings.getBookings);
  const portfolioProjects = useQuery(api.cms.getPortfolioProjects);
  const testimonials = useQuery(api.cms.getTestimonials);

  // Créer une liste d'activités récentes
  const activities: ActivityItem[] = [];

  // Ajouter les réservations récentes
  if (allBookings) {
    allBookings
      .sort((a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime())
      .slice(0, 3)
      .forEach(booking => {
        activities.push({
          id: `booking-${booking._id}`,
          type: 'booking',
          title: `Nouvelle réservation`,
          description: `${booking.client_name} - ${booking.service_type}`,
          timestamp: booking.booking_date,
          status: booking.status,
          icon: 'ri-calendar-line',
          color: 'text-blue-500'
        });
      });
  }

  // Ajouter les projets récents
  if (portfolioProjects) {
    portfolioProjects
      .sort((a, b) => new Date(b._creationTime || 0).getTime() - new Date(a._creationTime || 0).getTime())
      .slice(0, 2)
      .forEach(project => {
        activities.push({
          id: `project-${project._id}`,
          type: 'page',
          title: `Projet ${project.title}`,
          description: `${project.category} - ${project.is_active ? 'Actif' : 'Inactif'}`,
          timestamp: project._creationTime || new Date().toISOString(),
          status: project.is_active ? 'published' : 'draft',
          icon: 'ri-image-line',
          color: 'text-green-500'
        });
      });
  }

  // Ajouter les témoignages récents
  if (testimonials) {
    testimonials
      .sort((a, b) => new Date(b._creationTime || 0).getTime() - new Date(a._creationTime || 0).getTime())
      .slice(0, 2)
      .forEach(testimonial => {
        activities.push({
          id: `testimonial-${testimonial._id}`,
          type: 'article',
          title: `Témoignage ${testimonial.author}`,
          description: `${testimonial.role} - ${testimonial.is_active ? 'Actif' : 'Inactif'}`,
          timestamp: testimonial._creationTime || new Date().toISOString(),
          status: testimonial.is_active ? 'published' : 'draft',
          icon: 'ri-chat-quote-line',
          color: 'text-purple-500'
        });
      });
  }

  // Trier par timestamp et prendre les 5 plus récents
  const recentActivities = activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'published': return 'Publié';
      case 'draft': return 'Brouillon';
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmé';
      case 'cancelled': return 'Annulé';
      default: return status || '';
    }
  };

  if (recentActivities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Activité récente
        </h3>
        <div className="text-center py-8">
          <i className="ri-time-line text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">Aucune activité récente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Activité récente
        </h3>
        <span className="text-sm text-gray-500">
          {recentActivities.length} activité{recentActivities.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-4">
        {recentActivities.map((activity, index) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg bg-gray-100 ${activity.color}`}>
              <i className={`${activity.icon} text-sm`}></i>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </p>
                {activity.status && (
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                    {getStatusLabel(activity.status)}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 truncate">
                {activity.description}
              </p>
              
              <p className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(new Date(activity.timestamp), { 
                  addSuffix: true, 
                  locale: fr 
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <a
          href="#"
          className="text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          Voir toute l'activité →
        </a>
      </div>
    </div>
  );
}
