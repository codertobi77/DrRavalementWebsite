import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Table des utilisateurs
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    password_hash: v.optional(v.string()), // Hash du mot de passe (optionnel pour migration)
    role: v.union(v.literal("admin"), v.literal("editor"), v.literal("viewer")),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("pending")),
    last_login: v.optional(v.string()),
    avatar: v.optional(v.string()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_status", ["status"]),

  // Table des sessions d'authentification
  auth_sessions: defineTable({
    user_id: v.id("users"),
    token: v.string(),
    expires_at: v.string(),
    created_at: v.string(),
    last_used: v.string(),
    ip_address: v.optional(v.string()),
    user_agent: v.optional(v.string()),
  })
    .index("by_user_id", ["user_id"])
    .index("by_token", ["token"])
    .index("by_expires_at", ["expires_at"]),

  // Table de configuration du site
  site_config: defineTable({
    key: v.string(),
    value: v.any(), // JSONB equivalent
    description: v.optional(v.string()),
    category: v.string(),
    is_public: v.boolean(),
  })
    .index("by_key", ["key"])
    .index("by_category", ["category"])
    .index("by_public", ["is_public"]),

  // Table des réservations
  bookings: defineTable({
    client_name: v.string(),
    client_email: v.string(),
    client_phone: v.string(),
    service_type: v.string(),
    booking_date: v.string(), // Date as string
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("completed")
    ),
  })
    .index("by_date", ["booking_date"])
    .index("by_status", ["status"])
    .index("by_email", ["client_email"]),


  // Table des médias
  media_files: defineTable({
    filename: v.string(),
    original_name: v.string(),
    file_path: v.string(),
    file_size: v.number(),
    mime_type: v.string(),
    alt_text: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    uploaded_by: v.optional(v.id("users")),
  })
    .index("by_category", ["category"])
    .index("by_mime_type", ["mime_type"])
    .index("by_uploaded_by", ["uploaded_by"]),

  // Table des projets
  projects: defineTable({
    client_id: v.optional(v.string()),
    title: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("planning"),
      v.literal("in-progress"),
      v.literal("completed"),
      v.literal("on-hold")
    ),
    progress: v.number(),
    start_date: v.string(),
    end_date: v.string(),
    budget: v.number(),
    address: v.string(),
    client_name: v.optional(v.string()),
    client_email: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_client_id", ["client_id"])
    .index("by_start_date", ["start_date"]),

  // Table des devis
  quotes: defineTable({
    client_name: v.string(),
    client_email: v.string(),
    client_phone: v.string(),
    address: v.string(),
    service_type: v.string(),
    description: v.string(),
    amount: v.number(),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("accepted"),
      v.literal("rejected"),
      v.literal("expired")
    ),
    valid_until: v.string(),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    items: v.optional(v.array(v.object({
      id: v.string(),
      description: v.string(),
      quantity: v.number(),
      unit_price: v.number(),
      total: v.number(),
    }))),
  })
    .index("by_status", ["status"])
    .index("by_client_email", ["client_email"])
    .index("by_valid_until", ["valid_until"]),

  // Table des notifications
  notifications: defineTable({
    user_id: v.optional(v.id("users")),
    type: v.string(),
    title: v.string(),
    message: v.string(),
    data: v.optional(v.any()),
    read: v.boolean(),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
  })
    .index("by_user_id", ["user_id"])
    .index("by_read", ["read"])
    .index("by_priority", ["priority"]),

  // ===== CMS SIMPLIFIÉ =====
  
  // Table des statistiques (pour section Hero)
  statistics: defineTable({
    key: v.string(), // "facades_renovees", "annees_experience", etc.
    value: v.string(), // "500+", "15+", etc.
    label: v.string(), // "Façades Rénovées", "Années d'Expérience", etc.
    order_index: v.number(),
    is_active: v.boolean(),
  })
    .index("by_key", ["key"])
    .index("by_order", ["order_index"])
    .index("by_active", ["is_active"]),

  // Table des services
  services: defineTable({
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
    is_active: v.boolean(),
  })
    .index("by_order", ["order_index"])
    .index("by_active", ["is_active"]),

  // Table des zones d'intervention
  zones: defineTable({
    name: v.string(),
    order_index: v.number(),
    is_active: v.boolean(),
  })
    .index("by_order", ["order_index"])
    .index("by_active", ["is_active"]),

  // Table des raisons (Pourquoi nous choisir)
  reasons: defineTable({
    title: v.string(),
    description: v.string(),
    icon: v.string(),
    order_index: v.number(),
    is_active: v.boolean(),
  })
    .index("by_order", ["order_index"])
    .index("by_active", ["is_active"]),

  // Table des témoignages
  testimonials: defineTable({
    text: v.string(),
    author: v.string(),
    role: v.string(),
    project: v.string(),
    image: v.string(),
    order_index: v.number(),
    is_active: v.boolean(),
  })
    .index("by_order", ["order_index"])
    .index("by_active", ["is_active"]),

  // Table de l'histoire de l'entreprise
  company_history: defineTable({
    title: v.string(),
    paragraphs: v.array(v.string()),
    statistics: v.array(v.object({
      value: v.string(),
      label: v.string(),
    })),
    image: v.string(),
    is_active: v.boolean(),
  })
    .index("by_active", ["is_active"]),

  // Table des valeurs
  values: defineTable({
    title: v.string(),
    description: v.string(),
    icon: v.string(),
    order_index: v.number(),
    is_active: v.boolean(),
  })
    .index("by_order", ["order_index"])
    .index("by_active", ["is_active"]),

  // Table des membres de l'équipe
  team_members: defineTable({
    name: v.string(),
    role: v.string(),
    description: v.string(),
    image: v.string(),
    order_index: v.number(),
    is_active: v.boolean(),
  })
    .index("by_order", ["order_index"])
    .index("by_active", ["is_active"]),

  // Table des certifications
  certifications: defineTable({
    title: v.string(),
    description: v.string(),
    icon: v.string(),
    order_index: v.number(),
    is_active: v.boolean(),
  })
    .index("by_order", ["order_index"])
    .index("by_active", ["is_active"]),

  // Table des étapes du processus
  process_steps: defineTable({
    title: v.string(),
    description: v.string(),
    order_index: v.number(),
    is_active: v.boolean(),
  })
    .index("by_order", ["order_index"])
    .index("by_active", ["is_active"]),

  // Table des filtres de projets
  project_filters: defineTable({
    key: v.string(), // "tous", "ravalement", "maconnerie", "couverture"
    label: v.string(), // "Tous les Projets", "Ravalement", etc.
    order_index: v.number(),
    is_active: v.boolean(),
  })
    .index("by_key", ["key"])
    .index("by_order", ["order_index"])
    .index("by_active", ["is_active"]),

  // Table des projets de réalisation
  portfolio_projects: defineTable({
    title: v.string(),
    category: v.string(), // "ravalement", "maconnerie", "couverture"
    description: v.string(),
    details: v.string(), // "Surface: 180m² • Durée: 2 semaines • Finition: Grattée"
    order_index: v.number(),
    is_active: v.boolean(),
    // Champs pour les images avant-après
    before_image: v.string(), // Maintenant obligatoire
    after_image: v.string(), // Maintenant obligatoire
    is_before_after: v.boolean(), // Maintenant obligatoire, toujours true
  })
    .index("by_category", ["category"])
    .index("by_order", ["order_index"])
    .index("by_active", ["is_active"])
    .index("by_before_after", ["is_before_after"]),

  // Table des articles de blog
  articles: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    featured_image: v.string(),
    meta_title: v.optional(v.string()),
    meta_description: v.optional(v.string()),
    category: v.string(),
    tags: v.array(v.string()),
    author_id: v.optional(v.id("users")),
    status: v.union(v.literal("draft"), v.literal("published")),
    published_at: v.optional(v.string()),
    read_time: v.number(), // en minutes
    view_count: v.number(),
    order_index: v.number(),
    is_featured: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_category", ["category"])
    .index("by_author", ["author_id"])
    .index("by_published_at", ["published_at"])
    .index("by_featured", ["is_featured"])
    .index("by_order", ["order_index"]),
});
