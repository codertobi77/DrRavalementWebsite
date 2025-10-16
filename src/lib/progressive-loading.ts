/**
 * Système de chargement progressif pour zones à faible couverture
 * Charge les données par priorité et affiche du contenu immédiatement
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useOfflineCache } from './offline-cache';

// Types pour le chargement progressif
export interface LoadingPriority {
  critical: string[];    // Données critiques (statistiques, services)
  important: string[];   // Données importantes (zones, raisons)
  niceToHave: string[]; // Données optionnelles (témoignages, projets)
}

export interface ProgressiveLoadingConfig {
  enableSkeleton: boolean;
  enableProgressiveImages: boolean;
  batchSize: number;
  delayBetweenBatches: number;
  timeoutMs: number;
}

// Configuration par défaut
const DEFAULT_PRIORITY: LoadingPriority = {
  critical: ['STATISTICS', 'SERVICES'],
  important: ['ZONES', 'REASONS', 'PROCESS_STEPS'],
  niceToHave: ['TESTIMONIALS', 'PORTFOLIO_PROJECTS', 'TEAM_MEMBERS']
};

const DEFAULT_CONFIG: ProgressiveLoadingConfig = {
  enableSkeleton: true,
  enableProgressiveImages: true,
  batchSize: 2,
  delayBetweenBatches: 100,
  timeoutMs: 10000
};

// Hook pour le chargement progressif des données CMS
export function useProgressiveCmsLoading(
  priority: LoadingPriority = DEFAULT_PRIORITY,
  config: ProgressiveLoadingConfig = DEFAULT_CONFIG
) {
  const { networkStatus, isSlowConnection } = useOfflineCache();
  const [loadingState, setLoadingState] = useState<{
    critical: boolean;
    important: boolean;
    niceToHave: boolean;
    allLoaded: boolean;
  }>({
    critical: true,
    important: false,
    niceToHave: false,
    allLoaded: false
  });

  const [loadedData, setLoadedData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fonction pour charger une batch de données
  const loadBatch = useCallback(async (
    dataKeys: string[],
    category: keyof LoadingPriority
  ) => {
    const batch = dataKeys.slice(0, config.batchSize);
    const remaining = dataKeys.slice(config.batchSize);

    try {
      // Charger les données de la batch actuelle
      const promises = batch.map(async (key) => {
        try {
          // Simuler le chargement des données
          const data = await loadCmsData(key);
          return { key, data, error: null };
        } catch (error) {
          return { 
            key, 
            data: null, 
            error: error instanceof Error ? error.message : 'Erreur de chargement' 
          };
        }
      });

      const results = await Promise.all(promises);
      
      // Mettre à jour l'état avec les résultats
      setLoadedData(prev => {
        const newData = { ...prev };
        results.forEach(({ key, data }) => {
          if (data) newData[key] = data;
        });
        return newData;
      });

      // Mettre à jour les erreurs
      setErrors(prev => {
        const newErrors = { ...prev };
        results.forEach(({ key, error }) => {
          if (error) newErrors[key] = error;
        });
        return newErrors;
      });

      // Marquer la catégorie comme chargée
      setLoadingState(prev => ({
        ...prev,
        [category]: false
      }));

      // Charger la batch suivante s'il y en a une
      if (remaining.length > 0) {
        setTimeout(() => {
          loadBatch(remaining, category);
        }, config.delayBetweenBatches);
      } else {
        // Vérifier si tout est chargé
        setLoadingState(prev => {
          const allLoaded = !prev.critical && !prev.important && !prev.niceToHave;
          return { ...prev, allLoaded };
        });
      }

    } catch (error) {
      console.error(`Erreur lors du chargement de la batch ${category}:`, error);
      setLoadingState(prev => ({ ...prev, [category]: false }));
    }
  }, [config]);

  // Fonction pour charger une donnée CMS spécifique
  const loadCmsData = useCallback(async (key: string) => {
    // Simuler le chargement depuis Convex ou le cache
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Timeout pour ${key}`));
      }, config.timeoutMs);

      // Simuler un délai de chargement basé sur la connexion
      const delay = isSlowConnection() ? 2000 : 500;
      
      setTimeout(() => {
        clearTimeout(timeout);
        // Ici, vous intégreriez le vrai chargement de données
        resolve({ key, loaded: true, timestamp: Date.now() });
      }, delay);
    });
  }, [isSlowConnection, config.timeoutMs]);

  // Démarrer le chargement progressif
  useEffect(() => {
    if (!networkStatus.isOnline) return;

    // Charger les données critiques en premier
    if (priority.critical.length > 0) {
      loadBatch(priority.critical, 'critical');
    }

    // Charger les données importantes après un délai
    setTimeout(() => {
      if (priority.important.length > 0) {
        loadBatch(priority.important, 'important');
      }
    }, 500);

    // Charger les données optionnelles en dernier
    setTimeout(() => {
      if (priority.niceToHave.length > 0) {
        loadBatch(priority.niceToHave, 'niceToHave');
      }
    }, 1000);

  }, [networkStatus.isOnline, priority, loadBatch]);

  return {
    loadingState,
    loadedData,
    errors,
    isSlowConnection,
    networkStatus
  };
}

// Hook pour le chargement progressif d'images
export function useProgressiveImageLoading(
  images: string[],
  config: { enableBlur: boolean; placeholderSize: string } = {
    enableBlur: true,
    placeholderSize: 'w-full h-64'
  }
) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const loadImage = useCallback((src: string) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, src]));
        resolve();
      };
      
      img.onerror = () => {
        setImageErrors(prev => new Set([...prev, src]));
        reject(new Error(`Erreur de chargement de l'image: ${src}`));
      };
      
      img.src = src;
    });
  }, []);

  // Charger les images progressivement
  useEffect(() => {
    const loadImagesProgressively = async () => {
      for (const image of images) {
        try {
          await loadImage(image);
          // Délai entre chaque image pour éviter de surcharger
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.warn(`Erreur chargement image ${image}:`, error);
        }
      }
    };

    loadImagesProgressively();
  }, [images, loadImage]);

  return {
    loadedImages,
    imageErrors,
    isImageLoaded: (src: string) => loadedImages.has(src),
    hasImageError: (src: string) => imageErrors.has(src)
  };
}

// Composant de skeleton pour le chargement progressif
export function ProgressiveSkeleton({ 
  type = 'card', 
  count = 3,
  className = '' 
}: {
  type?: 'card' | 'list' | 'grid' | 'statistics';
  count?: number;
  className?: string;
}) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return Array.from({ length: count }, (_, i) => (
          <div key={i} className={`bg-white rounded-2xl overflow-hidden shadow-xl animate-pulse ${className}`}>
            <div className="h-64 bg-gray-300"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-300 rounded mb-3"></div>
              <div className="h-4 bg-gray-300 rounded mb-4"></div>
              <div className="space-y-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-3 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ));

      case 'statistics':
        return Array.from({ length: count }, (_, i) => (
          <div key={i} className={`text-center animate-pulse ${className}`}>
            <div className="h-8 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        ));

      case 'list':
        return Array.from({ length: count }, (_, i) => (
          <div key={i} className={`flex items-center space-x-4 animate-pulse ${className}`}>
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        ));

      case 'grid':
        return Array.from({ length: count }, (_, i) => (
          <div key={i} className={`text-center animate-pulse ${className}`}>
            <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-6"></div>
            <div className="h-6 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        ));

      default:
        return null;
    }
  };

  return <>{renderSkeleton()}</>;
}

// Composant pour les images progressives
export function ProgressiveImage({
  src,
  alt,
  placeholder,
  className = '',
  onLoad,
  onError
}: {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  if (hasError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Image non disponible</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && placeholder && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <span className="text-gray-500 text-sm">Chargement...</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}

// Hook pour le chargement progressif des sections
export function useProgressiveSectionLoading() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [loadingSections, setLoadingSections] = useState<Set<string>>(new Set());

  const loadSection = useCallback(async (sectionId: string, priority: 'high' | 'medium' | 'low' = 'medium') => {
    setLoadingSections(prev => new Set([...prev, sectionId]));

    try {
      // Simuler le chargement de la section
      const delay = priority === 'high' ? 100 : priority === 'medium' ? 300 : 500;
      await new Promise(resolve => setTimeout(resolve, delay));

      setVisibleSections(prev => new Set([...prev, sectionId]));
    } catch (error) {
      console.error(`Erreur chargement section ${sectionId}:`, error);
    } finally {
      setLoadingSections(prev => {
        const newSet = new Set(prev);
        newSet.delete(sectionId);
        return newSet;
      });
    }
  }, []);

  const isSectionVisible = useCallback((sectionId: string) => {
    return visibleSections.has(sectionId);
  }, [visibleSections]);

  const isSectionLoading = useCallback((sectionId: string) => {
    return loadingSections.has(sectionId);
  }, [loadingSections]);

  return {
    loadSection,
    isSectionVisible,
    isSectionLoading,
    visibleSections: Array.from(visibleSections),
    loadingSections: Array.from(loadingSections)
  };
}

export default {
  useProgressiveCmsLoading,
  useProgressiveImageLoading,
  useProgressiveSectionLoading,
  ProgressiveSkeleton,
  ProgressiveImage
};

