/**
 * Indicateur de statut réseau pour zones à faible couverture
 * Affiche l'état de la connexion et les informations de cache
 */

import { useState, useEffect } from 'react';
import { useOfflineCache } from '../../lib/offline-cache';

interface NetworkStatusIndicatorProps {
  showDetails?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
}

export default function NetworkStatusIndicator({ 
  showDetails = false, 
  position = 'top-right',
  className = '' 
}: NetworkStatusIndicatorProps) {
  const { networkStatus, isSlowConnection: isSlow, getStats } = useOfflineCache();
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      const stats = await getStats();
      setCacheStats(stats);
    };
    loadStats();
  }, [getStats]);

  const getStatusColor = () => {
    if (!networkStatus.isOnline) return 'bg-red-500';
    if (isSlow) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusIcon = () => {
    if (!networkStatus.isOnline) return 'ri-wifi-off-line';
    if (isSlow) return 'ri-wifi-1-line';
    return 'ri-wifi-line';
  };

  const getStatusText = () => {
    if (!networkStatus.isOnline) return 'Hors ligne';
    if (isSlow) return 'Connexion lente';
    return 'En ligne';
  };

  const getConnectionTypeText = () => {
    switch (networkStatus.connectionType) {
      case 'slow-2g': return '2G lent';
      case '2g': return '2G';
      case '3g': return '3G';
      case '4g': return '4G';
      case '5g': return '5G';
      default: return 'Inconnu';
    }
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
      {/* Indicateur principal */}
      <div 
        className={`${getStatusColor()} text-white px-3 py-2 rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:scale-105`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <i className={`${getStatusIcon()} text-sm`}></i>
          <span className="text-sm font-medium">{getStatusText()}</span>
          {showDetails && (
            <i className={`ri-arrow-${isExpanded ? 'up' : 'down'}-s-line text-xs`}></i>
          )}
        </div>
      </div>

      {/* Détails expandés */}
      {isExpanded && showDetails && (
        <div className="mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-80">
          <div className="space-y-3">
            {/* Statut réseau */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Statut Réseau</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">État:</span>
                  <span className={`font-medium ${networkStatus.isOnline ? 'text-green-600' : 'text-red-600'}`}>
                    {networkStatus.isOnline ? 'En ligne' : 'Hors ligne'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{getConnectionTypeText()}</span>
                </div>
                {networkStatus.downlink > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vitesse:</span>
                    <span className="font-medium">{networkStatus.downlink.toFixed(1)} Mbps</span>
                  </div>
                )}
                {networkStatus.rtt > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Latence:</span>
                    <span className="font-medium">{networkStatus.rtt}ms</span>
                  </div>
                )}
              </div>
            </div>

            {/* Statistiques du cache */}
            {cacheStats && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Cache Local</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">localStorage:</span>
                    <span className="font-medium">{cacheStats.localStorage.size} entrées</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IndexedDB:</span>
                    <span className="font-medium">{cacheStats.indexedDB.size} entrées</span>
                  </div>
                  {cacheStats.indexedDB.totalSize > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taille totale:</span>
                      <span className="font-medium">
                        {(cacheStats.indexedDB.totalSize / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recommandations */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Recommandations</h3>
              <div className="text-sm text-gray-600 space-y-1">
                {!networkStatus.isOnline ? (
                  <p className="text-red-600">
                    <i className="ri-wifi-off-line mr-1"></i>
                    Mode hors ligne - Les données en cache sont utilisées
                  </p>
                ) : isSlow ? (
                  <p className="text-yellow-600">
                    <i className="ri-wifi-1-line mr-1"></i>
                    Connexion lente - Le cache est optimisé pour cette situation
                  </p>
                ) : (
                  <p className="text-green-600">
                    <i className="ri-wifi-line mr-1"></i>
                    Connexion rapide - Mise à jour automatique des données
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Composant simplifié pour la barre de statut
export function NetworkStatusBar({ className = '' }: { className?: string }) {
  const { networkStatus, isSlowConnection: isSlow } = useOfflineCache();

  if (networkStatus.isOnline && !isSlow) {
    return null; // Ne pas afficher si la connexion est bonne
  }

  return (
    <div className={`bg-${isSlow ? 'yellow' : 'red'}-500 text-white px-4 py-2 text-center text-sm font-medium ${className}`}>
      <div className="flex items-center justify-center space-x-2">
        <i className={`${isSlow ? 'ri-wifi-1-line' : 'ri-wifi-off-line'}`}></i>
        <span>
          {!networkStatus.isOnline 
            ? 'Mode hors ligne - Données en cache' 
            : 'Connexion lente - Chargement optimisé'
          }
        </span>
      </div>
    </div>
  );
}

// Hook pour utiliser le statut réseau dans d'autres composants
export function useNetworkStatus() {
  const { networkStatus, isSlowConnection: isSlow, getStats } = useOfflineCache();
  const [cacheStats, setCacheStats] = useState<any>(null);

  useEffect(() => {
    const loadStats = async () => {
      const stats = await getStats();
      setCacheStats(stats);
    };
    loadStats();
  }, [getStats]);

  return {
    networkStatus,
    isSlowConnection: isSlow,
    cacheStats,
    isOffline: !networkStatus.isOnline,
    connectionType: networkStatus.connectionType,
    downlink: networkStatus.downlink,
    rtt: networkStatus.rtt
  };
}
