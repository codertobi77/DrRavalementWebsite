# Guide d'utilisation des services Convex

Ce guide explique comment configurer et utiliser les services dynamiques dans le footer.

## 🚀 Configuration rapide

### 1. Vérifier la configuration Convex

```bash
# Tester la connexion à Convex
npm run test-convex
```

### 2. Initialiser les services de base

```bash
# Créer des services de base dans la base de données
npm run init-services

# Forcer la création même si des services existent
npm run init-services -- --force
```

### 3. Vérifier les services

```bash
# Vérifier l'état des services
npm run check-objectives
```

## 🔧 Configuration avancée

### Variables d'environnement

Assurez-vous que votre fichier `.env` contient :

```env
VITE_CONVEX_URL=https://votre-deployment.convex.cloud
```

### Démarrage du serveur Convex

```bash
# Démarrer le serveur de développement Convex
npm run convex:dev

# Ou en arrière-plan
npx convex dev
```

## 📋 Fonctionnalités

### Hook useServices

Le hook `useServices` fournit :

- **Chargement automatique** : Récupère les services depuis Convex
- **Fallback gracieux** : Utilise des services par défaut si Convex n'est pas disponible
- **Gestion d'erreurs** : Gère les erreurs de connexion
- **État de chargement** : Indique quand les données sont en cours de chargement

### Services par défaut

Si Convex n'est pas disponible, les services suivants sont affichés :

1. Ravalement de Façades
2. Projection Machine
3. Maçonnerie Générale
4. Couverture
5. Clôtures Parpaing
6. Isolation Thermique

### Services dynamiques

Avec Convex configuré, le footer affiche :

- **Services de la base de données** : Récupérés depuis Convex
- **Tri automatique** : Par `order_index`
- **Filtrage actif** : Seulement les services `is_active: true`
- **Mise à jour en temps réel** : Les changements se reflètent automatiquement

## 🛠️ Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run test-convex` | Tester la connexion à Convex |
| `npm run init-services` | Initialiser des services de base |
| `npm run update-objectives` | Mettre à jour les objectifs des services |
| `npm run check-objectives` | Vérifier l'état des objectifs |

## 🔍 Dépannage

### Erreur "Convex URL non configurée"

```bash
# Vérifier le fichier .env
cat .env | grep VITE_CONVEX_URL

# Configurer l'URL Convex
echo "VITE_CONVEX_URL=https://votre-deployment.convex.cloud" >> .env
```

### Erreur "Function not found"

```bash
# Vérifier que Convex est démarré
npm run convex:dev

# Vérifier les fonctions disponibles
npm run test-convex
```

### Services non affichés

1. Vérifier que Convex est démarré
2. Vérifier la connexion : `npm run test-convex`
3. Initialiser les services : `npm run init-services`
4. Vérifier dans l'admin que les services sont actifs

## 📊 Structure des données

### Service dans Convex

```typescript
interface Service {
  _id: string;
  title: string;
  description: string;
  objective?: string;
  image: string;
  features: string[];
  order_index: number;
  is_active: boolean;
}
```

### Services par défaut

Les services par défaut sont définis dans `src/hooks/useServices.ts` et peuvent être modifiés selon vos besoins.

## 🎯 Prochaines étapes

1. **Configurer Convex** : Suivez le guide de configuration Convex
2. **Initialiser les services** : Utilisez `npm run init-services`
3. **Personnaliser** : Modifiez les services via l'interface d'administration
4. **Tester** : Vérifiez que les services s'affichent correctement dans le footer

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs de la console
2. Testez la connexion : `npm run test-convex`
3. Consultez la documentation Convex
4. Vérifiez la configuration de votre environnement
