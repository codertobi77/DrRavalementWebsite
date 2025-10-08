import { useState } from 'react'
// import { Twilio } from 'twilio'
// Note: Installer twilio avec: npm install twilio

const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID
const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN
const fromNumber = import.meta.env.VITE_TWILIO_PHONE_NUMBER

// const client = new Twilio(accountSid, authToken)
// Note: Décommenter après installation de twilio

export interface SMSData {
  to: string
  message: string
}

export interface SMSNotificationData {
  name: string
  phone: string
  date?: string
  time?: string
  projectType?: string
  address?: string
}

export class SMSService {
  // Envoyer un SMS simple
  static async sendSMS(data: SMSData) {
    try {
      // TODO: Implémenter avec Twilio après installation
      console.log('SMS would be sent:', data)
      return {
        success: true,
        messageId: 'mock-message-id',
        status: 'sent'
      }
    } catch (error) {
      console.error('Error sending SMS:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Envoyer un SMS de confirmation de rendez-vous
  static async sendBookingConfirmation(data: SMSNotificationData) {
    const message = `Bonjour ${data.name}, votre rendez-vous est confirmé pour le ${data.date} à ${data.time}. Service: ${data.projectType || 'Consultation'}. DR RAVALEMENT - +33 1 39 58 90 15`
    
    return await this.sendSMS({
      to: data.phone,
      message
    })
  }

  // Envoyer un SMS de rappel de rendez-vous
  static async sendBookingReminder(data: SMSNotificationData) {
    const message = `Rappel: Votre rendez-vous DR RAVALEMENT est prévu demain à ${data.time}. En cas d'empêchement, appelez le +33 1 39 58 90 15`
    
    return await this.sendSMS({
      to: data.phone,
      message
    })
  }

  // Envoyer un SMS de confirmation de devis
  static async sendQuoteConfirmation(data: SMSNotificationData) {
    const message = `Merci ${data.name} ! Votre demande de devis a été reçue. Notre équipe vous contactera sous 24h. DR RAVALEMENT - +33 1 39 58 90 15`
    
    return await this.sendSMS({
      to: data.phone,
      message
    })
  }

  // Envoyer un SMS de mise à jour de projet
  static async sendProjectUpdate(data: SMSNotificationData & { update: string }) {
    const message = `Mise à jour projet: ${data.update}. Connectez-vous à votre espace client pour plus de détails. DR RAVALEMENT`
    
    return await this.sendSMS({
      to: data.phone,
      message
    })
  }

  // Envoyer un SMS de facture
  static async sendInvoiceNotification(data: SMSNotificationData & { invoiceNumber: string, amount: number }) {
    const message = `Nouvelle facture ${data.invoiceNumber} de ${data.amount.toLocaleString('fr-FR')}€ disponible. Consultez votre espace client. DR RAVALEMENT`
    
    return await this.sendSMS({
      to: data.phone,
      message
    })
  }

  // Envoyer un SMS d'urgence
  static async sendUrgentNotification(data: SMSNotificationData & { urgentMessage: string }) {
    const message = `URGENT: ${data.urgentMessage}. DR RAVALEMENT - +33 1 39 58 90 15`
    
    return await this.sendSMS({
      to: data.phone,
      message
    })
  }

  // Vérifier le statut d'un SMS
  static async getSMSStatus(messageId: string) {
    try {
      // TODO: Implémenter avec Twilio après installation
      return {
        success: true,
        status: 'delivered',
        direction: 'outbound',
        dateCreated: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error fetching SMS status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Obtenir l'historique des SMS
  static async getSMSHistory(limit: number = 50) {
    try {
      // TODO: Implémenter avec Twilio après installation
      return {
        success: true,
        messages: []
      }
    } catch (error) {
      console.error('Error fetching SMS history:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Hook React pour les SMS
export function useSMS() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendSMS = async (data: SMSData) => {
    setLoading(true)
    setError(null)

    try {
      const result = await SMSService.sendSMS(data)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const sendBookingConfirmation = async (data: SMSNotificationData) => {
    setLoading(true)
    setError(null)

    try {
      const result = await SMSService.sendBookingConfirmation(data)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const sendBookingReminder = async (data: SMSNotificationData) => {
    setLoading(true)
    setError(null)

    try {
      const result = await SMSService.sendBookingReminder(data)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
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
    sendSMS,
    sendBookingConfirmation,
    sendBookingReminder,
    clearError: () => setError(null)
  }
}
