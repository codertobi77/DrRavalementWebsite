import { supabase, type Quote, type Booking } from './supabase'

export class QuoteService {
  // Créer un nouveau devis
  static async createQuote(quoteData: Omit<Quote, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('quotes')
      .insert(quoteData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Obtenir les devis d'un client
  static async getClientQuotes(clientId: string): Promise<Quote[]> {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Obtenir un devis par ID
  static async getQuote(quoteId: string): Promise<Quote | null> {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', quoteId)
      .single()

    if (error) {
      console.error('Error fetching quote:', error)
      return null
    }
    return data
  }

  // Mettre à jour le statut d'un devis
  static async updateQuoteStatus(quoteId: string, status: Quote['status']) {
    const { data, error } = await supabase
      .from('quotes')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', quoteId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Supprimer un devis
  static async deleteQuote(quoteId: string) {
    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', quoteId)

    if (error) throw error
  }
}

export class BookingService {
  // Créer une nouvelle réservation
  static async createBooking(bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Obtenir les réservations d'un client
  static async getClientBookings(clientId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: true })

    if (error) throw error
    return data || []
  }

  // Obtenir toutes les réservations (admin)
  static async getAllBookings(): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('date', { ascending: true })

    if (error) throw error
    return data || []
  }

  // Obtenir une réservation par ID
  static async getBooking(bookingId: string): Promise<Booking | null> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()

    if (error) {
      console.error('Error fetching booking:', error)
      return null
    }
    return data
  }

  // Mettre à jour le statut d'une réservation
  static async updateBookingStatus(bookingId: string, status: Booking['status']) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', bookingId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Vérifier la disponibilité d'un créneau
  static async checkAvailability(date: string, time: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('date', date)
      .eq('time', time)
      .eq('status', 'confirmed')

    if (error) throw error
    return data.length === 0
  }

  // Obtenir les créneaux disponibles pour une date
  static async getAvailableTimeSlots(date: string): Promise<string[]> {
    const allTimeSlots = [
      '08:00', '09:00', '10:00', '11:00', 
      '14:00', '15:00', '16:00', '17:00'
    ]

    const { data, error } = await supabase
      .from('bookings')
      .select('time')
      .eq('date', date)
      .eq('status', 'confirmed')

    if (error) throw error

    const bookedTimes = data.map(booking => booking.time)
    return allTimeSlots.filter(time => !bookedTimes.includes(time))
  }
}
