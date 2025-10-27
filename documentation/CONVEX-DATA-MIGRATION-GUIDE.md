# 📦 Guide de Migration des Données Convex (Dev → Prod)

Ce guide vous explique comment migrer toutes vos données de l'environnement de développement vers la production Convex.

## 🎯 Vue d'ensemble

Quand vous utilisez `npx convex deploy`, cela déploie uniquement le **schéma et les fonctions** vers l'environnement de production. Les **données ne sont PAS migrées automatiquement**.

Il faut donc **exporter** les données du dev et **importer** dans prod.

## 📊 Structure des Données à Migrer

Votre application utilise ces tables principales :
- `users` - Utilisateurs et administrateurs
- `site_config` - Configuration du site
- `bookings` - Réservations
- `projects` - Projets clients
- `quotes` - Devis
- `notifications` - Notifications
- `articles` - Articles de blog
- `services` - Services offerts
- `statistics` - Statistiques (Hero section)
- `zones` - Zones d'intervention
- `reasons` - Raisons (Pourquoi nous choisir)
- `testimonials` - Témoignages
- `company_history` - Histoire de l'entreprise
- `values` - Valeurs
- `team_members` - Membres de l'équipe
- `certifications` - Certifications
- `process_steps` - Étapes du processus
- `project_filters` - Filtres de projets
- `portfolio_projects` - Projets de réalisation
- `media_files` - Fichiers médias

## 🚀 Méthode 1 : Utilisation des Scripts (Recommandé)

### Étape 1 : Exporter les données du Dev

```bash
# Exporter toutes les données de votre environnement dev
node scripts/export-convex-data.js
```

Cela va créer un fichier `convex-data-backup.json` avec toutes vos données.

### Étape 2 : Déployer vers la Production

```bash
# Déployer le schéma et les fonctions vers prod
npx convex deploy --prod
```

### Étape 3 : Importer les données dans Prod

```bash
# Importer les données dans l'environnement de production
node scripts/import-convex-data.js
```

## 🔧 Méthode 2 : Migration Manuelle via Dashboard

### Étape 1 : Déployer vers Production

```bash
npx convex deploy --prod
```

### Étape 2 : Accéder au Dashboard

```bash
# Ouvrir le dashboard de production
npx convex dashboard --prod
```

### Étape 3 : Réinitialiser les données de Prod

Dans le dashboard de production, vous pouvez :
1. Aller dans l'onglet "Data"
2. Supprimer toutes les tables
3. Exécuter la fonction d'initialisation

```bash
# Dans le terminal
npx convex run initData:initializeDefaultData --prod
```

### Étape 4 : Re-manipuler les données

Une fois les données initiales chargées, vous devrez manuellement recréer/modifier vos données via l'interface d'administration de votre application.

## 📝 Méthode 3 : Script Interactif

Un script interactif est disponible pour vous guider pas à pas :

```bash
node scripts/migrate-convex-data.js
```

Ce script va :
1. Vous demander de choisir la source (dev)
2. Vous demander de choisir la destination (prod)
3. Exporter toutes les données
4. Vous permettre de revoir les données avant import
5. Importer les données dans la destination

## ⚠️ Points Importants

### 1. Sauvegarde

**TOUJOURS** créer une sauvegarde avant de migrer :

```bash
# Sauvegarder les données de prod (si vous avez déjà des données)
node scripts/export-convex-data.js --env prod
```

### 2. Images et Fichiers Médias

Les URLs d'images dans vos données pointent vers votre environnement dev. Vous devrez peut-être :
- Copier les fichiers d'images vers un service de stockage accessible en prod
- Ou mettre à jour les URLs dans les données

### 3. Authentification

Les tokens d'authentification devront être recréés en production car ils ne sont pas transférables.

### 4. IDs

Les IDs générés en dev seront différents en prod. C'est normal.

## 🔍 Vérification Post-Migration

Après la migration, vérifiez que :

```bash
# Vérifier les données dans prod
node scripts/verify-data-migration.js
```

Cela va vérifier :
- ✅ Nombre total de documents par table
- ✅ Intégrité des relations (clés étrangères)
- ✅ Données critiques (admin, config)
- ✅ Images accessibles

## 🛠️ Commandes Utiles

```bash
# Voir le statut de votre déploiement
npx convex status --prod

# Voir les logs de production
npx convex logs --prod

# Ouvrir le dashboard de production
npx convex dashboard --prod

# Ouvrir le dashboard de dev
npx convex dashboard

# Voir les fonctions déployées
npx convex functions list --prod
```

## 🆘 Dépannage

### Erreur : "Cannot connect to Convex"

Vérifiez que vous êtes connecté :
```bash
npx convex login
```

### Erreur : "Project not found"

Assurez-vous que votre projet prod est bien configuré dans `.env.local` :
```env
CONVEX_PROJECT=your-prod-project-id
```

### Données incomplètes

Si certaines tables ne sont pas migrées :
```bash
# Réinitialiser une table spécifique
node scripts/import-convex-data.js --table nom_de_la_table
```

## 📌 Étapes Résumées

1. ✅ **Backup** : Exporter les données de dev
2. ✅ **Deploy** : `npx convex deploy --prod`
3. ✅ **Import** : Importer les données dans prod
4. ✅ **Verify** : Vérifier les données
5. ✅ **Test** : Tester l'application en prod
6. ✅ **Images** : Gérer les fichiers médias
7. ✅ **Auth** : Recréer les sessions admin

---

**💡 Astuce** : Utilisez toujours le script `migrate-convex-data.js` pour une migration guidée et sécurisée !


