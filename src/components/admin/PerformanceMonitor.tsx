import React, { useState, useEffect } from 'react';
import { getCacheStats, clearCache } from '../../lib/cache-optimizer';

interface PerformanceStats {
  size: number;
  maxSize: number;
  hitRate: number;
  entries: Array<{ key: string; age: number; ttl: number }>;
}

export default function PerformanceMonitor() {
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      setStats(getCacheStats());
    };

    // Mettre à jour les stats toutes les 5 secondes
    const interval = setInterval(updateStats, 5000);
    updateStats(); // Mise à jour initiale

    return () => clearInterval(interval);
  }, []);

  const handleClearCache = () => {
    clearCache();
    setStats(getCacheStats());
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors z-50"
        title="Afficher le moniteur de performance"
      >
        <i className="ri-dashboard-line text-xl"></i>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80 z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Performance Monitor</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleClearCache}
            className="text-red-500 hover:text-red-700 p-1"
            title="Vider le cache"
          >
            <i className="ri-refresh-line"></i>
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700 p-1"
            title="Fermer"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>
      </div>

      {stats && (
        <div className="space-y-3">
          {/* Statistiques générales */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Cache Size</div>
              <div className="text-lg font-semibold text-gray-900">
                {stats.size} / {stats.maxSize}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: `${(stats.size / stats.maxSize) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">Hit Rate</div>
              <div className="text-lg font-semibold text-gray-900">
                {stats.hitRate.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Entrées du cache */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Cache Entries</div>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {stats.entries.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-2">
                  Aucune entrée en cache
                </div>
              ) : (
                stats.entries.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between text-xs bg-gray-50 rounded p-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-gray-900 truncate">
                        {entry.key}
                      </div>
                      <div className="text-gray-500">
                        Age: {Math.round(entry.age / 1000)}s | TTL: {Math.round(entry.ttl / 1000)}s
                      </div>
                    </div>
                    <div className="ml-2">
                      {entry.age < entry.ttl ? (
                        <span className="text-green-500">
                          <i className="ri-check-line"></i>
                        </span>
                      ) : (
                        <span className="text-red-500">
                          <i className="ri-close-line"></i>
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Actions rapides */}
          <div className="flex space-x-2 pt-2 border-t border-gray-200">
            <button
              onClick={() => setStats(getCacheStats())}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm transition-colors"
            >
              <i className="ri-refresh-line mr-1"></i>
              Actualiser
            </button>
            <button
              onClick={handleClearCache}
              className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded text-sm transition-colors"
            >
              <i className="ri-delete-bin-line mr-1"></i>
              Vider
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
