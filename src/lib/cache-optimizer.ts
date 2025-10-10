/**
 * Système de cache optimisé pour améliorer les performances
 */

import React from 'react';

// Cache en mémoire pour les données fréquemment utilisées
const memoryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Configuration du cache
const CACHE_TTL = 15000; // 15 secondes
const MAX_CACHE_SIZE = 100; // Maximum 100 entrées en cache

/**
 * Interface pour les options de cache
 */
interface CacheOptions {
  ttl?: number; // Time to live en millisecondes
  key?: string; // Clé personnalisée pour le cache
  forceRefresh?: boolean; // Forcer le rafraîchissement
}

/**
 * Génère une clé de cache basée sur les paramètres
 */
function generateCacheKey(prefix: string, params: any = {}): string {
  const paramString = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('|');
  return `${prefix}:${paramString}`;
}

/**
 * Vérifie si une entrée de cache est valide
 */
function isCacheValid(entry: { data: any; timestamp: number; ttl: number }): boolean {
  return Date.now() - entry.timestamp < entry.ttl;
}

/**
 * Nettoie le cache en supprimant les entrées expirées
 */
function cleanExpiredCache(): void {
  const now = Date.now();
  for (const [key, entry] of memoryCache.entries()) {
    if (now - entry.timestamp >= entry.ttl) {
      memoryCache.delete(key);
    }
  }
}

/**
 * Gère la taille du cache en supprimant les entrées les plus anciennes
 */
function manageCacheSize(): void {
  if (memoryCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(memoryCache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Supprimer les 20% les plus anciens
    const toDelete = Math.floor(MAX_CACHE_SIZE * 0.2);
    for (let i = 0; i < toDelete; i++) {
      memoryCache.delete(entries[i][0]);
    }
  }
}

/**
 * Récupère des données depuis le cache ou exécute la fonction
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const cacheKey = options.key || key;
  const ttl = options.ttl || CACHE_TTL;
  
  // Nettoyer le cache si nécessaire
  cleanExpiredCache();
  manageCacheSize();
  
  // Vérifier le cache si pas de force refresh
  if (!options.forceRefresh) {
    const cached = memoryCache.get(cacheKey);
    if (cached && isCacheValid(cached)) {
      return cached.data;
    }
  }
  
  try {
    // Exécuter la fonction de récupération
    const data = await fetcher();
    
    // Mettre en cache
    memoryCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl
    });
    
    return data;
  } catch (error) {
    // En cas d'erreur, retourner les données en cache si disponibles
    const cached = memoryCache.get(cacheKey);
    if (cached) {
      console.warn(`Erreur lors de la récupération des données, utilisation du cache: ${error}`);
      return cached.data;
    }
    throw error;
  }
}

/**
 * Invalide le cache pour une clé spécifique
 */
export function invalidateCache(key: string): void {
  memoryCache.delete(key);
}

/**
 * Invalide tout le cache
 */
export function clearCache(): void {
  memoryCache.clear();
}

/**
 * Récupère les statistiques du cache
 */
export function getCacheStats(): {
  size: number;
  maxSize: number;
  hitRate: number;
  entries: Array<{ key: string; age: number; ttl: number }>;
} {
  const now = Date.now();
  const entries = Array.from(memoryCache.entries()).map(([key, entry]) => ({
    key,
    age: now - entry.timestamp,
    ttl: entry.ttl
  }));
  
  return {
    size: memoryCache.size,
    maxSize: MAX_CACHE_SIZE,
    hitRate: 0, // TODO: Implémenter le calcul du hit rate
    entries
  };
}

/**
 * Hook React pour utiliser le cache avec Convex
 */
export function useOptimizedQuery<T>(
  queryFn: () => T | undefined,
  cacheKey: string,
  options: CacheOptions = {}
): { data: T | undefined; isLoading: boolean; error: Error | null } {
  const [data, setData] = React.useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  
  React.useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await withCache(
          cacheKey,
          async () => {
            const result = queryFn();
            if (result === undefined) {
              throw new Error('Query returned undefined');
            }
            return result;
          },
          options
        );
        
        if (mounted) {
          setData(result);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => {
      mounted = false;
    };
  }, [cacheKey, options.forceRefresh]);
  
  return { data, isLoading, error };
}

// Nettoyage automatique du cache toutes les 30 secondes
setInterval(cleanExpiredCache, 30000);
