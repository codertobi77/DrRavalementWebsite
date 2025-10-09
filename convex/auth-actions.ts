"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import crypto from "crypto";

// Fonction utilitaire pour hasher les mots de passe
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Fonction utilitaire pour générer un token de session
function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Fonction utilitaire pour calculer la date d'expiration
function getExpirationDate(hours: number = 24): string {
  const now = new Date();
  now.setHours(now.getHours() + hours);
  return now.toISOString();
}

// Action pour authentifier un utilisateur
export const authenticateUser = action({
  args: { 
    email: v.string(), 
    password: v.string(),
    ip_address: v.optional(v.string()),
    user_agent: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Trouver l'utilisateur par email
    const user = await ctx.runQuery("auth:getUserByEmail", { email: args.email });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    // Vérifier le statut
    if (user.status !== "active") {
      throw new Error("Compte inactif");
    }

    const now = new Date().toISOString();

    // Vérifier le mot de passe (si l'utilisateur en a un)
    if (user.password_hash) {
      const hashedPassword = hashPassword(args.password);
      if (user.password_hash !== hashedPassword) {
        throw new Error("Mot de passe incorrect");
      }
    } else {
      // Pour les utilisateurs existants sans mot de passe, utiliser un mot de passe par défaut
      const defaultPassword = "admin123"; // Mot de passe par défaut pour la migration
      const hashedDefaultPassword = hashPassword(defaultPassword);
      if (args.password !== defaultPassword) {
        throw new Error("Utilisez le mot de passe par défaut: admin123");
      }
      // Mettre à jour l'utilisateur avec le hash du mot de passe
      await ctx.runMutation("auth:updateUserPassword", {
        user_id: user._id,
        password_hash: hashedDefaultPassword,
        updated_at: now
      });
    }

    // Mettre à jour la dernière connexion
    await ctx.runMutation("auth:updateLastLogin", {
      user_id: user._id,
      last_login: now,
      updated_at: now
    });

    // Créer une nouvelle session
    const token = generateSessionToken();
    const expiresAt = getExpirationDate(24); // 24 heures

    const sessionId = await ctx.runMutation("auth:createSession", {
      user_id: user._id,
      token,
      expires_at: expiresAt,
      created_at: now,
      last_used: now,
      ip_address: args.ip_address,
      user_agent: args.user_agent
    });

    // Nettoyer les anciennes sessions expirées
    await ctx.runMutation("auth:cleanExpiredSessions");

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
        token,
        expires_at: expiresAt
      }
    };
  },
});

// Action pour créer un utilisateur admin
export const createAdminUser = action({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await ctx.runQuery("auth:getUserByEmail", { email: args.email });

    if (existingUser) {
      throw new Error("Un utilisateur avec cet email existe déjà");
    }

    const now = new Date().toISOString();
    const hashedPassword = hashPassword(args.password);

    const userId = await ctx.runMutation("auth:insertUser", {
      email: args.email,
      name: args.name || "Administrateur",
      password_hash: hashedPassword,
      role: "admin",
      status: "active",
      created_at: now,
      updated_at: now
    });

    return { userId };
  },
});

// Action pour changer le mot de passe
export const changePassword = action({
  args: {
    user_id: v.id("users"),
    current_password: v.string(),
    new_password: v.string()
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery("auth:getUserById", { user_id: args.user_id });
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    // Vérifier le mot de passe actuel
    const currentHashedPassword = hashPassword(args.current_password);
    if (user.password_hash !== currentHashedPassword) {
      throw new Error("Mot de passe actuel incorrect");
    }

    // Mettre à jour le mot de passe
    const newHashedPassword = hashPassword(args.new_password);
    await ctx.runMutation("auth:updateUserPassword", {
      user_id: args.user_id,
      password_hash: newHashedPassword,
      updated_at: new Date().toISOString()
    });

    return { success: true };
  },
});
