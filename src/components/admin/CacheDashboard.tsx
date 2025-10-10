/**
 * Dashboard de surveillance des performances du cache CMS
 */

import React, { useState, useEffect } from 'react';
import { useCacheStats, useCacheErrors } from '../../contexts/CmsCacheContext';
import { useCachePerformance } from '../../hooks/useOptimizedCmsData';

export default function CacheDashboard() {
  const { stats, isRefreshing, lastRefresh, refreshStats } = useCacheStats();
  const { errors, hasErrors, errorCount } = useCacheErrors();
  const performance = useCachePerformance();
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 secondes par défaut

  // Auto-refresh des statistiques
  useEffect(() => {
    const interval = setInterval(refreshStats, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshStats, refreshInterval]);

  const formatLastRefresh = (timestamp: number | null) => {
    if (!timestamp) return 'Jamais';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return date.toLocaleString('fr-FR');
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return 'text-green-600';
    if (efficiency >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEfficiencyLabel = (efficiency: number) => {
    if (efficiency >= 80) return 'Excellent';
    if (efficiency >= 60) return 'Bon';
    if (efficiency >= 40) return 'Moyen';
    return 'Faible';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Cache CMS</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Refresh:</label>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value={10000}>10s</option>
              <option value={30000}>30s</option>
              <option value={60000}>1min</option>
              <option value={300000}>5min</option>
            </select>
          </div>
          <button
            onClick={refreshStats}
            disabled={isRefreshing}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm rounded transition-colors flex items-center space-x-1"
          >
            <i className={`ri-refresh-line ${isRefreshing ? 'animate-spin' : ''}`}></i>
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Entrées en cache</p>
              <p className="text-2xl font-bold text-blue-900">{stats.size}</p>
            </div>
            <i className="ri-database-line text-blue-500 text-2xl"></i>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Efficacité</p>
              <p className={`text-2xl font-bold ${getEfficiencyColor(performance.cacheEfficiency)}`}>
                {Math.round(performance.cacheEfficiency)}%
              </p>
              <p className="text-xs text-green-600">
                {getEfficiencyLabel(performance.cacheEfficiency)}
              </p>
            </div>
            <i className="ri-speed-line text-green-500 text-2xl"></i>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Dernier refresh</p>
              <p className="text-sm font-bold text-purple-900">
                {formatLastRefresh(lastRefresh)}
              </p>
            </div>
            <i className="ri-time-line text-purple-500 text-2xl"></i>
          </div>
        </div>

        <div className={`rounded-lg p-4 ${hasErrors ? 'bg-red-50' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${hasErrors ? 'text-red-600' : 'text-gray-600'}`}>
                Erreurs
              </p>
              <p className={`text-2xl font-bold ${hasErrors ? 'text-red-900' : 'text-gray-900'}`}>
                {errorCount}
              </p>
            </div>
            <i className={`text-2xl ${hasErrors ? 'ri-error-warning-line text-red-500' : 'ri-check-line text-gray-500'}`}></i>
          </div>
        </div>
      </div>

      {/* État du cache */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">État du cache</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Statut</span>
            <div className="flex items-center space-x-2">
              {isRefreshing ? (
                <span className="text-blue-600 text-sm flex items-center">
                  <i className="ri-loader-4-line animate-spin mr-1"></i>
                  Rafraîchissement...
                </span>
              ) : (
                <span className="text-green-600 text-sm flex items-center">
                  <i className="ri-check-line mr-1"></i>
                  Actif
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Clés en cache</span>
            <span className="text-sm font-medium text-gray-900">{stats.keys.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Taille estimée</span>
            <span className="text-sm font-medium text-gray-900">
              {Math.round(stats.size * 0.5)} KB (estimation)
            </span>
          </div>
        </div>
      </div>

      {/* Clés de cache détaillées */}
      {stats.keys.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Clés de cache</h3>
          <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
            <div className="space-y-2">
              {stats.keys.map((key, index) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-mono">{key}</span>
                  <span className="text-gray-400 text-xs">#{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Erreurs détaillées */}
      {hasErrors && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-red-900 mb-3">Erreurs détectées</h3>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="space-y-2">
              {Object.entries(errors).map(([key, error]) => (
                <div key={key} className="flex items-start space-x-2">
                  <i className="ri-error-warning-line text-red-500 mt-0.5"></i>
                  <div>
                    <p className="text-sm font-medium text-red-900">{key}</p>
                    <p className="text-xs text-red-700">{error}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recommandations */}
      <div className="bg-yellow-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">Recommandations</h3>
        <div className="space-y-2 text-sm text-yellow-800">
          {performance.cacheEfficiency < 40 && (
            <p className="flex items-start space-x-2">
              <i className="ri-lightbulb-line mt-0.5"></i>
              <span>L'efficacité du cache est faible. Considérez vider le cache et recharger les données.</span>
            </p>
          )}
          {stats.size > 80 && (
            <p className="flex items-start space-x-2">
              <i className="ri-information-line mt-0.5"></i>
              <span>Le cache contient beaucoup d'entrées. Surveillez l'utilisation de la mémoire.</span>
            </p>
          )}
          {hasErrors && (
            <p className="flex items-start space-x-2">
              <i className="ri-alert-line mt-0.5"></i>
              <span>Des erreurs sont présentes. Vérifiez la connectivité et les permissions.</span>
            </p>
          )}
          {!hasErrors && stats.size > 0 && (
            <p className="flex items-start space-x-2">
              <i className="ri-check-line mt-0.5"></i>
              <span>Le cache fonctionne correctement. Aucune action requise.</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
