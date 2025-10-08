import { EmailService, type EmailData } from './email'
import { SMSService, type SMSNotificationData } from './sms'
import { NotificationService } from './notifications'

export interface UnifiedNotificationData extends EmailData, SMSNotificationData {
  sendEmail?: boolean
  sendSMS?: boolean
  sendInApp?: boolean
}

export class UnifiedNotificationService {
  // Envoyer une notification de confirmation de devis
  static async sendQuoteConfirmation(data: UnifiedNotificationData) {
    const results = []

    // Email
    if (data.sendEmail !== false && data.email) {
      try {
        const emailResult = await EmailService.sendQuoteConfirmation(data)
        results.push({ type: 'email', success: true, result: emailResult })
      } catch (error) {
        results.push({ type: 'email', success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    // SMS
    if (data.sendSMS && data.phone) {
      try {
        const smsResult = await SMSService.sendQuoteConfirmation(data)
        results.push({ type: 'sms', success: smsResult.success, result: smsResult })
      } catch (error) {
        results.push({ type: 'sms', success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    // Notification in-app
    if (data.sendInApp !== false) {
      NotificationService.success(
        'Devis confirmé',
        'Votre demande de devis a été envoyée avec succès'
      )
    }

    return results
  }

  // Envoyer une notification de confirmation de rendez-vous
  static async sendBookingConfirmation(data: UnifiedNotificationData) {
    const results = []

    // Email
    if (data.sendEmail !== false && data.email) {
      try {
        const emailResult = await EmailService.sendBookingConfirmation(data)
        results.push({ type: 'email', success: true, result: emailResult })
      } catch (error) {
        results.push({ type: 'email', success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    // SMS
    if (data.sendSMS && data.phone) {
      try {
        const smsResult = await SMSService.sendBookingConfirmation(data)
        results.push({ type: 'sms', success: smsResult.success, result: smsResult })
      } catch (error) {
        results.push({ type: 'sms', success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    // Notification in-app
    if (data.sendInApp !== false) {
      NotificationService.success(
        'Rendez-vous confirmé',
        `Votre rendez-vous du ${data.date} à ${data.time} a été confirmé`
      )
    }

    return results
  }

  // Envoyer une notification de rappel de rendez-vous
  static async sendBookingReminder(data: UnifiedNotificationData) {
    const results = []

    // Email
    if (data.sendEmail !== false && data.email) {
      try {
        const emailResult = await EmailService.sendBookingReminder(data)
        results.push({ type: 'email', success: true, result: emailResult })
      } catch (error) {
        results.push({ type: 'email', success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    // SMS
    if (data.sendSMS && data.phone) {
      try {
        const smsResult = await SMSService.sendBookingReminder(data)
        results.push({ type: 'sms', success: smsResult.success, result: smsResult })
      } catch (error) {
        results.push({ type: 'sms', success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    // Notification in-app
    if (data.sendInApp !== false) {
      NotificationService.info(
        'Rappel de rendez-vous',
        `Rendez-vous prévu demain à ${data.time}`
      )
    }

    return results
  }

  // Envoyer une notification de mise à jour de projet
  static async sendProjectUpdate(data: UnifiedNotificationData & { projectTitle: string, update: string }) {
    const results = []

    // Email
    if (data.sendEmail !== false && data.email) {
      try {
        const emailResult = await EmailService.sendProjectUpdate(data)
        results.push({ type: 'email', success: true, result: emailResult })
      } catch (error) {
        results.push({ type: 'email', success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    // SMS
    if (data.sendSMS && data.phone) {
      try {
        const smsResult = await SMSService.sendProjectUpdate(data)
        results.push({ type: 'sms', success: smsResult.success, result: smsResult })
      } catch (error) {
        results.push({ type: 'sms', success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    // Notification in-app
    if (data.sendInApp !== false) {
      NotificationService.info(
        'Mise à jour de projet',
        `Nouvelle mise à jour pour ${data.projectTitle}`
      )
    }

    return results
  }

  // Envoyer une notification de facture
  static async sendInvoiceNotification(data: UnifiedNotificationData & { invoiceNumber: string, amount: number, dueDate: string }) {
    const results = []

    // Email
    if (data.sendEmail !== false && data.email) {
      try {
        const emailResult = await EmailService.sendInvoice(data)
        results.push({ type: 'email', success: true, result: emailResult })
      } catch (error) {
        results.push({ type: 'email', success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    // SMS
    if (data.sendSMS && data.phone) {
      try {
        const smsResult = await SMSService.sendInvoiceNotification(data)
        results.push({ type: 'sms', success: smsResult.success, result: smsResult })
      } catch (error) {
        results.push({ type: 'sms', success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    // Notification in-app
    if (data.sendInApp !== false) {
      NotificationService.warning(
        'Nouvelle facture',
        `Facture ${data.invoiceNumber} de ${data.amount.toLocaleString('fr-FR')}€ disponible`
      )
    }

    return results
  }

  // Envoyer une notification de bienvenue
  static async sendWelcomeNotification(data: UnifiedNotificationData) {
    const results = []

    // Email
    if (data.sendEmail !== false && data.email) {
      try {
        const emailResult = await EmailService.sendWelcomeEmail(data)
        results.push({ type: 'email', success: true, result: emailResult })
      } catch (error) {
        results.push({ type: 'email', success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    // SMS
    if (data.sendSMS && data.phone) {
      try {
        const smsResult = await SMSService.sendSMS({
          to: data.phone,
          message: `Bienvenue chez DR RAVALEMENT ${data.name} ! Votre espace client est maintenant actif. +33 1 39 58 90 15`
        })
        results.push({ type: 'sms', success: smsResult.success, result: smsResult })
      } catch (error) {
        results.push({ type: 'sms', success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    // Notification in-app
    if (data.sendInApp !== false) {
      NotificationService.success(
        'Bienvenue !',
        'Votre compte a été créé avec succès'
      )
    }

    return results
  }

  // Envoyer une notification de contact
  static async sendContactNotification(data: UnifiedNotificationData) {
    const results = []

    // Email (vers l'équipe)
    if (data.sendEmail !== false) {
      try {
        const emailResult = await EmailService.sendContactForm(data)
        results.push({ type: 'email', success: true, result: emailResult })
      } catch (error) {
        results.push({ type: 'email', success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    // SMS de confirmation au client
    if (data.sendSMS && data.phone) {
      try {
        const smsResult = await SMSService.sendSMS({
          to: data.phone,
          message: `Merci ${data.name} ! Votre message a été reçu. Nous vous recontacterons sous 24h. DR RAVALEMENT`
        })
        results.push({ type: 'sms', success: smsResult.success, result: smsResult })
      } catch (error) {
        results.push({ type: 'sms', success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    // Notification in-app
    if (data.sendInApp !== false) {
      NotificationService.success(
        'Message envoyé',
        'Votre message a été envoyé avec succès'
      )
    }

    return results
  }

  // Envoyer une notification d'urgence
  static async sendUrgentNotification(data: UnifiedNotificationData & { urgentMessage: string }) {
    const results = []

    // Email
    if (data.sendEmail !== false && data.email) {
      try {
        const emailResult = await EmailService.sendContactForm({
          ...data,
          message: `URGENT: ${data.urgentMessage}`
        })
        results.push({ type: 'email', success: true, result: emailResult })
      } catch (error) {
        results.push({ type: 'email', success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    // SMS
    if (data.sendSMS && data.phone) {
      try {
        const smsResult = await SMSService.sendUrgentNotification(data)
        results.push({ type: 'sms', success: smsResult.success, result: smsResult })
      } catch (error) {
        results.push({ type: 'sms', success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    // Notification in-app
    if (data.sendInApp !== false) {
      NotificationService.error(
        'Notification urgente',
        data.urgentMessage
      )
    }

    return results
  }
}

// Hook React pour les notifications unifiées
export function useUnifiedNotifications() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendQuoteConfirmation = async (data: UnifiedNotificationData) => {
    setLoading(true)
    setError(null)

    try {
      const results = await UnifiedNotificationService.sendQuoteConfirmation(data)
      return results
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const sendBookingConfirmation = async (data: UnifiedNotificationData) => {
    setLoading(true)
    setError(null)

    try {
      const results = await UnifiedNotificationService.sendBookingConfirmation(data)
      return results
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const sendBookingReminder = async (data: UnifiedNotificationData) => {
    setLoading(true)
    setError(null)

    try {
      const results = await UnifiedNotificationService.sendBookingReminder(data)
      return results
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const sendProjectUpdate = async (data: UnifiedNotificationData & { projectTitle: string, update: string }) => {
    setLoading(true)
    setError(null)

    try {
      const results = await UnifiedNotificationService.sendProjectUpdate(data)
      return results
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const sendInvoiceNotification = async (data: UnifiedNotificationData & { invoiceNumber: string, amount: number, dueDate: string }) => {
    setLoading(true)
    setError(null)

    try {
      const results = await UnifiedNotificationService.sendInvoiceNotification(data)
      return results
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const sendWelcomeNotification = async (data: UnifiedNotificationData) => {
    setLoading(true)
    setError(null)

    try {
      const results = await UnifiedNotificationService.sendWelcomeNotification(data)
      return results
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const sendContactNotification = async (data: UnifiedNotificationData) => {
    setLoading(true)
    setError(null)

    try {
      const results = await UnifiedNotificationService.sendContactNotification(data)
      return results
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const sendUrgentNotification = async (data: UnifiedNotificationData & { urgentMessage: string }) => {
    setLoading(true)
    setError(null)

    try {
      const results = await UnifiedNotificationService.sendUrgentNotification(data)
      return results
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
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
    clearError: () => setError(null)
  }
}
