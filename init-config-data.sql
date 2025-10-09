-- Script d'initialisation des données de configuration
-- Exécuter dans Supabase SQL Editor

-- Configuration des réservations
INSERT INTO site_config (key, value, description, category, is_public) VALUES 
('booking', '{
  "services": [
    {
      "id": "consultation",
      "name": "Consultation gratuite",
      "duration": 60,
      "description": "Évaluation gratuite de votre projet de ravalement"
    },
    {
      "id": "devis",
      "name": "Visite pour devis",
      "duration": 90,
      "description": "Devis personnalisé sur site avec expertise technique"
    },
    {
      "id": "expertise",
      "name": "Expertise technique",
      "duration": 120,
      "description": "Analyse technique approfondie et diagnostic complet"
    },
    {
      "id": "suivi",
      "name": "Suivi de chantier",
      "duration": 30,
      "description": "Contrôle qualité et suivi des travaux en cours"
    }
  ],
  "timeSlots": ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
  "workingDays": {"start": 1, "end": 5},
  "workingHours": {
    "morning": {"start": "08:00", "end": "12:00"},
    "afternoon": {"start": "14:00", "end": "18:00"}
  },
  "maxAdvanceDays": 30,
  "minAdvanceHours": 24
}', 'Configuration des réservations et créneaux', 'booking', true)
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  is_public = EXCLUDED.is_public,
  updated_at = NOW();

-- Configuration des contacts
INSERT INTO site_config (key, value, description, category, is_public) VALUES 
('contact', '{
  "companyName": "DR RAVALEMENT",
  "email": "contact@dr-ravalement.fr",
  "phone": "01 23 45 67 89",
  "address": "123 Rue de la Façade",
  "city": "Paris",
  "postalCode": "75001",
  "country": "France",
  "website": "https://dr-ravalement.fr",
  "socialMedia": {
    "facebook": "https://facebook.com/dr-ravalement",
    "instagram": "https://instagram.com/dr_ravalement",
    "linkedin": "https://linkedin.com/company/dr-ravalement",
    "twitter": "https://twitter.com/dr_ravalement"
  }
}', 'Informations de contact de l\'entreprise', 'contact', true)
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  is_public = EXCLUDED.is_public,
  updated_at = NOW();

-- Configuration des emails
INSERT INTO site_config (key, value, description, category, is_public) VALUES 
('email', '{
  "ownerEmail": "contact@dr-ravalement.fr",
  "fromName": "DR RAVALEMENT",
  "fromEmail": "noreply@dr-ravalement.fr",
  "replyTo": "contact@dr-ravalement.fr",
  "templates": {
    "bookingConfirmation": {
      "subject": "Confirmation de votre rendez-vous - {{serviceType}}",
      "template": "default"
    },
    "ownerNotification": {
      "subject": "Nouveau rendez-vous réservé - {{serviceType}}",
      "template": "default"
    }
  }
}', 'Configuration des emails et notifications', 'email', true)
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  is_public = EXCLUDED.is_public,
  updated_at = NOW();

-- Configuration de l'apparence
INSERT INTO site_config (key, value, description, category, is_public) VALUES 
('appearance', '{
  "primaryColor": "#e67e22",
  "secondaryColor": "#f39c12",
  "logo": "/logo.png",
  "favicon": "/favicon.ico",
  "theme": "light",
  "fonts": {
    "primary": "Inter",
    "secondary": "Roboto"
  }
}', 'Configuration de l\'apparence et du design', 'appearance', true)
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  is_public = EXCLUDED.is_public,
  updated_at = NOW();

-- Vérifier les configurations créées
SELECT key, description, category, is_public, created_at 
FROM site_config 
ORDER BY category, key;
