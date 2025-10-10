# Dossier Test

Ce dossier contient tous les scripts de test et de validation du projet Dr-Ravalement.

## 📁 Structure des Fichiers

### Scripts de Test CMS
- `test-cms-*.js` - Tests du système CMS
- `test-cache-*.js` - Tests du système de cache
- `test-auth-*.js` - Tests d'authentification
- `test-image-*.js` - Tests d'affichage d'images

### Scripts de Validation
- `check-cms-*.js` - Vérification de l'intégrité des données CMS
- `verify-*.js` - Validation des migrations
- `debug-*.js` - Scripts de débogage

### Scripts de Test Spécifiques
- `test-before-after-gallery.js` - Test de la galerie avant-après
- `test-gallery-fix.js` - Test de correction de la galerie
- `test-gallery-issue.js` - Diagnostic des problèmes de galerie

## 🚀 Utilisation

### Exécuter un Test
```bash
# Depuis la racine du projet
node test/nom-du-test.js
```

### Exemples
```bash
# Tester la galerie avant-après
node test/test-before-after-gallery.js

# Vérifier l'intégrité des données CMS
node test/check-cms-data-integrity.js

# Tester l'authentification
node test/test-auth-system.js
```

## 📋 Types de Tests

### Tests de Fonctionnalité
- ✅ Galerie avant-après
- ✅ Système CMS
- ✅ Authentification
- ✅ Cache des données
- ✅ Upload d'images

### Tests de Validation
- ✅ Intégrité des données
- ✅ Configuration Convex
- ✅ Migrations
- ✅ Performance

### Tests de Debug
- ✅ Diagnostic des problèmes
- ✅ Vérification des logs
- ✅ Analyse des erreurs

## 🔧 Configuration

Tous les scripts utilisent la configuration Convex définie dans `.env` :
```
VITE_CONVEX_URL=https://acoustic-ox-512.convex.cloud
```

## 📊 Résultats

Les tests affichent des résultats détaillés avec :
- ✅ Succès
- ❌ Erreurs
- ⚠️ Avertissements
- 📊 Statistiques

---

*Dossier créé pour organiser tous les scripts de test du projet*
