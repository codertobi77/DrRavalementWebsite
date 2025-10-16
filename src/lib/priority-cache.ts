/**
 * Système de cache avec priorité absolue pour le cache
 * Garantit que les données en cache sont affichées instantanément
 */

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

// Types pour le cache prioritaire
export interface PriorityCacheEntry<T> {
  data: T;
  timestamp: number;
  version: string;
  ttl: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

// Gestionnaire de cache prioritaire
class PriorityCacheManager {
  private cache = new Map<string, PriorityCacheEntry<any>>();
  private config = {
    criticalTTL: 24 * 60 * 60 * 1000, // 24h
    highTTL: 12 * 60 * 60 * 1000,     // 12h
    mediumTTL: 6 * 60 * 60 * 1000,    // 6h
    lowTTL: 2 * 60 * 60 * 1000        // 2h
  };

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('priority_cache');
      if (stored) {
        const data = JSON.parse(stored);
        Object.entries(data).forEach(([key, entry]: [string, any]) => {
          if (this.isValidEntry(entry)) {
            this.cache.set(key, entry);
          }
        });
      }
    } catch (error) {
      console.warn('Erreur chargement cache prioritaire:', error);
    }
  }

  private saveToStorage() {
    try {
      const data = Object.fromEntries(this.cache);
      localStorage.setItem('priority_cache', JSON.stringify(data));
    } catch (error) {
      console.warn('Erreur sauvegarde cache prioritaire:', error);
    }
  }

  private isValidEntry(entry: any): boolean {
    if (!entry || !entry.data || !entry.timestamp || !entry.ttl) return false;
    return Date.now() - entry.timestamp < entry.ttl;
  }

  private getTTL(priority: string): number {
    switch (priority) {
      case 'critical': return this.config.criticalTTL;
      case 'high': return this.config.highTTL;
      case 'medium': return this.config.mediumTTL;
      case 'low': return this.config.lowTTL;
      default: return this.config.mediumTTL;
    }
  }

  // Obtenir des données - CACHE EN PRIORITÉ ABSOLUE
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry || !this.isValidEntry(entry)) {
      this.cache.delete(key);
      this.saveToStorage();
      return null;
    }
    return entry.data;
  }

  // Sauvegarder des données
  set<T>(key: string, data: T, priority: string = 'medium'): void {
    const entry: PriorityCacheEntry<T> = {
      data,
      timestamp: Date.now(),
      version: '1.0.0',
      ttl: this.getTTL(priority),
      priority: priority as any
    };

    this.cache.set(key, entry);
    this.saveToStorage();
  }

  // Vérifier si une clé existe et est valide
  has(key: string): boolean {
    const entry = this.cache.get(key);
    return entry ? this.isValidEntry(entry) : false;
  }

  // Nettoyer le cache
  clear(): void {
    this.cache.clear();
    localStorage.removeItem('priority_cache');
  }

  // Obtenir les statistiques
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        priority: entry.priority,
        age: Date.now() - entry.timestamp,
        ttl: entry.ttl
      }))
    };
  }
}

// Instance globale
const priorityCache = new PriorityCacheManager();

// Hook pour le cache prioritaire
export function usePriorityCache() {
  const [stats, setStats] = useState(priorityCache.getStats());

  const get = useCallback(<T>(key: string): T | null => {
    return priorityCache.get<T>(key);
  }, []);

  const set = useCallback(<T>(key: string, data: T, priority: string = 'medium'): void => {
    priorityCache.set(key, data, priority);
    setStats(priorityCache.getStats());
  }, []);

  const has = useCallback((key: string): boolean => {
    return priorityCache.has(key);
  }, []);

  const clear = useCallback(() => {
    priorityCache.clear();
    setStats(priorityCache.getStats());
  }, []);

  return { get, set, has, clear, stats };
}

// Hook pour les données CMS avec priorité absolue au cache
export function usePriorityCmsData<T>(
  cacheKey: string,
  queryFn: () => T | undefined,
  fallbackData: T,
  priority: 'critical' | 'high' | 'medium' | 'low' = 'medium'
) {
  const { get, set, has } = usePriorityCache();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Commencer par true
  const [error, setError] = useState<Error | null>(null);

  // Charger les données avec priorité absolue au cache
  useEffect(() => {
    const loadData = () => {
      // 1. PRIORITÉ ABSOLUE: Cache - AFFICHER IMMÉDIATEMENT
      const cached = get<T>(cacheKey);
      if (cached) {
        setData(cached);
        setIsLoading(false); // ARRÊTER LE CHARGEMENT IMMÉDIATEMENT
        return;
      }

      // 2. Essayer Convex
      const convexData = queryFn();
      if (convexData) {
        setData(convexData);
        set(cacheKey, convexData, priority);
        setIsLoading(false);
        return;
      }

      // 3. Utiliser fallback IMMÉDIATEMENT
      if (fallbackData) {
        setData(fallbackData);
        set(cacheKey, fallbackData, priority);
        setIsLoading(false);
        return;
      }

      // 4. Seulement si rien n'est disponible
      setIsLoading(true);
    };

    loadData();
  }, [cacheKey, priority, get, set, queryFn, fallbackData]);

  // Mise à jour en arrière-plan si Convex a de nouvelles données
  useEffect(() => {
    if (!has(cacheKey)) return;

    const convexData = queryFn();
    if (convexData) {
      // Mettre à jour en arrière-plan sans bloquer l'affichage
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
          set(cacheKey, convexData, priority);
        });
      } else {
        setTimeout(() => {
          set(cacheKey, convexData, priority);
        }, 0);
      }
    }
  }, [cacheKey, priority, set, has, queryFn]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setError(null);

    try {
      const freshData = queryFn();
      if (freshData) {
        setData(freshData);
        set(cacheKey, freshData, priority);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur de refresh'));
    } finally {
      setIsLoading(false);
    }
  }, [cacheKey, priority, queryFn, set]);

  return {
    data: data || fallbackData,
    isLoading: data === null && !fallbackData, // Ne pas attendre Convex si on a du cache ou fallback
    error,
    refresh,
    isCached: has(cacheKey)
  };
}

// Hook spécialisé pour les configurations (retournent directement la valeur, pas un tableau)
export function usePriorityConfigData<T>(
  cacheKey: string,
  queryFn: () => T | undefined,
  fallbackData: T,
  priority: 'critical' | 'high' | 'medium' | 'low' = 'medium'
) {
  const { get, set, has } = usePriorityCache();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Commencer par true
  const [error, setError] = useState<Error | null>(null);

  // Charger les données avec priorité absolue au cache
  useEffect(() => {
    const loadData = () => {
      // 1. PRIORITÉ ABSOLUE: Cache - AFFICHER IMMÉDIATEMENT
      const cached = get<T>(cacheKey);
      if (cached) {
        setData(cached);
        setIsLoading(false); // ARRÊTER LE CHARGEMENT IMMÉDIATEMENT
        return;
      }

      // 2. Essayer Convex
      const convexData = queryFn();
      if (convexData) {
        setData(convexData);
        set(cacheKey, convexData, priority);
        setIsLoading(false);
        return;
      }

      // 3. Utiliser fallback IMMÉDIATEMENT
      if (fallbackData) {
        setData(fallbackData);
        set(cacheKey, fallbackData, priority);
        setIsLoading(false);
        return;
      }

      // 4. Seulement si rien n'est disponible
      setIsLoading(true);
    };

    loadData();
  }, [cacheKey, priority, get, set, queryFn, fallbackData]);

  // Mise à jour en arrière-plan si Convex a de nouvelles données
  useEffect(() => {
    if (!has(cacheKey)) return;

    const convexData = queryFn();
    if (convexData) {
      // Mettre à jour en arrière-plan sans bloquer l'affichage
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
          set(cacheKey, convexData, priority);
        });
      } else {
        setTimeout(() => {
          set(cacheKey, convexData, priority);
        }, 0);
      }
    }
  }, [cacheKey, priority, set, has, queryFn]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setError(null);

    try {
      const freshData = queryFn();
      if (freshData) {
        setData(freshData);
        set(cacheKey, freshData, priority);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur de refresh'));
    } finally {
      setIsLoading(false);
    }
  }, [cacheKey, priority, queryFn, set]);

  return {
    data: data || fallbackData,
    isLoading: data === null && !fallbackData, // Ne pas attendre Convex si on a du cache ou fallback
    error,
    refresh,
    isCached: has(cacheKey)
  };
}

// Hooks spécialisés avec fallbacks par défaut
export function usePriorityStatistics() {
  const convexData = useQuery(api.cms.getStatistics);
  const fallbackData = [
    { _id: '1', key: 'projects', value: '150+', label: 'Projets réalisés' },
    { _id: '2', key: 'clients', value: '200+', label: 'Clients satisfaits' },
    { _id: '3', key: 'experience', value: '10+', label: 'Années d\'expérience' },
    { _id: '4', key: 'zones', value: '15+', label: 'Zones couvertes' }
  ];
  
  return usePriorityCmsData('priority_stats', () => convexData, fallbackData, 'critical');
}

export function usePriorityServices() {
  const convexData = useQuery(api.cms.getServices);
  const fallbackData = [
    {
      _id: '1',
      title: 'Ravalement de façade',
      description: 'Rénovation complète de votre façade avec les meilleures techniques',
      image: '/images/services/ravalement.jpg',
      features: ['Nettoyage haute pression', 'Réparation des fissures', 'Peinture résistante'],
      is_active: true,
      order_index: 1
    },
    {
      _id: '2',
      title: 'Isolation thermique',
      description: 'Amélioration de l\'isolation de votre bâtiment',
      image: '/images/services/isolation.jpg',
      features: ['Isolation extérieure', 'Réduction des coûts', 'Confort amélioré'],
      is_active: true,
      order_index: 2
    }
  ];
  
  return usePriorityCmsData('priority_services', () => convexData, fallbackData, 'critical');
}

export function usePriorityZones() {
  const convexData = useQuery(api.cms.getZones);
  const fallbackData = [
    { _id: '1', name: 'Paris', is_active: true },
    { _id: '2', name: 'Lyon', is_active: true },
    { _id: '3', name: 'Marseille', is_active: true },
    { _id: '4', name: 'Toulouse', is_active: true }
  ];
  
  return usePriorityCmsData('priority_zones', () => convexData, fallbackData, 'high');
}

export function usePriorityReasons() {
  const convexData = useQuery(api.cms.getReasons);
  const fallbackData = [
    {
      _id: '1',
      title: 'Qualité garantie',
      description: 'Travaux de haute qualité avec garantie',
      icon: 'ri-award-line',
      is_active: true,
      order_index: 1
    },
    {
      _id: '2',
      title: 'Respect des délais',
      description: 'Livraison dans les temps convenus',
      icon: 'ri-time-line',
      is_active: true,
      order_index: 2
    },
    {
      _id: '3',
      title: 'Service client',
      description: 'Support et suivi personnalisé',
      icon: 'ri-customer-service-line',
      is_active: true,
      order_index: 3
    }
  ];
  
  return usePriorityCmsData('priority_reasons', () => convexData, fallbackData, 'high');
}

export function usePriorityTestimonials() {
  const convexData = useQuery(api.cms.getTestimonials);
  const fallbackData = [
    {
      _id: '1',
      text: 'Excellent travail, très satisfait du résultat. L\'équipe est professionnelle et à l\'écoute.',
      author: 'Marie Dubois',
      role: 'Propriétaire',
      project: 'Ravalement façade',
      image: '/images/testimonials/default.jpg',
      is_active: true,
      order_index: 1
    },
    {
      _id: '2',
      text: 'Service impeccable, délais respectés et qualité au rendez-vous. Je recommande vivement.',
      author: 'Jean Martin',
      role: 'Gérant',
      project: 'Isolation thermique',
      image: '/images/testimonials/default.jpg',
      is_active: true,
      order_index: 2
    }
  ];
  
  return usePriorityCmsData('priority_testimonials', () => convexData, fallbackData, 'medium');
}

export function usePriorityPortfolioProjects() {
  const convexData = useQuery(api.cms.getPortfolioProjects);
  const fallbackData = [
    {
      _id: '1',
      title: 'Ravalement moderne',
      description: 'Transformation complète d\'une façade ancienne',
      before_image: '/images/projects/before.jpg',
      after_image: '/images/projects/after.jpg',
      category: 'Ravalement',
      is_active: true,
      order_index: 1
    },
    {
      _id: '2',
      title: 'Isolation thermique',
      description: 'Amélioration de l\'isolation d\'un bâtiment',
      before_image: '/images/projects/before2.jpg',
      after_image: '/images/projects/after2.jpg',
      category: 'Isolation',
      is_active: true,
      order_index: 2
    }
  ];
  
  return usePriorityCmsData('priority_projects', () => convexData, fallbackData, 'medium');
}

// Hooks pour les configurations du site avec cache prioritaire
export function usePrioritySiteConfig() {
  const convexData = useQuery(api.siteConfig.getPublicConfigs);
  const fallbackData = [
    {
      _id: '1' as any,
      _creationTime: Date.now(),
      key: 'booking_config',
      value: {
        maxAdvanceDays: 30,
        workingDays: { start: 1, end: 5 },
        timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
        services: [
          { id: '1', name: 'Ravalement', duration: 120, description: 'Rénovation complète de façade' },
          { id: '2', name: 'Isolation', duration: 180, description: 'Isolation thermique extérieure' }
        ]
      },
      category: 'booking',
      is_public: true
    },
    {
      _id: '2' as any,
      _creationTime: Date.now(),
      key: 'contact_config',
      value: {
        email: 'contact@dr-ravalement.fr',
        phone: '+33 1 23 45 67 89',
        address: '123 Rue de la Rénovation, 75001 Paris',
        hours: 'Lun-Ven: 8h-18h, Sam: 9h-17h'
      },
      category: 'contact',
      is_public: true
    },
    {
      _id: '3' as any,
      _creationTime: Date.now(),
      key: 'appearance_config',
      value: {
        siteName: 'Dr Ravalement',
        tagline: 'Spécialiste de la rénovation de façade',
        primaryColor: '#2563eb',
        secondaryColor: '#f59e0b',
        logo: '/images/logo.png'
      },
      category: 'appearance',
      is_public: true
    }
  ];
  
  return usePriorityCmsData('priority_site_config', () => convexData, fallbackData, 'critical');
}

export function usePriorityBookingConfig() {
  const convexData = useQuery(api.siteConfig.getConfigByKey, { key: 'booking_config' });
  const fallbackData = {
    maxAdvanceDays: 30,
    workingDays: { start: 1, end: 5 },
    timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    services: [
      { id: '1', name: 'Ravalement', duration: 120, description: 'Rénovation complète de façade' },
      { id: '2', name: 'Isolation', duration: 180, description: 'Isolation thermique extérieure' }
    ]
  };
  
  // Hook spécialisé pour les configurations (retournent directement la valeur)
  return usePriorityConfigData('priority_booking_config', () => convexData, fallbackData, 'critical');
}

export function usePriorityContactConfig() {
  const convexData = useQuery(api.siteConfig.getConfigByKey, { key: 'contact_config' });
  const fallbackData = {
    email: 'contact@dr-ravalement.fr',
    phone: '+33 1 23 45 67 89',
    address: '123 Rue de la Rénovation, 75001 Paris',
    hours: 'Lun-Ven: 8h-18h, Sam: 9h-17h'
  };
  
  return usePriorityConfigData('priority_contact_config', () => convexData, fallbackData, 'critical');
}

export function usePriorityEmailConfig() {
  const convexData = useQuery(api.siteConfig.getConfigByKey, { key: 'email_config' });
  const fallbackData = {
    fromEmail: 'noreply@dr-ravalement.fr',
    fromName: 'Dr Ravalement',
    replyTo: 'contact@dr-ravalement.fr'
  };
  
  return usePriorityConfigData('priority_email_config', () => convexData, fallbackData, 'high');
}

export function usePriorityAppearanceConfig() {
  const convexData = useQuery(api.siteConfig.getConfigByKey, { key: 'appearance_config' });
  const fallbackData = {
    siteName: 'Dr Ravalement',
    tagline: 'Spécialiste de la rénovation de façade',
    primaryColor: '#2563eb',
    secondaryColor: '#f59e0b',
    logo: '/images/logo.png'
  };
  
  return usePriorityConfigData('priority_appearance_config', () => convexData, fallbackData, 'critical');
}

export function usePriorityLegalConfig() {
  const convexData = useQuery(api.siteConfig.getConfigByKey, { key: 'legal_config' });
  const fallbackData = {
    companyName: 'Dr Ravalement',
    siret: '12345678901234',
    tva: 'FR12345678901',
    address: '123 Rue de la Rénovation, 75001 Paris',
    phone: '+33 1 23 45 67 89',
    email: 'contact@dr-ravalement.fr',
    cgv: 'Conditions générales de vente disponibles sur demande',
    mentions: 'Mentions légales conformes au RGPD',
    cookies: 'Ce site utilise des cookies pour améliorer votre expérience'
  };
  
  return usePriorityConfigData('priority_legal_config', () => convexData, fallbackData, 'high');
}

export function usePrioritySeoConfig() {
  const convexData = useQuery(api.siteConfig.getConfigByKey, { key: 'seo_config' });
  const fallbackData = {
    title: 'Dr Ravalement - Spécialiste rénovation façade',
    description: 'Expert en ravalement de façade, isolation thermique et rénovation. Devis gratuit, qualité garantie.',
    keywords: 'ravalement, façade, isolation, rénovation, peinture, Paris',
    ogImage: '/images/og-image.jpg',
    twitterCard: 'summary_large_image',
    canonical: 'https://dr-ravalement.fr'
  };
  
  return usePriorityConfigData('priority_seo_config', () => convexData, fallbackData, 'high');
}

// Hook spécialisé pour les informations de l'entreprise (companyInfo)
export function usePriorityCompanyInfo() {
  const convexData = useQuery(api.siteConfig.getConfigByKey, { key: 'contact_config' });
  const fallbackData = {
    companyName: 'DR RAVALEMENT',
    legalForm: 'SARL',
    creationDate: '2008-01-01',
    siren: '123456789',
    apeCode: '4332A',
    vatNumber: 'FR12345678901',
    fullAddress: '123 Rue de la Rénovation, 75001 Paris, France',
    city: 'Paris',
    country: 'France',
    description: 'Expert en ravalement de façades, maçonnerie générale et couverture en Seine-et-Marne et Île-de-France',
    url: 'https://dr-ravalement.fr',
    logo: '/images/logo-dr-ravalement.png',
    telephone: '+33 1 39 58 90 15',
    email: 'contact@dr-ravalement.fr',
    areaServed: ['Seine-et-Marne', 'Île-de-France', 'Paris'],
    serviceType: [
      'Ravalement de façades',
      'Maçonnerie générale', 
      'Couverture',
      'Isolation thermique',
      'Rénovation extérieure'
    ],
    sameAs: [
      'https://www.facebook.com/dr-ravalement',
      'https://www.linkedin.com/company/dr-ravalement',
      'https://www.instagram.com/dr_ravalement'
    ]
  };
  
  return usePriorityConfigData('priority_company_info', () => convexData, fallbackData, 'critical');
}

export default priorityCache;
