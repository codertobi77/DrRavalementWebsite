import { useState } from 'react'
// import { google } from 'googleapis'
// Note: Installer googleapis avec: npm install googleapis

export interface CalendarEvent {
  id?: string
  title: string
  description?: string
  start: Date
  end: Date
  location?: string
  attendees?: Array<{
    email: string
    name?: string
  }>
  reminders?: {
    useDefault: boolean
    overrides?: Array<{
      method: 'email' | 'popup'
      minutes: number
    }>
  }
}

export interface BookingEventData {
  clientName: string
  clientEmail: string
  clientPhone?: string
  serviceType: string
  date: string
  time: string
  duration: number // en minutes
  address?: string
  notes?: string
}

export class CalendarService {
  // private static oauth2Client = new google.auth.OAuth2(
  //   import.meta.env.VITE_GOOGLE_CLIENT_ID,
  //   import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
  //   import.meta.env.VITE_GOOGLE_REDIRECT_URI
  // )

  // private static calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })

  // Configurer les tokens d'authentification
  static setCredentials(tokens: any) {
    // TODO: Implémenter avec googleapis après installation
    console.log('Credentials set:', tokens)
  }

  // Obtenir l'URL d'autorisation
  static getAuthUrl() {
    // TODO: Implémenter avec googleapis après installation
    return 'https://accounts.google.com/oauth/authorize'
  }

  // Échanger le code d'autorisation contre des tokens
  static async getTokens(code: string) {
    // TODO: Implémenter avec googleapis après installation
    return { access_token: 'mock-token', refresh_token: 'mock-refresh' }
  }

  // Créer un événement de rendez-vous
  static async createBookingEvent(data: BookingEventData): Promise<CalendarEvent> {
    const startDate = new Date(`${data.date}T${data.time}`)
    const endDate = new Date(startDate.getTime() + data.duration * 60000)

    const event = {
      summary: `Rendez-vous ${data.serviceType} - ${data.clientName}`,
      description: `
        Client: ${data.clientName}
        Email: ${data.clientEmail}
        Téléphone: ${data.clientPhone || 'Non renseigné'}
        Service: ${data.serviceType}
        Adresse: ${data.address || 'À confirmer'}
        Notes: ${data.notes || 'Aucune note'}
      `,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'Europe/Paris'
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'Europe/Paris'
      },
      location: data.address,
      attendees: [
        { email: data.clientEmail, name: data.clientName },
        { email: 'contact@dr-ravalement.fr', name: 'DR RAVALEMENT' }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 24h avant
          { method: 'popup', minutes: 60 } // 1h avant
        ]
      }
    }

    try {
      // TODO: Implémenter avec googleapis après installation
      console.log('Creating calendar event:', event)
      
      return {
        id: 'mock-event-id',
        title: event.summary,
        description: event.description,
        start: startDate,
        end: endDate,
        location: event.location,
        attendees: event.attendees
      }
    } catch (error) {
      console.error('Error creating calendar event:', error)
      throw new Error('Erreur lors de la création de l\'événement')
    }
  }

  // Mettre à jour un événement
  static async updateBookingEvent(eventId: string, data: BookingEventData): Promise<CalendarEvent> {
    const startDate = new Date(`${data.date}T${data.time}`)
    const endDate = new Date(startDate.getTime() + data.duration * 60000)

    const event = {
      summary: `Rendez-vous ${data.serviceType} - ${data.clientName}`,
      description: `
        Client: ${data.clientName}
        Email: ${data.clientEmail}
        Téléphone: ${data.clientPhone || 'Non renseigné'}
        Service: ${data.serviceType}
        Adresse: ${data.address || 'À confirmer'}
        Notes: ${data.notes || 'Aucune note'}
      `,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'Europe/Paris'
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'Europe/Paris'
      },
      location: data.address,
      attendees: [
        { email: data.clientEmail, name: data.clientName },
        { email: 'contact@dr-ravalement.fr', name: 'DR RAVALEMENT' }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 60 }
        ]
      }
    }

    try {
      // TODO: Implémenter avec googleapis après installation
      console.log('Updating calendar event:', eventId, event)
      
      return {
        id: eventId,
        title: event.summary,
        description: event.description,
        start: startDate,
        end: endDate,
        location: event.location,
        attendees: event.attendees
      }
    } catch (error) {
      console.error('Error updating calendar event:', error)
      throw new Error('Erreur lors de la mise à jour de l\'événement')
    }
  }

  // Supprimer un événement
  static async deleteBookingEvent(eventId: string) {
    try {
      // TODO: Implémenter avec googleapis après installation
      console.log('Deleting calendar event:', eventId)
      return { success: true }
    } catch (error) {
      console.error('Error deleting calendar event:', error)
      throw new Error('Erreur lors de la suppression de l\'événement')
    }
  }

  // Obtenir les événements d'une période
  static async getEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    try {
      // TODO: Implémenter avec googleapis après installation
      console.log('Fetching calendar events:', startDate, endDate)
      return []
    } catch (error) {
      console.error('Error fetching calendar events:', error)
      throw new Error('Erreur lors de la récupération des événements')
    }
  }

  // Vérifier la disponibilité
  static async checkAvailability(date: string, time: string, duration: number = 60): Promise<boolean> {
    const startDate = new Date(`${date}T${time}`)
    const endDate = new Date(startDate.getTime() + duration * 60000)

    try {
      const events = await this.getEvents(startDate, endDate)
      
      // Vérifier s'il y a des conflits
      return events.length === 0
    } catch (error) {
      console.error('Error checking availability:', error)
      return false
    }
  }

  // Obtenir les créneaux disponibles pour une date
  static async getAvailableTimeSlots(date: string): Promise<string[]> {
    const allTimeSlots = [
      '08:00', '09:00', '10:00', '11:00',
      '14:00', '15:00', '16:00', '17:00'
    ]

    // TODO: Implémenter avec googleapis après installation
    console.log('Getting available time slots for:', date)
    return allTimeSlots
  }

  // Créer un événement de projet
  static async createProjectEvent(projectData: {
    title: string
    description: string
    startDate: string
    endDate: string
    location?: string
    teamMembers?: string[]
  }): Promise<CalendarEvent> {
    const event = {
      summary: `Projet: ${projectData.title}`,
      description: projectData.description,
      start: {
        dateTime: new Date(projectData.startDate).toISOString(),
        timeZone: 'Europe/Paris'
      },
      end: {
        dateTime: new Date(projectData.endDate).toISOString(),
        timeZone: 'Europe/Paris'
      },
      location: projectData.location,
      attendees: projectData.teamMembers?.map(email => ({ email })) || []
    }

    try {
      // TODO: Implémenter avec googleapis après installation
      console.log('Creating project event:', event)
      
      return {
        id: 'mock-project-event-id',
        title: event.summary,
        description: event.description,
        start: new Date(projectData.startDate),
        end: new Date(projectData.endDate),
        location: event.location,
        attendees: event.attendees
      }
    } catch (error) {
      console.error('Error creating project event:', error)
      throw new Error('Erreur lors de la création de l\'événement de projet')
    }
  }
}

// Hook React pour Google Calendar
export function useCalendar() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const authenticate = () => {
    const authUrl = CalendarService.getAuthUrl()
    window.open(authUrl, '_blank')
  }

  const handleAuthCallback = async (code: string) => {
    setLoading(true)
    setError(null)

    try {
      const tokens = await CalendarService.getTokens(code)
      CalendarService.setCredentials(tokens)
      setIsAuthenticated(true)
      return tokens
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createBookingEvent = async (data: BookingEventData) => {
    setLoading(true)
    setError(null)

    try {
      const event = await CalendarService.createBookingEvent(data)
      return event
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateBookingEvent = async (eventId: string, data: BookingEventData) => {
    setLoading(true)
    setError(null)

    try {
      const event = await CalendarService.updateBookingEvent(eventId, data)
      return event
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteBookingEvent = async (eventId: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await CalendarService.deleteBookingEvent(eventId)
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getEvents = async (startDate: Date, endDate: Date) => {
    setLoading(true)
    setError(null)

    try {
      const events = await CalendarService.getEvents(startDate, endDate)
      return events
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const checkAvailability = async (date: string, time: string, duration: number = 60) => {
    setLoading(true)
    setError(null)

    try {
      const isAvailable = await CalendarService.checkAvailability(date, time, duration)
      return isAvailable
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getAvailableTimeSlots = async (date: string) => {
    setLoading(true)
    setError(null)

    try {
      const slots = await CalendarService.getAvailableTimeSlots(date)
      return slots
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
    isAuthenticated,
    authenticate,
    handleAuthCallback,
    createBookingEvent,
    updateBookingEvent,
    deleteBookingEvent,
    getEvents,
    checkAvailability,
    getAvailableTimeSlots,
    clearError: () => setError(null)
  }
}
