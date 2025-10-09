import { supabase } from './supabase'

export interface BookingData {
  clientName: string
  clientEmail: string
  clientPhone: string
  serviceType: string
  date: string
  time: string
  duration: number
  address?: string
  notes?: string
}

export interface Booking {
  id: string
  client_name: string
  client_email: string
  client_phone: string
  service_type: string
  booking_date: string
  booking_time: string
  duration: number
  address?: string
  notes?: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  created_at: string
  updated_at: string
}

export class BookingService {
  // Créer un nouveau rendez-vous
  static async createBooking(data: BookingData): Promise<Booking> {
    try {
      console.log('Creating booking with data:', data)
      
      // Vérifier si le créneau est disponible
      const isAvailable = await this.isTimeSlotAvailable(data.date, data.time)
      if (!isAvailable) {
        throw new Error('Ce créneau n\'est plus disponible')
      }

      // Créer le rendez-vous
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          client_name: data.clientName,
          client_email: data.clientEmail,
          client_phone: data.clientPhone,
          service_type: data.serviceType,
          booking_date: data.date,
          booking_time: data.time,
          duration: data.duration,
          address: data.address,
          notes: data.notes,
          status: 'pending'
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating booking:', error)
        throw new Error('Erreur lors de la création du rendez-vous')
      }

      console.log('Booking created successfully:', booking)
      return booking
    } catch (error) {
      console.error('Error in createBooking:', error)
      throw error
    }
  }

  // Vérifier si un créneau est disponible
  static async isTimeSlotAvailable(date: string, time: string): Promise<boolean> {
    try {
      const { data: existingBookings, error } = await supabase
        .from('bookings')
        .select('booking_time, duration, status')
        .eq('booking_date', date)
        .in('status', ['pending', 'confirmed'])

      if (error) {
        console.error('Error checking availability:', error)
        return false
      }

      // Vérifier les conflits d'horaires
      const requestedTime = new Date(`${date}T${time}`)
      
      for (const booking of existingBookings || []) {
        const bookingTime = new Date(`${date}T${booking.booking_time}`)
        const bookingEndTime = new Date(bookingTime.getTime() + booking.duration * 60000)
        
        // Vérifier si les créneaux se chevauchent
        if (requestedTime < bookingEndTime && 
            new Date(requestedTime.getTime() + 60 * 60000) > bookingTime) {
          return false
        }
      }

      return true
    } catch (error) {
      console.error('Error in isTimeSlotAvailable:', error)
      return false
    }
  }

  // Obtenir les créneaux disponibles pour une date
  static async getAvailableTimeSlots(date: string): Promise<string[]> {
    const allTimeSlots = [
      '08:00', '09:00', '10:00', '11:00',
      '14:00', '15:00', '16:00', '17:00'
    ]

    try {
      console.log('Checking availability for date:', date)
      
      const availableSlots: string[] = []
      
      for (const time of allTimeSlots) {
        const isAvailable = await this.isTimeSlotAvailable(date, time)
        if (isAvailable) {
          availableSlots.push(time)
        }
      }

      console.log('Available slots found:', availableSlots)
      return availableSlots
    } catch (error) {
      console.error('Error getting available time slots:', error)
      // En cas d'erreur de base de données, retourner tous les créneaux
      console.log('Database error, returning all slots as available')
      return allTimeSlots
    }
  }

  // Obtenir tous les rendez-vous
  static async getBookings(): Promise<Booking[]> {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .order('booking_date', { ascending: true })
        .order('booking_time', { ascending: true })

      if (error) {
        console.error('Error fetching bookings:', error)
        throw new Error('Erreur lors de la récupération des rendez-vous')
      }

      return bookings || []
    } catch (error) {
      console.error('Error in getBookings:', error)
      throw error
    }
  }

  // Mettre à jour le statut d'un rendez-vous
  static async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<void> {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)

      if (error) {
        console.error('Error updating booking status:', error)
        throw new Error('Erreur lors de la mise à jour du rendez-vous')
      }
    } catch (error) {
      console.error('Error in updateBookingStatus:', error)
      throw error
    }
  }

  // Supprimer un rendez-vous
  static async deleteBooking(bookingId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId)

      if (error) {
        console.error('Error deleting booking:', error)
        throw new Error('Erreur lors de la suppression du rendez-vous')
      }
    } catch (error) {
      console.error('Error in deleteBooking:', error)
      throw error
    }
  }

  // Obtenir les rendez-vous d'un client
  static async getClientBookings(clientEmail: string): Promise<Booking[]> {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('client_email', clientEmail)
        .order('booking_date', { ascending: true })
        .order('booking_time', { ascending: true })

      if (error) {
        console.error('Error fetching client bookings:', error)
        throw new Error('Erreur lors de la récupération des rendez-vous du client')
      }

      return bookings || []
    } catch (error) {
      console.error('Error in getClientBookings:', error)
      throw error
    }
  }
}
