export interface NotificationData {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

export class NotificationService {
  private static notifications: NotificationData[] = []
  private static listeners: ((notifications: NotificationData[]) => void)[] = []

  // Ajouter une notification
  static addNotification(notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>) {
    const newNotification: NotificationData = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    }

    this.notifications.unshift(newNotification)
    this.notifyListeners()
  }

  // Marquer une notification comme lue
  static markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id)
    if (notification) {
      notification.read = true
      this.notifyListeners()
    }
  }

  // Marquer toutes les notifications comme lues
  static markAllAsRead() {
    this.notifications.forEach(n => n.read = true)
    this.notifyListeners()
  }

  // Supprimer une notification
  static removeNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id)
    this.notifyListeners()
  }

  // Obtenir toutes les notifications
  static getNotifications(): NotificationData[] {
    return [...this.notifications]
  }

  // Obtenir les notifications non lues
  static getUnreadNotifications(): NotificationData[] {
    return this.notifications.filter(n => !n.read)
  }

  // Compter les notifications non lues
  static getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length
  }

  // S'abonner aux changements
  static subscribe(listener: (notifications: NotificationData[]) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  // Notifier les listeners
  private static notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]))
  }

  // Méthodes de convenance pour différents types de notifications
  static success(title: string, message: string, actionUrl?: string) {
    this.addNotification({
      type: 'success',
      title,
      message,
      actionUrl,
    })
  }

  static error(title: string, message: string, actionUrl?: string) {
    this.addNotification({
      type: 'error',
      title,
      message,
      actionUrl,
    })
  }

  static warning(title: string, message: string, actionUrl?: string) {
    this.addNotification({
      type: 'warning',
      title,
      message,
      actionUrl,
    })
  }

  static info(title: string, message: string, actionUrl?: string) {
    this.addNotification({
      type: 'info',
      title,
      message,
      actionUrl,
    })
  }
}

// Hook React pour les notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Initialiser avec les notifications existantes
    setNotifications(NotificationService.getNotifications())
    setUnreadCount(NotificationService.getUnreadCount())

    // S'abonner aux changements
    const unsubscribe = NotificationService.subscribe((newNotifications) => {
      setNotifications(newNotifications)
      setUnreadCount(NotificationService.getUnreadCount())
    })

    return unsubscribe
  }, [])

  const addNotification = (notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>) => {
    NotificationService.addNotification(notification)
  }

  const markAsRead = (id: string) => {
    NotificationService.markAsRead(id)
  }

  const markAllAsRead = () => {
    NotificationService.markAllAsRead()
  }

  const removeNotification = (id: string) => {
    NotificationService.removeNotification(id)
  }

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
  }
}
