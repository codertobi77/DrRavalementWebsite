import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Booking } from "./convex";

// Hook pour récupérer toutes les réservations
export function useBookings() {
  return useQuery(api.bookings.getBookings);
}

// Hook pour récupérer les réservations par statut
export function useBookingsByStatus(status: string) {
  return useQuery(api.bookings.getBookingsByStatus, { status });
}

// Hook pour récupérer les réservations par date
export function useBookingsByDate(date: string) {
  return useQuery(api.bookings.getBookingsByDate, { date });
}

// Hook pour récupérer les créneaux disponibles
export function useAvailableTimeSlots(date: string) {
  return useQuery(api.bookings.getAvailableTimeSlots, { date });
}

// Hook pour vérifier la disponibilité d'un créneau
export function useIsTimeSlotAvailable(date: string, time: string) {
  return useQuery(api.bookings.isTimeSlotAvailable, { date, time });
}

// Hook pour créer une réservation
export function useCreateBooking() {
  return useMutation(api.bookings.createBooking);
}

// Hook pour mettre à jour une réservation
export function useUpdateBooking() {
  return useMutation(api.bookings.updateBooking);
}

// Hook pour supprimer une réservation
export function useDeleteBooking() {
  return useMutation(api.bookings.deleteBooking);
}

// Hook pour les statistiques des réservations
export function useBookingStats() {
  return useQuery(api.bookings.getBookingStats);
}

// Service class pour la compatibilité avec l'ancien code
export interface BookingData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: string;
  date: string;
  time: string;
  duration: number;
  address?: string;
  notes?: string;
}

export class BookingService {
  // Créer un nouveau rendez-vous
  static async createBooking(data: BookingData): Promise<Booking> {
    console.warn("BookingService.createBooking should be replaced with useCreateBooking hook");
    throw new Error("Use useCreateBooking hook instead");
  }

  // Vérifier si un créneau est disponible
  static async isTimeSlotAvailable(date: string, time: string): Promise<boolean> {
    console.warn("BookingService.isTimeSlotAvailable should be replaced with useIsTimeSlotAvailable hook");
    return false;
  }

  // Obtenir les créneaux disponibles pour une date
  static async getAvailableTimeSlots(date: string): Promise<string[]> {
    console.warn("BookingService.getAvailableTimeSlots should be replaced with useAvailableTimeSlots hook");
    return [];
  }

  // Obtenir tous les rendez-vous
  static async getBookings(): Promise<Booking[]> {
    console.warn("BookingService.getBookings should be replaced with useBookings hook");
    return [];
  }

  // Mettre à jour un rendez-vous
  static async updateBooking(id: string, data: Partial<BookingData>): Promise<Booking> {
    console.warn("BookingService.updateBooking should be replaced with useUpdateBooking hook");
    throw new Error("Use useUpdateBooking hook instead");
  }

  // Supprimer un rendez-vous
  static async deleteBooking(id: string): Promise<void> {
    console.warn("BookingService.deleteBooking should be replaced with useDeleteBooking hook");
    throw new Error("Use useDeleteBooking hook instead");
  }
}
