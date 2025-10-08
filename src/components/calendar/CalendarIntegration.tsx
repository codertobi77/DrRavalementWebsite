import { useState } from 'react'
import { useCalendar } from '../../lib/calendar'

interface CalendarIntegrationProps {
  onEventCreated?: (event: any) => void
  onEventUpdated?: (event: any) => void
  onEventDeleted?: (eventId: string) => void
}

export default function CalendarIntegration({ 
  onEventCreated, 
  onEventUpdated, 
  onEventDeleted 
}: CalendarIntegrationProps) {
  const {
    loading,
    error,
    isAuthenticated,
    authenticate,
    handleAuthCallback,
    createBookingEvent,
    updateBookingEvent,
    deleteBookingEvent,
    getEvents,
    checkAvailability,
    getAvailableTimeSlots,
    clearError
  } = useCalendar()

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authCode, setAuthCode] = useState('')

  const handleAuthenticate = () => {
    setShowAuthModal(true)
    authenticate()
  }

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authCode) return

    try {
      await handleAuthCallback(authCode)
      setShowAuthModal(false)
      setAuthCode('')
    } catch (err) {
      console.error('Auth error:', err)
    }
  }

  const createEvent = async (eventData: any) => {
    try {
      const event = await createBookingEvent(eventData)
      onEventCreated?.(event)
      return event
    } catch (err) {
      console.error('Error creating event:', err)
      throw err
    }
  }

  const updateEvent = async (eventId: string, eventData: any) => {
    try {
      const event = await updateBookingEvent(eventId, eventData)
      onEventUpdated?.(event)
      return event
    } catch (err) {
      console.error('Error updating event:', err)
      throw err
    }
  }

  const deleteEvent = async (eventId: string) => {
    try {
      await deleteBookingEvent(eventId)
      onEventDeleted?.(eventId)
    } catch (err) {
      console.error('Error deleting event:', err)
      throw err
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-calendar-line text-2xl text-orange-600"></i>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Intégration Google Calendar
          </h3>
          
          <p className="text-gray-600 mb-6">
            Connectez votre calendrier Google pour synchroniser automatiquement vos rendez-vous.
          </p>
          
          <button
            onClick={handleAuthenticate}
            disabled={loading}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connexion...' : 'Connecter Google Calendar'}
          </button>
        </div>

        {/* Modal d'authentification */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Code d'autorisation
              </h3>
              
              <p className="text-gray-600 mb-4">
                Après avoir autorisé l'application, copiez le code d'autorisation ici :
              </p>
              
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code d'autorisation
                  </label>
                  <input
                    type="text"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Collez le code ici"
                    required
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading || !authCode}
                    className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Connexion...' : 'Confirmer'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <i className="ri-calendar-check-line text-green-600"></i>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Google Calendar connecté
            </h3>
            <p className="text-sm text-gray-600">
              Synchronisation automatique activée
            </p>
          </div>
        </div>
        
        <button
          onClick={clearError}
          className="text-gray-500 hover:text-gray-700"
        >
          <i className="ri-refresh-line"></i>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg">
          <div className="flex items-center">
            <i className="ri-error-warning-line mr-2"></i>
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <i className="ri-calendar-line text-orange-600"></i>
              <span className="text-sm font-medium text-gray-700">Événements</span>
            </div>
            <p className="text-xs text-gray-600">
              Synchronisation automatique des rendez-vous
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <i className="ri-notification-line text-orange-600"></i>
              <span className="text-sm font-medium text-gray-700">Rappels</span>
            </div>
            <p className="text-xs text-gray-600">
              Notifications automatiques 24h avant
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <i className="ri-time-line text-orange-600"></i>
              <span className="text-sm font-medium text-gray-700">Disponibilité</span>
            </div>
            <p className="text-xs text-gray-600">
              Vérification automatique des créneaux
            </p>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <i className="ri-information-line text-orange-600"></i>
            <span className="text-sm font-medium text-orange-800">Fonctionnalités activées</span>
          </div>
          <ul className="text-xs text-orange-700 space-y-1">
            <li>• Création automatique d'événements</li>
            <li>• Mise à jour en temps réel</li>
            <li>• Rappels par email et SMS</li>
            <li>• Vérification des conflits</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// Hook pour utiliser l'intégration calendrier
export function useCalendarIntegration() {
  const {
    loading,
    error,
    isAuthenticated,
    createBookingEvent,
    updateBookingEvent,
    deleteBookingEvent,
    getEvents,
    checkAvailability,
    getAvailableTimeSlots,
    clearError
  } = useCalendar()

  return {
    loading,
    error,
    isAuthenticated,
    createBookingEvent,
    updateBookingEvent,
    deleteBookingEvent,
    getEvents,
    checkAvailability,
    getAvailableTimeSlots,
    clearError
  }
}
