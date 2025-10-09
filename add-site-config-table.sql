-- Script pour ajouter la table site_config à la base de données existante
-- Exécuter dans Supabase SQL Editor

-- Créer la table de configuration du site
CREATE TABLE IF NOT EXISTS site_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS
CREATE POLICY "Public config is viewable by everyone" ON site_config FOR SELECT USING (is_public = true);
CREATE POLICY "Admins can view all config" ON site_config FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage config" ON site_config FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Créer un trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_config_updated_at 
    BEFORE UPDATE ON site_config 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Vérifier que la table a été créée
SELECT 'Table site_config créée avec succès' as status;
