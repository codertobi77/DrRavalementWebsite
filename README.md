# Dr-Ravalement - Site Web

Site web professionnel pour l'entreprise de ravalement de façades.

## 📁 Organisation du Projet

### 🧪 [`test/`](test/) - Scripts de Test
Contient tous les scripts de test et de validation :
- Tests de fonctionnalités (CMS, authentification, galerie)
- Tests de validation des données
- Scripts de débogage et diagnostic

### 📚 [`documentation/`](documentation/) - Documentation
Contient toute la documentation technique :
- Guides d'implémentation
- Documentation des fonctionnalités
- Guides de correction et dépannage

### 🔧 [`scripts/`](scripts/) - Scripts d'Initialisation
Contient tous les scripts d'initialisation et de maintenance :
- Scripts d'initialisation des données
- Scripts de configuration
- Scripts de migration et maintenance

### 💻 [`src/`](src/) - Code Source
Code source de l'application React :
- Composants React
- Pages et routes
- Logique métier et utilitaires

### 🗄️ [`convex/`](convex/) - Backend Convex
Configuration et fonctions du backend :
- Schéma de base de données
- Fonctions Convex
- Authentification

## 🚀 Démarrage Rapide

### 1. Installation
```bash
npm install
```

### 2. Configuration
```bash
# Copier le fichier d'environnement
cp env.example .env

# Configurer Convex
npx convex dev
```

### 3. Initialisation des Données
```bash
# Initialiser les données de base
node scripts/init-cms-data.js
node scripts/init-before-after-projects.js
```

### 4. Démarrage
```bash
npm run dev
```

## 🧪 Tests

### Exécuter les Tests
```bash
# Tester la galerie avant-après
node test/test-before-after-gallery.js

# Vérifier l'intégrité des données
node test/check-cms-data-integrity.js
```

### Tests Disponibles
- Tests de fonctionnalités CMS
- Tests d'authentification
- Tests de la galerie avant-après
- Tests de validation des données

## 📖 Documentation

### Guides Principaux
- [Installation Rapide](documentation/QUICK-SETUP.md)
- [Configuration Convex](documentation/CONVEX-SETUP-GUIDE.md)
- [Galerie Avant/Après](documentation/BEFORE-AFTER-GALLERY-GUIDE.md)

### Dépannage
- [Erreurs CMS](documentation/CMS-ERROR-FIX-GUIDE.md)
- [Problèmes d'Authentification](documentation/AUTH-TROUBLESHOOTING-GUIDE.md)

## 🔧 Maintenance

### Scripts Utiles
```bash
# Nettoyer le cache
node scripts/clear-cache.js

# Corriger les images
node scripts/fix-existing-images.js

# Nettoyer les doublons
node scripts/clean-duplicate-cms-data.js
```

## 🏗️ Architecture

### Frontend
- **React** avec TypeScript
- **Tailwind CSS** pour le styling
- **Convex** pour la gestion d'état
- **React Router** pour la navigation

### Backend
- **Convex** pour la base de données et l'API
- **Authentification** intégrée
- **Upload d'images** avec stockage

### Fonctionnalités
- 🏠 **Pages** : Accueil, Services, Portfolio, Contact
- 🖼️ **Galerie Avant/Après** interactive
- 👤 **Espace Admin** complet
- 📱 **Design Responsive**
- 🔐 **Authentification** sécurisée

## 📊 Structure des Données

### Projets de Portfolio
- Images avant/après
- Catégorisation (Ravalement, Maçonnerie, Couverture)
- Descriptions détaillées

### Système CMS
- Gestion de contenu dynamique
- Cache optimisé
- Interface d'administration

## 🚀 Déploiement

### Production
```bash
# Build de production
npm run build

# Déploiement Vercel
vercel deploy
```

### Configuration
- Variables d'environnement configurées
- Base de données Convex déployée
- Images optimisées

## 📞 Support

Pour toute question ou problème :
1. Consulter la [documentation](documentation/)
2. Exécuter les [tests](test/)
3. Utiliser les [scripts de maintenance](scripts/)

---

*Projet organisé pour faciliter le développement et la maintenance*
