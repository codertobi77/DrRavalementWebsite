# 🚀 Guide Rapide de Migration des Données Convex

## Étape 1 : Déployer vers Production

```bash
# Se connecter à Convex
npx convex login

# Déployer le schéma et les fonctions vers la production
npx convex deploy --prod
```

⚠️ **Important** : Cela déploie uniquement le code (schéma + fonctions), PAS les données.

## Étape 2 : Migrer les Données

Convex ne fournit pas d'outil automatique pour exporter/importer les données. Voici 3 méthodes :

### Méthode 1 : Export/Import via Dashboard (Recommandé)

#### A. Accéder au Dashboard Dev

```bash
npx convex dashboard
```

#### B. Exporter les données

1. Dans le dashboard dev, allez dans chaque table
2. Utilisez l'interface pour voir les données
3. Copiez manuellement les données importantes

#### C. Accéder au Dashboard Prod

```bash
npx convex dashboard --prod
```

#### D. Importer les données

1. Re-entrer les données dans chaque table via le dashboard
2. Ou utiliser la fonction d'initialisation si applicable

### Méthode 2 : Re-initialiser avec les données par défaut

Si vous utilisez des données par défaut/initiales :

```bash
# Dans l'environnement de production
npx convex run initData:initializeDefaultData --prod
```

### Méthode 3 : Recréer les données via l'interface Admin

1. Déployer l'application en production
2. Se connecter à l'interface admin
3. Recréer les données manuellement via l'interface

## Étape 3 : Vérifier

```bash
# Voir les données en production
npx convex dashboard --prod

# Voir les logs
npx convex logs --prod
```

## ⚠️ Points Importants

### 1. Images et Fichiers

Les URLs d'images doivent être accessibles en production :
- Utilisez un service de stockage (Cloudinary, S3, etc.)
- Ou hébergez les images sur votre propre serveur

### 2. Authentification

Les sessions utilisateur doivent être recréées en production.

### 3. Configuration

Assurez-vous que les configurations (`site_config`) sont définies en production.

## 🔧 Commandes Utiles

```bash
# Liste des commandes Convex
npx convex --help

# Voir le statut de vos déploiements
npx convex status

# Voir les logs de production
npx convex logs --prod

# Dashboard de développement
npx convex dashboard

# Dashboard de production
npx convex dashboard --prod
```

## 📌 Checklist de Migration

- [ ] Déployer le code vers prod : `npx convex deploy --prod`
- [ ] Exporter les données importantes depuis dev
- [ ] Initialiser les données de base en prod : `npx convex run initData:initializeDefaultData --prod`
- [ ] Importer les données personnalisées
- [ ] Configurer les images/fichiers médias
- [ ] Tester l'application en production
- [ ] Vérifier les comptes admin
- [ ] Vérifier la configuration du site

---

**💡 Note** : Pour les gros volumes de données, considérez utiliser l'API Convex directement ou contacter le support Convex pour un export/import en masse.


