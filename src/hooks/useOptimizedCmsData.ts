/**
 * Hook personnalisé pour optimiser les performances des données CMS
 * Combine useMemo, useCallback et le système de cache
 */

import { useMemo, useCallback, useRef, useEffect } from 'react';
import { useCachedCmsData } from '../lib/cms-cache';
import { validateCmsData } from '../lib/cms-utils';

// Types pour les options d'optimisation
interface OptimizationOptions {
  ttl?: number;
  enabled?: boolean;
  refetchOnMount?: boolean;
  memoizeValidation?: boolean;
  debounceMs?: number;
}

// Hook pour les données CMS optimisées
export function useOptimizedCmsData<T>(
  queryKey: keyof typeof import('../lib/cms-cache').CMS_CACHE_KEYS,
  queryFn: () => T | undefined,
  validationFn: (data: T[]) => T[],
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
  const debounceRef = useRef<NodeJS.Timeout>();

  // Validation mémorisée des données
  const validatedData = useMemo(() => {
    if (!rawData || !Array.isArray(rawData)) {
      return null;
    }

    if (memoizeValidation) {
      return validateCmsData(rawData, validationFn, fallbackMessage);
    }

    return validationFn(rawData);
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

  // Statistiques de performance
  const performanceStats = useMemo(() => {
    const startTime = performance.now();
    const dataSize = rawData ? JSON.stringify(rawData).length : 0;
    const endTime = performance.now();
    
    return {
      processingTime: endTime - startTime,
      dataSize,
      isCached,
      validationApplied: memoizeValidation
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
    performanceStats
  };
}

// Hook spécialisé pour les statistiques optimisées
export function useOptimizedStatistics() {
  const { useCachedStatistics } = require('../lib/cms-cache');
  const { deduplicateStatistics } = require('../lib/cms-utils');
  
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
    const cacheEfficiency = totalSize > 0 ? (totalSize / 100) * 100 : 0; // Efficacité basée sur la taille
    
    return {
      totalEntries: totalSize,
      cacheEfficiency: Math.min(cacheEfficiency, 100),
      isRefreshing: state.isRefreshing,
      lastRefresh: state.lastRefresh,
      hasErrors: Object.keys(state.errors).length > 0,
      errorCount: Object.keys(state.errors).length
    };
  }, [state]);
}

export default useOptimizedCmsData;
