import { useState } from 'react';
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import AdminLayout from '../../../components/admin/AdminLayout';
import Button from '../../../components/base/Button';
import ConfirmationModal from '../../../components/base/ConfirmationModal';
import { useOptimizedAdminBookings, useOptimizedAdminBookingsByStatus, useOptimizedAdminBookingStats } from '../../../hooks/useOptimizedCmsData';
import { useToast } from '../../../contexts/ToastContext';
import { useConfirmation } from '../../../hooks/useConfirmation';

interface Booking {
  _id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  service_type: string;
  booking_date: string;
  address?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export default function BookingManagement() {
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Hooks pour les toasters et confirmations
  const { showSuccess, showError, showWarning } = useToast();
  const { isOpen, isLoading, options, confirm, handleConfirm, handleCancel } = useConfirmation();

  // Utiliser les hooks optimisés avec cache
  const { data: allBookings, isLoading: allBookingsLoading, refresh: refreshAllBookings } = useOptimizedAdminBookings();
  const { data: bookingsByStatus, isLoading: bookingsByStatusLoading, refresh: refreshBookingsByStatus } = useOptimizedAdminBookingsByStatus(filter);
  const { data: bookingStats, isLoading: bookingStatsLoading, refresh: refreshBookingStats } = useOptimizedAdminBookingStats();

  // Mutations et Actions
  const updateBooking = useMutation(api.bookings.updateBooking);
  const deleteBooking = useMutation(api.bookings.deleteBooking);
  const confirmBooking = useAction(api.bookings.confirmBooking);

  // Utiliser les données filtrées ou toutes les réservations
  const bookings = filter === 'all' ? allBookings : bookingsByStatus;
  const loading = filter === 'all' ? allBookingsLoading : bookingsByStatusLoading;

  // Filtrer les réservations par terme de recherche
  const filteredBookings = bookings?.filter(booking => {
    const matchesSearch = booking.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }) || [];

  const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      await updateBooking({ id: bookingId as any, status });
      setSelectedBooking(null);
      refreshAllBookings();
      refreshBookingsByStatus();
      refreshBookingStats();
      showSuccess('Statut mis à jour', 'Le statut de la réservation a été modifié avec succès.');
    } catch (error) {
      console.error('Error updating booking status:', error);
      showError('Erreur de mise à jour', 'Impossible de modifier le statut de la réservation.');
    }
  };

  const confirmBookingWithEmail = async (bookingId: string, adminNotes?: string) => {
    try {
      await confirmBooking({ 
        bookingId: bookingId as any, 
        adminNotes 
      });
      setSelectedBooking(null);
      setError(null);
      refreshAllBookings();
      refreshBookingsByStatus();
      refreshBookingStats();
      showSuccess('Réservation confirmée', 'La réservation a été confirmée et un email a été envoyé au client.');
    } catch (error) {
      console.error('Error confirming booking:', error);
      showError('Erreur de confirmation', 'Impossible de confirmer la réservation.');
    }
  };

  const deleteBookingHandler = async (bookingId: string) => {
    const booking = bookings?.find(b => b._id === bookingId);
    confirm({
      title: 'Supprimer la réservation',
      message: `Êtes-vous sûr de vouloir supprimer la réservation${booking?.client_name ? ` de "${booking.client_name}"` : ''} ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'danger',
      onConfirm: async () => {
        try {
          await deleteBooking({ id: bookingId as any });
          setSelectedBooking(null);
          refreshAllBookings();
          refreshBookingsByStatus();
          refreshBookingStats();
          showSuccess('Réservation supprimée', 'La réservation a été supprimée avec succès.');
        } catch (error) {
          console.error('Error deleting booking:', error);
          showError('Erreur de suppression', 'Impossible de supprimer la réservation.');
        }
      },
    });
  };
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

  if (loading || bookingStatsLoading) {
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
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Réservations</h1>
            <p className="text-gray-600 mt-2">Gérez les rendez-vous et leurs statuts</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button
              onClick={() => {
                refreshAllBookings();
                refreshBookingsByStatus();
                refreshBookingStats();
              }}
              className="bg-gray-600 text-white hover:bg-gray-700"
            >
              <i className="ri-refresh-line mr-2"></i>
              Rafraîchir
            </Button>
            <Button>
              <i className="ri-download-line mr-2"></i>
              Exporter
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

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <i className="ri-calendar-line text-2xl text-blue-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Réservations</p>
                <p className="text-2xl font-bold text-gray-900">{bookingStats?.total || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <i className="ri-time-line text-2xl text-yellow-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-gray-900">{bookingStats?.pending || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <i className="ri-check-line text-2xl text-green-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmées</p>
                <p className="text-2xl font-bold text-gray-900">{bookingStats?.confirmed || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <i className="ri-check-double-line text-2xl text-blue-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Terminées</p>
                <p className="text-2xl font-bold text-gray-900">{bookingStats?.completed || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher
              </label>
              <input
                type="text"
                placeholder="Nom, email, service, adresse..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmées</option>
                <option value="cancelled">Annulées</option>
                <option value="completed">Terminées</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des réservations */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Réservations ({filteredBookings.length})
            </h3>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <i className="ri-calendar-line text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réservation trouvée</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filter !== 'all'
                  ? 'Aucune réservation ne correspond à vos critères de recherche.'
                  : 'Aucune réservation n\'a encore été créée.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <div key={booking._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900 truncate">
                          {booking.client_name}
                        </h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusLabel(booking.status)}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-3">
                        <i className="ri-service-line mr-1"></i>
                        {booking.service_type}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <i className="ri-mail-line mr-1"></i>
                          {booking.client_email}
                        </span>
                        <span className="flex items-center">
                          <i className="ri-phone-line mr-1"></i>
                          {booking.client_phone}
                        </span>
                        <span className="flex items-center">
                          <i className="ri-calendar-line mr-1"></i>
                          {new Date(booking.booking_date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        {booking.address && (
                          <span className="flex items-center">
                            <i className="ri-map-pin-line mr-1"></i>
                            {booking.address}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                        title="Voir détails"
                      >
                        <i className="ri-eye-line text-lg"></i>
                      </button>

                      {booking.status === 'pending' && (
                        <button
                          onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Confirmer"
                        >
                          <i className="ri-check-line text-lg"></i>
                        </button>
                      )}

                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Annuler"
                        >
                          <i className="ri-close-line text-lg"></i>
                        </button>
                      )}

                      <button
                        onClick={() => deleteBookingHandler(booking._id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <i className="ri-delete-bin-line text-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de détails */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdateStatus={updateBookingStatus}
          onConfirmWithEmail={confirmBookingWithEmail}
          onDelete={deleteBookingHandler}
        />
      )}

      {/* Modal de confirmation */}
      <ConfirmationModal
        isOpen={isOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title={options?.title || ''}
        message={options?.message || ''}
        confirmText={options?.confirmText}
        cancelText={options?.cancelText}
        type={options?.type}
        isLoading={isLoading}
      />
    </AdminLayout>
  );
}

// Modal de détails de la réservation
function BookingDetailsModal({ 
  booking, 
  onClose, 
  onUpdateStatus, 
  onConfirmWithEmail,
  onDelete 
}: {
  booking: Booking;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Booking['status']) => void;
  onConfirmWithEmail: (id: string, adminNotes?: string) => void;
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
                onClick={() => onConfirmWithEmail(booking._id)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <i className="ri-mail-send-line mr-2"></i>
                Confirmer et envoyer email
              </Button>
            )}
            {booking.status === 'confirmed' && (
              <Button
                onClick={() => onUpdateStatus(booking._id, 'completed')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <i className="ri-check-double-line mr-2"></i>
                Marquer comme terminé
              </Button>
            )}
            {booking.status !== 'cancelled' && (
              <Button
                onClick={() => onUpdateStatus(booking._id, 'cancelled')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <i className="ri-close-line mr-2"></i>
                Annuler
              </Button>
            )}
            <Button
              onClick={() => onDelete(booking._id)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <i className="ri-delete-bin-line mr-2"></i>
              Supprimer
            </Button>
            <Button
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}