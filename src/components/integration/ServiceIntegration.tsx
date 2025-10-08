import { useState, useEffect } from 'react'
import { useUnifiedNotifications } from '../../lib/notifications-unified'
import { useCalendar } from '../../lib/calendar'
import { useSEO } from '../../lib/seo'

interface ServiceIntegrationProps {
  children: React.ReactNode
}

export default function ServiceIntegration({ children }: ServiceIntegrationProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [services, setServices] = useState({
    email: false,
    sms: false,
    calendar: false,
    seo: true // SEO toujours disponible
  })

  const { 
    loading: notificationLoading, 
    error: notificationError,
    sendQuoteConfirmation,
    sendBookingConfirmation,
    sendBookingReminder,
    sendProjectUpdate,
    sendInvoiceNotification,
    sendWelcomeNotification,
    sendContactNotification,
    sendUrgentNotification
  } = useUnifiedNotifications()

  const {
    loading: calendarLoading,
    error: calendarError,
    isAuthenticated: calendarAuthenticated,
    createBookingEvent,
    updateBookingEvent,
    deleteBookingEvent,
    getEvents,
    checkAvailability,
    getAvailableTimeSlots
  } = useCalendar()

  // Vérifier l'état des services
  useEffect(() => {
    const checkServices = async () => {
      const serviceStatus = {
        email: !!import.meta.env.VITE_RESEND_API_KEY,
        sms: !!(import.meta.env.VITE_TWILIO_ACCOUNT_SID && import.meta.env.VITE_TWILIO_AUTH_TOKEN),
        calendar: calendarAuthenticated,
        seo: true
      }
      
      setServices(serviceStatus)
      setIsInitialized(true)
    }

    checkServices()
  }, [calendarAuthenticated])

  // Fonction pour envoyer une notification complète
  const sendCompleteNotification = async (type: string, data: any) => {
    try {
      let result

      switch (type) {
        case 'quote_confirmation':
          result = await sendQuoteConfirmation(data)
          break
        case 'booking_confirmation':
          result = await sendBookingConfirmation(data)
          break
        case 'booking_reminder':
          result = await sendBookingReminder(data)
          break
        case 'project_update':
          result = await sendProjectUpdate(data)
          break
        case 'invoice_notification':
          result = await sendInvoiceNotification(data)
          break
        case 'welcome_notification':
          result = await sendWelcomeNotification(data)
          break
        case 'contact_notification':
          result = await sendContactNotification(data)
          break
        case 'urgent_notification':
          result = await sendUrgentNotification(data)
          break
        default:
          throw new Error('Type de notification non reconnu')
      }

      return result
    } catch (error) {
      console.error('Error sending notification:', error)
      throw error
    }
  }

  // Fonction pour créer un événement avec notifications
  const createEventWithNotifications = async (eventData: any, notificationData: any) => {
    try {
      // Créer l'événement dans le calendrier
      const event = await createBookingEvent(eventData)
      
      // Envoyer les notifications
      const notifications = await sendCompleteNotification('booking_confirmation', notificationData)
      
      return { event, notifications }
    } catch (error) {
      console.error('Error creating event with notifications:', error)
      throw error
    }
  }

  // Fonction pour mettre à jour un événement avec notifications
  const updateEventWithNotifications = async (eventId: string, eventData: any, notificationData: any) => {
    try {
      // Mettre à jour l'événement
      const event = await updateBookingEvent(eventId, eventData)
      
      // Envoyer les notifications
      const notifications = await sendCompleteNotification('booking_confirmation', notificationData)
      
      return { event, notifications }
    } catch (error) {
      console.error('Error updating event with notifications:', error)
      throw error
    }
  }

  // Fonction pour supprimer un événement avec notifications
  const deleteEventWithNotifications = async (eventId: string, notificationData: any) => {
    try {
      // Supprimer l'événement
      await deleteBookingEvent(eventId)
      
      // Envoyer les notifications d'annulation
      const notifications = await sendCompleteNotification('urgent_notification', {
        ...notificationData,
        urgentMessage: 'Votre rendez-vous a été annulé. Nous vous recontacterons pour reprogrammer.'
      })
      
      return { notifications }
    } catch (error) {
      console.error('Error deleting event with notifications:', error)
      throw error
    }
  }

  // Fonction pour vérifier la disponibilité et envoyer des suggestions
  const checkAvailabilityWithSuggestions = async (date: string, time: string, duration: number = 60) => {
    try {
      const isAvailable = await checkAvailability(date, time, duration)
      
      if (!isAvailable) {
        // Obtenir les créneaux disponibles
        const availableSlots = await getAvailableTimeSlots(date)
        
        return {
          available: false,
          suggestions: availableSlots,
          message: 'Ce créneau n\'est pas disponible. Voici les créneaux disponibles :'
        }
      }
      
      return {
        available: true,
        message: 'Créneau disponible'
      }
    } catch (error) {
      console.error('Error checking availability:', error)
      throw error
    }
  }

  // Fonction pour envoyer un rappel automatique
  const sendAutomaticReminder = async (eventData: any, notificationData: any) => {
    try {
      // Vérifier si c'est 24h avant l'événement
      const eventDate = new Date(`${eventData.date}T${eventData.time}`)
      const now = new Date()
      const diffHours = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60)
      
      if (diffHours <= 24 && diffHours > 0) {
        const notifications = await sendCompleteNotification('booking_reminder', notificationData)
        return { sent: true, notifications }
      }
      
      return { sent: false, message: 'Rappel non nécessaire' }
    } catch (error) {
      console.error('Error sending automatic reminder:', error)
      throw error
    }
  }

  // Fonction pour envoyer une mise à jour de projet
  const sendProjectUpdateWithCalendar = async (projectData: any, updateData: any) => {
    try {
      // Créer un événement de projet dans le calendrier
      const projectEvent = await createBookingEvent({
        clientName: projectData.clientName,
        clientEmail: projectData.clientEmail,
        serviceType: `Projet: ${projectData.title}`,
        date: projectData.startDate,
        time: '09:00',
        duration: 480, // 8 heures
        address: projectData.location
      })
      
      // Envoyer les notifications
      const notifications = await sendCompleteNotification('project_update', updateData)
      
      return { event: projectEvent, notifications }
    } catch (error) {
      console.error('Error sending project update:', error)
      throw error
    }
  }

  // Fonction pour envoyer une facture avec rappel
  const sendInvoiceWithReminder = async (invoiceData: any, reminderData: any) => {
    try {
      // Envoyer la facture
      const invoiceNotifications = await sendCompleteNotification('invoice_notification', invoiceData)
      
      // Programmer un rappel pour 7 jours
      const reminderDate = new Date()
      reminderDate.setDate(reminderDate.getDate() + 7)
      
      const reminderNotifications = await sendCompleteNotification('urgent_notification', {
        ...reminderData,
        urgentMessage: `Rappel: Facture ${invoiceData.invoiceNumber} de ${invoiceData.amount.toLocaleString('fr-FR')}€ à régler`
      })
      
      return { 
        invoice: invoiceNotifications, 
        reminder: reminderNotifications 
      }
    } catch (error) {
      console.error('Error sending invoice with reminder:', error)
      throw error
    }
  }

  // Exposer les fonctions via le contexte
  const integrationContext = {
    // État des services
    services,
    isInitialized,
    loading: notificationLoading || calendarLoading,
    errors: {
      notification: notificationError,
      calendar: calendarError
    },
    
    // Fonctions de notification
    sendCompleteNotification,
    
    // Fonctions de calendrier
    createEventWithNotifications,
    updateEventWithNotifications,
    deleteEventWithNotifications,
    checkAvailabilityWithSuggestions,
    sendAutomaticReminder,
    
    // Fonctions de projet
    sendProjectUpdateWithCalendar,
    sendInvoiceWithReminder,
    
    // Fonctions de base
    createBookingEvent,
    updateBookingEvent,
    deleteBookingEvent,
    getEvents,
    checkAvailability,
    getAvailableTimeSlots
  }

  return (
    <div className="relative">
      {children}
      
      {/* Indicateur de chargement global */}
      {(notificationLoading || calendarLoading) && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Traitement...</p>
                <p className="text-xs text-gray-500">
                  {notificationLoading ? 'Notifications' : 'Calendrier'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Erreurs globales */}
      {(notificationError || calendarError) && (
        <div className="fixed top-4 left-4 z-50">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-sm">
            <div className="flex items-center space-x-3">
              <i className="ri-error-warning-line text-red-600"></i>
              <div>
                <p className="text-sm font-medium text-red-800">Erreur de service</p>
                <p className="text-xs text-red-600">
                  {notificationError || calendarError}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statut des services */}
      {isInitialized && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-2">
              <i className="ri-settings-line text-gray-600"></i>
              <span className="text-sm font-medium text-gray-900">Services</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${services.email ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-gray-600">Email</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${services.sms ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-gray-600">SMS</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${services.calendar ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-gray-600">Calendar</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${services.seo ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-gray-600">SEO</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Hook pour utiliser l'intégration des services
export function useServiceIntegration() {
  const [integration, setIntegration] = useState<any>(null)

  useEffect(() => {
    // Cette fonction sera appelée par le ServiceIntegration
    const setServiceIntegration = (integrationInstance: any) => {
      setIntegration(integrationInstance)
    }

    // Exposer la fonction globalement
    ;(window as any).setServiceIntegration = setServiceIntegration
  }, [])

  return integration
}
