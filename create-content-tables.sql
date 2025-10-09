-- Tables pour la gestion du contenu CMS
-- Exécuter ce script dans Supabase SQL Editor

-- Table des pages du site
CREATE TABLE IF NOT EXISTS pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  content JSONB NOT NULL DEFAULT '{}',
  status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des sections de contenu pour les pages
CREATE TABLE IF NOT EXISTS page_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL,
  section_type TEXT NOT NULL, -- 'hero', 'text', 'image', 'services', 'testimonials', etc.
  title TEXT,
  content JSONB NOT NULL DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page_id, section_key)
);

-- Table des articles de blog
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  meta_title TEXT,
  meta_description TEXT,
  category TEXT,
  tags TEXT[],
  author_id UUID,
  status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  read_time INTEGER, -- en minutes
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des médias
CREATE TABLE IF NOT EXISTS media_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  alt_text TEXT,
  description TEXT,
  category TEXT,
  tags TEXT[],
  uploaded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

-- Policies pour les pages
CREATE POLICY "Pages are viewable by everyone" ON pages FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage pages" ON pages FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Policies pour les sections de pages
CREATE POLICY "Page sections are viewable by everyone" ON page_sections FOR SELECT USING (
  EXISTS (SELECT 1 FROM pages WHERE id = page_sections.page_id AND status = 'published')
);
CREATE POLICY "Admins can manage page sections" ON page_sections FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Policies pour les articles
CREATE POLICY "Published articles are viewable by everyone" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage articles" ON articles FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Policies pour les médias
CREATE POLICY "Media files are viewable by everyone" ON media_files FOR SELECT USING (true);
CREATE POLICY "Admins can manage media files" ON media_files FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
CREATE INDEX IF NOT EXISTS idx_page_sections_page_id ON page_sections(page_id);
CREATE INDEX IF NOT EXISTS idx_page_sections_order ON page_sections(page_id, order_index);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
CREATE INDEX IF NOT EXISTS idx_media_files_category ON media_files(category);
