/**
 * Système de cache pour les données CMS Convex
 * Combine localStorage, useMemo et invalidation intelligente
 */

import { useMemo, useCallback, useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

// Types pour le cache
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  version: string;
  ttl: number; // Time to live en millisecondes
}

export interface CacheConfig {
  ttl: number; // Durée de vie par défaut (5 minutes)
  maxSize: number; // Taille maximale du cache (100 entrées)
  version: string; // Version du cache pour invalidation
}

// Configuration par défaut optimisée pour zones à faible couverture
const DEFAULT_CONFIG: CacheConfig = {
  ttl: 30 * 60 * 1000, // 30 minutes (augmenté pour zones à faible couverture)
  maxSize: 200, // Augmenté pour stocker plus de données
  version: '1.0.0'
};

// Configuration spéciale pour zones à faible couverture
const LOW_CONNECTIVITY_CONFIG: CacheConfig = {
  ttl: 2 * 60 * 60 * 1000, // 2 heures pour zones à faible couverture
  maxSize: 300,
  version: '1.0.0'
};

// Clés de cache pour chaque type de données CMS
export const CMS_CACHE_KEYS = {
  STATISTICS: 'cms_statistics',
  SERVICES: 'cms_services',
  ZONES: 'cms_zones',
  REASONS: 'cms_reasons',
  TESTIMONIALS: 'cms_testimonials',
  COMPANY_HISTORY: 'cms_company_history',
  VALUES: 'cms_values',
  TEAM_MEMBERS: 'cms_team_members',
  CERTIFICATIONS: 'cms_certifications',
  PROCESS_STEPS: 'cms_process_steps',
  PROJECT_FILTERS: 'cms_project_filters',
  PORTFOLIO_PROJECTS: 'cms_portfolio_projects'
} as const;

// Gestionnaire de cache localStorage
class LocalStorageCache {
  private config: CacheConfig;

  constructor(config: CacheConfig = DEFAULT_CONFIG) {
    this.config = config;
    this.detectLowConnectivity();
  }

  // Détecter si l'utilisateur est dans une zone à faible couverture
  private detectLowConnectivity() {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      const isSlowConnection = connection.effectiveType === 'slow-2g' || 
                              connection.effectiveType === '2g' ||
                              connection.downlink < 0.5;
      
      if (isSlowConnection) {
        this.config = { ...LOW_CONNECTIVITY_CONFIG };
        console.log('Mode faible couverture détecté - TTL étendu à 2h');
      }
    }
  }

  // Obtenir une entrée du cache
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const cacheEntry: CacheEntry<T> = JSON.parse(item);
      
      // Vérifier si l'entrée est expirée
      if (this.isExpired(cacheEntry)) {
        this.remove(key);
        return null;
      }

      // Vérifier la version
      if (cacheEntry.version !== this.config.version) {
        this.remove(key);
        return null;
      }

      return cacheEntry.data;
    } catch (error) {
      console.warn(`Erreur lors de la lecture du cache pour ${key}:`, error);
      this.remove(key);
      return null;
    }
  }

  // Sauvegarder une entrée dans le cache
  set<T>(key: string, data: T, ttl?: number): void {
    try {
      const cacheEntry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        version: this.config.version,
        ttl: ttl || this.config.ttl
      };

      // Vérifier la taille du cache
      this.cleanupIfNeeded();

      localStorage.setItem(key, JSON.stringify(cacheEntry));
    } catch (error) {
      console.warn(`Erreur lors de la sauvegarde du cache pour ${key}:`, error);
    }
  }

  // Supprimer une entrée du cache
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Erreur lors de la suppression du cache pour ${key}:`, error);
    }
  }

  // Vérifier si une entrée est expirée
  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  // Nettoyer le cache si nécessaire
  private cleanupIfNeeded(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('cms_'));
    
    if (keys.length >= this.config.maxSize) {
      // Supprimer les entrées les plus anciennes
      const entries = keys.map(key => {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const entry = JSON.parse(item);
            return { key, timestamp: entry.timestamp };
          }
        } catch (error) {
          // Supprimer les entrées corrompues
          localStorage.removeItem(key);
        }
        return null;
      }).filter(Boolean).sort((a, b) => a!.timestamp - b!.timestamp);

      // Supprimer les 20% les plus anciens
      const toRemove = Math.floor(entries.length * 0.2);
      for (let i = 0; i < toRemove; i++) {
        localStorage.removeItem(entries[i]!.key);
      }
    }
  }

  // Vider tout le cache CMS
  clear(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('cms_'));
    keys.forEach(key => localStorage.removeItem(key));
  }

  // Obtenir les statistiques du cache
  getStats(): { size: number; keys: string[] } {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('cms_'));
    return { size: keys.length, keys };
  }
}

// Instance globale du cache
const cache = new LocalStorageCache();

// Hook personnalisé pour les données CMS avec cache
export function useCachedCmsData<T>(
  queryKey: keyof typeof CMS_CACHE_KEYS,
  queryFn: () => T | undefined,
  options: {
    ttl?: number;
    enabled?: boolean;
    refetchOnMount?: boolean;
  } = {}
) {
  const {
    ttl = DEFAULT_CONFIG.ttl,
    enabled = true,
    refetchOnMount = false
  } = options;

  const cacheKey = CMS_CACHE_KEYS[queryKey];
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Récupérer les données depuis Convex
  const convexData = queryFn();

  // Mémoriser les données avec cache - CACHE EN PRIORITÉ ABSOLUE
  const cachedData = useMemo(() => {
    if (!enabled) return convexData;

    // PRIORITÉ 1: Cache d'abord - NE JAMAIS ATTENDRE CONVEX
    const cached = cache.get<T>(cacheKey);
    if (cached) {
      // Mise à jour en arrière-plan SANS BLOQUER l'affichage
      if (convexData && !refetchOnMount) {
        // Utiliser requestIdleCallback pour ne pas bloquer l'UI
        if (window.requestIdleCallback) {
          window.requestIdleCallback(() => {
            cache.set(cacheKey, convexData, ttl);
          });
        } else {
          setTimeout(() => {
            cache.set(cacheKey, convexData, ttl);
          }, 0);
        }
      }
      return cached; // RETOURNER IMMÉDIATEMENT
    }

    // PRIORITÉ 2: Si pas de cache, utiliser Convex et sauvegarder
    if (convexData) {
      cache.set(cacheKey, convexData, ttl);
      return convexData;
    }

    // PRIORITÉ 3: Refetch forcé
    if (refetchOnMount && convexData) {
      cache.set(cacheKey, convexData, ttl);
      return convexData;
    }

    return null;
  }, [convexData, cacheKey, ttl, enabled, refetchOnMount]);

  // Fonction pour forcer le refresh
  const refresh = useCallback(() => {
    setIsLoading(true);
    setError(null);
    
    // Supprimer du cache et laisser Convex refetch
    cache.remove(cacheKey);
    
    // Simuler un délai pour l'UX
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, [cacheKey]);

  // Fonction pour invalider le cache
  const invalidate = useCallback(() => {
    cache.remove(cacheKey);
  }, [cacheKey]);

  return {
    data: cachedData,
    isLoading: cachedData === null && convexData === undefined, // Ne pas attendre Convex si on a du cache
    error,
    refresh,
    invalidate,
    isCached: cache.get(cacheKey) !== null
  };
}

// Hooks spécialisés pour chaque type de données CMS avec TTL optimisé
export function useCachedStatistics() {
  const convexData = useQuery(api.cms.getStatistics);
  return useCachedCmsData('STATISTICS', () => convexData, {
    ttl: 60 * 60 * 1000 // 1 heure pour les statistiques (changent rarement)
  });
}

export function useCachedServices() {
  const convexData = useQuery(api.cms.getServices);
  return useCachedCmsData('SERVICES', () => convexData, {
    ttl: 45 * 60 * 1000 // 45 minutes pour les services
  });
}

export function useCachedZones() {
  const convexData = useQuery(api.cms.getZones);
  return useCachedCmsData('ZONES', () => convexData, {
    ttl: 2 * 60 * 60 * 1000 // 2 heures pour les zones (changent très rarement)
  });
}

export function useCachedReasons() {
  const convexData = useQuery(api.cms.getReasons);
  return useCachedCmsData('REASONS', () => convexData, {
    ttl: 60 * 60 * 1000 // 1 heure pour les raisons
  });
}

export function useCachedTestimonials() {
  const convexData = useQuery(api.cms.getTestimonials);
  return useCachedCmsData('TESTIMONIALS', () => convexData, {
    ttl: 30 * 60 * 1000 // 30 minutes pour les témoignages
  });
}

export function useCachedCompanyHistory() {
  const convexData = useQuery(api.cms.getCompanyHistory);
  return useCachedCmsData('COMPANY_HISTORY', () => convexData, {
    ttl: 2 * 60 * 60 * 1000 // 2 heures pour l'historique (changent très rarement)
  });
}

export function useCachedValues() {
  const convexData = useQuery(api.cms.getValues);
  return useCachedCmsData('VALUES', () => convexData, {
    ttl: 2 * 60 * 60 * 1000 // 2 heures pour les valeurs (changent très rarement)
  });
}

export function useCachedTeamMembers() {
  const convexData = useQuery(api.cms.getTeamMembers);
  return useCachedCmsData('TEAM_MEMBERS', () => convexData, {
    ttl: 60 * 60 * 1000 // 1 heure pour l'équipe
  });
}

export function useCachedCertifications() {
  const convexData = useQuery(api.cms.getCertifications);
  return useCachedCmsData('CERTIFICATIONS', () => convexData, {
    ttl: 2 * 60 * 60 * 1000 // 2 heures pour les certifications (changent très rarement)
  });
}

export function useCachedProcessSteps() {
  const convexData = useQuery(api.cms.getProcessSteps);
  return useCachedCmsData('PROCESS_STEPS', () => convexData, {
    ttl: 60 * 60 * 1000 // 1 heure pour les étapes de processus
  });
}

export function useCachedProjectFilters() {
  const convexData = useQuery(api.cms.getProjectFilters);
  return useCachedCmsData('PROJECT_FILTERS', () => convexData, {
    ttl: 30 * 60 * 1000 // 30 minutes pour les filtres
  });
}

export function useCachedPortfolioProjects() {
  const convexData = useQuery(api.cms.getPortfolioProjects);
  return useCachedCmsData('PORTFOLIO_PROJECTS', () => convexData, {
    ttl: 20 * 60 * 1000 // 20 minutes pour les projets (changent plus souvent)
  });
}

// Hook pour les projets par catégorie avec cache
export function useCachedPortfolioProjectsByCategory(category: string) {
  const convexData = useQuery(api.cms.getPortfolioProjectsByCategory, { category });
  return useCachedCmsData('PORTFOLIO_PROJECTS', () => convexData, {
    ttl: 15 * 60 * 1000 // 15 minutes pour les filtres (plus court car plus dynamique)
  });
}

// Fonctions utilitaires pour la gestion du cache
export const cacheUtils = {
  // Vider tout le cache CMS
  clearAll: () => cache.clear(),
  
  // Obtenir les statistiques du cache
  getStats: () => cache.getStats(),
  
  // Invalider un type de données spécifique
  invalidate: (queryKey: keyof typeof CMS_CACHE_KEYS) => {
    cache.remove(CMS_CACHE_KEYS[queryKey]);
  },
  
  // Invalider plusieurs types de données
  invalidateMultiple: (queryKeys: (keyof typeof CMS_CACHE_KEYS)[]) => {
    queryKeys.forEach(key => cache.remove(CMS_CACHE_KEYS[key]));
  },
  
  // Forcer le refresh de toutes les données
  refreshAll: () => {
    cache.clear();
    // Déclencher un re-render des composants
    window.dispatchEvent(new CustomEvent('cms-cache-refresh'));
  }
};

// Hook pour écouter les événements de refresh global
export function useCacheRefreshListener() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const handleRefresh = () => {
      setRefreshTrigger(prev => prev + 1);
    };

    window.addEventListener('cms-cache-refresh', handleRefresh);
    return () => window.removeEventListener('cms-cache-refresh', handleRefresh);
  }, []);

  return refreshTrigger;
}

export default cache;
