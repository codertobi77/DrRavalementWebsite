import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Récupérer une configuration par clé
export const getConfigByKey = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const config = await ctx.db
      .query("site_config")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    
    return config?.value;
  },
});

// Récupérer toutes les configurations publiques
export const getPublicConfigs = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("site_config")
      .withIndex("by_public", (q) => q.eq("is_public", true))
      .collect();
  },
});

// Récupérer toutes les configurations (admin)
export const getAllConfigs = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("site_config")
      .collect();
  },
});

// Récupérer les configurations par catégorie
export const getConfigsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("site_config")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

// Créer ou mettre à jour une configuration
export const setConfig = mutation({
  args: {
    key: v.string(),
    value: v.any(),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    is_public: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("site_config")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        value: args.value,
        description: args.description,
        category: args.category || "general",
        is_public: args.is_public ?? false,
      });
    } else {
      return await ctx.db.insert("site_config", {
        key: args.key,
        value: args.value,
        description: args.description,
        category: args.category || "general",
        is_public: args.is_public ?? false,
      });
    }
  },
});

// Supprimer une configuration
export const deleteConfig = mutation({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const config = await ctx.db
      .query("site_config")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (config) {
      return await ctx.db.delete(config._id);
    }
  },
});

// Initialiser les configurations par défaut
export const initializeDefaultConfigs = mutation({
  handler: async (ctx) => {
    const defaultConfigs = [
      {
        key: "booking_config",
        value: {
          maxAdvanceDays: 30,
          workingDays: { start: 1, end: 5 }, // Lundi à Vendredi
          timeSlots: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
          services: [
            { id: "ravalement", name: "Ravalement de Façade", duration: 120, description: "Rénovation complète de façade" },
            { id: "projection", name: "Projection Machine", duration: 90, description: "Enduit par projection" },
            { id: "maconnerie", name: "Maçonnerie Générale", duration: 60, description: "Travaux de maçonnerie" },
            { id: "isolation", name: "Isolation Thermique", duration: 150, description: "ITE par l'extérieur" }
          ]
        },
        description: "Configuration des réservations",
        category: "booking",
        is_public: true,
      },
      {
        key: "contact_config",
        value: {
          email: "contact@dr-ravalement.fr",
          phone: "+33 1 39 58 90 15",
          address: "Seine-et-Marne & Île-de-France",
          hours: "Lun-Ven: 8h-18h | Sam: 9h-12h"
        },
        description: "Informations de contact",
        category: "contact",
        is_public: true,
      },
      {
        key: "email_config",
        value: {
          fromEmail: "noreply@dr-ravalement.fr",
          fromName: "DR RAVALEMENT",
          replyTo: "contact@dr-ravalement.fr"
        },
        description: "Configuration des emails",
        category: "email",
        is_public: false,
      },
      {
        key: "appearance_config",
        value: {
          siteName: "DR RAVALEMENT",
          tagline: "Expert Façades & Maçonnerie",
          primaryColor: "#ea580c",
          secondaryColor: "#f97316",
          logo: "/images/logo-dr-ravalement.png"
        },
        description: "Configuration de l'apparence",
        category: "appearance",
        is_public: true,
      }
    ];

    for (const config of defaultConfigs) {
      await ctx.db.insert("site_config", config);
    }

    return { success: true, count: defaultConfigs.length };
  },
});
