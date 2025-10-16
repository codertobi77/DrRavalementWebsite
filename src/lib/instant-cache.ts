/**
 * Système de cache instantané pour chargement immédiat
 * Élimine tous les délais et goulots d'étranglement
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

// Types pour le cache instantané
export interface InstantCacheEntry<T> {
  data: T;
  timestamp: number;
  version: string;
  ttl: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface InstantCacheConfig {
  enablePreload: boolean;
  enableBackgroundSync: boolean;
  maxCacheSize: number;
  criticalTTL: number;
  highTTL: number;
  mediumTTL: number;
  lowTTL: number;
}

// Configuration optimisée pour chargement instantané
const INSTANT_CONFIG: InstantCacheConfig = {
  enablePreload: true,
  enableBackgroundSync: true,
  maxCacheSize: 1000,
  criticalTTL: 24 * 60 * 60 * 1000, // 24h pour les données critiques
  highTTL: 12 * 60 * 60 * 1000,     // 12h pour les données importantes
  mediumTTL: 6 * 60 * 60 * 1000,    // 6h pour les données moyennes
  lowTTL: 2 * 60 * 60 * 1000        // 2h pour les données optionnelles
};

// Clés de cache avec priorités
export const INSTANT_CACHE_KEYS = {
  STATISTICS: { key: 'instant_stats', priority: 'critical' as const },
  SERVICES: { key: 'instant_services', priority: 'critical' as const },
  ZONES: { key: 'instant_zones', priority: 'high' as const },
  REASONS: { key: 'instant_reasons', priority: 'high' as const },
  TESTIMONIALS: { key: 'instant_testimonials', priority: 'medium' as const },
  PORTFOLIO_PROJECTS: { key: 'instant_projects', priority: 'medium' as const },
  TEAM_MEMBERS: { key: 'instant_team', priority: 'low' as const },
  CERTIFICATIONS: { key: 'instant_certifications', priority: 'low' as const }
} as const;

// Gestionnaire de cache instantané
class InstantCacheManager {
  private cache = new Map<string, InstantCacheEntry<any>>();
  private preloadPromises = new Map<string, Promise<any>>();
  private config: InstantCacheConfig;

  constructor(config: InstantCacheConfig = INSTANT_CONFIG) {
    this.config = config;
    this.initializeCache();
  }

  private initializeCache() {
    // Charger le cache depuis localStorage au démarrage
    try {
      const stored = localStorage.getItem('instant_cache');
      if (stored) {
        const data = JSON.parse(stored);
        Object.entries(data).forEach(([key, entry]: [string, any]) => {
          if (this.isValidEntry(entry)) {
            this.cache.set(key, entry);
          }
        });
      }
    } catch (error) {
      console.warn('Erreur lors du chargement du cache instantané:', error);
    }
  }

  private isValidEntry(entry: any): boolean {
    if (!entry || !entry.data || !entry.timestamp || !entry.ttl) return false;
    return Date.now() - entry.timestamp < entry.ttl;
  }

  private getTTL(priority: string): number {
    switch (priority) {
      case 'critical': return this.config.criticalTTL;
      case 'high': return this.config.highTTL;
      case 'medium': return this.config.mediumTTL;
      case 'low': return this.config.lowTTL;
      default: return this.config.mediumTTL;
    }
  }

  // Obtenir des données instantanément
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry || !this.isValidEntry(entry)) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  // Sauvegarder des données instantanément
  set<T>(key: string, data: T, priority: string = 'medium'): void {
    const entry: InstantCacheEntry<T> = {
      data,
      timestamp: Date.now(),
      version: '1.0.0',
      ttl: this.getTTL(priority),
      priority: priority as any
    };

    this.cache.set(key, entry);
    this.persistCache();
  }

  // Précharger des données en arrière-plan
  async preload<T>(key: string, queryFn: () => Promise<T>, priority: string = 'medium'): Promise<T | null> {
    // Si déjà en cache et valide, retourner immédiatement
    const cached = this.get<T>(key);
    if (cached) return cached;

    // Si déjà en cours de chargement, attendre
    if (this.preloadPromises.has(key)) {
      return await this.preloadPromises.get(key);
    }

    // Lancer le chargement en arrière-plan
    const promise = queryFn().then(data => {
      this.set(key, data, priority);
      this.preloadPromises.delete(key);
      return data;
    }).catch(error => {
      console.warn(`Erreur préchargement ${key}:`, error);
      this.preloadPromises.delete(key);
      return null;
    });

    this.preloadPromises.set(key, promise);
    return await promise;
  }

  // Synchroniser avec localStorage
  private persistCache() {
    try {
      const data = Object.fromEntries(this.cache);
      localStorage.setItem('instant_cache', JSON.stringify(data));
    } catch (error) {
      console.warn('Erreur sauvegarde cache instantané:', error);
    }
  }

  // Nettoyer le cache
  clear(): void {
    this.cache.clear();
    this.preloadPromises.clear();
    localStorage.removeItem('instant_cache');
  }

  // Obtenir les statistiques
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      preloading: this.preloadPromises.size
    };
  }
}

// Instance globale
const instantCache = new InstantCacheManager();

// Hook pour le cache instantané
export function useInstantCache() {
  const [stats, setStats] = useState(instantCache.getStats());

  const get = useCallback(<T>(key: string): T | null => {
    return instantCache.get<T>(key);
  }, []);

  const set = useCallback(<T>(key: string, data: T, priority: string = 'medium'): void => {
    instantCache.set(key, data, priority);
    setStats(instantCache.getStats());
  }, []);

  const preload = useCallback(<T>(key: string, queryFn: () => Promise<T>, priority: string = 'medium'): Promise<T | null> => {
    return instantCache.preload(key, queryFn, priority);
  }, []);

  const clear = useCallback(() => {
    instantCache.clear();
    setStats(instantCache.getStats());
  }, []);

  return { get, set, preload, clear, stats };
}

// Hook pour les données CMS instantanées
export function useInstantCmsData<T>(
  cacheKey: keyof typeof INSTANT_CACHE_KEYS,
  queryFn: () => T | undefined,
  options: {
    fallbackData?: T;
    enablePreload?: boolean;
  } = {}
) {
  const { fallbackData, enablePreload = true } = options;
  const { get, set, preload } = useInstantCache();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const key = INSTANT_CACHE_KEYS[cacheKey].key;
  const priority = INSTANT_CACHE_KEYS[cacheKey].priority;

  // Charger les données instantanément - CACHE EN PRIORITÉ ABSOLUE
  useEffect(() => {
    const loadData = () => {
      // 1. PRIORITÉ ABSOLUE: Cache instantané - AFFICHER IMMÉDIATEMENT
      const cached = get<T>(key);
      if (cached) {
        setData(cached);
        setIsLoading(false); // ARRÊTER LE CHARGEMENT IMMÉDIATEMENT
        return;
      }

      // 2. Essayer les données Convex synchrones
      const convexData = queryFn();
      if (convexData) {
        setData(convexData);
        set(key, convexData, priority);
        setIsLoading(false);
        return;
      }

      // 3. Utiliser les données de fallback IMMÉDIATEMENT
      if (fallbackData) {
        setData(fallbackData);
        set(key, fallbackData, priority);
        setIsLoading(false);
        return;
      }

      // 4. Seulement si rien n'est disponible, marquer comme en cours de chargement
      setIsLoading(true);
    };

    loadData();
  }, [key, priority, get, set, queryFn, fallbackData]);

  // Précharger en arrière-plan si activé
  useEffect(() => {
    if (!enablePreload || data) return;

    const preloadData = async () => {
      try {
        const preloadedData = await preload(
          key,
          async () => {
            // Simuler une requête asynchrone
            return new Promise<T>((resolve) => {
              const convexData = queryFn();
              if (convexData) {
                resolve(convexData);
              } else {
                // Attendre un peu et réessayer
                setTimeout(() => {
                  const retryData = queryFn();
                  resolve(retryData || fallbackData as T);
                }, 100);
              }
            });
          },
          priority
        );

        if (preloadedData && !data) {
          setData(preloadedData);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erreur de préchargement'));
      } finally {
        setIsLoading(false);
      }
    };

    preloadData();
  }, [key, priority, enablePreload, data, preload, queryFn, fallbackData]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const freshData = queryFn();
      if (freshData) {
        setData(freshData);
        set(key, freshData, priority);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur de refresh'));
    } finally {
      setIsLoading(false);
    }
  }, [key, priority, queryFn, set]);

  return {
    data: data || fallbackData,
    isLoading,
    error,
    refresh,
    isCached: !!get(key)
  };
}

// Hooks spécialisés pour chaque type de données
export function useInstantStatistics() {
  const convexData = useQuery(api.cms.getStatistics);
  return useInstantCmsData('STATISTICS', () => convexData, {
    fallbackData: [
      { _id: '1', key: 'projects', value: '0', label: 'Projets réalisés' },
      { _id: '2', key: 'clients', value: '0', label: 'Clients satisfaits' },
      { _id: '3', key: 'experience', value: '0', label: 'Années d\'expérience' },
      { _id: '4', key: 'zones', value: '0', label: 'Zones couvertes' }
    ]
  });
}

export function useInstantServices() {
  const convexData = useQuery(api.cms.getServices);
  return useInstantCmsData('SERVICES', () => convexData, {
    fallbackData: [
      {
        _id: '1',
        title: 'Ravalement de façade',
        description: 'Rénovation complète de votre façade',
        image: '/images/services/ravalement.jpg',
        features: ['Nettoyage', 'Réparation', 'Peinture'],
        is_active: true,
        order_index: 1
      }
    ]
  });
}

export function useInstantZones() {
  const convexData = useQuery(api.cms.getZones);
  return useInstantCmsData('ZONES', () => convexData, {
    fallbackData: [
      { _id: '1', name: 'Paris', is_active: true },
      { _id: '2', name: 'Lyon', is_active: true },
      { _id: '3', name: 'Marseille', is_active: true }
    ]
  });
}

export function useInstantReasons() {
  const convexData = useQuery(api.cms.getReasons);
  return useInstantCmsData('REASONS', () => convexData, {
    fallbackData: [
      {
        _id: '1',
        title: 'Qualité garantie',
        description: 'Travaux de haute qualité',
        icon: 'ri-award-line',
        is_active: true,
        order_index: 1
      }
    ]
  });
}

export function useInstantTestimonials() {
  const convexData = useQuery(api.cms.getTestimonials);
  return useInstantCmsData('TESTIMONIALS', () => convexData, {
    fallbackData: [
      {
        _id: '1',
        text: 'Excellent travail, très satisfait du résultat',
        author: 'Client satisfait',
        role: 'Propriétaire',
        project: 'Ravalement façade',
        image: '/images/testimonials/default.jpg',
        is_active: true,
        order_index: 1
      }
    ]
  });
}

export function useInstantPortfolioProjects() {
  const convexData = useQuery(api.cms.getPortfolioProjects);
  return useInstantCmsData('PORTFOLIO_PROJECTS', () => convexData, {
    fallbackData: [
      {
        _id: '1',
        title: 'Projet exemple',
        description: 'Description du projet',
        before_image: '/images/projects/before.jpg',
        after_image: '/images/projects/after.jpg',
        category: 'Ravalement',
        is_active: true,
        order_index: 1
      }
    ]
  });
}

// Hook pour précharger toutes les données critiques
export function usePreloadCriticalData() {
  const { preload } = useInstantCache();

  useEffect(() => {
    const preloadAll = async () => {
      // Précharger les données critiques en parallèle
      await Promise.all([
        preload('instant_stats', async () => {
          // Simuler la récupération des statistiques
          return [
            { _id: '1', key: 'projects', value: '150+', label: 'Projets réalisés' },
            { _id: '2', key: 'clients', value: '200+', label: 'Clients satisfaits' },
            { _id: '3', key: 'experience', value: '10+', label: 'Années d\'expérience' },
            { _id: '4', key: 'zones', value: '15+', label: 'Zones couvertes' }
          ];
        }, 'critical'),
        
        preload('instant_services', async () => {
          // Simuler la récupération des services
          return [
            {
              _id: '1',
              title: 'Ravalement de façade',
              description: 'Rénovation complète de votre façade avec les meilleures techniques',
              image: '/images/services/ravalement.jpg',
              features: ['Nettoyage haute pression', 'Réparation des fissures', 'Peinture résistante'],
              is_active: true,
              order_index: 1
            },
            {
              _id: '2',
              title: 'Isolation thermique',
              description: 'Amélioration de l\'isolation de votre bâtiment',
              image: '/images/services/isolation.jpg',
              features: ['Isolation extérieure', 'Réduction des coûts', 'Confort amélioré'],
              is_active: true,
              order_index: 2
            }
          ];
        }, 'critical')
      ]);
    };

    preloadAll();
  }, [preload]);
}

export default instantCache;

