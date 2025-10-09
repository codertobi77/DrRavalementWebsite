# Guide de Configuration du CMS

Ce guide vous explique comment configurer et utiliser le système de gestion de contenu (CMS) pour votre site DR RAVALEMENT.

## 🚀 Installation et Configuration

### 1. Prérequis
- Node.js installé
- Compte Supabase configuré
- Variables d'environnement définies

### 2. Variables d'environnement requises
Ajoutez ces variables à votre fichier `.env` :

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email Configuration (pour les notifications)
VITE_RESEND_API_KEY=your_resend_api_key
```

### 3. Initialisation de la base de données

#### Option A : Script automatique
```bash
node setup-cms-database.js
```

#### Option B : Scripts SQL manuels
1. Ouvrez Supabase Dashboard > SQL Editor
2. Exécutez `create-content-tables.sql`
3. Exécutez `init-page-content.sql`

### 4. Vérification de l'installation
```bash
node check-cms-setup.js
```

## 📄 Structure du CMS

### Tables créées
- **`pages`** : Pages principales du site (accueil, à propos, services, réalisations)
- **`page_sections`** : Sections modulaires de chaque page
- **`articles`** : Articles de blog
- **`media_files`** : Fichiers médias (images, documents)

### Pages gérées
1. **Page d'accueil** (`/`)
   - Section Hero
   - Pourquoi nous choisir
   - Services principaux
   - Témoignages
   - Zones d'intervention

2. **À propos** (`/about`)
   - Histoire de l'entreprise
   - Valeurs
   - Équipe

3. **Services** (`/services`)
   - Services principaux
   - Processus de travail

4. **Réalisations** (`/portfolio`)
   - Galerie de projets
   - Témoignages clients

## 🎛️ Interface d'Administration

### Accès
- URL : `http://localhost:3000/admin`
- Lien dans le footer du site

### Fonctionnalités disponibles

#### 1. Gestion des Pages (`/admin/pages`)
- **Sélection de page** : Choisir la page à modifier
- **Informations SEO** : Titre et description meta
- **Sections modulaires** : Ajouter, modifier, supprimer des sections
- **Types de sections** :
  - `hero` : Section d'en-tête
  - `text` : Contenu textuel
  - `services` : Liste de services
  - `testimonials` : Témoignages
  - `gallery` : Galerie d'images

#### 2. Gestion du Contenu (`/admin/content`)
- Articles de blog
- Pages statiques
- Système de catégories

#### 3. Gestion des Médias (`/admin/media`)
- Upload de fichiers
- Organisation par catégories
- Métadonnées (alt text, descriptions)

#### 4. Autres modules
- Projets (`/admin/projects`)
- Devis (`/admin/quotes`)
- Utilisateurs (`/admin/users`)
- Analytics (`/admin/analytics`)

## ✏️ Modification du Contenu

### 1. Modifier une page
1. Allez sur `/admin/pages`
2. Sélectionnez la page à modifier
3. Cliquez sur "Modifier la page" pour les infos SEO
4. Modifiez les sections existantes ou ajoutez-en de nouvelles

### 2. Structure des sections
Chaque section contient :
- **Clé de section** : Identifiant unique
- **Type** : Type de contenu
- **Titre** : Titre affiché
- **Contenu** : Données JSON structurées
- **Ordre** : Position dans la page
- **Statut** : Actif/Inactif

### 3. Exemple de contenu JSON
```json
{
  "headline": "Expert Façades & Maçonnerie",
  "subtitle": "Spécialiste du ravalement...",
  "cta_text": "Demander un devis gratuit",
  "cta_link": "/booking",
  "background_image": "/images/hero-facade.jpg"
}
```

## 🔧 Développement

### Structure des fichiers
```
src/
├── lib/
│   └── page-content.ts          # Service de gestion des pages
├── pages/
│   ├── admin/
│   │   └── pages/
│   │       └── page.tsx         # Interface d'administration
│   └── [pages-frontend]         # Pages publiques
└── components/
    └── [composants-réutilisables]
```

### Intégration frontend
Pour connecter les pages frontend au CMS :

```typescript
import { PageContentService } from '../lib/page-content';

// Dans votre composant de page
const { page, sections } = await PageContentService.getPageWithSections('home');
```

## 🚨 Dépannage

### Problèmes courants

1. **Erreur de connexion Supabase**
   - Vérifiez les variables d'environnement
   - Vérifiez l'URL et les clés API

2. **Tables manquantes**
   - Exécutez les scripts SQL dans Supabase
   - Vérifiez les permissions RLS

3. **Contenu non affiché**
   - Vérifiez le statut des pages (publié/brouillon)
   - Vérifiez le statut des sections (actif/inactif)

4. **Erreurs de permissions**
   - Vérifiez les politiques RLS
   - Utilisez la clé service role pour l'admin

### Logs utiles
```bash
# Vérifier la configuration
node check-cms-setup.js

# Logs du navigateur
F12 > Console > Erreurs réseau
```

## 📞 Support

Pour toute question ou problème :
1. Vérifiez ce guide
2. Consultez les logs d'erreur
3. Testez avec les scripts de vérification

---

**Note** : Ce CMS est conçu pour être simple et efficace. Toutes les modifications sont sauvegardées en temps réel et visibles immédiatement sur le site.
