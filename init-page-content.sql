-- Initialisation du contenu des pages principales
-- Exécuter ce script dans Supabase SQL Editor après create-content-tables.sql

-- Page d'accueil
INSERT INTO pages (slug, title, meta_title, meta_description, content, status) VALUES 
('home', 'Accueil', 'DR RAVALEMENT - Expert Façades & Maçonnerie en Seine-et-Marne', 'Spécialiste du ravalement de façades par projection machine et maçonnerie générale en Seine-et-Marne depuis 2008. Devis gratuit.', '{}', 'published');

-- Page à propos
INSERT INTO pages (slug, title, meta_title, meta_description, content, status) VALUES 
('about', 'À Propos', 'À Propos - DR RAVALEMENT | Votre Expert Façades', 'Découvrez l''histoire de DR RAVALEMENT, votre spécialiste du ravalement de façades en Seine-et-Marne. Plus de 15 ans d''expérience.', '{}', 'published');

-- Page services
INSERT INTO pages (slug, title, meta_title, meta_description, content, status) VALUES 
('services', 'Services', 'Nos Services - DR RAVALEMENT | Ravalement & Maçonnerie', 'Découvrez tous nos services : ravalement de façades, projection machine, maçonnerie générale, couverture, clôtures et isolation thermique.', '{}', 'published');

-- Page réalisations
INSERT INTO pages (slug, title, meta_title, meta_description, content, status) VALUES 
('portfolio', 'Réalisations', 'Nos Réalisations - DR RAVALEMENT | Galerie de Projets', 'Consultez notre galerie de réalisations : ravalements de façades, projets de maçonnerie et rénovations en Seine-et-Marne.', '{}', 'published');

-- Sections de la page d'accueil
INSERT INTO page_sections (page_id, section_key, section_type, title, content, order_index) VALUES 
-- Hero Section
((SELECT id FROM pages WHERE slug = 'home'), 'hero', 'hero', 'DR RAVALEMENT', 
 '{"headline": "Expert Façades & Maçonnerie", "subtitle": "Spécialiste du ravalement de façades par projection machine et maçonnerie générale en Seine-et-Marne depuis 2008", "cta_text": "Demander un devis gratuit", "cta_link": "/booking", "background_image": "/images/hero-facade.jpg"}', 1),

-- Pourquoi nous choisir
((SELECT id FROM pages WHERE slug = 'home'), 'why-choose', 'text', 'Pourquoi choisir DR RAVALEMENT ?', 
 '{"content": "Avec plus de 15 ans d''expérience, DR RAVALEMENT s''est imposé comme le spécialiste du ravalement de façades en Seine-et-Marne. Notre expertise technique, notre savoir-faire artisanal et notre engagement qualité nous permettent de réaliser des projets d''exception qui valorisent votre patrimoine.", "features": [{"icon": "ri-award-line", "title": "15+ ans d''expérience", "description": "Une expertise reconnue dans le domaine du ravalement"}, {"icon": "ri-tools-line", "title": "Matériel professionnel", "description": "Projection machine et équipements de pointe"}, {"icon": "ri-shield-check-line", "title": "Garantie décennale", "description": "Assurance et garanties complètes"}, {"icon": "ri-map-pin-line", "title": "Zone d''intervention", "description": "Seine-et-Marne et Île-de-France"}]}', 2),

-- Services principaux
((SELECT id FROM pages WHERE slug = 'home'), 'services', 'services', 'Nos Services', 
 '{"services": [{"title": "Ravalement de Façades", "description": "Rénovation complète de vos façades avec projection machine", "icon": "ri-building-line", "link": "/services"}, {"title": "Projection Machine", "description": "Technique professionnelle pour un rendu parfait", "icon": "ri-tools-line", "link": "/services"}, {"title": "Maçonnerie Générale", "description": "Tous travaux de maçonnerie et réparations", "icon": "ri-hammer-line", "link": "/services"}, {"title": "Isolation Thermique", "description": "Amélioration de l''efficacité énergétique", "icon": "ri-home-line", "link": "/services"}]}', 3),

-- Témoignages
((SELECT id FROM pages WHERE slug = 'home'), 'testimonials', 'testimonials', 'Témoignages Clients', 
 '{"testimonials": [{"name": "Jean Dupont", "location": "Meaux", "text": "Excellent travail de ravalement. L''équipe est professionnelle et le résultat dépasse nos attentes.", "rating": 5}, {"name": "Marie Martin", "location": "Chelles", "text": "Service impeccable et respect des délais. Je recommande vivement DR RAVALEMENT.", "rating": 5}, {"name": "Pierre Durand", "location": "Torcy", "text": "Un savoir-faire exceptionnel et des conseils précieux. Très satisfait du résultat final.", "rating": 5}]}', 4),

-- Zones d'intervention
((SELECT id FROM pages WHERE slug = 'home'), 'zones', 'text', 'Nos Zones d''Intervention', 
 '{"content": "Nous intervenons dans toute la Seine-et-Marne et l''Île-de-France pour tous vos projets de ravalement et maçonnerie.", "zones": ["Le Pecq", "Meaux", "Chelles", "Torcy", "Melun", "Fontainebleau", "Provins", "Coulommiers"]}', 5);

-- Sections de la page à propos
INSERT INTO page_sections (page_id, section_key, section_type, title, content, order_index) VALUES 
-- Histoire de l'entreprise
((SELECT id FROM pages WHERE slug = 'about'), 'history', 'text', 'Notre Histoire', 
 '{"content": "DR RAVALEMENT a été fondée en 2008 par des professionnels passionnés du bâtiment. Depuis plus de 15 ans, nous nous sommes spécialisés dans le ravalement de façades et la maçonnerie générale, développant une expertise reconnue en Seine-et-Marne. Notre engagement : offrir des solutions durables et esthétiques qui valorisent votre patrimoine immobilier.", "image": "/images/equipe-dr-ravalement.jpg"}', 1),

-- Valeurs
((SELECT id FROM pages WHERE slug = 'about'), 'values', 'text', 'Nos Valeurs', 
 '{"values": [{"title": "Excellence", "description": "Nous visons l''excellence dans chaque projet, avec un souci du détail et une finition impeccable.", "icon": "ri-award-line"}, {"title": "Innovation", "description": "Nous utilisons les dernières techniques et matériaux pour garantir des résultats durables.", "icon": "ri-lightbulb-line"}, {"title": "Transparence", "description": "Devis détaillés, planning respecté et communication claire tout au long du projet.", "icon": "ri-eye-line"}, {"title": "Engagement", "description": "Notre engagement qualité se traduit par des garanties complètes et un suivi personnalisé.", "icon": "ri-handshake-line"}]}', 2),

-- Équipe
((SELECT id FROM pages WHERE slug = 'about'), 'team', 'text', 'Notre Équipe', 
 '{"content": "Notre équipe de professionnels qualifiés met son savoir-faire au service de vos projets. Chaque membre de l''équipe DR RAVALEMENT est formé aux dernières techniques et engagé dans une démarche qualité continue.", "team_members": [{"name": "Directeur Technique", "role": "Expert façade", "experience": "20 ans"}, {"name": "Chef d''équipe", "role": "Spécialiste projection", "experience": "15 ans"}, {"name": "Maçon", "role": "Maçonnerie générale", "experience": "12 ans"}]}', 3);

-- Sections de la page services
INSERT INTO page_sections (page_id, section_key, section_type, title, content, order_index) VALUES 
-- Services principaux
((SELECT id FROM pages WHERE slug = 'services'), 'main-services', 'services', 'Nos Services Principaux', 
 '{"services": [{"title": "Ravalement de Façades", "description": "Rénovation complète de vos façades avec projection machine pour un rendu professionnel et durable.", "features": ["Préparation de la façade", "Projection machine enduit", "Peinture décorative", "Finitions soignées"], "image": "/images/ravalement-facade.jpg", "price_range": "À partir de 80€/m²"}, {"title": "Projection Machine", "description": "Technique professionnelle de projection d''enduit pour une finition parfaite et uniforme.", "features": ["Enduits monocouches", "Enduits décoratifs", "Isolants thermiques", "Résines de protection"], "image": "/images/projection-machine.jpg", "price_range": "À partir de 60€/m²"}, {"title": "Maçonnerie Générale", "description": "Tous travaux de maçonnerie : réparations, rejointoiement, construction et rénovation.", "features": ["Réparation de fissures", "Rejointoiement", "Construction neuve", "Rénovation"], "image": "/images/maconnerie.jpg", "price_range": "Sur devis"}, {"title": "Isolation Thermique", "description": "Amélioration de l''efficacité énergétique de votre bâtiment par l''extérieur (ITE).", "features": ["Pose d''isolant", "Enduit isolant", "Finitions décoratives", "Certification RGE"], "image": "/images/isolation-thermique.jpg", "price_range": "À partir de 120€/m²"}]}', 1),

-- Processus de travail
((SELECT id FROM pages WHERE slug = 'services'), 'process', 'text', 'Notre Processus de Travail', 
 '{"steps": [{"step": 1, "title": "Devis Gratuit", "description": "Visite sur site et établissement d''un devis détaillé gratuit", "icon": "ri-file-text-line"}, {"step": 2, "title": "Planification", "description": "Organisation des travaux et respect des délais convenus", "icon": "ri-calendar-line"}, {"step": 3, "title": "Préparation", "description": "Protection des abords et préparation de la façade", "icon": "ri-tools-line"}, {"step": 4, "title": "Réalisation", "description": "Exécution des travaux avec notre équipe qualifiée", "icon": "ri-hammer-line"}, {"step": 5, "title": "Livraison", "description": "Nettoyage final et remise des clés", "icon": "ri-check-double-line"}]}', 2);

-- Sections de la page réalisations
INSERT INTO page_sections (page_id, section_key, section_type, title, content, order_index) VALUES 
-- Galerie de projets
((SELECT id FROM pages WHERE slug = 'portfolio'), 'gallery', 'gallery', 'Nos Réalisations', 
 '{"projects": [{"title": "Ravalement Maison Individuelle", "location": "Meaux", "year": "2024", "description": "Ravalement complet d''une maison de 150m² avec projection machine et peinture décorative.", "images": ["/images/projet1-avant.jpg", "/images/projet1-apres.jpg"], "category": "Ravalement"}, {"title": "Rénovation Immeuble Collectif", "location": "Chelles", "year": "2024", "description": "Rénovation de la façade d''un immeuble de 5 étages avec isolation thermique par l''extérieur.", "images": ["/images/projet2-avant.jpg", "/images/projet2-apres.jpg"], "category": "Isolation"}, {"title": "Maçonnerie et Rejointoiement", "location": "Torcy", "year": "2023", "description": "Réparation de fissures et rejointoiement complet d''une façade en pierre.", "images": ["/images/projet3-avant.jpg", "/images/projet3-apres.jpg"], "category": "Maçonnerie"}]}', 1),

-- Témoignages clients
((SELECT id FROM pages WHERE slug = 'portfolio'), 'client-testimonials', 'testimonials', 'Témoignages Clients', 
 '{"testimonials": [{"name": "Sophie Bernard", "project": "Ravalement façade", "text": "Le résultat est magnifique ! L''équipe a été très professionnelle et a respecté tous les délais.", "rating": 5, "image": "/images/temoignage1.jpg"}, {"name": "Marc Leroy", "project": "Isolation thermique", "text": "Excellente prestation. Nous avons noté une amélioration significative de notre confort thermique.", "rating": 5, "image": "/images/temoignage2.jpg"}]}', 2);
