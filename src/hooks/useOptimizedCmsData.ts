/**
 * Hook personnalisé pour optimiser les performances des données CMS
 * Combine useMemo, useCallback et le système de cache
 */

import { useMemo, useCallback, useRef, useEffect } from 'react';
import { useCachedCmsData, useCachedStatistics, useCachedAdminArticles, useCachedAdminArticleStats, useCachedAdminProjects, useCachedAdminProjectsByStatus, useCachedAdminBookings, useCachedAdminBookingsByStatus, useCachedAdminBookingStats, useCachedAdminUsers, useCachedAdminUsersByRole, useCachedAdminUsersByStatus, useCachedAdminDashboardStats, DEFAULT_CONFIG } from '../lib/cms-cache';
import { validateCmsData, deduplicateStatistics } from '../lib/cms-utils';


// Types pour les options d'optimisation
interface OptimizationOptions {
  ttl?: number;
  enabled?: boolean;
  refetchOnMount?: boolean;
  memoizeValidation?: boolean;
  debounceMs?: number;
}

// Hook pour les données CMS optimisées (arrays)
export function useOptimizedCmsData<T extends unknown[]>(
  queryKey: keyof typeof import('../lib/cms-cache').CMS_CACHE_KEYS,
  queryFn: () => T | null | undefined,
  validationFn: (data: T) => T,
  fallbackMessage: string = "Aucune donnée disponible",
  options: OptimizationOptions = {}
) {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes par défaut
    enabled = true,
    refetchOnMount = false,
    memoizeValidation = true,
    debounceMs = 100
  } = options;

  const { data: rawData, isLoading, error, isCached, refresh, invalidate } = useCachedCmsData(
    queryKey,
    queryFn,
    { ttl, enabled, refetchOnMount }
  );

  // Référence pour le debounce
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Validation mémorisée des données
  const validatedData = useMemo(() => {
    if (!rawData || !Array.isArray(rawData)) {
      return null;
    }

    if (memoizeValidation) {
      // Ensure the second param is a function accepting (items: unknown[]) => T
      return validateCmsData(rawData, (items: unknown[]) => validationFn(items as T) as unknown[], fallbackMessage) as T;
    }

    return validationFn(rawData as T);
  }, [rawData, validationFn, fallbackMessage, memoizeValidation]);
  // Fonction de refresh optimisée avec debounce
  const debouncedRefresh = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      refresh();
    }, debounceMs);
  }, [refresh, debounceMs]);

  // Fonction d'invalidation optimisée
  const debouncedInvalidate = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      invalidate();
    }, debounceMs);
  }, [invalidate, debounceMs]);

  // Nettoyage du debounce
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Statistiques de performance légères (sans JSON.stringify coûteux)
  const performanceStats = useMemo(() => {
    // Utilisation d'approximations légères au lieu de JSON.stringify
    const itemCount = Array.isArray(rawData) ? rawData.length : 0;
    const estimatedComplexity = Array.isArray(rawData) 
      ? rawData.length * 100 // Heuristique de complexité basée sur le nombre d'éléments
      : rawData ? Object.keys(rawData).length * 50 : 0; // Heuristique de complexité basée sur les clés d'objet
    
    return {
      itemCount,
      estimatedComplexity, // Score de complexité approximatif, pas une taille en bytes
      isCached,
      validationApplied: memoizeValidation,
      // Fonction pour calculer la taille réelle seulement quand nécessaire
      getDetailedStats: () => ({
        itemCount,
        actualSize: rawData ? JSON.stringify(rawData).length : 0,
        isCached,
        validationApplied: memoizeValidation,
        processingTime: null // Pas de timing dans le hot path
      })
    };
  }, [rawData, isCached, memoizeValidation]);

  // Fonction de profilage dédiée (hors du hot path)
  const profilePerformance = useCallback(() => {
    const startTime = performance.now();
    const actualSize = rawData ? JSON.stringify(rawData).length : 0;
    const endTime = performance.now();
    
    return {
      itemCount: Array.isArray(rawData) ? rawData.length : 0,
      actualSize,
      processingTime: endTime - startTime,
      isCached,
      validationApplied: memoizeValidation,
      timestamp: Date.now()
    };
  }, [rawData, isCached, memoizeValidation]);

  return {
    data: validatedData,
    rawData,
    isLoading,
    error,
    isCached,
    refresh: debouncedRefresh,
    invalidate: debouncedInvalidate,
    performanceStats,
    profilePerformance
  };
}

// Hook pour les données CMS optimisées (objects)
export function useOptimizedCmsObject<T>(
  queryKey: keyof typeof import('../lib/cms-cache').CMS_CACHE_KEYS,
  queryFn: () => T | undefined,
  validationFn: (data: T) => T,
  _fallbackMessage: string = "Aucune donnée disponible",
  options: OptimizationOptions = {}
) {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes par défaut
    enabled = true,
    refetchOnMount = false,
    memoizeValidation = true,
    debounceMs = 100
  } = options;

  const { data: rawData, isLoading, error, isCached, refresh, invalidate } = useCachedCmsData(
    queryKey,
    queryFn,
    { ttl, enabled, refetchOnMount }
  );

  // Référence pour le debounce
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Validation mémorisée des données
  const validatedData = useMemo(() => {
    if (!rawData) {
      return null;
    }

    return validationFn(rawData);
  }, [rawData, validationFn]);

  // Fonction de refresh optimisée avec debounce
  const debouncedRefresh = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      refresh();
    }, debounceMs);
  }, [refresh, debounceMs]);

  // Fonction d'invalidation optimisée
  const debouncedInvalidate = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      invalidate();
    }, debounceMs);
  }, [invalidate, debounceMs]);

  // Nettoyage du debounce
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Statistiques de performance légères
  const performanceStats = useMemo(() => {
    const itemCount = rawData ? 1 : 0;
    const estimatedComplexity = rawData ? Object.keys(rawData).length * 50 : 0;
    
    return {
      itemCount,
      estimatedComplexity,
      isCached,
      validationApplied: memoizeValidation,
      getDetailedStats: () => ({
        itemCount,
        actualSize: rawData ? JSON.stringify(rawData).length : 0,
        isCached,
        validationApplied: memoizeValidation,
        processingTime: null
      })
    };
  }, [rawData, isCached, memoizeValidation]);

  // Fonction de profilage dédiée
  const profilePerformance = useCallback(() => {
    const startTime = performance.now();
    const actualSize = rawData ? JSON.stringify(rawData).length : 0;
    const endTime = performance.now();
    
    return {
      itemCount: rawData ? 1 : 0,
      actualSize,
      processingTime: endTime - startTime,
      isCached,
      validationApplied: memoizeValidation,
      timestamp: Date.now()
    };
  }, [rawData, isCached, memoizeValidation]);

  return {
    data: validatedData,
    rawData,
    isLoading,
    error,
    isCached,
    refresh: debouncedRefresh,
    invalidate: debouncedInvalidate,
    performanceStats,
    profilePerformance
  };
}

// Hook spécialisé pour les statistiques optimisées
export function useOptimizedStatistics() {
  const { data: rawStatistics } = useCachedStatistics();
  
  return useOptimizedCmsData(
    'STATISTICS',
    () => rawStatistics,
    deduplicateStatistics,
    "Aucune statistique disponible",
    {
      ttl: 10 * 60 * 1000, // 10 minutes pour les statistiques
      memoizeValidation: true,
      debounceMs: 50
    }
  );
}

// Hook spécialisé pour les services optimisés
export function useOptimizedServices() {
  const { useCachedServices } = require('../lib/cms-cache');
  const { deduplicateServices } = require('../lib/cms-utils');
  
  const { data: rawServices } = useCachedServices();
  
  return useOptimizedCmsData(
    'SERVICES',
    () => rawServices,
    deduplicateServices,
    "Aucun service disponible",
    {
      ttl: 5 * 60 * 1000, // 5 minutes pour les services
      memoizeValidation: true,
      debounceMs: 100
    }
  );
}

// Hook spécialisé pour les zones optimisées
export function useOptimizedZones() {
  const { useCachedZones } = require('../lib/cms-cache');
  const { deduplicateZones } = require('../lib/cms-utils');
  
  const { data: rawZones } = useCachedZones();
  
  return useOptimizedCmsData(
    'ZONES',
    () => rawZones,
    deduplicateZones,
    "Aucune zone disponible",
    {
      ttl: 15 * 60 * 1000, // 15 minutes pour les zones (changent rarement)
      memoizeValidation: true,
      debounceMs: 50
    }
  );
}

// Hook spécialisé pour les raisons optimisées
export function useOptimizedReasons() {
  const { useCachedReasons } = require('../lib/cms-cache');
  const { deduplicateReasons } = require('../lib/cms-utils');
  
  const { data: rawReasons } = useCachedReasons();
  
  return useOptimizedCmsData(
    'REASONS',
    () => rawReasons,
    deduplicateReasons,
    "Aucune raison disponible",
    {
      ttl: 10 * 60 * 1000, // 10 minutes pour les raisons
      memoizeValidation: true,
      debounceMs: 50
    }
  );
}

// Hook spécialisé pour les témoignages optimisés
export function useOptimizedTestimonials() {
  const { useCachedTestimonials } = require('../lib/cms-cache');
  const { deduplicateTestimonials } = require('../lib/cms-utils');
  
  const { data: rawTestimonials } = useCachedTestimonials();
  
  return useOptimizedCmsData(
    'TESTIMONIALS',
    () => rawTestimonials,
    deduplicateTestimonials,
    "Aucun témoignage disponible",
    {
      ttl: 5 * 60 * 1000, // 5 minutes pour les témoignages
      memoizeValidation: true,
      debounceMs: 100
    }
  );
}

// Hook spécialisé pour les projets de portfolio optimisés
export function useOptimizedPortfolioProjects() {
  const { useCachedPortfolioProjects } = require('../lib/cms-cache');
  
  const { data: rawProjects } = useCachedPortfolioProjects();
  
  return useOptimizedCmsData(
    'PORTFOLIO_PROJECTS',
    () => rawProjects,
    (data) => data, // Pas de déduplication spéciale pour les projets
    "Aucun projet disponible",
    {
      ttl: 3 * 60 * 1000, // 3 minutes pour les projets (changent plus souvent)
      memoizeValidation: true,
      debounceMs: 150
    }
  );
}

// Hook pour les projets par catégorie optimisés
export function useOptimizedPortfolioProjectsByCategory(category: string) {
  const { useCachedPortfolioProjectsByCategory } = require('../lib/cms-cache');
  
  const { data: rawProjects } = useCachedPortfolioProjectsByCategory(category);
  
  return useOptimizedCmsData(
    'PORTFOLIO_PROJECTS',
    () => rawProjects,
    (data) => data,
    "Aucun projet disponible",
    {
      ttl: 2 * 60 * 1000, // 2 minutes pour les filtres
      memoizeValidation: true,
      debounceMs: 200
    }
  );
}

// Hook pour les performances globales du cache
export function useCachePerformance() {
  const { useCmsCache } = require('../contexts/CmsCacheContext');
  const { state } = useCmsCache();
  
  return useMemo(() => {
    const totalSize = state.cacheStats.size;
    const maxCacheSize = DEFAULT_CONFIG.maxSize;
    
    // Calcul correct de l'efficacité en pourcentage avec clamping
    const cacheEfficiency = maxCacheSize > 0 
      ? Math.max(0, Math.min(100, (totalSize / maxCacheSize) * 100))
      : 0;
    
    return {
      totalEntries: totalSize,
      cacheEfficiency,
      maxCacheSize,
      isRefreshing: state.isRefreshing,
      lastRefresh: state.lastRefresh,
      hasErrors: Object.keys(state.errors).length > 0,
      errorCount: Object.keys(state.errors).length
    };
  }, [state, DEFAULT_CONFIG.maxSize]);
}

// Hooks spécialisés pour les données admin optimisées
export function useOptimizedAdminArticles() {
  const { data: rawArticles } = useCachedAdminArticles();
  
  return useOptimizedCmsData(
    'ADMIN_ARTICLES',
    () => rawArticles,
    (data) => data, // Pas de déduplication spéciale pour les articles
    "Aucun article disponible",
    {
      ttl: 2 * 60 * 1000, // 2 minutes pour les articles admin
      memoizeValidation: true,
      debounceMs: 100
    }
  );
}

export function useOptimizedAdminArticleStats() {
  const { data: rawStats } = useCachedAdminArticleStats();
  
  return useOptimizedCmsObject(
    'ADMIN_ARTICLE_STATS',
    () => rawStats || { total: 0, published: 0, draft: 0, featured: 0, totalViews: 0, categories: 0 },
    (data) => {
      // Si c'est un tableau, le transformer en objet
      if (Array.isArray(data)) {
        return {
          total: data.length,
          published: data.filter((item: unknown) => (item as { status?: string }).status === 'published').length,
          draft: data.filter((item: unknown) => (item as { status?: string }).status === 'draft').length,
          featured: data.filter((item: unknown) => (item as { is_featured?: boolean }).is_featured === true).length,
          totalViews: data.reduce((sum: number, item: unknown) => sum + ((item as { view_count?: number }).view_count || 0), 0),
          categories: new Set(data.map((item: unknown) => (item as { category?: string }).category).filter(Boolean)).size
        };
      }
      return data;
    },
    "Aucune statistique d'articles disponible",
    {
      ttl: 5 * 60 * 1000, // 5 minutes pour les statistiques
      memoizeValidation: true,
      debounceMs: 50
    }
  );
}

export function useOptimizedAdminProjects() {
  const { data: rawProjects } = useCachedAdminProjects();
  
  return useOptimizedCmsData(
    'ADMIN_PROJECTS',
    () => rawProjects,
    (data) => data,
    "Aucun projet disponible",
    {
      ttl: 3 * 60 * 1000, // 3 minutes pour les projets
      memoizeValidation: true,
      debounceMs: 150
    }
  );
}

export function useOptimizedAdminProjectsByStatus(status: string) {
  const { data: rawProjects } = useCachedAdminProjectsByStatus(status);
  
  return useOptimizedCmsData(
    'ADMIN_PROJECTS_BY_STATUS',
    () => rawProjects,
    (data) => data,
    "Aucun projet disponible",
    {
      ttl: 2 * 60 * 1000, // 2 minutes pour les projets filtrés
      memoizeValidation: true,
      debounceMs: 200
    }
  );
}

export function useOptimizedAdminBookings() {
  const { data: rawBookings } = useCachedAdminBookings();
  
  return useOptimizedCmsData(
    'ADMIN_BOOKINGS',
    () => rawBookings,
    (data) => data,
    "Aucune réservation disponible",
    {
      ttl: 2 * 60 * 1000, // 2 minutes pour les réservations
      memoizeValidation: true,
      debounceMs: 100
    }
  );
}

export function useOptimizedAdminBookingsByStatus(status: string) {
  const { data: rawBookings } = useCachedAdminBookingsByStatus(status);
  
  return useOptimizedCmsData(
    'ADMIN_BOOKINGS_BY_STATUS',
    () => rawBookings,
    (data) => data,
    "Aucune réservation disponible",
    {
      ttl: 1 * 60 * 1000, // 1 minute pour les réservations filtrées
      memoizeValidation: true,
      debounceMs: 150
    }
  );
}

export function useOptimizedAdminBookingStats() {
  const { data: rawStats } = useCachedAdminBookingStats();
  
  return useOptimizedCmsObject(
    'ADMIN_BOOKING_STATS',
    () => rawStats || { total: 0, pending: 0, confirmed: 0, cancelled: 0, completed: 0 },
    (data) => data,
    "Aucune statistique de réservation disponible",
    {
      ttl: 5 * 60 * 1000, // 5 minutes pour les statistiques
      memoizeValidation: true,
      debounceMs: 50
    }
  );
}

export function useOptimizedAdminUsers() {
  const { data: rawUsers } = useCachedAdminUsers();
  
  return useOptimizedCmsData(
    'ADMIN_USERS',
    () => rawUsers,
    (data) => data,
    "Aucun utilisateur disponible",
    {
      ttl: 10 * 60 * 1000, // 10 minutes pour les utilisateurs
      memoizeValidation: true,
      debounceMs: 100
    }
  );
}

export function useOptimizedAdminUsersByRole(role: string) {
  const { data: rawUsers } = useCachedAdminUsersByRole(role);
  
  return useOptimizedCmsData(
    'ADMIN_USERS_BY_ROLE',
    () => rawUsers,
    (data) => data,
    "Aucun utilisateur disponible",
    {
      ttl: 5 * 60 * 1000, // 5 minutes pour les utilisateurs filtrés
      memoizeValidation: true,
      debounceMs: 150
    }
  );
}

export function useOptimizedAdminUsersByStatus(status: string) {
  const { data: rawUsers } = useCachedAdminUsersByStatus(status);
  
  return useOptimizedCmsData(
    'ADMIN_USERS_BY_STATUS',
    () => rawUsers,
    (data) => data,
    "Aucun utilisateur disponible",
    {
      ttl: 5 * 60 * 1000, // 5 minutes pour les utilisateurs filtrés
      memoizeValidation: true,
      debounceMs: 150
    }
  );
}

export function useOptimizedAdminDashboardStats() {
  const { data: rawStats } = useCachedAdminDashboardStats();
  
  return useOptimizedCmsObject(
    'ADMIN_DASHBOARD_STATS',
    () => rawStats || { bookings: { total: 0, pending: 0, confirmed: 0, cancelled: 0, completed: 0 }, articles: { total: 0, published: 0, draft: 0, featured: 0, totalViews: 0, categories: 0 }, timestamp: Date.now() },
    (data) => data,
    "Aucune statistique de dashboard disponible",
    {
      ttl: 3 * 60 * 1000, // 3 minutes pour les statistiques du dashboard
      memoizeValidation: true,
      debounceMs: 100
    }
  );
}

export default useOptimizedCmsData;
