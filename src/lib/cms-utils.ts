/**
 * Utilitaires pour la gestion des données CMS
 * Évite la duplication des données dans l'interface utilisateur
 */

// Fonction générique pour dédupliquer les données basée sur une clé unique
export function deduplicateByKey<T>(items: T[], key: keyof T): T[] {
  if (!items || items.length === 0) return [];
  
  const seen = new Set();
  return items.filter(item => {
    const keyValue = item[key];
    if (seen.has(keyValue)) {
      return false;
    }
    seen.add(keyValue);
    return true;
  });
}

// Fonction pour dédupliquer les statistiques par clé
export function deduplicateStatistics(statistics: any[]): any[] {
  return deduplicateByKey(statistics, 'key');
}

// Fonction pour dédupliquer les services par titre
export function deduplicateServices(services: any[]): any[] {
  return deduplicateByKey(services, 'title');
}

// Fonction pour dédupliquer les zones par nom
export function deduplicateZones(zones: any[]): any[] {
  return deduplicateByKey(zones, 'name');
}

// Fonction pour dédupliquer les raisons par titre
export function deduplicateReasons(reasons: any[]): any[] {
  return deduplicateByKey(reasons, 'title');
}

// Fonction pour dédupliquer les témoignages par texte
export function deduplicateTestimonials(testimonials: any[]): any[] {
  return deduplicateByKey(testimonials, 'text');
}

// Fonction pour valider l'intégrité des données avant affichage
export function validateCmsData<T>(
  data: T[] | undefined, 
  deduplicateFn: (items: T[]) => T[],
  fallbackMessage: string = "Aucune donnée disponible"
): T[] | null {
  if (!data || data.length === 0) {
    console.warn(`CMS Data Warning: ${fallbackMessage}`);
    return null;
  }

  const deduplicatedData = deduplicateFn(data);
  
  if (deduplicatedData.length !== data.length) {
    console.warn(`CMS Data Warning: ${data.length - deduplicatedData.length} éléments dupliqués supprimés`);
  }

  return deduplicatedData;
}

// Fonction pour logger les erreurs de données CMS
export function logCmsError(component: string, error: any, data?: any) {
  console.error(`CMS Error in ${component}:`, {
    error: error.message || error,
    data: data ? `Data length: ${Array.isArray(data) ? data.length : 'N/A'}` : 'No data',
    timestamp: new Date().toISOString()
  });
}

// Fonction pour créer un état de chargement uniforme
export function createLoadingState(itemCount: number = 3) {
  return Array.from({ length: itemCount }, (_, index) => ({
    _id: `loading-${index}`,
    _isLoading: true
  }));
}

// Types pour les données CMS
export interface CmsDataItem {
  _id: string;
  _creationTime?: number;
  is_active?: boolean;
  order_index?: number;
}

export interface StatisticsItem extends CmsDataItem {
  key: string;
  value: string;
  label: string;
}

export interface ServiceItem extends CmsDataItem {
  title: string;
  description: string;
  image: string;
  features: string[];
}

export interface ZoneItem extends CmsDataItem {
  name: string;
}

export interface ReasonItem extends CmsDataItem {
  title: string;
  description: string;
  icon: string;
}

export interface TestimonialItem extends CmsDataItem {
  text: string;
  author: string;
  role: string;
  project: string;
  image: string;
}

// Import du système de cache optimisé
import React from 'react';
import { withCache } from './cache-optimizer';

/**
 * Hook optimisé pour les données CMS avec cache de 15 secondes
 */
export function useOptimizedCmsData<T>(
  queryFn: () => T | undefined,
  cacheKey: string,
  deduplicateFn?: (items: T[]) => T[]
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
          { ttl: 15000 } // Cache de 15 secondes
        );
        
        if (mounted) {
          // Appliquer la déduplication si fournie
          const processedData = deduplicateFn ? deduplicateFn(result as T[]) : result;
          setData(processedData);
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
  }, [cacheKey]);
  
  return { data, isLoading, error };
}

/**
 * Fonction utilitaire pour créer un état de chargement optimisé
 */
export function createOptimizedLoadingState() {
  return {
    isLoading: true,
    error: null,
    data: null
  };
}

/**
 * Fonction utilitaire pour créer un état d'erreur optimisé
 */
export function createOptimizedErrorState(error: Error) {
  return {
    isLoading: false,
    error,
    data: null
  };
}

/**
 * Fonction utilitaire pour créer un état de succès optimisé
 */
export function createOptimizedSuccessState<T>(data: T) {
  return {
    isLoading: false,
    error: null,
    data
  };
}
