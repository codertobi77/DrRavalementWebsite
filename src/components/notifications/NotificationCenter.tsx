import { useNotifications } from '../../lib/notifications'

export default function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'ri-check-line text-green-600'
      case 'error':
        return 'ri-error-warning-line text-red-600'
      case 'warning':
        return 'ri-alert-line text-yellow-600'
      case 'info':
      default:
        return 'ri-information-line text-blue-600'
    }
  }

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'À l\'instant'
    if (minutes < 60) return `Il y a ${minutes} min`
    if (hours < 24) return `Il y a ${hours}h`
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <i className="ri-notification-line text-orange-600"></i>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-600">
                {unreadCount > 0 ? `${unreadCount} nouvelle${unreadCount > 1 ? 's' : ''}` : 'Aucune nouvelle notification'}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Tout marquer comme lu
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <i className="ri-notification-off-line text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600">Aucune notification</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getNotificationBgColor(notification.type)}`}>
                    <i className={`${getNotificationIcon(notification.type)} text-sm`}></i>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-gray-500 hover:text-gray-700"
                            title="Marquer comme lu"
                          >
                            <i className="ri-check-line"></i>
                          </button>
                        )}
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="text-xs text-gray-500 hover:text-red-600"
                          title="Supprimer"
                        >
                          <i className="ri-close-line"></i>
                        </button>
                      </div>
                    </div>
                    
                    {notification.actionUrl && (
                      <div className="mt-3">
                        <a
                          href={notification.actionUrl}
                          className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                        >
                          Voir les détails →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{notifications.length} notification{notifications.length > 1 ? 's' : ''}</span>
            <button
              onClick={() => notifications.forEach(n => removeNotification(n.id))}
              className="text-red-600 hover:text-red-700"
            >
              Tout supprimer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
