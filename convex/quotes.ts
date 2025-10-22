import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Récupérer tous les devis
export const getAllQuotes = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("quotes")
      .order("desc")
      .collect();
  },
});

// Récupérer les devis par statut
export const getQuotesByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quotes")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

// Récupérer les devis par client
export const getQuotesByClient = query({
  args: { clientEmail: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quotes")
      .withIndex("by_client_email", (q) => q.eq("client_email", args.clientEmail))
      .collect();
  },
});

// Récupérer les devis expirés
export const getExpiredQuotes = query({
  handler: async (ctx) => {
    const now = new Date().toISOString();
    return await ctx.db
      .query("quotes")
      .withIndex("by_valid_until")
      .filter((q) => q.lt(q.field("valid_until"), now))
      .collect();
  },
});

// Créer un nouveau devis
export const createQuote = mutation({
  args: {
    client_name: v.string(),
    client_email: v.string(),
    client_phone: v.string(),
    address: v.string(),
    service_type: v.string(),
    description: v.string(),
    amount: v.number(),
    status: v.optional(v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("accepted"),
      v.literal("rejected"),
      v.literal("expired")
    )),
    valid_until: v.string(),
    items: v.optional(v.array(v.object({
      id: v.string(),
      description: v.string(),
      quantity: v.number(),
      unit_price: v.number(),
      total: v.number(),
    }))),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("quotes", {
      ...args,
      status: args.status || "draft",
      created_at: now,
      updated_at: now,
    });
  },
});

// Mettre à jour un devis
export const updateQuote = mutation({
  args: {
    id: v.id("quotes"),
    client_name: v.optional(v.string()),
    client_email: v.optional(v.string()),
    client_phone: v.optional(v.string()),
    address: v.optional(v.string()),
    service_type: v.optional(v.string()),
    description: v.optional(v.string()),
    amount: v.optional(v.number()),
    status: v.optional(v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("accepted"),
      v.literal("rejected"),
      v.literal("expired")
    )),
    valid_until: v.optional(v.string()),
    items: v.optional(v.array(v.object({
      id: v.string(),
      description: v.string(),
      quantity: v.number(),
      unit_price: v.number(),
      total: v.number(),
    }))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const now = new Date().toISOString();
    return await ctx.db.patch(id, {
      ...updates,
      updated_at: now,
    });
  },
});

// Supprimer un devis
export const deleteQuote = mutation({
  args: { id: v.id("quotes") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Récupérer les statistiques des devis
export const getQuoteStats = query({
  handler: async (ctx) => {
    const allQuotes = await ctx.db.query("quotes").collect();
    
    const stats = {
      total: allQuotes.length,
      draft: allQuotes.filter(q => q.status === "draft").length,
      sent: allQuotes.filter(q => q.status === "sent").length,
      accepted: allQuotes.filter(q => q.status === "accepted").length,
      rejected: allQuotes.filter(q => q.status === "rejected").length,
      expired: allQuotes.filter(q => q.status === "expired").length,
      totalAmount: allQuotes.reduce((sum, q) => sum + q.amount, 0),
      averageAmount: allQuotes.length > 0 
        ? allQuotes.reduce((sum, q) => sum + q.amount, 0) / allQuotes.length 
        : 0,
    };

    return stats;
  },
});

// Rechercher des devis
export const searchQuotes = query({
  args: { 
    query: v.string(),
    status: v.optional(v.string()),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    let quotes = await ctx.db.query("quotes").collect();

    // Filtrer par statut si spécifié
    if (args.status) {
      quotes = quotes.filter(quote => quote.status === args.status);
    }

    // Recherche dans les champs textuels
    const searchQuery = args.query.toLowerCase();
    quotes = quotes.filter(quote => 
      quote.client_name.toLowerCase().includes(searchQuery) ||
      quote.client_email.toLowerCase().includes(searchQuery) ||
      quote.service_type.toLowerCase().includes(searchQuery) ||
      quote.description.toLowerCase().includes(searchQuery) ||
      quote.address.toLowerCase().includes(searchQuery)
    );

    return quotes.slice(0, args.limit || 20);
  },
});
