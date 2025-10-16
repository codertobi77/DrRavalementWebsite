/**
 * Composant des services du footer avec cache prioritaire
 * Version optimisée de FooterServicesSection
 */

import React from 'react';
import { usePriorityServices } from '../../lib/priority-cache';

export default function PriorityFooterServicesSection() {
  const services = usePriorityServices();

  if (services.isLoading && !services.data) {
    return (
      <div>
        <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Nos Services</h4>
        <ul className="space-y-2 sm:space-y-3">
          {[...Array(6)].map((_, index) => (
            <li key={index}>
              <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (services.error) {
    console.warn('Erreur lors du chargement des services:', services.error);
  }

  if (!services.data || services.data.length === 0) {
    return (
      <div>
        <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Nos Services</h4>
        <ul className="space-y-2 sm:space-y-3">
          <li className="text-gray-300 text-xs sm:text-sm">Aucun service disponible</li>
        </ul>
      </div>
    );
  }

  // Limiter à 6 services pour le footer
  const displayServices = services.data.slice(0, 6);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h4 className="text-base sm:text-lg font-semibold">Nos Services</h4>
        {services.isCached && (
          <span className="text-green-400 text-xs">✅ Cache</span>
        )}
      </div>
      <ul className="space-y-2 sm:space-y-3">
        {displayServices.map((service) => (
          <li key={service._id}>
            <a 
              href="/services" 
              className="text-gray-300 hover:text-orange-400 transition-colors text-xs sm:text-sm block"
              title={service.description}
            >
              {service.title}
            </a>
          </li>
        ))}
        {services.data.length > 6 && (
          <li>
            <a 
              href="/services" 
              className="text-orange-400 hover:text-orange-300 transition-colors text-xs sm:text-sm font-medium"
            >
              Voir tous les services →
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
