import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Récupérer tous les utilisateurs
export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .order("desc")
      .collect();
  },
});

// Récupérer un utilisateur par email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Récupérer les utilisateurs par rôle
export const getUsersByRole = query({
  args: { role: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", args.role))
      .collect();
  },
});

// Récupérer les utilisateurs par statut
export const getUsersByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

// Créer un nouvel utilisateur
export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    role: v.optional(v.union(
      v.literal("admin"),
      v.literal("editor"),
      v.literal("viewer")
    )),
    status: v.optional(v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("pending")
    )),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      ...args,
      role: args.role || "viewer",
      status: args.status || "pending",
    });
  },
});

// Mettre à jour un utilisateur
export const updateUser = mutation({
  args: {
    id: v.id("users"),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    role: v.optional(v.union(
      v.literal("admin"),
      v.literal("editor"),
      v.literal("viewer")
    )),
    status: v.optional(v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("pending")
    )),
    last_login: v.optional(v.string()),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

// Supprimer un utilisateur
export const deleteUser = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Mettre à jour la dernière connexion
export const updateLastLogin = mutation({
  args: { 
    id: v.id("users"),
    lastLogin: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      last_login: args.lastLogin,
    });
  },
});

// Récupérer les statistiques des utilisateurs
export const getUserStats = query({
  handler: async (ctx) => {
    const allUsers = await ctx.db.query("users").collect();
    
    const stats = {
      total: allUsers.length,
      active: allUsers.filter(u => u.status === "active").length,
      inactive: allUsers.filter(u => u.status === "inactive").length,
      pending: allUsers.filter(u => u.status === "pending").length,
      admins: allUsers.filter(u => u.role === "admin").length,
      editors: allUsers.filter(u => u.role === "editor").length,
      viewers: allUsers.filter(u => u.role === "viewer").length,
    };

    return stats;
  },
});

// Rechercher des utilisateurs
export const searchUsers = query({
  args: { 
    query: v.string(),
    role: v.optional(v.string()),
    status: v.optional(v.string()),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    let users = await ctx.db.query("users").collect();

    // Filtrer par rôle si spécifié
    if (args.role) {
      users = users.filter(user => user.role === args.role);
    }

    // Filtrer par statut si spécifié
    if (args.status) {
      users = users.filter(user => user.status === args.status);
    }

    // Recherche dans le nom et l'email
    const searchQuery = args.query.toLowerCase();
    users = users.filter(user => 
      user.name?.toLowerCase().includes(searchQuery) ||
      user.email.toLowerCase().includes(searchQuery)
    );

    return users.slice(0, args.limit || 20);
  },
});
