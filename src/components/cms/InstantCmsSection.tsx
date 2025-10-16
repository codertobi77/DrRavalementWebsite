/**
 * Composant CMS avec chargement instantané
 * Affiche immédiatement les données en cache ou les fallbacks
 */

import React, { useState, useEffect } from 'react';
import { 
  useInstantStatistics, 
  useInstantServices, 
  useInstantZones, 
  useInstantReasons,
  useInstantTestimonials,
  useInstantPortfolioProjects,
  usePreloadCriticalData
} from '../../lib/instant-cache';
import { NetworkStatusIndicator } from '../network/NetworkStatusIndicator';

interface InstantCmsSectionProps {
  children: React.ReactNode;
  showNetworkStatus?: boolean;
  enablePreload?: boolean;
  className?: string;
}

export default function InstantCmsSection({
  children,
  showNetworkStatus = true,
  enablePreload = true,
  className = ''
}: InstantCmsSectionProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  // Précharger les données critiques si activé
  usePreloadCriticalData();

  // Initialiser immédiatement
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  if (!isInitialized) {
    return (
      <div className={className}>
        {showNetworkStatus && <NetworkStatusIndicator showDetails={true} />}
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Initialisation...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {showNetworkStatus && <NetworkStatusIndicator showDetails={true} />}
      {children}
    </div>
  );
}

// Composant de test pour vérifier le chargement instantané
export function InstantCmsTest() {
  const stats = useInstantStatistics();
  const services = useInstantServices();
  const zones = useInstantZones();
  const reasons = useInstantReasons();
  const testimonials = useInstantTestimonials();
  const projects = useInstantPortfolioProjects();

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Test de Chargement Instantané</h1>
      
      {/* Statistiques */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.data?.map((stat: any) => (
            <div key={stat._id} className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {stats.isCached ? '✅ Données en cache' : '⏳ Chargement...'}
        </div>
      </div>

      {/* Services */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.data?.map((service: any) => (
            <div key={service._id} className="border rounded-lg p-4">
              <h3 className="font-semibold">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {services.isCached ? '✅ Données en cache' : '⏳ Chargement...'}
        </div>
      </div>

      {/* Zones */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Zones</h2>
        <div className="flex flex-wrap gap-2">
          {zones.data?.map((zone: any) => (
            <span key={zone._id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {zone.name}
            </span>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {zones.isCached ? '✅ Données en cache' : '⏳ Chargement...'}
        </div>
      </div>

      {/* Raisons */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Pourquoi nous choisir</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reasons.data?.map((reason: any) => (
            <div key={reason._id} className="text-center">
              <i className={`${reason.icon} text-3xl text-blue-600 mb-2`}></i>
              <h3 className="font-semibold">{reason.title}</h3>
              <p className="text-gray-600 text-sm">{reason.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {reasons.isCached ? '✅ Données en cache' : '⏳ Chargement...'}
        </div>
      </div>

      {/* Témoignages */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Témoignages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.data?.map((testimonial: any) => (
            <div key={testimonial._id} className="border rounded-lg p-4">
              <p className="text-gray-700 mb-2">"{testimonial.text}"</p>
              <div className="text-sm text-gray-600">
                <strong>{testimonial.author}</strong> - {testimonial.role}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {testimonials.isCached ? '✅ Données en cache' : '⏳ Chargement...'}
        </div>
      </div>

      {/* Projets */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Projets</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.data?.map((project: any) => (
            <div key={project._id} className="border rounded-lg overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Image du projet</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{project.title}</h3>
                <p className="text-gray-600 text-sm">{project.description}</p>
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mt-2">
                  {project.category}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {projects.isCached ? '✅ Données en cache' : '⏳ Chargement...'}
        </div>
      </div>
    </div>
  );
}

// Hook pour utiliser les données instantanées dans d'autres composants
export function useInstantCmsData() {
  const stats = useInstantStatistics();
  const services = useInstantServices();
  const zones = useInstantZones();
  const reasons = useInstantReasons();
  const testimonials = useInstantTestimonials();
  const projects = useInstantPortfolioProjects();

  return {
    statistics: stats,
    services: services,
    zones: zones,
    reasons: reasons,
    testimonials: testimonials,
    projects: projects,
    allLoaded: [stats, services, zones, reasons, testimonials, projects].every(
      data => data.data && data.data.length > 0
    ),
    allCached: [stats, services, zones, reasons, testimonials, projects].every(
      data => data.isCached
    )
  };
}

