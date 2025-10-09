import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Récupérer toutes les réservations
export const getBookings = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("bookings")
      .order("desc")
      .collect();
  },
});

// Récupérer les réservations par statut
export const getBookingsByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bookings")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

// Récupérer les réservations par date
export const getBookingsByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bookings")
      .withIndex("by_date", (q) => q.eq("booking_date", args.date))
      .collect();
  },
});

// Récupérer les créneaux disponibles pour une date
export const getAvailableTimeSlots = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const allTimeSlots = [
      '08:00', '09:00', '10:00', '11:00',
      '14:00', '15:00', '16:00', '17:00'
    ];

    // Récupérer les réservations existantes pour cette date
    const existingBookings = await ctx.db
      .query("bookings")
      .withIndex("by_date", (q) => q.eq("booking_date", args.date))
      .filter((q) => 
        q.or(
          q.eq(q.field("status"), "pending"),
          q.eq(q.field("status"), "confirmed")
        )
      )
      .collect();

    // Vérifier les conflits d'horaires
    const availableSlots: string[] = [];
    
    for (const time of allTimeSlots) {
      const requestedTime = new Date(`${args.date}T${time}`);
      let isAvailable = true;
      
      for (const booking of existingBookings) {
        const bookingTime = new Date(`${args.date}T${booking.booking_time}`);
        const bookingEndTime = new Date(bookingTime.getTime() + booking.duration * 60000);
        
        // Vérifier si les créneaux se chevauchent
        if (requestedTime < bookingEndTime && 
            new Date(requestedTime.getTime() + 60 * 60000) > bookingTime) {
          isAvailable = false;
          break;
        }
      }
      
      if (isAvailable) {
        availableSlots.push(time);
      }
    }

    return availableSlots;
  },
});

// Vérifier si un créneau est disponible
export const isTimeSlotAvailable = query({
  args: { 
    date: v.string(),
    time: v.string()
  },
  handler: async (ctx, args) => {
    const existingBookings = await ctx.db
      .query("bookings")
      .withIndex("by_date", (q) => q.eq("booking_date", args.date))
      .filter((q) => 
        q.or(
          q.eq(q.field("status"), "pending"),
          q.eq(q.field("status"), "confirmed")
        )
      )
      .collect();

    const requestedTime = new Date(`${args.date}T${args.time}`);
    
    for (const booking of existingBookings) {
      const bookingTime = new Date(`${args.date}T${booking.booking_time}`);
      const bookingEndTime = new Date(bookingTime.getTime() + booking.duration * 60000);
      
      // Vérifier si les créneaux se chevauchent
      if (requestedTime < bookingEndTime && 
          new Date(requestedTime.getTime() + 60 * 60000) > bookingTime) {
        return false;
      }
    }

    return true;
  },
});

// Créer une nouvelle réservation
export const createBooking = mutation({
  args: {
    client_name: v.string(),
    client_email: v.string(),
    client_phone: v.string(),
    service_type: v.string(),
    booking_date: v.string(),
    booking_time: v.string(),
    duration: v.number(),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("completed")
    )),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bookings", {
      ...args,
      status: args.status || "pending",
    });
  },
});

// Mettre à jour une réservation
export const updateBooking = mutation({
  args: {
    id: v.id("bookings"),
    client_name: v.optional(v.string()),
    client_email: v.optional(v.string()),
    client_phone: v.optional(v.string()),
    service_type: v.optional(v.string()),
    booking_date: v.optional(v.string()),
    booking_time: v.optional(v.string()),
    duration: v.optional(v.number()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("completed")
    )),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

// Supprimer une réservation
export const deleteBooking = mutation({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Récupérer les statistiques des réservations
export const getBookingStats = query({
  handler: async (ctx) => {
    const allBookings = await ctx.db.query("bookings").collect();
    
    const stats = {
      total: allBookings.length,
      pending: allBookings.filter(b => b.status === "pending").length,
      confirmed: allBookings.filter(b => b.status === "confirmed").length,
      cancelled: allBookings.filter(b => b.status === "cancelled").length,
      completed: allBookings.filter(b => b.status === "completed").length,
    };

    return stats;
  },
});
