import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../components/feature/Header';
import Footer from '../../../components/feature/Footer';
import Button from '../../../components/base/Button';
import { BookingService, type Booking } from '../../../lib/booking';

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await BookingService.getBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
      setError('Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      await BookingService.updateBookingStatus(bookingId, status);
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status } : booking
      ));
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error updating booking status:', error);
      setError('Erreur lors de la mise à jour du statut');
    }
  };

  const deleteBooking = async (bookingId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      return;
    }

    try {
      await BookingService.deleteBooking(bookingId);
      setBookings(bookings.filter(booking => booking.id !== bookingId));
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error deleting booking:', error);
      setError('Erreur lors de la suppression');
    }
  };

  const filteredBookings = bookings.filter(booking => 
    filter === 'all' || booking.status === filter
  );

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmé';
      case 'cancelled': return 'Annulé';
      case 'completed': return 'Terminé';
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
                  Gestion des réservations
                </h1>
                <p className="text-gray-600">
                  Gérez les rendez-vous et leurs statuts
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

          {/* Filtres */}
          <div className="mb-6 bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Filtrer par statut :</span>
              <div className="flex space-x-2">
                {[
                  { key: 'all', label: 'Tous', count: bookings.length },
                  { key: 'pending', label: 'En attente', count: bookings.filter(b => b.status === 'pending').length },
                  { key: 'confirmed', label: 'Confirmés', count: bookings.filter(b => b.status === 'confirmed').length },
                  { key: 'cancelled', label: 'Annulés', count: bookings.filter(b => b.status === 'cancelled').length },
                  { key: 'completed', label: 'Terminés', count: bookings.filter(b => b.status === 'completed').length }
                ].map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key as any)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filter === key
                        ? 'bg-orange-100 text-orange-700 border border-orange-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {label} ({count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Liste des réservations */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <i className="ri-calendar-line text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucune réservation trouvée
                </h3>
                <p className="text-gray-600">
                  {filter === 'all' 
                    ? 'Aucune réservation n\'a encore été créée'
                    : `Aucune réservation avec le statut "${getStatusLabel(filter as any)}"`
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Heure
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.client_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.client_email}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.client_phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {booking.service_type}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.duration} min
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(booking.booking_date).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.booking_time}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                            {getStatusLabel(booking.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedBooking(booking)}
                              className="text-orange-600 hover:text-orange-900"
                            >
                              <i className="ri-eye-line"></i>
                            </button>
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                              disabled={booking.status === 'confirmed'}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <i className="ri-check-line"></i>
                            </button>
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                              disabled={booking.status === 'cancelled'}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <i className="ri-close-line"></i>
                            </button>
                            <button
                              onClick={() => deleteBooking(booking.id)}
                              className="text-gray-600 hover:text-gray-900"
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
            )}
          </div>
        </div>
      </div>

      {/* Modal de détails */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdateStatus={updateBookingStatus}
          onDelete={deleteBooking}
        />
      )}
      
      <Footer />
    </div>
  );
}

// Modal de détails de la réservation
function BookingDetailsModal({ 
  booking, 
  onClose, 
  onUpdateStatus, 
  onDelete 
}: {
  booking: Booking;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Booking['status']) => void;
  onDelete: (id: string) => void;
}) {
  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmé';
      case 'cancelled': return 'Annulé';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Détails de la réservation
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* Informations client */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Informations client</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <p className="text-sm text-gray-900">{booking.client_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm text-gray-900">{booking.client_email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <p className="text-sm text-gray-900">{booking.client_phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Statut</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                  {getStatusLabel(booking.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Détails du rendez-vous */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Détails du rendez-vous</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Service</label>
                <p className="text-sm text-gray-900">{booking.service_type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Durée</label>
                <p className="text-sm text-gray-900">{booking.duration} minutes</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <p className="text-sm text-gray-900">
                  {new Date(booking.booking_date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Heure</label>
                <p className="text-sm text-gray-900">{booking.booking_time}</p>
              </div>
            </div>
          </div>

          {/* Adresse et notes */}
          {(booking.address || booking.notes) && (
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">Informations supplémentaires</h4>
              {booking.address && (
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700">Adresse</label>
                  <p className="text-sm text-gray-900">{booking.address}</p>
                </div>
              )}
              {booking.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <p className="text-sm text-gray-900">{booking.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            {booking.status === 'pending' && (
              <Button
                onClick={() => onUpdateStatus(booking.id, 'confirmed')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <i className="ri-check-line mr-2"></i>
                Confirmer
              </Button>
            )}
            {booking.status === 'confirmed' && (
              <Button
                onClick={() => onUpdateStatus(booking.id, 'completed')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <i className="ri-check-double-line mr-2"></i>
                Marquer comme terminé
              </Button>
            )}
            {booking.status !== 'cancelled' && (
              <Button
                onClick={() => onUpdateStatus(booking.id, 'cancelled')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <i className="ri-close-line mr-2"></i>
                Annuler
              </Button>
            )}
            <Button
              onClick={() => onDelete(booking.id)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <i className="ri-delete-bin-line mr-2"></i>
              Supprimer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
