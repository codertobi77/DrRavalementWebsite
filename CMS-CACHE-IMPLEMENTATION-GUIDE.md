# Guide d'implémentation du système de cache CMS

## Vue d'ensemble

Le système de cache CMS a été implémenté pour améliorer significativement les performances de chargement des données Convex. Il combine localStorage, useMemo et un système d'invalidation intelligent.

## Architecture

### 1. Système de cache localStorage (`src/lib/cms-cache.ts`)

- **Cache persistant** : Les données sont stockées dans localStorage avec TTL (Time To Live)
- **Gestion automatique** : Nettoyage automatique des entrées expirées
- **Versioning** : Invalidation automatique lors des changements de version
- **Débordement** : Suppression des entrées les plus anciennes quand la limite est atteinte

### 2. Contexte global (`src/contexts/CmsCacheContext.tsx`)

- **État centralisé** : Gestion globale de l'état du cache
- **Actions** : Refresh, invalidation, vidage du cache
- **Monitoring** : Statistiques et surveillance des erreurs
- **Hooks spécialisés** : `useCacheStats()`, `useCacheErrors()`

### 3. Hooks optimisés (`src/hooks/useOptimizedCmsData.ts`)

- **Performance** : useMemo pour éviter les recalculs inutiles
- **Debouncing** : Évite les appels trop fréquents
- **Validation mémorisée** : Cache des résultats de validation
- **Métriques** : Suivi des performances de traitement

## Utilisation

### Hooks de base

```typescript
import { useCachedServices, useCachedStatistics } from '../lib/cms-cache';

function MyComponent() {
  const { data, isLoading, error, isCached, refresh } = useCachedServices();
  
  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;
  
  return (
    <div>
      {isCached && <CacheIndicator />}
      {data?.map(service => <ServiceCard key={service._id} service={service} />)}
    </div>
  );
}
```

### Hooks optimisés

```typescript
import { useOptimizedServices } from '../hooks/useOptimizedCmsData';

function OptimizedComponent() {
  const { 
    data, 
    performanceStats, 
    refresh 
  } = useOptimizedServices();
  
  console.log('Temps de traitement:', performanceStats.processingTime);
  console.log('Taille des données:', performanceStats.dataSize);
  
  return <ServicesList services={data} />;
}
```

### Gestion du cache

```typescript
import { useCmsCache } from '../contexts/CmsCacheContext';

function AdminPanel() {
  const { refreshAll, invalidate, clearAll } = useCmsCache();
  
  const handleRefresh = () => {
    refreshAll(); // Rafraîchit toutes les données
  };
  
  const handleInvalidateServices = () => {
    invalidate('SERVICES'); // Invalide seulement les services
  };
  
  const handleClearCache = () => {
    clearAll(); // Vide complètement le cache
  };
}
```

## Configuration

### TTL par défaut

- **Statistiques** : 10 minutes
- **Services** : 5 minutes  
- **Zones** : 15 minutes
- **Raisons** : 10 minutes
- **Témoignages** : 5 minutes
- **Projets** : 3 minutes
- **Projets par catégorie** : 2 minutes

### Limites

- **Taille maximale** : 100 entrées
- **Nettoyage automatique** : 20% des entrées les plus anciennes
- **Version** : 1.0.0 (invalidation automatique)

## Composants d'administration

### CacheManagement

Interface de gestion du cache avec :
- Statistiques en temps réel
- Actions de refresh/invalidation
- Gestion des erreurs
- Monitoring des performances

### CacheDashboard

Dashboard de surveillance avec :
- Métriques de performance
- État du cache
- Recommandations
- Historique des erreurs

## Avantages

### Performance

1. **Chargement instantané** : Les données en cache s'affichent immédiatement
2. **Réduction des requêtes** : Moins d'appels à Convex
3. **Mémoire optimisée** : useMemo évite les recalculs
4. **Débouncing** : Évite les appels redondants

### Expérience utilisateur

1. **Indicateurs visuels** : Affichage de l'état du cache
2. **Gestion d'erreurs** : Récupération automatique
3. **Loading states** : États de chargement cohérents
4. **Fallbacks** : Données de secours en cas d'erreur

### Maintenance

1. **Monitoring** : Surveillance des performances
2. **Debugging** : Outils de diagnostic
3. **Configuration** : TTL et limites configurables
4. **Invalidation** : Contrôle granulaire du cache

## Migration des composants existants

### Avant

```typescript
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

function OldComponent() {
  const data = useQuery(api.cms.getServices);
  // ...
}
```

### Après

```typescript
import { useCachedServices } from "../../lib/cms-cache";

function NewComponent() {
  const { data, isLoading, isCached } = useCachedServices();
  // ...
}
```

## Bonnes pratiques

### 1. Utiliser les hooks appropriés

- `useCached*` pour les composants simples
- `useOptimized*` pour les composants complexes
- `useCmsCache` pour la gestion administrative

### 2. Gérer les états de chargement

```typescript
if (isLoading) return <LoadingSkeleton />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;
```

### 3. Afficher l'état du cache

```typescript
{isCached && (
  <div className="cache-indicator">
    <i className="ri-database-line"></i>
    Données en cache
  </div>
)}
```

### 4. Invalider après les mutations

```typescript
const updateService = useMutation(api.cms.updateService);
const { invalidate } = useCmsCache();

const handleUpdate = async (data) => {
  await updateService(data);
  invalidate('SERVICES'); // Invalide le cache des services
};
```

## Dépannage

### Problèmes courants

1. **Cache non mis à jour** : Vérifier l'invalidation après les mutations
2. **Données expirées** : Ajuster le TTL si nécessaire
3. **Erreurs de localStorage** : Vérifier les permissions du navigateur
4. **Performance dégradée** : Surveiller la taille du cache

### Outils de debug

1. **TestCMSConnection** : Affiche l'état des données et du cache
2. **CacheManagement** : Interface de gestion en temps réel
3. **CacheDashboard** : Monitoring des performances
4. **Console logs** : Informations détaillées sur le cache

## Métriques de performance

Le système fournit plusieurs métriques :

- **Temps de traitement** : Durée de validation des données
- **Taille des données** : Taille en bytes des données cachées
- **Efficacité du cache** : Pourcentage d'utilisation
- **Nombre d'entrées** : Entrées actives dans le cache
- **Taux d'erreur** : Fréquence des erreurs de cache

## Conclusion

Le système de cache CMS améliore significativement les performances tout en maintenant la simplicité d'utilisation. Il est conçu pour être transparent pour les développeurs tout en offrant des outils de monitoring et de gestion avancés pour les administrateurs.
