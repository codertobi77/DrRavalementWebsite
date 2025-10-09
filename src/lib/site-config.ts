import { supabase } from './supabase'

export interface SiteConfig {
  id: string
  key: string
  value: any
  description?: string
  category: string
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface BookingConfig {
  services: Array<{
    id: string
    name: string
    duration: number
    description?: string
  }>
  timeSlots: string[]
  workingDays: {
    start: number // 0 = dimanche, 1 = lundi, etc.
    end: number
  }
  workingHours: {
    morning: { start: string; end: string }
    afternoon: { start: string; end: string }
  }
  maxAdvanceDays: number
  minAdvanceHours: number
}

export interface ContactConfig {
  companyName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
  website?: string
  socialMedia?: {
    facebook?: string
    instagram?: string
    linkedin?: string
    twitter?: string
  }
}

export interface EmailConfig {
  ownerEmail: string
  fromName: string
  fromEmail: string
  replyTo: string
  templates: {
    bookingConfirmation: {
      subject: string
      template: string
    }
    ownerNotification: {
      subject: string
      template: string
    }
  }
}

export class SiteConfigService {
  // Obtenir une configuration par clé
  static async getConfig(key: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', key)
        .eq('is_public', true)
        .single()

      if (error) {
        console.error(`Error getting config for key ${key}:`, error)
        return null
      }

      return data?.value
    } catch (error) {
      console.error(`Error in getConfig for key ${key}:`, error)
      return null
    }
  }

  // Obtenir toutes les configurations publiques
  static async getPublicConfigs(): Promise<Record<string, any>> {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('key, value')
        .eq('is_public', true)

      if (error) {
        console.error('Error getting public configs:', error)
        return {}
      }

      const configs: Record<string, any> = {}
      data?.forEach(config => {
        configs[config.key] = config.value
      })

      return configs
    } catch (error) {
      console.error('Error in getPublicConfigs:', error)
      return {}
    }
  }

  // Obtenir la configuration de réservation
  static async getBookingConfig(): Promise<BookingConfig> {
    const config = await this.getConfig('booking') as BookingConfig
    
    // Configuration par défaut si pas trouvée
    return config || {
      services: [
        { id: 'consultation', name: 'Consultation gratuite', duration: 60, description: 'Évaluation gratuite de votre projet' },
        { id: 'devis', name: 'Visite pour devis', duration: 90, description: 'Devis personnalisé sur site' },
        { id: 'expertise', name: 'Expertise technique', duration: 120, description: 'Analyse technique approfondie' },
        { id: 'suivi', name: 'Suivi de chantier', duration: 30, description: 'Contrôle qualité et suivi' }
      ],
      timeSlots: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
      workingDays: { start: 1, end: 5 }, // Lundi à Vendredi
      workingHours: {
        morning: { start: '08:00', end: '12:00' },
        afternoon: { start: '14:00', end: '18:00' }
      },
      maxAdvanceDays: 30,
      minAdvanceHours: 24
    }
  }

  // Obtenir la configuration de contact
  static async getContactConfig(): Promise<ContactConfig> {
    const config = await this.getConfig('contact') as ContactConfig
    
    return config || {
      companyName: 'DR RAVALEMENT',
      email: 'contact@dr-ravalement.fr',
      phone: '01 23 45 67 89',
      address: '123 Rue de la Façade',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
      website: 'https://dr-ravalement.fr',
      socialMedia: {
        facebook: 'https://facebook.com/dr-ravalement',
        instagram: 'https://instagram.com/dr_ravalement',
        linkedin: 'https://linkedin.com/company/dr-ravalement'
      }
    }
  }

  // Obtenir la configuration d'email
  static async getEmailConfig(): Promise<EmailConfig> {
    const config = await this.getConfig('email') as EmailConfig
    
    return config || {
      ownerEmail: 'contact@dr-ravalement.fr',
      fromName: 'DR RAVALEMENT',
      fromEmail: 'noreply@dr-ravalement.fr',
      replyTo: 'contact@dr-ravalement.fr',
      templates: {
        bookingConfirmation: {
          subject: 'Confirmation de votre rendez-vous - {{serviceType}}',
          template: 'default'
        },
        ownerNotification: {
          subject: 'Nouveau rendez-vous réservé - {{serviceType}}',
          template: 'default'
        }
      }
    }
  }

  // Mettre à jour une configuration (admin seulement)
  static async updateConfig(key: string, value: any, description?: string, category: string = 'general'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('site_config')
        .upsert({
          key,
          value,
          description,
          category,
          is_public: true,
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.error(`Error updating config for key ${key}:`, error)
        return false
      }

      return true
    } catch (error) {
      console.error(`Error in updateConfig for key ${key}:`, error)
      return false
    }
  }

  // Initialiser les configurations par défaut
  static async initializeDefaultConfigs(): Promise<void> {
    const defaultConfigs = [
      {
        key: 'booking',
        value: {
          services: [
            { id: 'consultation', name: 'Consultation gratuite', duration: 60, description: 'Évaluation gratuite de votre projet' },
            { id: 'devis', name: 'Visite pour devis', duration: 90, description: 'Devis personnalisé sur site' },
            { id: 'expertise', name: 'Expertise technique', duration: 120, description: 'Analyse technique approfondie' },
            { id: 'suivi', name: 'Suivi de chantier', duration: 30, description: 'Contrôle qualité et suivi' }
          ],
          timeSlots: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
          workingDays: { start: 1, end: 5 },
          workingHours: {
            morning: { start: '08:00', end: '12:00' },
            afternoon: { start: '14:00', end: '18:00' }
          },
          maxAdvanceDays: 30,
          minAdvanceHours: 24
        },
        description: 'Configuration des réservations et créneaux',
        category: 'booking'
      },
      {
        key: 'contact',
        value: {
          companyName: 'DR RAVALEMENT',
          email: 'contact@dr-ravalement.fr',
          phone: '01 23 45 67 89',
          address: '123 Rue de la Façade',
          city: 'Paris',
          postalCode: '75001',
          country: 'France',
          website: 'https://dr-ravalement.fr',
          socialMedia: {
            facebook: 'https://facebook.com/dr-ravalement',
            instagram: 'https://instagram.com/dr_ravalement',
            linkedin: 'https://linkedin.com/company/dr-ravalement'
          }
        },
        description: 'Informations de contact de l\'entreprise',
        category: 'contact'
      },
      {
        key: 'email',
        value: {
          ownerEmail: 'contact@dr-ravalement.fr',
          fromName: 'DR RAVALEMENT',
          fromEmail: 'noreply@dr-ravalement.fr',
          replyTo: 'contact@dr-ravalement.fr',
          templates: {
            bookingConfirmation: {
              subject: 'Confirmation de votre rendez-vous - {{serviceType}}',
              template: 'default'
            },
            ownerNotification: {
              subject: 'Nouveau rendez-vous réservé - {{serviceType}}',
              template: 'default'
            }
          }
        },
        description: 'Configuration des emails et notifications',
        category: 'email'
      }
    ]

    for (const config of defaultConfigs) {
      await this.updateConfig(config.key, config.value, config.description, config.category)
    }
  }
}
