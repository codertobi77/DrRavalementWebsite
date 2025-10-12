import { useState, useEffect } from 'react';
import { ConvexHttpClient } from 'convex/browser';

// Interface pour les services
interface Service {
  _id: string;
  title: string;
  description: string;
  objective?: string;
  image: string;
  features: string[];
  order_index: number;
  is_active: boolean;
}

// Services par défaut
const DEFAULT_SERVICES: Service[] = [
  { 
    _id: "1", 
    title: "Ravalement de Façades", 
    description: "Ravalement complet de façades",
    image: "",
    features: [],
    order_index: 1,
    is_active: true
  },
  { 
    _id: "2", 
    title: "Projection Machine", 
    description: "Enduit par projection",
    image: "",
    features: [],
    order_index: 2,
    is_active: true
  },
  { 
    _id: "3", 
    title: "Maçonnerie Générale", 
    description: "Travaux de maçonnerie",
    image: "",
    features: [],
    order_index: 3,
    is_active: true
  },
  { 
    _id: "4", 
    title: "Couverture", 
    description: "Travaux de couverture",
    image: "",
    features: [],
    order_index: 4,
    is_active: true
  },
  { 
    _id: "5", 
    title: "Clôtures Parpaing", 
    description: "Construction de clôtures",
    image: "",
    features: [],
    order_index: 5,
    is_active: true
  },
  { 
    _id: "6", 
    title: "Isolation Thermique", 
    description: "Isolation des bâtiments",
    image: "",
    features: [],
    order_index: 6,
    is_active: true
  }
];

export function useServices() {
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Vérifier si l'URL Convex est configurée
        const convexUrl = import.meta.env.VITE_CONVEX_URL;
        if (!convexUrl || convexUrl.includes('your-convex-deployment')) {
          console.log('Convex URL non configurée, utilisation des services par défaut');
          return;
        }

        // Créer le client Convex
        const client = new ConvexHttpClient(convexUrl);

        // Appeler directement la fonction Convex
        const convexServices = await client.query('cms:getServices', {});
        
        if (convexServices && Array.isArray(convexServices) && convexServices.length > 0) {
          // Filtrer seulement les services actifs et les trier par order_index
          const activeServices = convexServices
            .filter((service: any) => service.is_active)
            .sort((a: any, b: any) => a.order_index - b.order_index);
          
          setServices(activeServices);
          console.log('Services chargés depuis Convex:', activeServices.length);
        } else {
          console.log('Aucun service trouvé dans Convex, utilisation des services par défaut');
        }
      } catch (err) {
        console.error('Erreur lors du chargement des services depuis Convex:', err);
        setError('Erreur de chargement des services');
        // En cas d'erreur, on garde les services par défaut
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, []);

  return {
    services,
    isLoading,
    error,
    refetch: () => {
      const loadServices = async () => {
        try {
          setIsLoading(true);
          setError(null);

          const convexUrl = import.meta.env.VITE_CONVEX_URL;
          if (!convexUrl || convexUrl.includes('your-convex-deployment')) {
            return;
          }

          const client = new ConvexHttpClient(convexUrl);
          const convexServices = await client.query('cms:getServices', {});
          
          if (convexServices && Array.isArray(convexServices) && convexServices.length > 0) {
            const activeServices = convexServices
              .filter((service: any) => service.is_active)
              .sort((a: any, b: any) => a.order_index - b.order_index);
            
            setServices(activeServices);
          }
        } catch (err) {
          console.error('Erreur lors du rechargement des services:', err);
          setError('Erreur de rechargement des services');
        } finally {
          setIsLoading(false);
        }
      };
      loadServices();
    }
  };
}
