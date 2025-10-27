# 📦 Comment Migrer vos Données de Dev vers Prod Convex

## 🎯 Résumé

Quand vous faites `npx convex deploy`, cela déploie **uniquement le code** (schéma + fonctions). Les **données ne sont PAS migrées automatiquement**.

## ✅ Solution la Plus Simple

### 1. Déployer vers Prod

```bash
# Connectez-vous à Convex si nécessaire
npx convex login

# Déployez le code
npx convex deploy --prod
```

### 2. Initialiser les Données

```bash
# Initialiser les données par défaut en production
npx convex run initData:initializeDefaultData --prod
```

### 3. Recréer les Données Personnalisées

Pour vos données personnalisées (utilisateurs, projets, articles, etc.) :

**Option A** : Utiliser l'interface Admin de votre application
- Connectez-vous à `/admin`
- Recréez les données via les formulaires d'administration

**Option B** : Utiliser des scripts de migration
- Créez des scripts Node.js qui utilisent les mutations Convex
- Définissez vos données dans le script
- Exécutez le script contre l'environnement de prod

## 📝 Exemple de Script de Migration

Créez `scripts/migrate-to-prod.js` :

```javascript
const { ConvexHttpClient } = require('convex/browser');

// URL de votre projet de prod
const CONVEX_URL_PROD = process.env.CONVEX_URL_PROD;

const client = new ConvexHttpClient(CONVEX_URL_PROD);

async function migrateData() {
  // Exemple : Créer un utilisateur admin
  await client.mutation('users:createUser', {
    email: 'admin@votre-site.com',
    name: 'Administrateur',
    role: 'admin',
    status: 'active',
  });

  // Exemple : Créer des services
  await client.mutation('cms:createService', {
    title: 'Ravalement de Façades',
    description: 'Service complet de rénovation',
    image: '/images/ravalement.jpg',
    features: ['Préparation', 'Projection', 'Finition'],
    order_index: 1,
  });

  console.log('✅ Migration terminée !');
}

migrateData();
```

Puis exécutez :
```bash
node scripts/migrate-to-prod.js
```

## 🔍 Vérifier les Données

```bash
# Ouvrir le dashboard de production
npx convex dashboard --prod

# Ou vérifier les logs
npx convex logs --prod
```

## 📌 Tables à Migrer Manuellement

Voici les tables qui contiennent vos données personnalisées :

### Priorité Haute
- **users** : Utilisateurs et administrateurs
- **site_config** : Configuration du site
- **bookings** : Réservations clients
- **articles** : Articles de blog

### Priorité Moyenne
- **projects** : Projets clients
- **quotes** : Devis
- **portfolio_projects** : Projets de réalisation
- **services** : Services offerts

### Priorité Basse
- **statistics** : Statistiques
- **zones** : Zones d'intervention  
- **testimonials** : Témoignages
- **company_history** : Histoire de l'entreprise
- **etc...**

## ⚠️ Points Importants

1. **Images** : Les URLs d'images doivent être accessibles en prod
2. **Sessions** : Les sessions utilisateur doivent être recréées
3. **IDs** : Les IDs seront différents en prod (c'est normal)
4. **Backup** : Faites toujours un backup avant de migrer

## 🆘 Besoin d'Aide ?

```bash
# Voir la documentation Convex
npx convex --help

# Dashboard
npx convex dashboard --prod

# Logs
npx convex logs --prod
```

---

**💡 Astuce** : Pour éviter de recréer les données à chaque fois, créez des scripts de migration réutilisables avec toutes vos données de base.


