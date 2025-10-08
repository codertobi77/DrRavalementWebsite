import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour TypeScript
export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  role: 'client' | 'admin' | 'employee'
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  client_id: string
  title: string
  description: string
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold'
  progress: number
  start_date: string
  end_date: string
  budget: number
  address: string
  created_at: string
  updated_at: string
}

export interface ProjectDocument {
  id: string
  project_id: string
  name: string
  type: 'contract' | 'invoice' | 'photo' | 'plan' | 'certificate'
  url: string
  size: string
  created_at: string
}

export interface ProjectPhoto {
  id: string
  project_id: string
  url: string
  caption: string
  category: 'before' | 'progress' | 'after'
  created_at: string
}

export interface TimelineEvent {
  id: string
  project_id: string
  title: string
  description: string
  type: 'milestone' | 'update' | 'issue' | 'completion'
  date: string
  created_at: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  phone: string
  email: string
  project_id?: string
  created_at: string
}

export interface Quote {
  id: string
  client_id: string
  project_type: string
  surface: number
  materials: string[]
  urgency: string
  estimated_price: number
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  client_id: string
  service_type: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'cancelled'
  notes?: string
  created_at: string
  updated_at: string
}

export interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  image: string
  status: 'draft' | 'published'
  read_time: string
  created_at: string
  updated_at: string
}

export interface Page {
  id: string
  title: string
  slug: string
  content: string
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
}
