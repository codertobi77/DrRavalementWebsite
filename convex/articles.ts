import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Fonction utilitaire pour générer un slug à partir du titre
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/[^a-z0-9\s-]/g, "") // Garde seulement lettres, chiffres, espaces et tirets
    .replace(/\s+/g, "-") // Remplace les espaces par des tirets
    .replace(/-+/g, "-") // Remplace les tirets multiples par un seul
    .trim();
}

// Fonction utilitaire pour calculer le temps de lecture
function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Récupérer tous les articles avec filtres
export const getArticles = query({
  args: {
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    category: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Récupérer tous les articles d'abord
    let articles = await ctx.db.query("articles").collect();

    // Appliquer les filtres
    if (args.status) {
      articles = articles.filter(article => article.status === args.status);
    }

    if (args.category) {
      articles = articles.filter(article => article.category === args.category);
    }

    if (args.featured !== undefined) {
      articles = articles.filter(article => article.is_featured === args.featured);
    }

    // Trier par published_at si disponible, sinon par order_index
    articles.sort((a, b) => {
      if (a.published_at && b.published_at) {
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      }
      return b.order_index - a.order_index;
    });

    if (args.limit) {
      articles = articles.slice(0, args.limit);
    }

    return articles;
  },
});

// Récupérer un article par son slug
export const getArticleBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const article = await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!article) {
      return null;
    }

    // Retourner l'article sans incrémenter les vues pour éviter l'erreur
    // L'incrémentation des vues sera gérée côté client
    return article;
  },
});

// Récupérer un article par son ID
export const getArticleById = query({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Récupérer les catégories d'articles
export const getArticleCategories = query({
  handler: async (ctx) => {
    const articles = await ctx.db.query("articles").collect();
    const categories = [...new Set(articles.map(article => article.category))];
    
    // Catégories par défaut à inclure
    const defaultCategories = ['Actualités', 'Techniques', 'Rénovation'];
    
    // Combiner les catégories existantes avec les catégories par défaut
    const allCategories = [...new Set([...defaultCategories, ...categories])];
    
    return allCategories.sort();
  },
});

// Récupérer les articles les plus lus
export const getPopularArticles = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const articles = await ctx.db
      .query("articles")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    articles.sort((a, b) => b.view_count - a.view_count);

    return args.limit ? articles.slice(0, args.limit) : articles;
  },
});

// Créer un nouvel article
export const createArticle = mutation({
  args: {
    title: v.string(),
    excerpt: v.string(),
    content: v.string(),
    featured_image: v.string(),
    meta_title: v.optional(v.string()),
    meta_description: v.optional(v.string()),
    category: v.string(),
    tags: v.array(v.string()),
    author_id: v.optional(v.id("users")),
    status: v.union(v.literal("draft"), v.literal("published")),
    is_featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const slug = generateSlug(args.title);
    const readTime = calculateReadTime(args.content);
    
    // Vérifier si le slug existe déjà
    const existingArticle = await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    if (existingArticle) {
      throw new Error("Un article avec ce titre existe déjà");
    }

    // Récupérer le prochain order_index
    const articles = await ctx.db.query("articles").collect();
    const maxOrder = articles.reduce((max, article) => 
      Math.max(max, article.order_index), 0
    );

    const articleId = await ctx.db.insert("articles", {
      title: args.title,
      slug,
      excerpt: args.excerpt,
      content: args.content,
      featured_image: args.featured_image,
      meta_title: args.meta_title,
      meta_description: args.meta_description,
      category: args.category,
      tags: args.tags,
      author_id: args.author_id,
      status: args.status,
      published_at: args.status === "published" ? new Date().toISOString() : undefined,
      read_time: readTime,
      view_count: 0,
      order_index: maxOrder + 1,
      is_featured: args.is_featured || false,
    });

    return articleId;
  },
});

// Mettre à jour un article
export const updateArticle = mutation({
  args: {
    id: v.id("articles"),
    title: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    featured_image: v.optional(v.string()),
    meta_title: v.optional(v.string()),
    meta_description: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    is_featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Si le titre change, générer un nouveau slug
    if (updates.title) {
      const newSlug = generateSlug(updates.title);
      
      // Vérifier si le nouveau slug existe déjà
      const existingArticle = await ctx.db
        .query("articles")
        .withIndex("by_slug", (q) => q.eq("slug", newSlug))
        .first();

      if (existingArticle && existingArticle._id !== id) {
        throw new Error("Un article avec ce titre existe déjà");
      }

      updates.slug = newSlug;
    }

    // Si le contenu change, recalculer le temps de lecture
    if (updates.content) {
      updates.read_time = calculateReadTime(updates.content);
    }

    // Si le statut passe à "published" et qu'il n'y a pas de published_at
    if (updates.status === "published") {
      const article = await ctx.db.get(id);
      if (article && !article.published_at) {
        updates.published_at = new Date().toISOString();
      }
    }

    await ctx.db.patch(id, updates);
    return id;
  },
});

// Supprimer un article
export const deleteArticle = mutation({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Publier un article (passer de draft à published)
export const publishArticle = mutation({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    const article = await ctx.db.get(args.id);
    if (!article) {
      throw new Error("Article non trouvé");
    }

    await ctx.db.patch(args.id, {
      status: "published",
      published_at: new Date().toISOString(),
    });

    return args.id;
  },
});

// Mettre un article en brouillon
export const unpublishArticle = mutation({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "draft",
    });

    return args.id;
  },
});

// Réorganiser les articles (changer l'order_index)
export const reorderArticles = mutation({
  args: {
    articleIds: v.array(v.object({
      id: v.id("articles"),
      order_index: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    for (const { id, order_index } of args.articleIds) {
      await ctx.db.patch(id, { order_index });
    }
  },
});

// Incrémenter le nombre de vues d'un article
export const incrementViews = mutation({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    const article = await ctx.db.get(args.id);
    if (!article) {
      throw new Error("Article non trouvé");
    }

    await ctx.db.patch(args.id, {
      view_count: article.view_count + 1,
    });

    return article.view_count + 1;
  },
});

// Récupérer les statistiques des articles
export const getArticleStats = query({
  handler: async (ctx) => {
    const articles = await ctx.db.query("articles").collect();
    
    const stats = {
      total: articles.length,
      published: articles.filter(a => a.status === "published").length,
      draft: articles.filter(a => a.status === "draft").length,
      featured: articles.filter(a => a.is_featured).length,
      totalViews: articles.reduce((sum, a) => sum + a.view_count, 0),
      categories: [...new Set(articles.map(a => a.category))].length,
    };

    return stats;
  },
});
