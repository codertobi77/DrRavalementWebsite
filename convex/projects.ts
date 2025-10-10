import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Récupérer tous les projets
export const getAllProjects = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .order("desc")
      .collect();
  },
});

// Récupérer les projets par statut
export const getProjectsByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

// Récupérer les projets par client
export const getProjectsByClient = query({
  args: { clientId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_client_id", (q) => q.eq("client_id", args.clientId))
      .collect();
  },
});

// Récupérer les projets d'un client (avec ID Convex)
export const getClientProjects = query({
  args: { clientId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_client_id", (q) => q.eq("client_id", args.clientId))
      .collect();
  },
});

// Récupérer les projets actifs
export const getActiveProjects = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .filter((q) => 
        q.or(
          q.eq(q.field("status"), "planning"),
          q.eq(q.field("status"), "in-progress")
        )
      )
      .collect();
  },
});

// Créer un nouveau projet
export const createProject = mutation({
  args: {
    client_id: v.optional(v.string()),
    title: v.string(),
    description: v.string(),
    status: v.optional(v.union(
      v.literal("planning"),
      v.literal("in-progress"),
      v.literal("completed"),
      v.literal("on-hold")
    )),
    progress: v.optional(v.number()),
    start_date: v.string(),
    end_date: v.string(),
    budget: v.number(),
    address: v.string(),
    client_name: v.optional(v.string()),
    client_email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("projects", {
      ...args,
      status: args.status || "planning",
      progress: args.progress || 0,
    });
  },
});

// Mettre à jour un projet
export const updateProject = mutation({
  args: {
    id: v.id("projects"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("planning"),
      v.literal("in-progress"),
      v.literal("completed"),
      v.literal("on-hold")
    )),
    progress: v.optional(v.number()),
    start_date: v.optional(v.string()),
    end_date: v.optional(v.string()),
    budget: v.optional(v.number()),
    address: v.optional(v.string()),
    client_name: v.optional(v.string()),
    client_email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

// Supprimer un projet
export const deleteProject = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Récupérer les statistiques des projets
export const getProjectStats = query({
  handler: async (ctx) => {
    const allProjects = await ctx.db.query("projects").collect();
    
    const stats = {
      total: allProjects.length,
      planning: allProjects.filter(p => p.status === "planning").length,
      inProgress: allProjects.filter(p => p.status === "in-progress").length,
      completed: allProjects.filter(p => p.status === "completed").length,
      onHold: allProjects.filter(p => p.status === "on-hold").length,
      totalBudget: allProjects.reduce((sum, p) => sum + p.budget, 0),
      averageProgress: allProjects.length > 0 
        ? allProjects.reduce((sum, p) => sum + p.progress, 0) / allProjects.length 
        : 0,
    };

    return stats;
  },
});

// Rechercher des projets
export const searchProjects = query({
  args: { 
    query: v.string(),
    status: v.optional(v.string()),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    let projects = await ctx.db.query("projects").collect();

    // Filtrer par statut si spécifié
    if (args.status) {
      projects = projects.filter(project => project.status === args.status);
    }

    // Recherche dans le titre et la description
    const searchQuery = args.query.toLowerCase();
    projects = projects.filter(project => 
      project.title.toLowerCase().includes(searchQuery) ||
      project.description.toLowerCase().includes(searchQuery) ||
      project.client_name?.toLowerCase().includes(searchQuery) ||
      project.address.toLowerCase().includes(searchQuery)
    );

    return projects.slice(0, args.limit || 20);
  },
});
