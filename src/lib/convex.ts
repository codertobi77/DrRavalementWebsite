import { ConvexReactClient } from "convex/react";

// Configuration Convex
const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  throw new Error("VITE_CONVEX_URL environment variable is required");
}

// Créer le client Convex avec optimisations de performance
export const convex = new ConvexReactClient(convexUrl, {
  // Réduire le temps de cache à 15 secondes
  pollingInterval: 15000, // 15 secondes
  // Optimisations de performance
  optimisticUpdates: true,
  // Désactiver le polling automatique pour les queries non utilisées
  disableAutomaticReconnect: false,
  // Configuration du cache
  cache: {
    // Cache plus agressif pour les données statiques
    maxAge: 15000, // 15 secondes
    // Invalidation automatique
    staleWhileRevalidate: true
  }
});

// Types pour les données
export interface User {
  _id: string;
  email: string;
  name?: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  last_login?: string;
  avatar?: string;
}

export interface Booking {
  _id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  service_type: string;
  booking_date: string;
  booking_time: string;
  duration: number;
  address?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export interface PageContent {
  _id: string;
  slug: string;
  title: string;
  meta_title?: string;
  meta_description?: string;
  content: Record<string, any>;
  status: 'draft' | 'published';
}

export interface PageSection {
  _id: string;
  page_id: string;
  section_key: string;
  section_type: string;
  title?: string;
  content: Record<string, any>;
  order_index: number;
  is_active: boolean;
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  category?: string;
  tags?: string[];
  author_id?: string;
  status: 'draft' | 'published';
  published_at?: string;
  read_time?: number;
  view_count: number;
}

export interface MediaFile {
  _id: string;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  alt_text?: string;
  description?: string;
  category?: string;
  tags?: string[];
  uploaded_by?: string;
}

export interface Project {
  _id: string;
  client_id?: string;
  title: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  progress: number;
  start_date: string;
  end_date: string;
  budget: number;
  address: string;
  client_name?: string;
  client_email?: string;
}

export interface Quote {
  _id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  address: string;
  service_type: string;
  description: string;
  amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  valid_until: string;
  items?: Array<{
    id: string;
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
}

export interface Notification {
  _id: string;
  user_id?: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

// Configuration du site
export interface SiteConfig {
  booking_config?: {
    maxAdvanceDays: number;
    workingDays: { start: number; end: number };
    timeSlots: string[];
    services: Array<{
      id: string;
      name: string;
      duration: number;
      description: string;
    }>;
  };
  contact_config?: {
    email: string;
    phone: string;
    address: string;
    hours: string;
  };
  email_config?: {
    fromEmail: string;
    fromName: string;
    replyTo: string;
  };
  appearance_config?: {
    siteName: string;
    tagline: string;
    primaryColor: string;
    secondaryColor: string;
    logo: string;
  };
}
