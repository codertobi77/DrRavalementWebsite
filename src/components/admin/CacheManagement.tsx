/**
 * Composant de gestion du cache CMS pour l'interface d'administration
 */

import React, { useState } from 'react';
import { useCmsCache, useCacheStats, useCacheErrors } from '../../contexts/CmsCacheContext';

export default function CacheManagement() {
  const { refreshAll, invalidate, invalidateMultiple, clearAll } = useCmsCache();
  const { stats, isRefreshing, lastRefresh, refreshStats } = useCacheStats();
  const { errors, setError, clearError, clearAllErrors, hasErrors } = useCacheErrors();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleRefreshAll = async () => {
    try {
      await refreshAll();
      refreshStats();
    } catch (error) {
      setError('refresh_all', 'Erreur lors du rafraîchissement');
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAll();
      refreshStats();
    } catch (error) {
      setError('clear_all', 'Erreur lors du vidage du cache');
    }
  };

  const formatLastRefresh = (timestamp: number | null) => {
    if (!timestamp) return 'Jamais';
    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR');
  };

  const getCacheSizeColor = (size: number) => {
    if (size === 0) return 'text-gray-500';
    if (size < 10) return 'text-green-600';
    if (size < 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className={`px-4 py-2 rounded-lg shadow-lg transition-all flex items-center space-x-2 ${
            hasErrors 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <i className="ri-database-line"></i>
          <span>Cache CMS</span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            hasErrors ? 'bg-red-600' : 'bg-blue-600'
          }`}>
            {stats.size}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white rounded-lg shadow-xl border p-4 max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Gestion du Cache CMS</h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <i className="ri-close-line"></i>
        </button>
      </div>

      {/* Statistiques du cache */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Statistiques</span>
          <span className={`text-sm font-bold ${getCacheSizeColor(stats.size)}`}>
            {stats.size} entrées
          </span>
        </div>
        <div className="text-xs text-gray-500">
          Dernier rafraîchissement: {formatLastRefresh(lastRefresh)}
        </div>
        {isRefreshing && (
          <div className="text-xs text-blue-600 mt-1">
            <i className="ri-loader-4-line animate-spin mr-1"></i>
            Rafraîchissement en cours...
          </div>
        )}
      </div>

      {/* Actions du cache */}
      <div className="space-y-2 mb-4">
        <button
          onClick={handleRefreshAll}
          disabled={isRefreshing}
          className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm rounded transition-colors flex items-center justify-center space-x-2"
        >
          <i className="ri-refresh-line"></i>
          <span>Rafraîchir tout</span>
        </button>

        <button
          onClick={handleClearAll}
          className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors flex items-center justify-center space-x-2"
        >
          <i className="ri-delete-bin-line"></i>
          <span>Vider le cache</span>
        </button>
      </div>

      {/* Actions par type de données */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Invalider par type</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => invalidate('STATISTICS')}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded transition-colors"
          >
            Statistiques
          </button>
          <button
            onClick={() => invalidate('SERVICES')}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded transition-colors"
          >
            Services
          </button>
          <button
            onClick={() => invalidate('ZONES')}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded transition-colors"
          >
            Zones
          </button>
          <button
            onClick={() => invalidate('REASONS')}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded transition-colors"
          >
            Raisons
          </button>
          <button
            onClick={() => invalidate('TESTIMONIALS')}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded transition-colors"
          >
            Témoignages
          </button>
          <button
            onClick={() => invalidate('PORTFOLIO_PROJECTS')}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded transition-colors"
          >
            Projets
          </button>
        </div>
      </div>

      {/* Actions groupées */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Actions groupées</h4>
        <div className="space-y-1">
          <button
            onClick={() => invalidateMultiple(['STATISTICS', 'SERVICES', 'ZONES'])}
            className="w-full px-2 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs rounded transition-colors"
          >
            Invalider données principales
          </button>
          <button
            onClick={() => invalidateMultiple(['REASONS', 'TESTIMONIALS', 'PORTFOLIO_PROJECTS'])}
            className="w-full px-2 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs rounded transition-colors"
          >
            Invalider contenu secondaire
          </button>
        </div>
      </div>

      {/* Erreurs */}
      {hasErrors && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-red-700">Erreurs</h4>
            <button
              onClick={clearAllErrors}
              className="text-xs text-red-600 hover:text-red-800"
            >
              Effacer tout
            </button>
          </div>
          <div className="space-y-1">
            {Object.entries(errors).map(([key, error]) => (
              <div key={key} className="p-2 bg-red-50 rounded text-xs text-red-700 flex items-center justify-between">
                <span>{error}</span>
                <button
                  onClick={() => clearError(key)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Informations sur les clés de cache */}
      {stats.keys.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Clés en cache</h4>
          <div className="max-h-32 overflow-y-auto">
            {stats.keys.map((key) => (
              <div key={key} className="text-xs text-gray-500 py-1 border-b border-gray-100 last:border-b-0">
                {key}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Informations sur le cache */}
      <div className="text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <i className="ri-information-line"></i>
          <span>Cache automatique avec localStorage</span>
        </div>
        <div className="flex items-center space-x-1 mt-1">
          <i className="ri-time-line"></i>
          <span>TTL: 5 minutes par défaut</span>
        </div>
      </div>
    </div>
  );
}
