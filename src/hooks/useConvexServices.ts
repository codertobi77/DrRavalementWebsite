import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

// Interface pour les services
export interface Service {
  _id: string;
  title: string;
  description: string;
  objective?: string;
  detailedDescription?: string;
  image: string;
  features: string[];
  benefits?: string[];
  process?: string[];
  materials?: string[];
  duration?: string;
  price?: string;
  order_index: number;
  is_active: boolean;
}

export function useConvexServices() {
  const services = useQuery(api.cms.getServices) || [];
  
  // Filtrer seulement les services actifs et les trier par order_index
  const activeServices = services
    .filter((service: Service) => service.is_active)
    .sort((a: Service, b: Service) => a.order_index - b.order_index);

  return {
    services: activeServices,
    isLoading: services === undefined,
    error: null
  };
}
