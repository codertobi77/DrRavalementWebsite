export interface ServiceConfig {
  email: {
    enabled: boolean
    provider: 'resend' | 'sendgrid' | 'mailgun'
    apiKey: string
    fromEmail: string
    fromName: string
    replyTo: string
  }
  sms: {
    enabled: boolean
    provider: 'twilio' | 'messagebird' | 'nexmo'
    accountSid: string
    authToken: string
    phoneNumber: string
  }
  calendar: {
    enabled: boolean
    provider: 'google' | 'outlook' | 'apple'
    clientId: string
    clientSecret: string
    redirectUri: string
  }
  seo: {
    enabled: boolean
    siteName: string
    siteUrl: string
    defaultImage: string
    twitterHandle: string
    facebookAppId: string
  }
  notifications: {
    email: boolean
    sms: boolean
    inApp: boolean
    push: boolean
  }
}

export const defaultServiceConfig: ServiceConfig = {
  email: {
    enabled: !!import.meta.env.VITE_RESEND_API_KEY,
    provider: 'resend',
    apiKey: import.meta.env.VITE_RESEND_API_KEY || '',
    fromEmail: 'noreply@dr-ravalement.fr',
    fromName: 'DR RAVALEMENT',
    replyTo: 'contact@dr-ravalement.fr'
  },
  sms: {
    enabled: !!(import.meta.env.VITE_TWILIO_ACCOUNT_SID && import.meta.env.VITE_TWILIO_AUTH_TOKEN),
    provider: 'twilio',
    accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || '',
    authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || '',
    phoneNumber: import.meta.env.VITE_TWILIO_PHONE_NUMBER || ''
  },
  calendar: {
    enabled: !!(import.meta.env.VITE_GOOGLE_CLIENT_ID && import.meta.env.VITE_GOOGLE_CLIENT_SECRET),
    provider: 'google',
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
    redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI || ''
  },
  seo: {
    enabled: true,
    siteName: 'DR RAVALEMENT',
    siteUrl: 'https://dr-ravalement.fr',
    defaultImage: 'https://dr-ravalement.fr/og-image.jpg',
    twitterHandle: '@dr_ravalement',
    facebookAppId: import.meta.env.VITE_FACEBOOK_APP_ID || ''
  },
  notifications: {
    email: true,
    sms: true,
    inApp: true,
    push: false
  }
}

export class ServiceManager {
  private static config: ServiceConfig = defaultServiceConfig

  // Obtenir la configuration
  static getConfig(): ServiceConfig {
    return this.config
  }

  // Mettre à jour la configuration
  static updateConfig(newConfig: Partial<ServiceConfig>) {
    this.config = { ...this.config, ...newConfig }
  }

  // Vérifier si un service est disponible
  static isServiceAvailable(service: keyof ServiceConfig): boolean {
    switch (service) {
      case 'email':
        return this.config.email.enabled && !!this.config.email.apiKey
      case 'sms':
        return this.config.sms.enabled && !!this.config.sms.accountSid && !!this.config.sms.authToken
      case 'calendar':
        return this.config.calendar.enabled && !!this.config.calendar.clientId && !!this.config.calendar.clientSecret
      case 'seo':
        return this.config.seo.enabled
      case 'notifications':
        return this.config.notifications.email || this.config.notifications.sms || this.config.notifications.inApp
      default:
        return false
    }
  }

  // Obtenir le statut de tous les services
  static getServicesStatus() {
    return {
      email: this.isServiceAvailable('email'),
      sms: this.isServiceAvailable('sms'),
      calendar: this.isServiceAvailable('calendar'),
      seo: this.isServiceAvailable('seo'),
      notifications: this.isServiceAvailable('notifications')
    }
  }

  // Obtenir les services manquants
  static getMissingServices(): string[] {
    const missing: string[] = []
    
    if (!this.isServiceAvailable('email')) {
      missing.push('Email (Resend API Key manquante)')
    }
    
    if (!this.isServiceAvailable('sms')) {
      missing.push('SMS (Twilio credentials manquantes)')
    }
    
    if (!this.isServiceAvailable('calendar')) {
      missing.push('Calendar (Google OAuth credentials manquantes)')
    }
    
    return missing
  }

  // Obtenir les recommandations de configuration
  static getConfigurationRecommendations(): string[] {
    const recommendations: string[] = []
    
    if (!this.isServiceAvailable('email')) {
      recommendations.push('Configurez VITE_RESEND_API_KEY pour activer les emails')
    }
    
    if (!this.isServiceAvailable('sms')) {
      recommendations.push('Configurez VITE_TWILIO_ACCOUNT_SID et VITE_TWILIO_AUTH_TOKEN pour activer les SMS')
    }
    
    if (!this.isServiceAvailable('calendar')) {
      recommendations.push('Configurez VITE_GOOGLE_CLIENT_ID et VITE_GOOGLE_CLIENT_SECRET pour activer le calendrier')
    }
    
    return recommendations
  }

  // Valider la configuration
  static validateConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    
    // Vérifier les variables d'environnement requises
    if (!import.meta.env.VITE_SUPABASE_URL) {
      errors.push('VITE_SUPABASE_URL est requise')
    }
    
    if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
      errors.push('VITE_SUPABASE_ANON_KEY est requise')
    }
    
    // Vérifier les services optionnels
    if (this.config.email.enabled && !this.config.email.apiKey) {
      errors.push('VITE_RESEND_API_KEY est requise pour le service email')
    }
    
    if (this.config.sms.enabled && (!this.config.sms.accountSid || !this.config.sms.authToken)) {
      errors.push('VITE_TWILIO_ACCOUNT_SID et VITE_TWILIO_AUTH_TOKEN sont requises pour le service SMS')
    }
    
    if (this.config.calendar.enabled && (!this.config.calendar.clientId || !this.config.calendar.clientSecret)) {
      errors.push('VITE_GOOGLE_CLIENT_ID et VITE_GOOGLE_CLIENT_SECRET sont requises pour le service calendrier')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }

  // Obtenir les métriques de performance
  static getPerformanceMetrics() {
    return {
      email: {
        enabled: this.isServiceAvailable('email'),
        provider: this.config.email.provider,
        status: 'ready'
      },
      sms: {
        enabled: this.isServiceAvailable('sms'),
        provider: this.config.sms.provider,
        status: 'ready'
      },
      calendar: {
        enabled: this.isServiceAvailable('calendar'),
        provider: this.config.calendar.provider,
        status: 'ready'
      },
      seo: {
        enabled: this.isServiceAvailable('seo'),
        status: 'ready'
      }
    }
  }
}

// Hook React pour la gestion des services
export function useServiceManager() {
  const [config, setConfig] = useState<ServiceConfig>(defaultServiceConfig)
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadConfig = () => {
      setConfig(ServiceManager.getConfig())
      setStatus(ServiceManager.getServicesStatus())
      setLoading(false)
    }

    loadConfig()
  }, [])

  const updateConfig = (newConfig: Partial<ServiceConfig>) => {
    ServiceManager.updateConfig(newConfig)
    setConfig(ServiceManager.getConfig())
    setStatus(ServiceManager.getServicesStatus())
  }

  const validateConfig = () => {
    return ServiceManager.validateConfig()
  }

  const getMissingServices = () => {
    return ServiceManager.getMissingServices()
  }

  const getRecommendations = () => {
    return ServiceManager.getConfigurationRecommendations()
  }

  const getMetrics = () => {
    return ServiceManager.getPerformanceMetrics()
  }

  return {
    config,
    status,
    loading,
    updateConfig,
    validateConfig,
    getMissingServices,
    getRecommendations,
    getMetrics
  }
}
