# Guide de Migration de Supabase vers Convex

Ce guide vous explique comment migrer votre application de Supabase vers Convex.

## 🚀 Installation et Configuration

### 1. Prérequis
- Node.js installé
- Compte Convex créé
- Variables d'environnement configurées

### 2. Variables d'environnement
Ajoutez ces variables à votre fichier `.env` :

```env
# Convex Configuration
VITE_CONVEX_URL=your_convex_url

# Supprimez ou commentez les variables Supabase
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...
# SUPABASE_SERVICE_ROLE_KEY=...
```

### 3. Initialisation de Convex

#### Option A : Script automatique
```bash
# Initialiser Convex
npx convex dev

# Dans un autre terminal, initialiser les données
npx convex run initData:initializeDefaultData
```

#### Option B : Manuel
1. Créez un projet sur [convex.dev](https://convex.dev)
2. Copiez l'URL de votre projet
3. Ajoutez-la à votre `.env`
4. Exécutez `npx convex dev`

## 📊 Structure de la Migration

### Tables Migrées
- ✅ `users` → `users`
- ✅ `site_config` → `site_config`
- ✅ `bookings` → `bookings`
- ✅ `pages` → `pages`
- ✅ `page_sections` → `page_sections`
- ✅ `articles` → `articles`
- ✅ `media_files` → `media_files`
- ✅ `projects` → `projects`
- ✅ `quotes` → `quotes`
- ✅ `notifications` → `notifications`

### Services Migrés
- ✅ `PageContentService` → Hooks Convex
- ✅ `BookingService` → Hooks Convex
- ✅ `SiteConfigService` → Hooks Convex
- ✅ `ArticleService` → Hooks Convex
- ✅ `MediaService` → Hooks Convex
- ✅ `ProjectService` → Hooks Convex
- ✅ `QuoteService` → Hooks Convex
- ✅ `UserService` → Hooks Convex
- ✅ `NotificationService` → Hooks Convex

## 🔄 Changements dans le Code

### 1. Remplacement des Imports

**Avant (Supabase) :**
```typescript
import { supabase } from './supabase';
import { PageContentService } from './page-content';
```

**Après (Convex) :**
```typescript
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { usePageBySlug, useCreatePage } from './page-content-convex';
```

### 2. Remplacement des Services

**Avant (Supabase) :**
```typescript
const { data: pages, error } = await supabase
  .from('pages')
  .select('*')
  .eq('status', 'published');
```

**Après (Convex) :**
```typescript
const pages = useQuery(api.pages.getAllPages);
```

### 3. Remplacement des Mutations

**Avant (Supabase) :**
```typescript
const { data, error } = await supabase
  .from('pages')
  .insert({ title: 'New Page', slug: 'new-page' });
```

**Après (Convex) :**
```typescript
const createPage = useMutation(api.pages.createPage);
await createPage({ title: 'New Page', slug: 'new-page' });
```

## 📝 Exemples de Migration

### Page d'Administration
```typescript
// Avant
function AdminPages() {
  const [pages, setPages] = useState([]);
  
  useEffect(() => {
    PageContentService.getAllPages().then(setPages);
  }, []);

  return (
    <div>
      {pages.map(page => (
        <div key={page.id}>{page.title}</div>
      ))}
    </div>
  );
}

// Après
function AdminPages() {
  const pages = useQuery(api.pages.getAllPages);
  
  if (pages === undefined) return <div>Loading...</div>;

  return (
    <div>
      {pages.map(page => (
        <div key={page._id}>{page.title}</div>
      ))}
    </div>
  );
}
```

### Gestion des Réservations
```typescript
// Avant
function BookingPage() {
  const [timeSlots, setTimeSlots] = useState([]);
  
  const loadTimeSlots = async (date) => {
    const slots = await BookingService.getAvailableTimeSlots(date);
    setTimeSlots(slots);
  };

  return (
    <div>
      {timeSlots.map(slot => (
        <button key={slot}>{slot}</button>
      ))}
    </div>
  );
}

// Après
function BookingPage() {
  const [selectedDate, setSelectedDate] = useState('');
  const timeSlots = useQuery(api.bookings.getAvailableTimeSlots, 
    selectedDate ? { date: selectedDate } : "skip"
  );

  return (
    <div>
      {timeSlots?.map(slot => (
        <button key={slot}>{slot}</button>
      ))}
    </div>
  );
}
```

## 🛠️ Scripts de Migration

### 1. Script d'Initialisation
```bash
# Initialiser Convex
npx convex dev

# Initialiser les données
npx convex run initData:initializeDefaultData
```

### 2. Script de Vérification
```bash
# Vérifier la connexion
npx convex run pages:getAllPages
```

## ⚠️ Points d'Attention

### 1. IDs des Documents
- **Supabase** : `id` (string)
- **Convex** : `_id` (Id<"table_name">)

### 2. Requêtes Conditionnelles
- **Supabase** : `useQuery` avec conditions
- **Convex** : `"skip"` pour désactiver les requêtes

### 3. Gestion des Erreurs
- **Supabase** : `error` dans la réponse
- **Convex** : `undefined` pour les erreurs

### 4. Types TypeScript
- **Supabase** : Types générés automatiquement
- **Convex** : Types dans `convex/_generated/api`

## 🔧 Dépannage

### Problèmes Courants

1. **Erreur de connexion Convex**
   - Vérifiez `VITE_CONVEX_URL`
   - Vérifiez que Convex est en cours d'exécution

2. **Types TypeScript manquants**
   - Exécutez `npx convex dev` pour générer les types
   - Vérifiez les imports dans `convex/_generated/api`

3. **Données non chargées**
   - Vérifiez que les hooks sont utilisés dans des composants React
   - Vérifiez les conditions des requêtes

### Logs Utiles
```bash
# Logs Convex
npx convex dev --verbose

# Vérifier les données
npx convex run pages:getAllPages
```

## 📚 Ressources

- [Documentation Convex](https://docs.convex.dev)
- [Guide de Migration](https://docs.convex.dev/guides/migrating-from-supabase)
- [API Reference](https://docs.convex.dev/api)

---

**Note** : Cette migration préserve toutes les fonctionnalités existantes tout en améliorant les performances et la simplicité de développement.
