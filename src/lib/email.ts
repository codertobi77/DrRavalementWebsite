import { Resend } from 'resend'

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY)

export interface EmailTemplate {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
  replyTo?: string
  attachments?: Array<{
    filename: string
    content: Buffer | string
    contentType?: string
  }>
}

export interface EmailData {
  name: string
  email: string
  phone?: string
  message?: string
  projectType?: string
  budget?: number
  address?: string
  date?: string
  time?: string
}

export class EmailService {
  private static readonly FROM_EMAIL = 'DR RAVALEMENT <noreply@dr-ravalement.fr>'
  private static readonly REPLY_TO = 'contact@dr-ravalement.fr'

  // Envoyer un email de confirmation de devis
  static async sendQuoteConfirmation(data: EmailData) {
    const template = EmailTemplates.quoteConfirmation(data)
    
    return await resend.emails.send({
      from: this.FROM_EMAIL,
      to: data.email,
      replyTo: this.REPLY_TO,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  }

  // Envoyer un email de confirmation de rendez-vous
  static async sendBookingConfirmation(data: EmailData) {
    const template = EmailTemplates.bookingConfirmation(data)
    
    return await resend.emails.send({
      from: this.FROM_EMAIL,
      to: data.email,
      replyTo: this.REPLY_TO,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  }

  // Envoyer un email de rappel de rendez-vous
  static async sendBookingReminder(data: EmailData) {
    const template = EmailTemplates.bookingReminder(data)
    
    return await resend.emails.send({
      from: this.FROM_EMAIL,
      to: data.email,
      replyTo: this.REPLY_TO,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  }

  // Envoyer un email de mise à jour de projet
  static async sendProjectUpdate(data: EmailData & { projectTitle: string, update: string }) {
    const template = EmailTemplates.projectUpdate(data)
    
    return await resend.emails.send({
      from: this.FROM_EMAIL,
      to: data.email,
      replyTo: this.REPLY_TO,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  }

  // Envoyer un email de facture
  static async sendInvoice(data: EmailData & { invoiceNumber: string, amount: number, dueDate: string }) {
    const template = EmailTemplates.invoice(data)
    
    return await resend.emails.send({
      from: this.FROM_EMAIL,
      to: data.email,
      replyTo: this.REPLY_TO,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  }

  // Envoyer un email de newsletter
  static async sendNewsletter(data: { emails: string[], subject: string, content: string }) {
    const template = EmailTemplates.newsletter(data)
    
    return await resend.emails.send({
      from: this.FROM_EMAIL,
      to: data.emails,
      replyTo: this.REPLY_TO,
      subject: data.subject,
      html: template.html,
      text: template.text,
    })
  }

  // Envoyer un email de contact (formulaire)
  static async sendContactForm(data: EmailData) {
    const template = EmailTemplates.contactForm(data)
    
    return await resend.emails.send({
      from: this.FROM_EMAIL,
      to: this.REPLY_TO,
      replyTo: data.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  }

  // Envoyer un email de bienvenue
  static async sendWelcomeEmail(data: EmailData) {
    const template = EmailTemplates.welcome(data)
    
    return await resend.emails.send({
      from: this.FROM_EMAIL,
      to: data.email,
      replyTo: this.REPLY_TO,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  }

  // Envoyer un email de réinitialisation de mot de passe
  static async sendPasswordReset(data: EmailData & { resetLink: string }) {
    const template = EmailTemplates.passwordReset(data)
    
    return await resend.emails.send({
      from: this.FROM_EMAIL,
      to: data.email,
      replyTo: this.REPLY_TO,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  }
}

// Templates d'emails
export class EmailTemplates {
  static quoteConfirmation(data: EmailData) {
    return {
      subject: 'Confirmation de votre demande de devis - DR RAVALEMENT',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmation de devis</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ea580c, #dc2626); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">DR RAVALEMENT</h1>
            <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Expert Façades & Maçonnerie</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="color: #ea580c; margin-top: 0;">Merci pour votre demande de devis !</h2>
            
            <p>Bonjour ${data.name},</p>
            
            <p>Nous avons bien reçu votre demande de devis pour <strong>${data.projectType || 'votre projet'}</strong>.</p>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Récapitulatif de votre demande :</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li><strong>Type de projet :</strong> ${data.projectType || 'Non spécifié'}</li>
                <li><strong>Budget estimé :</strong> ${data.budget ? data.budget.toLocaleString('fr-FR') + '€' : 'À définir'}</li>
                <li><strong>Adresse :</strong> ${data.address || 'Non spécifiée'}</li>
                <li><strong>Message :</strong> ${data.message || 'Aucun message'}</li>
              </ul>
            </div>
            
            <p>Notre équipe d'experts va étudier votre projet et vous contactera sous <strong>24 heures</strong> pour :</p>
            <ul>
              <li>Planifier une visite sur site</li>
              <li>Établir un devis détaillé</li>
              <li>Vous proposer les meilleures solutions</li>
            </ul>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;"><strong>📞 Besoin d'aide ?</strong><br>
              Appelez-nous au <strong>+33 1 39 58 90 15</strong> ou répondez à cet email.</p>
            </div>
            
            <p>Cordialement,<br>
            <strong>L'équipe DR RAVALEMENT</strong></p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              DR RAVALEMENT - Seine-et-Marne & Île-de-France<br>
              Email: contact@dr-ravalement.fr | Tél: +33 1 39 58 90 15
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        Confirmation de votre demande de devis - DR RAVALEMENT
        
        Bonjour ${data.name},
        
        Nous avons bien reçu votre demande de devis pour ${data.projectType || 'votre projet'}.
        
        Récapitulatif :
        - Type de projet : ${data.projectType || 'Non spécifié'}
        - Budget estimé : ${data.budget ? data.budget.toLocaleString('fr-FR') + '€' : 'À définir'}
        - Adresse : ${data.address || 'Non spécifiée'}
        - Message : ${data.message || 'Aucun message'}
        
        Notre équipe vous contactera sous 24h.
        
        Cordialement,
        L'équipe DR RAVALEMENT
        
        Contact: +33 1 39 58 90 15 | contact@dr-ravalement.fr
      `
    }
  }

  static bookingConfirmation(data: EmailData) {
    return {
      subject: 'Confirmation de votre rendez-vous - DR RAVALEMENT',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmation de rendez-vous</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ea580c, #dc2626); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">DR RAVALEMENT</h1>
            <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Expert Façades & Maçonnerie</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="color: #ea580c; margin-top: 0;">✅ Rendez-vous confirmé !</h2>
            
            <p>Bonjour ${data.name},</p>
            
            <p>Votre rendez-vous a été confirmé avec succès.</p>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
              <h3 style="color: #0c4a6e; margin-top: 0;">📅 Détails du rendez-vous :</h3>
              <p style="margin: 5px 0;"><strong>Date :</strong> ${data.date}</p>
              <p style="margin: 5px 0;"><strong>Heure :</strong> ${data.time}</p>
              <p style="margin: 5px 0;"><strong>Service :</strong> ${data.projectType || 'Consultation'}</p>
              <p style="margin: 5px 0;"><strong>Adresse :</strong> ${data.address || 'À confirmer'}</p>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;"><strong>📝 Important :</strong><br>
              - Un SMS de rappel vous sera envoyé 24h avant<br>
              - En cas d'empêchement, merci de nous prévenir au moins 24h à l'avance</p>
            </div>
            
            <p>Cordialement,<br>
            <strong>L'équipe DR RAVALEMENT</strong></p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              DR RAVALEMENT - Seine-et-Marne & Île-de-France<br>
              Email: contact@dr-ravalement.fr | Tél: +33 1 39 58 90 15
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        Confirmation de votre rendez-vous - DR RAVALEMENT
        
        Bonjour ${data.name},
        
        Votre rendez-vous a été confirmé avec succès.
        
        Détails :
        - Date : ${data.date}
        - Heure : ${data.time}
        - Service : ${data.projectType || 'Consultation'}
        - Adresse : ${data.address || 'À confirmer'}
        
        Un SMS de rappel vous sera envoyé 24h avant.
        
        Cordialement,
        L'équipe DR RAVALEMENT
        
        Contact: +33 1 39 58 90 15 | contact@dr-ravalement.fr
      `
    }
  }

  static bookingReminder(data: EmailData) {
    return {
      subject: 'Rappel : Votre rendez-vous demain - DR RAVALEMENT',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Rappel de rendez-vous</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ea580c, #dc2626); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">DR RAVALEMENT</h1>
            <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Expert Façades & Maçonnerie</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="color: #ea580c; margin-top: 0;">⏰ Rappel de votre rendez-vous</h2>
            
            <p>Bonjour ${data.name},</p>
            
            <p>Nous vous rappelons votre rendez-vous <strong>demain</strong>.</p>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #92400e; margin-top: 0;">📅 Rendez-vous :</h3>
              <p style="margin: 5px 0; font-size: 18px;"><strong>${data.date} à ${data.time}</strong></p>
              <p style="margin: 5px 0;"><strong>Service :</strong> ${data.projectType || 'Consultation'}</p>
              <p style="margin: 5px 0;"><strong>Adresse :</strong> ${data.address || 'À confirmer'}</p>
            </div>
            
            <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #0c4a6e;"><strong>📞 En cas d'empêchement :</strong><br>
              Merci de nous prévenir au <strong>+33 1 39 58 90 15</strong></p>
            </div>
            
            <p>À bientôt !<br>
            <strong>L'équipe DR RAVALEMENT</strong></p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              DR RAVALEMENT - Seine-et-Marne & Île-de-France<br>
              Email: contact@dr-ravalement.fr | Tél: +33 1 39 58 90 15
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        Rappel : Votre rendez-vous demain - DR RAVALEMENT
        
        Bonjour ${data.name},
        
        Nous vous rappelons votre rendez-vous demain.
        
        Rendez-vous :
        - ${data.date} à ${data.time}
        - Service : ${data.projectType || 'Consultation'}
        - Adresse : ${data.address || 'À confirmer'}
        
        En cas d'empêchement : +33 1 39 58 90 15
        
        À bientôt !
        L'équipe DR RAVALEMENT
      `
    }
  }

  static projectUpdate(data: EmailData & { projectTitle: string, update: string }) {
    return {
      subject: `Mise à jour de votre projet : ${data.projectTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Mise à jour de projet</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ea580c, #dc2626); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">DR RAVALEMENT</h1>
            <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Expert Façades & Maçonnerie</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="color: #ea580c; margin-top: 0;">📋 Mise à jour de votre projet</h2>
            
            <p>Bonjour ${data.name},</p>
            
            <p>Nous vous informons de l'avancement de votre projet <strong>"${data.projectTitle}"</strong>.</p>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #0c4a6e; margin-top: 0;">📝 Dernière mise à jour :</h3>
              <p style="margin: 0; font-style: italic;">"${data.update}"</p>
            </div>
            
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #374151;"><strong>🔗 Suivez votre projet :</strong><br>
              Connectez-vous à votre espace client pour voir tous les détails et photos.</p>
            </div>
            
            <p>Cordialement,<br>
            <strong>L'équipe DR RAVALEMENT</strong></p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              DR RAVALEMENT - Seine-et-Marne & Île-de-France<br>
              Email: contact@dr-ravalement.fr | Tél: +33 1 39 58 90 15
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        Mise à jour de votre projet : ${data.projectTitle}
        
        Bonjour ${data.name},
        
        Nous vous informons de l'avancement de votre projet "${data.projectTitle}".
        
        Dernière mise à jour :
        "${data.update}"
        
        Connectez-vous à votre espace client pour voir tous les détails.
        
        Cordialement,
        L'équipe DR RAVALEMENT
      `
    }
  }

  static invoice(data: EmailData & { invoiceNumber: string, amount: number, dueDate: string }) {
    return {
      subject: `Facture ${data.invoiceNumber} - DR RAVALEMENT`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Facture</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ea580c, #dc2626); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">DR RAVALEMENT</h1>
            <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Expert Façades & Maçonnerie</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="color: #ea580c; margin-top: 0;">💰 Nouvelle facture disponible</h2>
            
            <p>Bonjour ${data.name},</p>
            
            <p>Votre facture <strong>${data.invoiceNumber}</strong> est maintenant disponible.</p>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #0c4a6e; margin-top: 0;">📄 Détails de la facture :</h3>
              <p style="margin: 5px 0;"><strong>Numéro :</strong> ${data.invoiceNumber}</p>
              <p style="margin: 5px 0;"><strong>Montant :</strong> ${data.amount.toLocaleString('fr-FR')}€</p>
              <p style="margin: 5px 0;"><strong>Échéance :</strong> ${data.dueDate}</p>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;"><strong>💳 Paiement :</strong><br>
              Vous pouvez régler cette facture par virement bancaire ou chèque.</p>
            </div>
            
            <p>Cordialement,<br>
            <strong>L'équipe DR RAVALEMENT</strong></p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              DR RAVALEMENT - Seine-et-Marne & Île-de-France<br>
              Email: contact@dr-ravalement.fr | Tél: +33 1 39 58 90 15
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        Facture ${data.invoiceNumber} - DR RAVALEMENT
        
        Bonjour ${data.name},
        
        Votre facture ${data.invoiceNumber} est maintenant disponible.
        
        Détails :
        - Numéro : ${data.invoiceNumber}
        - Montant : ${data.amount.toLocaleString('fr-FR')}€
        - Échéance : ${data.dueDate}
        
        Paiement par virement bancaire ou chèque.
        
        Cordialement,
        L'équipe DR RAVALEMENT
      `
    }
  }

  static newsletter(data: { emails: string[], subject: string, content: string }) {
    return {
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Newsletter</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ea580c, #dc2626); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">DR RAVALEMENT</h1>
            <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Expert Façades & Maçonnerie</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            ${data.content}
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              DR RAVALEMENT - Seine-et-Marne & Île-de-France<br>
              Email: contact@dr-ravalement.fr | Tél: +33 1 39 58 90 15
            </p>
          </div>
        </body>
        </html>
      `,
      text: data.content.replace(/<[^>]*>/g, '')
    }
  }

  static contactForm(data: EmailData) {
    return {
      subject: `Nouveau message de ${data.name} - Formulaire de contact`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nouveau message</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ea580c, #dc2626); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">DR RAVALEMENT</h1>
            <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Expert Façades & Maçonnerie</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="color: #ea580c; margin-top: 0;">📧 Nouveau message reçu</h2>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #0c4a6e; margin-top: 0;">👤 Informations du contact :</h3>
              <p style="margin: 5px 0;"><strong>Nom :</strong> ${data.name}</p>
              <p style="margin: 5px 0;"><strong>Email :</strong> ${data.email}</p>
              <p style="margin: 5px 0;"><strong>Téléphone :</strong> ${data.phone || 'Non renseigné'}</p>
              <p style="margin: 5px 0;"><strong>Service :</strong> ${data.projectType || 'Non spécifié'}</p>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">💬 Message :</h3>
              <p style="margin: 0; font-style: italic;">"${data.message || 'Aucun message'}"</p>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;"><strong>📞 Action requise :</strong><br>
              Merci de répondre à ce client dans les plus brefs délais.</p>
            </div>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              DR RAVALEMENT - Seine-et-Marne & Île-de-France<br>
              Email: contact@dr-ravalement.fr | Tél: +33 1 39 58 90 15
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        Nouveau message de ${data.name} - Formulaire de contact
        
        Informations du contact :
        - Nom : ${data.name}
        - Email : ${data.email}
        - Téléphone : ${data.phone || 'Non renseigné'}
        - Service : ${data.projectType || 'Non spécifié'}
        
        Message :
        "${data.message || 'Aucun message'}"
        
        Action requise : Répondre à ce client dans les plus brefs délais.
      `
    }
  }

  static welcome(data: EmailData) {
    return {
      subject: 'Bienvenue chez DR RAVALEMENT !',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenue</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ea580c, #dc2626); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">DR RAVALEMENT</h1>
            <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Expert Façades & Maçonnerie</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="color: #ea580c; margin-top: 0;">🎉 Bienvenue chez DR RAVALEMENT !</h2>
            
            <p>Bonjour ${data.name},</p>
            
            <p>Nous sommes ravis de vous accueillir dans notre communauté de clients satisfaits !</p>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #0c4a6e; margin-top: 0;">🎁 Vos avantages :</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Devis gratuit sous 24h</li>
                <li>Suivi de projet en temps réel</li>
                <li>Garantie décennale sur tous nos travaux</li>
                <li>Équipe d'experts à votre service</li>
              </ul>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;"><strong>📞 Besoin d'aide ?</strong><br>
              Notre équipe est à votre disposition au <strong>+33 1 39 58 90 15</strong></p>
            </div>
            
            <p>Merci de votre confiance !<br>
            <strong>L'équipe DR RAVALEMENT</strong></p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              DR RAVALEMENT - Seine-et-Marne & Île-de-France<br>
              Email: contact@dr-ravalement.fr | Tél: +33 1 39 58 90 15
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        Bienvenue chez DR RAVALEMENT !
        
        Bonjour ${data.name},
        
        Nous sommes ravis de vous accueillir dans notre communauté de clients satisfaits !
        
        Vos avantages :
        - Devis gratuit sous 24h
        - Suivi de projet en temps réel
        - Garantie décennale sur tous nos travaux
        - Équipe d'experts à votre service
        
        Besoin d'aide ? +33 1 39 58 90 15
        
        Merci de votre confiance !
        L'équipe DR RAVALEMENT
      `
    }
  }

  static passwordReset(data: EmailData & { resetLink: string }) {
    return {
      subject: 'Réinitialisation de votre mot de passe - DR RAVALEMENT',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Réinitialisation mot de passe</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ea580c, #dc2626); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">DR RAVALEMENT</h1>
            <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Expert Façades & Maçonnerie</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="color: #ea580c; margin-top: 0;">🔐 Réinitialisation de mot de passe</h2>
            
            <p>Bonjour ${data.name},</p>
            
            <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <a href="${data.resetLink}" style="background: #ea580c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Réinitialiser mon mot de passe
              </a>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;"><strong>⚠️ Important :</strong><br>
              Ce lien expire dans 24 heures. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
            </div>
            
            <p>Cordialement,<br>
            <strong>L'équipe DR RAVALEMENT</strong></p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              DR RAVALEMENT - Seine-et-Marne & Île-de-France<br>
              Email: contact@dr-ravalement.fr | Tél: +33 1 39 58 90 15
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        Réinitialisation de votre mot de passe - DR RAVALEMENT
        
        Bonjour ${data.name},
        
        Vous avez demandé la réinitialisation de votre mot de passe.
        
        Cliquez sur ce lien pour réinitialiser : ${data.resetLink}
        
        Ce lien expire dans 24 heures.
        
        Cordialement,
        L'équipe DR RAVALEMENT
      `
    }
  }
}
