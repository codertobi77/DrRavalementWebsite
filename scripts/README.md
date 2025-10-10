# Dossier Scripts

Ce dossier contient tous les scripts d'initialisation, de configuration et de maintenance du projet Dr-Ravalement.

## 📁 Structure des Fichiers

### Scripts d'Initialisation
- `init-*.js` - Scripts d'initialisation des données
- `setup-*.js` - Scripts de configuration initiale
- `start-*.js` - Scripts de démarrage et démonstration

### Scripts de Migration
- `migrate-*.js` - Scripts de migration entre systèmes
- `clean-*.js` - Scripts de nettoyage des données
- `fix-*.js` - Scripts de correction

### Scripts de Maintenance
- `clear-*.js` - Scripts de nettoyage du cache
- Scripts utilitaires divers

## 🚀 Utilisation

### Exécuter un Script
```bash
# Depuis la racine du projet
node scripts/nom-du-script.js
```

### Exemples
```bash
# Initialiser les projets avant-après
node scripts/init-before-after-projects.js

# Configurer Convex
node scripts/setup-convex.js

# Démarrer la démonstration
node scripts/start-before-after-demo.js
```

## 📋 Types de Scripts

### Initialisation
- ✅ **init-admin-users.js** - Création des utilisateurs admin
- ✅ **init-cms-data.js** - Initialisation des données CMS
- ✅ **init-before-after-projects.js** - Création des projets avant-après
- ✅ **init-convex.js** - Configuration Convex
- ✅ **init-legal-info-config.js** - Configuration des informations légales
- ✅ **init-site-config-convex.js** - Configuration du site

### Configuration
- ✅ **setup-convex.js** - Configuration Convex
- ✅ **setup-cms-database.js** - Configuration base de données CMS

### Migration
- ✅ **migrate-to-convex.js** - Migration vers Convex
- ✅ **migrate-to-cache.js** - Migration vers le cache

### Maintenance
- ✅ **clean-duplicate-cms-data.js** - Nettoyage des données dupliquées
- ✅ **fix-existing-images.js** - Correction des images existantes
- ✅ **clear-cache.js** - Nettoyage du cache

### Démonstration
- ✅ **start-before-after-demo.js** - Démonstration galerie avant-après

## 🔧 Configuration

Tous les scripts utilisent la configuration définie dans `.env` :
```
VITE_CONVEX_URL=https://acoustic-ox-512.convex.cloud
CONVEX_DEPLOYMENT=dev:acoustic-ox-512
```

## 📊 Ordre d'Exécution Recommandé

### 1. Configuration Initiale
```bash
node scripts/setup-convex.js
node scripts/init-convex.js
```

### 2. Initialisation des Données
```bash
node scripts/init-cms-data.js
node scripts/init-admin-users.js
node scripts/init-before-after-projects.js
```

### 3. Configuration du Site
```bash
node scripts/init-site-config-convex.js
node scripts/init-legal-info-config.js
```

### 4. Maintenance (si nécessaire)
```bash
node scripts/clean-duplicate-cms-data.js
node scripts/fix-existing-images.js
node scripts/clear-cache.js
```

## ⚠️ Précautions

### Avant d'exécuter un script :
1. **Sauvegarder** les données importantes
2. **Vérifier** la configuration Convex
3. **Tester** sur un environnement de développement
4. **Lire** la documentation du script

### Scripts de Migration :
- ⚠️ **Irréversibles** - Les migrations modifient définitivement les données
- ⚠️ **Sauvegarde requise** - Toujours sauvegarder avant migration
- ⚠️ **Test recommandé** - Tester sur des données de test d'abord

## 📈 Monitoring

Les scripts affichent des logs détaillés :
- ✅ **Succès** - Opérations réussies
- ❌ **Erreurs** - Problèmes rencontrés
- ⚠️ **Avertissements** - Points d'attention
- 📊 **Statistiques** - Résultats des opérations

## 🔍 Dépannage

### Erreurs courantes :
1. **Connexion Convex** - Vérifier l'URL dans `.env`
2. **Permissions** - Vérifier les droits d'accès
3. **Données manquantes** - Exécuter les scripts d'initialisation
4. **Cache** - Utiliser `clear-cache.js`

---

*Dossier créé pour organiser tous les scripts d'initialisation et de maintenance du projet*
