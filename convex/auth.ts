import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Types pour l'authentification
export interface AuthUser {
  _id: Id<"users">;
  email: string;
  name?: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "inactive" | "pending";
  last_login?: string;
  avatar?: string;
}

export interface AuthSession {
  _id: Id<"auth_sessions">;
  user_id: Id<"users">;
  token: string;
  expires_at: string;
  created_at: string;
  last_used: string;
  ip_address?: string;
  user_agent?: string;
}


// Vérifier si un utilisateur existe par email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    return user;
  },
});

// Obtenir un utilisateur par ID
export const getUserById = query({
  args: { user_id: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.user_id);
    return user;
  },
});

// Mettre à jour le mot de passe d'un utilisateur
export const updateUserPassword = mutation({
  args: {
    user_id: v.id("users"),
    password_hash: v.string(),
    updated_at: v.string()
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.user_id, {
      password_hash: args.password_hash,
      updated_at: args.updated_at
    });
  },
});

// Mettre à jour la dernière connexion
export const updateLastLogin = mutation({
  args: {
    user_id: v.id("users"),
    last_login: v.string(),
    updated_at: v.string()
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.user_id, {
      last_login: args.last_login,
      updated_at: args.updated_at
    });
  },
});

// Créer une session
export const createSession = mutation({
  args: {
    user_id: v.id("users"),
    token: v.string(),
    expires_at: v.string(),
    created_at: v.string(),
    last_used: v.string(),
    ip_address: v.optional(v.string()),
    user_agent: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("auth_sessions", {
      user_id: args.user_id,
      token: args.token,
      expires_at: args.expires_at,
      created_at: args.created_at,
      last_used: args.last_used,
      ip_address: args.ip_address,
      user_agent: args.user_agent
    });
  },
});

// Insérer un utilisateur
export const insertUser = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    password_hash: v.string(),
    role: v.union(v.literal("admin"), v.literal("editor"), v.literal("viewer")),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("pending")),
    created_at: v.string(),
    updated_at: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      password_hash: args.password_hash,
      role: args.role,
      status: args.status,
      created_at: args.created_at,
      updated_at: args.updated_at
    });
  },
});

// Vérifier la validité d'une session
export const validateSession = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("auth_sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session) {
      return null;
    }

    // Vérifier si la session est expirée
    const now = new Date();
    const expiresAt = new Date(session.expires_at);
    
    if (now > expiresAt) {
      // Supprimer la session expirée
      await ctx.db.delete(session._id);
      return null;
    }

    // Récupérer l'utilisateur
    const user = await ctx.db.get(session.user_id);
    if (!user || user.status !== "active") {
      // Supprimer la session si l'utilisateur n'existe plus ou est inactif
      await ctx.db.delete(session._id);
      return null;
    }

    // Mettre à jour la dernière utilisation
    await ctx.db.patch(session._id, {
      last_used: now.toISOString()
    });

    return {
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        last_login: user.last_login,
        avatar: user.avatar
      },
      session: {
        _id: session._id,
        token: session.token,
        expires_at: session.expires_at,
        created_at: session.created_at,
        last_used: session.last_used
      }
    };
  },
});

// Déconnexion (supprimer la session)
export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("auth_sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }

    return { success: true };
  },
});

// Déconnexion de toutes les sessions d'un utilisateur
export const logoutAllSessions = mutation({
  args: { user_id: v.id("users") },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("auth_sessions")
      .withIndex("by_user_id", (q) => q.eq("user_id", args.user_id))
      .collect();

    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }

    return { success: true, count: sessions.length };
  },
});

// Nettoyer les sessions expirées
export const cleanExpiredSessions = mutation({
  handler: async (ctx) => {
    const now = new Date().toISOString();
    const expiredSessions = await ctx.db
      .query("auth_sessions")
      .withIndex("by_expires_at", (q) => q.lt("expires_at", now))
      .collect();

    let deletedCount = 0;
    for (const session of expiredSessions) {
      await ctx.db.delete(session._id);
      deletedCount++;
    }

    return { deletedCount };
  },
});


// Obtenir les sessions actives d'un utilisateur
export const getUserSessions = query({
  args: { user_id: v.id("users") },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("auth_sessions")
      .withIndex("by_user_id", (q) => q.eq("user_id", args.user_id))
      .collect();

    // Filtrer les sessions expirées
    const now = new Date();
    const activeSessions = sessions.filter(session => {
      const expiresAt = new Date(session.expires_at);
      return now <= expiresAt;
    });

    return activeSessions;
  },
});

// Obtenir tous les utilisateurs (admin seulement)
export const getAllUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    
    // Retourner sans les mots de passe
    return users.map(user => ({
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      last_login: user.last_login,
      avatar: user.avatar,
      created_at: user.created_at,
      updated_at: user.updated_at
    }));
  },
});

// Mettre à jour le statut d'un utilisateur
export const updateUserStatus = mutation({
  args: {
    user_id: v.id("users"),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("pending"))
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.user_id, {
      status: args.status,
      updated_at: new Date().toISOString()
    });

    return { success: true };
  },
});
