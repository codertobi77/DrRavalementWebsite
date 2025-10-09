import { Resend } from 'resend'

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY)

export interface BookingEmailData {
  clientName: string
  clientEmail: string
  clientPhone: string
  serviceType: string
  date: string
  time: string
  duration: number
  address?: string
  notes?: string
  bookingId: string
}

export class BookingEmailService {
  // Envoyer l'email de confirmation au client
  static async sendClientConfirmation(data: BookingEmailData): Promise<void> {
    try {
      const { error } = await resend.emails.send({
        from: 'DR RAVALEMENT <noreply@dr-ravalement.fr>',
        to: [data.clientEmail],
        subject: `Confirmation de votre rendez-vous - ${data.serviceType}`,
        html: this.generateClientEmailHTML(data)
      })

      if (error) {
        console.error('Error sending client confirmation email:', error)
        throw new Error('Erreur lors de l\'envoi de l\'email de confirmation')
      }

      console.log('Client confirmation email sent successfully')
    } catch (error) {
      console.error('Error in sendClientConfirmation:', error)
      throw error
    }
  }

  // Envoyer l'email de notification au propriétaire
  static async sendOwnerNotification(data: BookingEmailData): Promise<void> {
    try {
      const ownerEmail = import.meta.env.VITE_GOOGLE_OWNER_EMAIL || 'contact@dr-ravalement.fr'
      
      const { error } = await resend.emails.send({
        from: 'DR RAVALEMENT <noreply@dr-ravalement.fr>',
        to: [ownerEmail],
        subject: `Nouveau rendez-vous réservé - ${data.serviceType}`,
        html: this.generateOwnerEmailHTML(data)
      })

      if (error) {
        console.error('Error sending owner notification email:', error)
        throw new Error('Erreur lors de l\'envoi de l\'email de notification')
      }

      console.log('Owner notification email sent successfully')
    } catch (error) {
      console.error('Error in sendOwnerNotification:', error)
      throw error
    }
  }

  // Envoyer les deux emails (client + propriétaire)
  static async sendBookingEmails(data: BookingEmailData): Promise<void> {
    try {
      await Promise.all([
        this.sendClientConfirmation(data),
        this.sendOwnerNotification(data)
      ])
    } catch (error) {
      console.error('Error sending booking emails:', error)
      throw error
    }
  }

  // Générer le HTML pour l'email client
  private static generateClientEmailHTML(data: BookingEmailData): string {
    const formattedDate = new Date(data.date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Confirmation de rendez-vous</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .content { background: white; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
          .booking-details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          .highlight { color: #e67e22; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎨 Confirmation de votre rendez-vous</h1>
            <p>Bonjour <strong>${data.clientName}</strong>,</p>
          </div>
          
          <div class="content">
            <p>Votre rendez-vous a été confirmé avec succès !</p>
            
            <div class="booking-details">
              <h3>📅 Détails du rendez-vous</h3>
              <p><strong>Service :</strong> <span class="highlight">${data.serviceType}</span></p>
              <p><strong>Date :</strong> ${formattedDate}</p>
              <p><strong>Heure :</strong> ${data.time}</p>
              <p><strong>Durée :</strong> ${data.duration} minutes</p>
              ${data.address ? `<p><strong>Adresse :</strong> ${data.address}</p>` : ''}
              ${data.notes ? `<p><strong>Notes :</strong> ${data.notes}</p>` : ''}
            </div>

            <h3>📞 Contact</h3>
            <p>Si vous avez des questions ou souhaitez modifier votre rendez-vous, n'hésitez pas à nous contacter :</p>
            <ul>
              <li>📧 Email : contact@dr-ravalement.fr</li>
              <li>📱 Téléphone : 01 23 45 67 89</li>
            </ul>

            <h3>ℹ️ Informations importantes</h3>
            <ul>
              <li>Merci d'arriver à l'heure prévue</li>
              <li>En cas d'empêchement, merci de nous prévenir au moins 24h à l'avance</li>
              <li>N'hésitez pas à nous faire part de vos questions avant le rendez-vous</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>Merci de votre confiance !</p>
            <p><strong>DR RAVALEMENT</strong> - Votre partenaire ravalement de façade</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  // Générer le HTML pour l'email propriétaire
  private static generateOwnerEmailHTML(data: BookingEmailData): string {
    const formattedDate = new Date(data.date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nouveau rendez-vous réservé</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #e67e22; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .content { background: white; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
          .booking-details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .client-info { background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          .highlight { color: #e67e22; font-weight: bold; }
          .urgent { color: #e74c3c; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Nouveau rendez-vous réservé</h1>
            <p>Un nouveau client a réservé un rendez-vous</p>
          </div>
          
          <div class="content">
            <div class="client-info">
              <h3>👤 Informations client</h3>
              <p><strong>Nom :</strong> ${data.clientName}</p>
              <p><strong>Email :</strong> ${data.clientEmail}</p>
              <p><strong>Téléphone :</strong> ${data.clientPhone}</p>
            </div>
            
            <div class="booking-details">
              <h3>📅 Détails du rendez-vous</h3>
              <p><strong>Service :</strong> <span class="highlight">${data.serviceType}</span></p>
              <p><strong>Date :</strong> ${formattedDate}</p>
              <p><strong>Heure :</strong> ${data.time}</p>
              <p><strong>Durée :</strong> ${data.duration} minutes</p>
              <p><strong>ID Réservation :</strong> ${data.bookingId}</p>
              ${data.address ? `<p><strong>Adresse :</strong> ${data.address}</p>` : ''}
              ${data.notes ? `<p><strong>Notes :</strong> ${data.notes}</p>` : ''}
            </div>

            <h3>📋 Actions recommandées</h3>
            <ul>
              <li>Confirmer le rendez-vous dans votre système</li>
              <li>Préparer les documents nécessaires</li>
              <li>Contacter le client si besoin d'informations supplémentaires</li>
              <li>Ajouter le rendez-vous à votre planning</li>
            </ul>

            <h3>📞 Contact client</h3>
            <p>Email : <a href="mailto:${data.clientEmail}">${data.clientEmail}</a></p>
            <p>Téléphone : <a href="tel:${data.clientPhone}">${data.clientPhone}</a></p>
          </div>
          
          <div class="footer">
            <p>Rendez-vous créé automatiquement via le site web</p>
            <p><strong>DR RAVALEMENT</strong> - Système de réservation</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
}
