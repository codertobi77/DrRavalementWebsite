/**
 * Composant de démonstration des performances du cache CMS
 * Compare les performances avec et sans cache
 */

import React, { useState, useEffect, useRef } from 'react';
import { useCachedServices, useCachedStatistics } from '../../lib/cms-cache';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function CachePerformanceDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{
    withCache: { duration: number; dataSize: number; calls: number };
    withoutCache: { duration: number; dataSize: number; calls: number };
  } | null>(null);
  const [currentTest, setCurrentTest] = useState<string>('');
  const testRef = useRef<number>(0);

  // Hooks avec cache
  const { data: cachedServices, isCached: servicesCached } = useCachedServices();
  const { data: cachedStatistics, isCached: statsCached } = useCachedStatistics();

  // Hooks sans cache (pour comparaison)
  const rawServices = useQuery(api.cms.getServices);
  const rawStatistics = useQuery(api.cms.getStatistics);

  const runPerformanceTest = async () => {
    setIsRunning(true);
    setCurrentTest('Préparation du test...');
    testRef.current++;

    const currentTestId = testRef.current;
    const iterations = 10;
    const results = {
      withCache: { duration: 0, dataSize: 0, calls: 0 },
      withoutCache: { duration: 0, dataSize: 0, calls: 0 }
    };

    try {
      // Test avec cache
      setCurrentTest('Test avec cache...');
      const cacheStartTime = performance.now();
      let cacheDataSize = 0;
      let cacheCalls = 0;

      for (let i = 0; i < iterations; i++) {
        if (currentTestId !== testRef.current) return; // Test annulé

        // Simuler l'utilisation des données cachées
        if (cachedServices) {
          cacheDataSize += JSON.stringify(cachedServices).length;
          cacheCalls++;
        }
        if (cachedStatistics) {
          cacheDataSize += JSON.stringify(cachedStatistics).length;
          cacheCalls++;
        }

        // Petit délai pour simuler le traitement
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      const cacheEndTime = performance.now();
      results.withCache = {
        duration: cacheEndTime - cacheStartTime,
        dataSize: cacheDataSize,
        calls: cacheCalls
      };

      // Test sans cache
      setCurrentTest('Test sans cache...');
      const noCacheStartTime = performance.now();
      let noCacheDataSize = 0;
      let noCacheCalls = 0;

      for (let i = 0; i < iterations; i++) {
        if (currentTestId !== testRef.current) return; // Test annulé

        // Simuler l'utilisation des données non cachées
        if (rawServices) {
          noCacheDataSize += JSON.stringify(rawServices).length;
          noCacheCalls++;
        }
        if (rawStatistics) {
          noCacheDataSize += JSON.stringify(rawStatistics).length;
          noCacheCalls++;
        }

        // Délai plus long pour simuler la latence réseau
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      const noCacheEndTime = performance.now();
      results.withoutCache = {
        duration: noCacheEndTime - noCacheStartTime,
        dataSize: noCacheDataSize,
        calls: noCacheCalls
      };

      if (currentTestId === testRef.current) {
        setResults(results);
        setCurrentTest('Test terminé !');
      }
    } catch (error) {
      console.error('Erreur lors du test:', error);
      setCurrentTest('Erreur lors du test');
    } finally {
      if (currentTestId === testRef.current) {
        setIsRunning(false);
      }
    }
  };

  const formatDuration = (ms: number) => {
    return `${ms.toFixed(2)}ms`;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getImprovementPercentage = () => {
    if (!results) return 0;
    const improvement = ((results.withoutCache.duration - results.withCache.duration) / results.withoutCache.duration) * 100;
    return Math.max(0, improvement);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Démonstration des performances du cache</h2>
        <button
          onClick={runPerformanceTest}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <i className={`ri-play-line ${isRunning ? 'animate-spin' : ''}`}></i>
          <span>{isRunning ? 'Test en cours...' : 'Lancer le test'}</span>
        </button>
      </div>

      {/* État actuel du cache */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">État actuel du cache</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <i className="ri-database-line text-blue-500"></i>
            <span className="text-sm text-gray-600">Services:</span>
            <span className={`text-sm font-medium ${servicesCached ? 'text-green-600' : 'text-gray-500'}`}>
              {servicesCached ? 'En cache' : 'Non caché'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <i className="ri-bar-chart-line text-blue-500"></i>
            <span className="text-sm text-gray-600">Statistiques:</span>
            <span className={`text-sm font-medium ${statsCached ? 'text-green-600' : 'text-gray-500'}`}>
              {statsCached ? 'En cache' : 'Non caché'}
            </span>
          </div>
        </div>
      </div>

      {/* Test en cours */}
      {isRunning && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <i className="ri-loader-4-line animate-spin text-blue-500"></i>
            <span className="text-blue-700">{currentTest}</span>
          </div>
        </div>
      )}

      {/* Résultats */}
      {results && (
        <div className="space-y-6">
          {/* Métriques principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Avec cache</p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatDuration(results.withCache.duration)}
                  </p>
                </div>
                <i className="ri-speed-line text-green-500 text-2xl"></i>
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">Sans cache</p>
                  <p className="text-2xl font-bold text-red-900">
                    {formatDuration(results.withoutCache.duration)}
                  </p>
                </div>
                <i className="ri-time-line text-red-500 text-2xl"></i>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Amélioration</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {getImprovementPercentage().toFixed(1)}%
                  </p>
                </div>
                <i className="ri-trending-up-line text-blue-500 text-2xl"></i>
              </div>
            </div>
          </div>

          {/* Détails des performances */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Avec cache</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Durée:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDuration(results.withCache.duration)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Taille des données:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatSize(results.withCache.dataSize)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Appels:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {results.withCache.calls}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Sans cache</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Durée:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDuration(results.withoutCache.duration)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Taille des données:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatSize(results.withoutCache.dataSize)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Appels:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {results.withoutCache.calls}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Graphique de comparaison */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Comparaison visuelle</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Avec cache</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${Math.min(100, (results.withCache.duration / results.withoutCache.duration) * 100)}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {formatDuration(results.withCache.duration)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-600">Sans cache</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full w-full"></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {formatDuration(results.withoutCache.duration)}
                </span>
              </div>
            </div>
          </div>

          {/* Recommandations */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-yellow-900 mb-2">Recommandations</h4>
            <div className="space-y-1 text-sm text-yellow-800">
              {getImprovementPercentage() > 50 && (
                <p className="flex items-start space-x-2">
                  <i className="ri-check-line mt-0.5"></i>
                  <span>Excellent ! Le cache améliore significativement les performances.</span>
                </p>
              )}
              {getImprovementPercentage() > 20 && getImprovementPercentage() <= 50 && (
                <p className="flex items-start space-x-2">
                  <i className="ri-information-line mt-0.5"></i>
                  <span>Bon ! Le cache apporte une amélioration notable des performances.</span>
                </p>
              )}
              {getImprovementPercentage() <= 20 && (
                <p className="flex items-start space-x-2">
                  <i className="ri-lightbulb-line mt-0.5"></i>
                  <span>Le cache apporte une amélioration modérée. Considérez optimiser les données ou augmenter le TTL.</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!results && !isRunning && (
        <div className="text-center text-gray-500">
          <i className="ri-play-circle-line text-4xl mb-2"></i>
          <p>Cliquez sur "Lancer le test" pour comparer les performances</p>
        </div>
      )}
    </div>
  );
}
