/**
 * Composant CMS optimisé pour zones à faible couverture
 * Utilise le chargement progressif et le cache offline
 */

import React, { useState, useEffect } from 'react';
import { useProgressiveCmsLoading, ProgressiveSkeleton } from '../../lib/progressive-loading';
import { useOfflineCmsData } from '../../lib/offline-cache';
import { NetworkStatusIndicator, NetworkStatusBar } from '../network/NetworkStatusIndicator';

interface OptimizedCmsSectionProps {
  children: React.ReactNode;
  showNetworkStatus?: boolean;
  enableProgressiveLoading?: boolean;
  priority?: 'high' | 'medium' | 'low';
  className?: string;
}

export default function OptimizedCmsSection({
  children,
  showNetworkStatus = true,
  enableProgressiveLoading = true,
  priority = 'medium',
  className = ''
}: OptimizedCmsSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Chargement progressif des données CMS
  const { loadingState, loadedData, errors, isSlowConnection } = useProgressiveCmsLoading(
    {
      critical: ['STATISTICS', 'SERVICES'],
      important: ['ZONES', 'REASONS', 'PROCESS_STEPS'],
      niceToHave: ['TESTIMONIALS', 'PORTFOLIO_PROJECTS', 'TEAM_MEMBERS']
    },
    {
      enableSkeleton: true,
      enableProgressiveImages: true,
      batchSize: isSlowConnection() ? 1 : 2,
      delayBetweenBatches: isSlowConnection() ? 200 : 100,
      timeoutMs: isSlowConnection() ? 15000 : 10000
    }
  );

  // Calculer le progrès de chargement
  useEffect(() => {
    const totalSections = 3;
    const loadedSections = Object.values(loadingState).filter(Boolean).length;
    const progress = ((totalSections - loadedSections) / totalSections) * 100;
    setLoadingProgress(progress);
  }, [loadingState]);

  // Détecter la visibilité pour le chargement paresseux
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('optimized-cms-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  // Afficher le skeleton pendant le chargement
  if (!isVisible || loadingState.critical) {
    return (
      <div id="optimized-cms-section" className={className}>
        {showNetworkStatus && <NetworkStatusIndicator showDetails={true} />}
        
        <div className="space-y-8">
          {/* Skeleton pour les statistiques */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto px-4">
            <ProgressiveSkeleton type="statistics" count={4} />
          </div>

          {/* Skeleton pour les services */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ProgressiveSkeleton type="card" count={3} />
          </div>

          {/* Barre de progression */}
          <div className="max-w-md mx-auto">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${100 - loadingProgress}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              Chargement des données... {Math.round(100 - loadingProgress)}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Afficher les erreurs si nécessaire
  if (Object.keys(errors).length > 0) {
    return (
      <div id="optimized-cms-section" className={className}>
        {showNetworkStatus && <NetworkStatusIndicator showDetails={true} />}
        
        <div className="text-center py-12">
          <div className="text-red-500 text-6xl mb-4">
            <i className="ri-error-warning-line"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Problème de chargement
          </h2>
          <p className="text-gray-600 mb-6">
            Certaines données n'ont pas pu être chargées. Vérifiez votre connexion.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="optimized-cms-section" className={className}>
      {showNetworkStatus && <NetworkStatusIndicator showDetails={true} />}
      {isSlowConnection() && <NetworkStatusBar />}
      
      {/* Contenu principal avec chargement progressif */}
      <div className="space-y-8">
        {children}
        
        {/* Indicateur de cache pour les zones à faible couverture */}
        {isSlowConnection() && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center space-x-2 text-blue-800">
              <i className="ri-database-line text-lg"></i>
              <span className="font-medium">Mode optimisé activé</span>
            </div>
            <p className="text-blue-700 text-sm mt-1">
              Les données sont mises en cache pour améliorer les performances sur votre connexion lente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Composant wrapper pour les sections individuelles
export function OptimizedSection({
  children,
  loading = false,
  error = null,
  className = ''
}: {
  children: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  className?: string;
}) {
  if (loading) {
    return (
      <div className={className}>
        <ProgressiveSkeleton type="card" count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-red-500 text-4xl mb-2">
          <i className="ri-error-warning-line"></i>
        </div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return <div className={className}>{children}</div>;
}

// Hook pour les données CMS optimisées
export function useOptimizedCmsData<T>(
  queryKey: string,
  queryFn: () => T | undefined,
  options: {
    priority?: 'high' | 'medium' | 'low';
    fallbackData?: T;
  } = {}
) {
  const { priority = 'medium', fallbackData } = options;
  const { data, isLoading, error, isCached, networkStatus } = useOfflineCmsData(
    queryKey as any,
    queryFn,
    { priority }
  );

  return {
    data: data || fallbackData,
    isLoading,
    error,
    isCached,
    networkStatus,
    isOffline: !networkStatus.isOnline,
    isSlowConnection: networkStatus.connectionType === 'slow-2g' || networkStatus.connectionType === '2g'
  };
}

