/**
 * Composant de chargement instantané pour remplacer les skeletons
 * Affiche immédiatement le contenu avec des données de fallback
 */

import React from 'react';
import { useInstantCmsData } from './InstantCmsSection';

interface InstantLoadingSectionProps {
  children: React.ReactNode;
  fallbackContent?: React.ReactNode;
  showLoadingIndicator?: boolean;
  className?: string;
}

export default function InstantLoadingSection({
  children,
  fallbackContent,
  showLoadingIndicator = false,
  className = ''
}: InstantLoadingSectionProps) {
  const { allLoaded, allCached } = useInstantCmsData();

  // Si tout est chargé, afficher le contenu normal
  if (allLoaded) {
    return <div className={className}>{children}</div>;
  }

  // Sinon, afficher le contenu de fallback ou un indicateur de chargement
  if (fallbackContent) {
    return <div className={className}>{fallbackContent}</div>;
  }

  return (
    <div className={className}>
      {showLoadingIndicator && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">
              {allCached ? 'Mise à jour des données...' : 'Chargement des données...'}
            </p>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

// Composant de fallback pour les statistiques
export function InstantStatisticsFallback() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto px-4">
      {[
        { value: '150+', label: 'Projets réalisés' },
        { value: '200+', label: 'Clients satisfaits' },
        { value: '10+', label: 'Années d\'expérience' },
        { value: '15+', label: 'Zones couvertes' }
      ].map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
            {stat.value}
          </div>
          <div className="text-orange-200 font-medium text-xs sm:text-sm lg:text-base">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

// Composant de fallback pour les services
export function InstantServicesFallback() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        {
          title: 'Ravalement de façade',
          description: 'Rénovation complète de votre façade avec les meilleures techniques',
          image: '/images/services/ravalement.jpg',
          features: ['Nettoyage haute pression', 'Réparation des fissures', 'Peinture résistante']
        },
        {
          title: 'Isolation thermique',
          description: 'Amélioration de l\'isolation de votre bâtiment',
          image: '/images/services/isolation.jpg',
          features: ['Isolation extérieure', 'Réduction des coûts', 'Confort amélioré']
        },
        {
          title: 'Rénovation complète',
          description: 'Transformation complète de votre bâtiment',
          image: '/images/services/renovation.jpg',
          features: ['Design moderne', 'Matériaux durables', 'Finitions soignées']
        }
      ].map((service, index) => (
        <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-xl">
          <div className="h-64 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <i className="ri-building-line text-6xl text-blue-400"></i>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <div className="space-y-2">
              {service.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-center text-sm text-gray-700">
                  <i className="ri-check-line text-green-500 mr-2"></i>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Composant de fallback pour les zones
export function InstantZonesFallback() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier'].map((zone, index) => (
        <div key={index} className="bg-white rounded-lg p-4 text-center shadow-md">
          <i className="ri-map-pin-line text-2xl text-blue-500 mb-2"></i>
          <span className="font-medium text-gray-800">{zone}</span>
        </div>
      ))}
    </div>
  );
}

// Composant de fallback pour les raisons
export function InstantReasonsFallback() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        {
          icon: 'ri-award-line',
          title: 'Qualité garantie',
          description: 'Travaux de haute qualité avec garantie'
        },
        {
          icon: 'ri-time-line',
          title: 'Respect des délais',
          description: 'Livraison dans les temps convenus'
        },
        {
          icon: 'ri-customer-service-line',
          title: 'Service client',
          description: 'Support et suivi personnalisé'
        }
      ].map((reason, index) => (
        <div key={index} className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className={`${reason.icon} text-2xl text-blue-600`}></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{reason.title}</h3>
          <p className="text-gray-600">{reason.description}</p>
        </div>
      ))}
    </div>
  );
}

// Composant de fallback pour les témoignages
export function InstantTestimonialsFallback() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        {
          text: 'Excellent travail, très satisfait du résultat. L\'équipe est professionnelle et à l\'écoute.',
          author: 'Marie Dubois',
          role: 'Propriétaire',
          project: 'Ravalement façade'
        },
        {
          text: 'Service impeccable, délais respectés et qualité au rendez-vous. Je recommande vivement.',
          author: 'Jean Martin',
          role: 'Gérant',
          project: 'Isolation thermique'
        },
        {
          text: 'Très bon rapport qualité-prix. L\'équipe a su nous conseiller et le résultat dépasse nos attentes.',
          author: 'Sophie Leroy',
          role: 'Directrice',
          project: 'Rénovation complète'
        }
      ].map((testimonial, index) => (
        <div key={index} className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <i className="ri-user-line text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">{testimonial.author}</h4>
              <p className="text-sm text-gray-600">{testimonial.role}</p>
            </div>
          </div>
          <p className="text-gray-700 mb-3">"{testimonial.text}"</p>
          <div className="text-sm text-blue-600 font-medium">{testimonial.project}</div>
        </div>
      ))}
    </div>
  );
}

// Hook pour utiliser les fallbacks
export function useInstantFallbacks() {
  return {
    statistics: <InstantStatisticsFallback />,
    services: <InstantServicesFallback />,
    zones: <InstantZonesFallback />,
    reasons: <InstantReasonsFallback />,
    testimonials: <InstantTestimonialsFallback />
  };
}

