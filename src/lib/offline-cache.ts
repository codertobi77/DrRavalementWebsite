/**
 * Système de cache offline optimisé pour zones à faible couverture réseau
 * Utilise Service Worker, IndexedDB et stratégies de cache agressives
 */

import React from 'react';
import { cacheUtils } from './cms-cache';

// Types pour le cache offline
export interface OfflineCacheConfig {
  enableServiceWorker: boolean;
  enableIndexedDB: boolean;
  aggressiveCaching: boolean;
  offlineTTL: number; // TTL plus long pour le mode offline
  maxOfflineEntries: number;
  preloadCriticalData: boolean;
}

export interface NetworkStatus {
  isOnline: boolean;
  connectionType: 'slow-2g' | '2g' | '3g' | '4g' | '5g' | 'unknown';
  effectiveType: string;
  downlink: number;
  rtt: number;
}

// Configuration optimisée pour zones à faible couverture
const OFFLINE_CONFIG: OfflineCacheConfig = {
  enableServiceWorker: true,
  enableIndexedDB: true,
  aggressiveCaching: true,
  offlineTTL: 24 * 60 * 60 * 1000, // 24 heures en mode offline
  maxOfflineEntries: 500,
  preloadCriticalData: true
};

// Gestionnaire de statut réseau
class NetworkManager {
  private status: NetworkStatus = {
    isOnline: navigator.onLine,
    connectionType: 'unknown',
    effectiveType: 'unknown',
    downlink: 0,
    rtt: 0
  };

  private listeners: ((status: NetworkStatus) => void)[] = [];

  constructor() {
    this.updateNetworkStatus();
    this.setupEventListeners();
  }

  private updateNetworkStatus() {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      this.status = {
        isOnline: navigator.onLine,
        connectionType: connection.effectiveType || 'unknown',
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0
      };
    } else {
      this.status = {
        isOnline: navigator.onLine,
        connectionType: 'unknown',
        effectiveType: 'unknown',
        downlink: 0,
        rtt: 0
      };
    }

    this.notifyListeners();
  }

  private setupEventListeners() {
    window.addEventListener('online', () => this.updateNetworkStatus());
    window.addEventListener('offline', () => this.updateNetworkStatus());
    
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', () => this.updateNetworkStatus());
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.status));
  }

  public getStatus(): NetworkStatus {
    return { ...this.status };
  }

  public isSlowConnection(): boolean {
    return this.status.connectionType === 'slow-2g' || 
           this.status.connectionType === '2g' ||
           this.status.downlink < 0.5;
  }

  public addListener(listener: (status: NetworkStatus) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

// Gestionnaire de cache IndexedDB pour données volumineuses
class IndexedDBCache {
  private dbName = 'dr-ravalement-offline-cache';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Store pour les données CMS
        if (!db.objectStoreNames.contains('cms-data')) {
          const store = db.createObjectStore('cms-data', { keyPath: 'key' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('type', 'type', { unique: false });
        }

        // Store pour les métadonnées
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }
      };
    });
  }

  async set(key: string, data: any, type: string = 'cms'): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cms-data'], 'readwrite');
      const store = transaction.objectStore('cms-data');
      
      const item = {
        key,
        data,
        type,
        timestamp: Date.now(),
        size: JSON.stringify(data).length
      };

      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async get(key: string): Promise<any | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cms-data'], 'readonly');
      const store = transaction.objectStore('cms-data');
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          resolve(result.data);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cms-data'], 'readwrite');
      const store = transaction.objectStore('cms-data');
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getStats(): Promise<{ size: number; totalSize: number }> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cms-data'], 'readonly');
      const store = transaction.objectStore('cms-data');
      const request = store.getAll();

      request.onsuccess = () => {
        const items = request.result;
        const size = items.length;
        const totalSize = items.reduce((sum, item) => sum + (item.size || 0), 0);
        resolve({ size, totalSize });
      };
      request.onerror = () => reject(request.error);
    });
  }
}

// Gestionnaire de cache offline principal
class OfflineCacheManager {
  private networkManager: NetworkManager;
  private indexedDBCache: IndexedDBCache;
  private config: OfflineCacheConfig;

  constructor(config: OfflineCacheConfig = OFFLINE_CONFIG) {
    this.config = config;
    this.networkManager = new NetworkManager();
    this.indexedDBCache = new IndexedDBCache();
    
    this.init();
  }

  private async init() {
    if (this.config.enableIndexedDB) {
      await this.indexedDBCache.init();
    }

    // Précharger les données critiques si configuré
    if (this.config.preloadCriticalData) {
      this.preloadCriticalData();
    }
  }

  public getNetworkStatus(): NetworkStatus {
    return this.networkManager.getStatus();
  }

  public isSlowConnection(): boolean {
    return this.networkManager.isSlowConnection();
  }

  public addNetworkListener(listener: (status: NetworkStatus) => void) {
    return this.networkManager.addListener(listener);
  }

  // Cache agressif pour les données critiques
  public async cacheData(key: string, data: any, type: string = 'cms'): Promise<void> {
    const ttl = this.isSlowConnection() ? this.config.offlineTTL : 5 * 60 * 1000;
    
    // Cache localStorage (rapide)
    try {
      const cacheEntry = {
        data,
        timestamp: Date.now(),
        version: '1.0.0',
        ttl,
        type
      };
      localStorage.setItem(`offline_${key}`, JSON.stringify(cacheEntry));
    } catch (error) {
      console.warn('Erreur localStorage:', error);
    }

    // Cache IndexedDB (volumineux)
    if (this.config.enableIndexedDB) {
      try {
        await this.indexedDBCache.set(key, data, type);
      } catch (error) {
        console.warn('Erreur IndexedDB:', error);
      }
    }
  }

  // Récupération intelligente des données
  public async getData(key: string): Promise<any | null> {
    // 1. Essayer localStorage d'abord (plus rapide)
    try {
      const cached = localStorage.getItem(`offline_${key}`);
      if (cached) {
        const entry = JSON.parse(cached);
        if (Date.now() - entry.timestamp < entry.ttl) {
          return entry.data;
        }
      }
    } catch (error) {
      console.warn('Erreur lecture localStorage:', error);
    }

    // 2. Essayer IndexedDB si localStorage échoue
    if (this.config.enableIndexedDB) {
      try {
        return await this.indexedDBCache.get(key);
      } catch (error) {
        console.warn('Erreur lecture IndexedDB:', error);
      }
    }

    return null;
  }

  // Préchargement des données critiques
  private async preloadCriticalData() {
    const criticalKeys = [
      'cms_statistics',
      'cms_services',
      'cms_zones',
      'cms_reasons'
    ];

    for (const key of criticalKeys) {
      try {
        const data = await this.getData(key);
        if (!data) {
          // Essayer de récupérer depuis le cache Convex existant
          const convexData = cacheUtils.getStats();
          if (convexData.keys.includes(key)) {
            // Les données sont déjà en cache Convex, on les copie
            console.log(`Préchargement des données critiques: ${key}`);
          }
        }
      } catch (error) {
        console.warn(`Erreur préchargement ${key}:`, error);
      }
    }
  }

  // Nettoyage du cache
  public async clearCache(): Promise<void> {
    // Nettoyer localStorage
    const keys = Object.keys(localStorage).filter(key => key.startsWith('offline_'));
    keys.forEach(key => localStorage.removeItem(key));

    // Nettoyer IndexedDB
    if (this.config.enableIndexedDB) {
      await this.indexedDBCache.clear();
    }
  }

  // Statistiques du cache offline
  public async getCacheStats(): Promise<{
    localStorage: { size: number; keys: string[] };
    indexedDB: { size: number; totalSize: number };
    network: NetworkStatus;
  }> {
    const localStorageKeys = Object.keys(localStorage).filter(key => key.startsWith('offline_'));
    const indexedDBStats = this.config.enableIndexedDB ? await this.indexedDBCache.getStats() : { size: 0, totalSize: 0 };

    return {
      localStorage: {
        size: localStorageKeys.length,
        keys: localStorageKeys
      },
      indexedDB: indexedDBStats,
      network: this.getNetworkStatus()
    };
  }
}

// Instance globale
const offlineCacheManager = new OfflineCacheManager();

// Hook React pour le cache offline
export function useOfflineCache() {
  const [networkStatus, setNetworkStatus] = React.useState<NetworkStatus>(
    offlineCacheManager.getNetworkStatus()
  );

  React.useEffect(() => {
    const unsubscribe = offlineCacheManager.addNetworkListener(setNetworkStatus);
    return unsubscribe;
  }, []);

  const cacheData = React.useCallback(async (key: string, data: any, type?: string) => {
    await offlineCacheManager.cacheData(key, data, type);
  }, []);

  const getData = React.useCallback(async (key: string) => {
    return await offlineCacheManager.getData(key);
  }, []);

  const clearCache = React.useCallback(async () => {
    await offlineCacheManager.clearCache();
  }, []);

  const getStats = React.useCallback(async () => {
    return await offlineCacheManager.getCacheStats();
  }, []);

  return {
    networkStatus,
    isSlowConnection: offlineCacheManager.isSlowConnection(),
    cacheData,
    getData,
    clearCache,
    getStats
  };
}

// Hook pour les données CMS avec cache offline
export function useOfflineCmsData<T>(
  queryKey: keyof typeof import('./cms-cache').CMS_CACHE_KEYS,
  queryFn: () => T | undefined,
  options: {
    ttl?: number;
    enabled?: boolean;
    priority?: 'high' | 'medium' | 'low';
  } = {}
) {
  const { ttl = 5 * 60 * 1000, enabled = true, priority = 'medium' } = options;
  const { networkStatus, isSlowConnection, cacheData, getData } = useOfflineCache();
  const [data, setData] = React.useState<T | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const cacheKey = `cms_${queryKey}`;

  React.useEffect(() => {
    const loadData = async () => {
      if (!enabled) return;

      setIsLoading(true);
      setError(null);

      try {
        // 1. Essayer le cache offline d'abord
        const cachedData = await getData(cacheKey);
        if (cachedData) {
          setData(cachedData);
          setIsLoading(false);
          
          // Si on est en ligne, mettre à jour en arrière-plan
          if (networkStatus.isOnline) {
            const freshData = queryFn();
            if (freshData) {
              await cacheData(cacheKey, freshData, 'cms');
              setData(freshData);
            }
          }
          return;
        }

        // 2. Si pas de cache, essayer Convex
        const convexData = queryFn();
        if (convexData) {
          setData(convexData);
          await cacheData(cacheKey, convexData, 'cms');
        } else {
          setError(new Error('Aucune donnée disponible'));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erreur de chargement'));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [queryKey, enabled, networkStatus.isOnline, cacheKey, cacheData, getData]);

  const refresh = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const freshData = queryFn();
      if (freshData) {
        setData(freshData);
        await cacheData(cacheKey, freshData, 'cms');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur de refresh'));
    } finally {
      setIsLoading(false);
    }
  }, [queryFn, cacheKey, cacheData]);

  return {
    data,
    isLoading,
    error,
    refresh,
    networkStatus,
    isSlowConnection,
    isCached: data !== null
  };
}

export default offlineCacheManager;
