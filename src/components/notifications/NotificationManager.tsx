import { useState, useEffect } from 'react'
import { useUnifiedNotifications } from '../../lib/notifications-unified'
import { useNotifications } from '../../lib/notifications'

interface NotificationManagerProps {
  children: React.ReactNode
}

export default function NotificationManager({ children }: NotificationManagerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [notificationQueue, setNotificationQueue] = useState<any[]>([])
  const [currentNotification, setCurrentNotification] = useState<any>(null)

  const { 
    loading, 
    error, 
    sendQuoteConfirmation,
    sendBookingConfirmation,
    sendBookingReminder,
    sendProjectUpdate,
    sendInvoiceNotification,
    sendWelcomeNotification,
    sendContactNotification,
    sendUrgentNotification,
    clearError 
  } = useUnifiedNotifications()

  const { addNotification } = useNotifications()

  // Gérer la queue de notifications
  useEffect(() => {
    if (notificationQueue.length > 0 && !currentNotification) {
      const nextNotification = notificationQueue[0]
      setCurrentNotification(nextNotification)
      setNotificationQueue(prev => prev.slice(1))
    }
  }, [notificationQueue, currentNotification])

  // Traiter la notification courante
  useEffect(() => {
    if (currentNotification) {
      processNotification(currentNotification)
    }
  }, [currentNotification])

  const processNotification = async (notification: any) => {
    try {
      let result
      
      switch (notification.type) {
        case 'quote_confirmation':
          result = await sendQuoteConfirmation(notification.data)
          break
        case 'booking_confirmation':
          result = await sendBookingConfirmation(notification.data)
          break
        case 'booking_reminder':
          result = await sendBookingReminder(notification.data)
          break
        case 'project_update':
          result = await sendProjectUpdate(notification.data)
          break
        case 'invoice_notification':
          result = await sendInvoiceNotification(notification.data)
          break
        case 'welcome_notification':
          result = await sendWelcomeNotification(notification.data)
          break
        case 'contact_notification':
          result = await sendContactNotification(notification.data)
          break
        case 'urgent_notification':
          result = await sendUrgentNotification(notification.data)
          break
        default:
          throw new Error('Type de notification non reconnu')
      }

      // Afficher le résultat
      const successCount = result.filter((r: any) => r.success).length
      const totalCount = result.length

      if (successCount === totalCount) {
        addNotification({
          type: 'success',
          title: 'Notification envoyée',
          message: `Toutes les notifications ont été envoyées avec succès (${successCount}/${totalCount})`
        })
      } else if (successCount > 0) {
        addNotification({
          type: 'warning',
          title: 'Notification partiellement envoyée',
          message: `${successCount}/${totalCount} notifications envoyées avec succès`
        })
      } else {
        addNotification({
          type: 'error',
          title: 'Erreur d\'envoi',
          message: 'Aucune notification n\'a pu être envoyée'
        })
      }

    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Erreur de notification',
        message: err.message || 'Erreur inconnue'
      })
    } finally {
      setCurrentNotification(null)
    }
  }

  const queueNotification = (type: string, data: any) => {
    setNotificationQueue(prev => [...prev, { type, data }])
  }

  // Exposer les fonctions via le contexte ou les props
  const notificationManager = {
    queueNotification,
    isProcessing: !!currentNotification,
    loading,
    error,
    clearError
  }

  return (
    <div className="relative">
      {children}
      
      {/* Indicateur de traitement */}
      {currentNotification && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Envoi en cours...</p>
                <p className="text-xs text-gray-500">
                  {currentNotification.type.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Erreur globale */}
      {error && (
        <div className="fixed top-4 left-4 z-50">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-sm">
            <div className="flex items-center space-x-3">
              <i className="ri-error-warning-line text-red-600"></i>
              <div>
                <p className="text-sm font-medium text-red-800">Erreur</p>
                <p className="text-xs text-red-600">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Hook pour utiliser le gestionnaire de notifications
export function useNotificationManager() {
  const [manager, setManager] = useState<any>(null)

  useEffect(() => {
    // Cette fonction sera appelée par le NotificationManager
    const setNotificationManager = (managerInstance: any) => {
      setManager(managerInstance)
    }

    // Exposer la fonction globalement
    ;(window as any).setNotificationManager = setNotificationManager
  }, [])

  const queueNotification = (type: string, data: any) => {
    if (manager) {
      manager.queueNotification(type, data)
    }
  }

  return {
    queueNotification,
    isProcessing: manager?.isProcessing || false,
    loading: manager?.loading || false,
    error: manager?.error || null
  }
}
