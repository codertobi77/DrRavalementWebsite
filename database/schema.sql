-- Tables pour DR RAVALEMENT

-- Table des utilisateurs (étend la table auth.users de Supabase)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('client', 'admin', 'employee')) DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des projets
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('planning', 'in-progress', 'completed', 'on-hold')) DEFAULT 'planning',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  start_date DATE,
  end_date DATE,
  budget DECIMAL(10,2),
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des documents de projet
CREATE TABLE project_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('contract', 'invoice', 'photo', 'plan', 'certificate')),
  url TEXT NOT NULL,
  size TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des photos de projet
CREATE TABLE project_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  category TEXT CHECK (category IN ('before', 'progress', 'after')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des événements de timeline
CREATE TABLE timeline_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('milestone', 'update', 'issue', 'completion')),
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des membres d'équipe
CREATE TABLE team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des devis
CREATE TABLE quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES users(id) NOT NULL,
  project_type TEXT NOT NULL,
  surface DECIMAL(10,2) NOT NULL,
  materials TEXT[],
  urgency TEXT,
  estimated_price DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des réservations
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES users(id) NOT NULL,
  service_type TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des articles de blog
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  image TEXT,
  status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  read_time TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des pages
CREATE TABLE pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des médias
CREATE TABLE media_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  size TEXT,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_project_documents_project_id ON project_documents(project_id);
CREATE INDEX idx_project_photos_project_id ON project_photos(project_id);
CREATE INDEX idx_timeline_events_project_id ON timeline_events(project_id);
CREATE INDEX idx_quotes_client_id ON quotes(client_id);
CREATE INDEX idx_bookings_client_id ON bookings(client_id);
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_pages_slug ON pages(slug);

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

-- Policies pour les utilisateurs
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Policies pour les projets
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Admins can view all projects" ON projects FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Policies pour les documents de projet
CREATE POLICY "Users can view project documents" ON project_documents FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE id = project_id AND client_id = auth.uid())
);

-- Policies pour les photos de projet
CREATE POLICY "Users can view project photos" ON project_photos FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE id = project_id AND client_id = auth.uid())
);

-- Policies pour les événements de timeline
CREATE POLICY "Users can view project timeline" ON timeline_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE id = project_id AND client_id = auth.uid())
);

-- Policies pour les devis
CREATE POLICY "Users can view own quotes" ON quotes FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Admins can view all quotes" ON quotes FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Policies pour les réservations
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Admins can view all bookings" ON bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Policies pour les articles (lecture publique)
CREATE POLICY "Articles are viewable by everyone" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage articles" ON articles FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Policies pour les pages (lecture publique)
CREATE POLICY "Pages are viewable by everyone" ON pages FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage pages" ON pages FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Policies pour les médias
CREATE POLICY "Media are viewable by everyone" ON media_files FOR SELECT USING (true);
CREATE POLICY "Admins can manage media" ON media_files FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
