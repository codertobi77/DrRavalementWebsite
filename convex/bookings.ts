import { query, mutation, action } from "./_generated/server";
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

// Vérifier si une date est disponible pour réservation
export const isDateAvailable = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    // Récupérer la configuration des réservations
    const bookingConfig = await ctx.db
      .query("site_config")
      .withIndex("by_key", (q) => q.eq("key", "booking_config"))
      .first();

    const maxBookingsPerDay = bookingConfig?.value?.maxBookingsPerDay || 5;

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

    return existingBookings.length < maxBookingsPerDay;
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

// Confirmer une réservation et envoyer un email de confirmation
export const confirmBooking = action({
  args: {
    bookingId: v.id("bookings"),
    adminNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Récupérer la réservation
    const booking = await ctx.runQuery("bookings:getBookingById", { id: args.bookingId });
    
    if (!booking) {
      throw new Error("Réservation non trouvée");
    }

    if (booking.status !== "pending") {
      throw new Error("Cette réservation ne peut pas être confirmée");
    }

    // Mettre à jour le statut de la réservation
    await ctx.runMutation("bookings:updateBooking", {
      id: args.bookingId,
      status: "confirmed",
    });

    // Envoyer l'email de confirmation au client
    await ctx.runAction("email:sendBookingConfirmationEmail", {
      clientName: booking.client_name,
      clientEmail: booking.client_email,
      clientPhone: booking.client_phone,
      serviceType: booking.service_type,
      date: booking.booking_date,
      address: booking.address,
      notes: booking.notes,
      bookingId: args.bookingId,
      adminNotes: args.adminNotes,
    });

    return { success: true, message: "Réservation confirmée et email envoyé" };
  },
});

// Récupérer une réservation par ID
export const getBookingById = query({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
