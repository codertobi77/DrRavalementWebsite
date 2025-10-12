import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ===== STATISTIQUES =====
export const getStatistics = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("statistics")
      .filter((q) => q.eq(q.field("is_active"), true))
      .order("asc")
      .collect();
  },
});

export const createStatistic = mutation({
  args: {
    key: v.string(),
    value: v.string(),
    label: v.string(),
    order_index: v.number(),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("statistics", {
      ...args,
      is_active: args.is_active ?? true,
    });
  },
});

export const updateStatistic = mutation({
  args: {
    id: v.id("statistics"),
    key: v.optional(v.string()),
    value: v.optional(v.string()),
    label: v.optional(v.string()),
    order_index: v.optional(v.number()),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteStatistic = mutation({
  args: { id: v.id("statistics") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// ===== SERVICES =====
export const getServices = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("services")
      .filter((q) => q.eq(q.field("is_active"), true))
      .order("asc")
      .collect();
  },
});

export const createService = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    objective: v.optional(v.string()),
    detailedDescription: v.optional(v.string()),
    image: v.string(),
    features: v.array(v.string()),
    benefits: v.optional(v.array(v.string())),
    process: v.optional(v.array(v.string())),
    materials: v.optional(v.array(v.string())),
    duration: v.optional(v.string()),
    price: v.optional(v.string()),
    order_index: v.number(),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("services", {
      ...args,
      is_active: args.is_active ?? true,
    });
  },
});

export const updateService = mutation({
  args: {
    id: v.id("services"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    objective: v.optional(v.string()),
    image: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    order_index: v.optional(v.number()),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteService = mutation({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// ===== ZONES =====
export const getZones = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("zones")
      .filter((q) => q.eq(q.field("is_active"), true))
      .order("asc")
      .collect();
  },
});

export const createZone = mutation({
  args: {
    name: v.string(),
    order_index: v.number(),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("zones", {
      ...args,
      is_active: args.is_active ?? true,
    });
  },
});

export const updateZone = mutation({
  args: {
    id: v.id("zones"),
    name: v.optional(v.string()),
    order_index: v.optional(v.number()),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteZone = mutation({
  args: { id: v.id("zones") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// ===== RAISONS =====
export const getReasons = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("reasons")
      .filter((q) => q.eq(q.field("is_active"), true))
      .order("asc")
      .collect();
  },
});

export const createReason = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    icon: v.string(),
    order_index: v.number(),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("reasons", {
      ...args,
      is_active: args.is_active ?? true,
    });
  },
});

export const updateReason = mutation({
  args: {
    id: v.id("reasons"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    order_index: v.optional(v.number()),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteReason = mutation({
  args: { id: v.id("reasons") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// ===== TÉMOIGNAGES =====
export const getTestimonials = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("testimonials")
      .filter((q) => q.eq(q.field("is_active"), true))
      .order("asc")
      .collect();
  },
});

export const createTestimonial = mutation({
  args: {
    text: v.string(),
    author: v.string(),
    role: v.string(),
    project: v.string(),
    image: v.string(),
    order_index: v.number(),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("testimonials", {
      ...args,
      is_active: args.is_active ?? true,
    });
  },
});

export const updateTestimonial = mutation({
  args: {
    id: v.id("testimonials"),
    text: v.optional(v.string()),
    author: v.optional(v.string()),
    role: v.optional(v.string()),
    project: v.optional(v.string()),
    image: v.optional(v.string()),
    order_index: v.optional(v.number()),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteTestimonial = mutation({
  args: { id: v.id("testimonials") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// ===== HISTOIRE DE L'ENTREPRISE =====
export const getCompanyHistory = query({
  args: {},
  handler: async (ctx) => {
    const history = await ctx.db
      .query("company_history")
      .filter((q) => q.eq(q.field("is_active"), true))
      .first();
    return history;
  },
});

export const createCompanyHistory = mutation({
  args: {
    title: v.string(),
    paragraphs: v.array(v.string()),
    statistics: v.array(v.object({
      value: v.string(),
      label: v.string(),
    })),
    image: v.string(),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("company_history", {
      ...args,
      is_active: args.is_active ?? true,
    });
  },
});

export const updateCompanyHistory = mutation({
  args: {
    id: v.id("company_history"),
    title: v.optional(v.string()),
    paragraphs: v.optional(v.array(v.string())),
    statistics: v.optional(v.array(v.object({
      value: v.string(),
      label: v.string(),
    }))),
    image: v.optional(v.string()),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

// ===== VALEURS =====
export const getValues = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("values")
      .filter((q) => q.eq(q.field("is_active"), true))
      .order("asc")
      .collect();
  },
});

export const createValue = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    icon: v.string(),
    order_index: v.number(),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("values", {
      ...args,
      is_active: args.is_active ?? true,
    });
  },
});

export const updateValue = mutation({
  args: {
    id: v.id("values"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    order_index: v.optional(v.number()),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteValue = mutation({
  args: { id: v.id("values") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// ===== MEMBRES DE L'ÉQUIPE =====
export const getTeamMembers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("team_members")
      .filter((q) => q.eq(q.field("is_active"), true))
      .order("asc")
      .collect();
  },
});

export const createTeamMember = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    description: v.string(),
    image: v.string(),
    order_index: v.number(),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("team_members", {
      ...args,
      is_active: args.is_active ?? true,
    });
  },
});

export const updateTeamMember = mutation({
  args: {
    id: v.id("team_members"),
    name: v.optional(v.string()),
    role: v.optional(v.string()),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    order_index: v.optional(v.number()),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteTeamMember = mutation({
  args: { id: v.id("team_members") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// ===== CERTIFICATIONS =====
export const getCertifications = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("certifications")
      .filter((q) => q.eq(q.field("is_active"), true))
      .order("asc")
      .collect();
  },
});

export const createCertification = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    icon: v.string(),
    order_index: v.number(),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("certifications", {
      ...args,
      is_active: args.is_active ?? true,
    });
  },
});

export const updateCertification = mutation({
  args: {
    id: v.id("certifications"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    order_index: v.optional(v.number()),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteCertification = mutation({
  args: { id: v.id("certifications") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// ===== ÉTAPES DU PROCESSUS =====
export const getProcessSteps = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("process_steps")
      .filter((q) => q.eq(q.field("is_active"), true))
      .order("asc")
      .collect();
  },
});

export const createProcessStep = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    order_index: v.number(),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("process_steps", {
      ...args,
      is_active: args.is_active ?? true,
    });
  },
});

export const updateProcessStep = mutation({
  args: {
    id: v.id("process_steps"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    order_index: v.optional(v.number()),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteProcessStep = mutation({
  args: { id: v.id("process_steps") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// ===== FILTRES DE PROJETS =====
export const getProjectFilters = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("project_filters")
      .filter((q) => q.eq(q.field("is_active"), true))
      .order("asc")
      .collect();
  },
});

export const createProjectFilter = mutation({
  args: {
    key: v.string(),
    label: v.string(),
    order_index: v.number(),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("project_filters", {
      ...args,
      is_active: args.is_active ?? true,
    });
  },
});

export const updateProjectFilter = mutation({
  args: {
    id: v.id("project_filters"),
    key: v.optional(v.string()),
    label: v.optional(v.string()),
    order_index: v.optional(v.number()),
    is_active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteProjectFilter = mutation({
  args: { id: v.id("project_filters") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// ===== PROJETS DE RÉALISATION =====
export const getPortfolioProjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("portfolio_projects")
      .filter((q) => q.eq(q.field("is_active"), true))
      .order("asc")
      .collect();
  },
});

export const getPortfolioProjectsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    if (args.category === "tous") {
      return await ctx.db
        .query("portfolio_projects")
        .filter((q) => q.eq(q.field("is_active"), true))
        .order("asc")
        .collect();
    }
    return await ctx.db
      .query("portfolio_projects")
      .filter((q) => q.and(
        q.eq(q.field("is_active"), true),
        q.eq(q.field("category"), args.category)
      ))
      .order("asc")
      .collect();
  },
});

export const createPortfolioProject = mutation({
  args: {
    title: v.string(),
    category: v.string(),
    description: v.string(),
    details: v.string(),
    order_index: v.number(),
    is_active: v.optional(v.boolean()),
    // Champs pour les images avant-après
    before_image: v.string(),
    after_image: v.string(),
    is_before_after: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("portfolio_projects", {
      ...args,
      is_active: args.is_active ?? true,
      is_before_after: true, // Toujours true maintenant
    });
  },
});

export const updatePortfolioProject = mutation({
  args: {
    id: v.id("portfolio_projects"),
    title: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    details: v.optional(v.string()),
    order_index: v.optional(v.number()),
    is_active: v.optional(v.boolean()),
    // Champs pour les images avant-après
    before_image: v.optional(v.string()),
    after_image: v.optional(v.string()),
    is_before_after: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deletePortfolioProject = mutation({
  args: { id: v.id("portfolio_projects") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// ===== PROJETS AVANT/APRÈS =====
export const getBeforeAfterProjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("portfolio_projects")
      .filter((q) => q.and(
        q.eq(q.field("is_active"), true),
        q.eq(q.field("is_before_after"), true)
      ))
      .order("asc")
      .collect();
  },
});
