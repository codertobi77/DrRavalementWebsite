import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Récupérer les notifications d'un utilisateur
export const getUserNotifications = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_user_id", (q) => q.eq("user_id", args.userId))
      .order("desc")
      .collect();
  },
});

// Récupérer les notifications non lues
export const getUnreadNotifications = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_user_id", (q) => q.eq("user_id", args.userId))
      .filter((q) => q.eq(q.field("read"), false))
      .collect();
  },
});

// Récupérer toutes les notifications (admin)
export const getAllNotifications = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("notifications")
      .order("desc")
      .collect();
  },
});

// Créer une nouvelle notification
export const createNotification = mutation({
  args: {
    user_id: v.optional(v.id("users")),
    type: v.string(),
    title: v.string(),
    message: v.string(),
    data: v.optional(v.any()),
    priority: v.optional(v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    )),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", {
      ...args,
      read: false,
      priority: args.priority || "medium",
    });
  },
});

// Marquer une notification comme lue
export const markAsRead = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { read: true });
  },
});

// Marquer toutes les notifications comme lues
export const markAllAsRead = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_id", (q) => q.eq("user_id", args.userId))
      .filter((q) => q.eq(q.field("read"), false))
      .collect();

    for (const notification of notifications) {
      await ctx.db.patch(notification._id, { read: true });
    }

    return { success: true, count: notifications.length };
  },
});

// Supprimer une notification
export const deleteNotification = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Supprimer toutes les notifications lues
export const deleteReadNotifications = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_id", (q) => q.eq("user_id", args.userId))
      .filter((q) => q.eq(q.field("read"), true))
      .collect();

    for (const notification of notifications) {
      await ctx.db.delete(notification._id);
    }

    return { success: true, count: notifications.length };
  },
});

// Récupérer les statistiques des notifications
export const getNotificationStats = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const allNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_id", (q) => q.eq("user_id", args.userId))
      .collect();

    const stats = {
      total: allNotifications.length,
      unread: allNotifications.filter(n => !n.read).length,
      read: allNotifications.filter(n => n.read).length,
      byPriority: allNotifications.reduce((acc, n) => {
        acc[n.priority] = (acc[n.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byType: allNotifications.reduce((acc, n) => {
        acc[n.type] = (acc[n.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };

    return stats;
  },
});
