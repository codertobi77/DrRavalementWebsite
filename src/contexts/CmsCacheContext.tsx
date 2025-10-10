/**
 * Contexte de cache global pour les données CMS
 * Fournit un état global et des fonctions de gestion du cache
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { cacheUtils, useCacheRefreshListener } from '../lib/cms-cache';

// Types pour le contexte
interface CmsCacheState {
  isRefreshing: boolean;
  lastRefresh: number | null;
  cacheStats: {
    size: number;
    keys: string[];
  };
  errors: Record<string, string>;
}

type CmsCacheAction =
  | { type: 'SET_REFRESHING'; payload: boolean }
  | { type: 'SET_LAST_REFRESH'; payload: number }
  | { type: 'UPDATE_CACHE_STATS'; payload: { size: number; keys: string[] } }
  | { type: 'SET_ERROR'; payload: { key: string; error: string } }
  | { type: 'CLEAR_ERROR'; payload: string }
  | { type: 'CLEAR_ALL_ERRORS' };

interface CmsCacheContextType {
  state: CmsCacheState;
  refreshAll: () => void;
  invalidate: (queryKey: keyof typeof import('../lib/cms-cache').CMS_CACHE_KEYS) => void;
  invalidateMultiple: (queryKeys: (keyof typeof import('../lib/cms-cache').CMS_CACHE_KEYS)[]) => void;
  clearAll: () => void;
  getCacheStats: () => { size: number; keys: string[] };
  setError: (key: string, error: string) => void;
  clearError: (key: string) => void;
  clearAllErrors: () => void;
}

// État initial
const initialState: CmsCacheState = {
  isRefreshing: false,
  lastRefresh: null,
  cacheStats: { size: 0, keys: [] },
  errors: {}
};

// Reducer pour gérer l'état
function cmsCacheReducer(state: CmsCacheState, action: CmsCacheAction): CmsCacheState {
  switch (action.type) {
    case 'SET_REFRESHING':
      return { ...state, isRefreshing: action.payload };
    
    case 'SET_LAST_REFRESH':
      return { ...state, lastRefresh: action.payload };
    
    case 'UPDATE_CACHE_STATS':
      return { ...state, cacheStats: action.payload };
    
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.payload.key]: action.payload.error }
      };
    
    case 'CLEAR_ERROR':
      const newErrors = { ...state.errors };
      delete newErrors[action.payload];
      return { ...state, errors: newErrors };
    
    case 'CLEAR_ALL_ERRORS':
      return { ...state, errors: {} };
    
    default:
      return state;
  }
}

// Créer le contexte
const CmsCacheContext = createContext<CmsCacheContextType | undefined>(undefined);

// Provider du contexte
export function CmsCacheProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cmsCacheReducer, initialState);
  const refreshTrigger = useCacheRefreshListener();

  // Mettre à jour les statistiques du cache
  const updateCacheStats = useCallback(() => {
    const stats = cacheUtils.getStats();
    dispatch({ type: 'UPDATE_CACHE_STATS', payload: stats });
  }, []);

  // Rafraîchir toutes les données
  const refreshAll = useCallback(() => {
    dispatch({ type: 'SET_REFRESHING', payload: true });
    dispatch({ type: 'CLEAR_ALL_ERRORS' });
    
    try {
      cacheUtils.refreshAll();
      dispatch({ type: 'SET_LAST_REFRESH', payload: Date.now() });
      updateCacheStats();
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { 
          key: 'refresh_all', 
          error: error instanceof Error ? error.message : 'Erreur lors du rafraîchissement' 
        } 
      });
    } finally {
      dispatch({ type: 'SET_REFRESHING', payload: false });
    }
  }, [updateCacheStats]);

  // Invalider un type de données
  const invalidate = useCallback((queryKey: keyof typeof import('../lib/cms-cache').CMS_CACHE_KEYS) => {
    try {
      cacheUtils.invalidate(queryKey);
      updateCacheStats();
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { 
          key: `invalidate_${queryKey}`, 
          error: error instanceof Error ? error.message : 'Erreur lors de l\'invalidation' 
        } 
      });
    }
  }, [updateCacheStats]);

  // Invalider plusieurs types de données
  const invalidateMultiple = useCallback((queryKeys: (keyof typeof import('../lib/cms-cache').CMS_CACHE_KEYS)[]) => {
    try {
      cacheUtils.invalidateMultiple(queryKeys);
      updateCacheStats();
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { 
          key: 'invalidate_multiple', 
          error: error instanceof Error ? error.message : 'Erreur lors de l\'invalidation multiple' 
        } 
      });
    }
  }, [updateCacheStats]);

  // Vider tout le cache
  const clearAll = useCallback(() => {
    try {
      cacheUtils.clearAll();
      dispatch({ type: 'CLEAR_ALL_ERRORS' });
      updateCacheStats();
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { 
          key: 'clear_all', 
          error: error instanceof Error ? error.message : 'Erreur lors du vidage du cache' 
        } 
      });
    }
  }, [updateCacheStats]);

  // Obtenir les statistiques du cache
  const getCacheStats = useCallback(() => {
    return cacheUtils.getStats();
  }, []);

  // Définir une erreur
  const setError = useCallback((key: string, error: string) => {
    dispatch({ type: 'SET_ERROR', payload: { key, error } });
  }, []);

  // Effacer une erreur
  const clearError = useCallback((key: string) => {
    dispatch({ type: 'CLEAR_ERROR', payload: key });
  }, []);

  // Effacer toutes les erreurs
  const clearAllErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_ERRORS' });
  }, []);

  // Mettre à jour les statistiques au montage et lors des changements
  useEffect(() => {
    updateCacheStats();
  }, [updateCacheStats, refreshTrigger]);

  // Mettre à jour les statistiques périodiquement
  useEffect(() => {
    const interval = setInterval(updateCacheStats, 30000); // Toutes les 30 secondes
    return () => clearInterval(interval);
  }, [updateCacheStats]);

  const contextValue: CmsCacheContextType = {
    state,
    refreshAll,
    invalidate,
    invalidateMultiple,
    clearAll,
    getCacheStats,
    setError,
    clearError,
    clearAllErrors
  };

  return (
    <CmsCacheContext.Provider value={contextValue}>
      {children}
    </CmsCacheContext.Provider>
  );
}

// Hook pour utiliser le contexte
export function useCmsCache() {
  const context = useContext(CmsCacheContext);
  if (context === undefined) {
    throw new Error('useCmsCache must be used within a CmsCacheProvider');
  }
  return context;
}

// Hook pour obtenir les statistiques du cache
export function useCacheStats() {
  const { state, getCacheStats } = useCmsCache();
  return {
    stats: state.cacheStats,
    isRefreshing: state.isRefreshing,
    lastRefresh: state.lastRefresh,
    refreshStats: getCacheStats
  };
}

// Hook pour gérer les erreurs de cache
export function useCacheErrors() {
  const { state, setError, clearError, clearAllErrors } = useCmsCache();
  return {
    errors: state.errors,
    setError,
    clearError,
    clearAllErrors,
    hasErrors: Object.keys(state.errors).length > 0
  };
}

export default CmsCacheContext;
