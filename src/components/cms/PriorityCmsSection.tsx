/**
 * Composant CMS avec priorité absolue au cache
 * Garantit un affichage instantané des données en cache
 */

import React from 'react';
import { 
  usePriorityStatistics, 
  usePriorityServices, 
  usePriorityZones, 
  usePriorityReasons,
  usePriorityTestimonials,
  usePriorityPortfolioProjects,
  usePrioritySiteConfig,
  usePriorityBookingConfig,
  usePriorityContactConfig,
  usePriorityEmailConfig,
  usePriorityAppearanceConfig,
  usePriorityLegalConfig,
  usePrioritySeoConfig,
  usePriorityCompanyInfo
} from '../../lib/priority-cache';
import { NetworkStatusIndicator, NetworkStatusBar } from '../network/NetworkStatusIndicator';

interface PriorityCmsSectionProps {
  children: React.ReactNode;
  showNetworkStatus?: boolean;
  className?: string;
}

export default function PriorityCmsSection({
  children,
  showNetworkStatus = true,
  className = ''
}: PriorityCmsSectionProps) {
  return (
    <div className={className}>
      {showNetworkStatus && <NetworkStatusIndicator showDetails={true} />}
      {children}
    </div>
  );
}

// Composant de test pour vérifier le chargement prioritaire
export function PriorityCmsTest() {
  const stats = usePriorityStatistics();
  const services = usePriorityServices();
  const zones = usePriorityZones();
  const reasons = usePriorityReasons();
  const testimonials = usePriorityTestimonials();
  const projects = usePriorityPortfolioProjects();
  
  // Configurations du site
  const siteConfig = usePrioritySiteConfig();
  const bookingConfig = usePriorityBookingConfig();
  const contactConfig = usePriorityContactConfig();
  const emailConfig = usePriorityEmailConfig();
  const appearanceConfig = usePriorityAppearanceConfig();
  const legalConfig = usePriorityLegalConfig();
  const seoConfig = usePrioritySeoConfig();
  const companyInfo = usePriorityCompanyInfo();

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Test de Priorité Cache</h1>
      
      {/* Indicateur de performance */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2">
          <i className="ri-flashlight-line text-green-600 text-xl"></i>
          <span className="font-semibold text-green-800">Mode Cache Prioritaire Activé</span>
        </div>
        <p className="text-green-700 text-sm mt-1">
          Les données en cache sont affichées instantanément, sans attendre Convex.
        </p>
      </div>

      {/* Statistiques */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <i className="ri-bar-chart-line mr-2 text-blue-600"></i>
          Statistiques
          {stats.isCached && <span className="ml-2 text-green-600 text-sm">✅ Cache</span>}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.data?.map((stat: any) => (
            <div key={stat._id} className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {stats.isLoading ? '⏳ Chargement...' : '✅ Données disponibles'}
        </div>
      </div>

      {/* Services */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <i className="ri-tools-line mr-2 text-blue-600"></i>
          Services
          {services.isCached && <span className="ml-2 text-green-600 text-sm">✅ Cache</span>}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.data?.map((service: any) => (
            <div key={service._id} className="border rounded-lg p-4">
              <h3 className="font-semibold">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
              <div className="mt-2">
                {service.features?.map((feature: string, index: number) => (
                  <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {services.isLoading ? '⏳ Chargement...' : '✅ Données disponibles'}
        </div>
      </div>

      {/* Zones */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <i className="ri-map-pin-line mr-2 text-blue-600"></i>
          Zones d'intervention
          {zones.isCached && <span className="ml-2 text-green-600 text-sm">✅ Cache</span>}
        </h2>
        <div className="flex flex-wrap gap-2">
          {zones.data?.map((zone: any) => (
            <span key={zone._id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {zone.name}
            </span>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {zones.isLoading ? '⏳ Chargement...' : '✅ Données disponibles'}
        </div>
      </div>

      {/* Raisons */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <i className="ri-star-line mr-2 text-blue-600"></i>
          Pourquoi nous choisir
          {reasons.isCached && <span className="ml-2 text-green-600 text-sm">✅ Cache</span>}
        </h2>
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
          {reasons.isLoading ? '⏳ Chargement...' : '✅ Données disponibles'}
        </div>
      </div>

      {/* Témoignages */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <i className="ri-chat-quote-line mr-2 text-blue-600"></i>
          Témoignages clients
          {testimonials.isCached && <span className="ml-2 text-green-600 text-sm">✅ Cache</span>}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.data?.map((testimonial: any) => (
            <div key={testimonial._id} className="border rounded-lg p-4">
              <p className="text-gray-700 mb-2">"{testimonial.text}"</p>
              <div className="text-sm text-gray-600">
                <strong>{testimonial.author}</strong> - {testimonial.role}
              </div>
              <div className="text-xs text-blue-600 mt-1">{testimonial.project}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {testimonials.isLoading ? '⏳ Chargement...' : '✅ Données disponibles'}
        </div>
      </div>

      {/* Projets */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <i className="ri-image-line mr-2 text-blue-600"></i>
          Projets réalisés
          {projects.isCached && <span className="ml-2 text-green-600 text-sm">✅ Cache</span>}
        </h2>
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
          {projects.isLoading ? '⏳ Chargement...' : '✅ Données disponibles'}
        </div>
      </div>

      {/* Configurations du site */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <i className="ri-settings-3-line mr-2 text-blue-600"></i>
          Configuration du site
          {siteConfig.isCached && <span className="ml-2 text-green-600 text-sm">✅ Cache</span>}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Configuration de contact */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <i className="ri-phone-line mr-2 text-green-600"></i>
              Contact
              {contactConfig.isCached && <span className="ml-1 text-green-600 text-xs">✅</span>}
            </h3>
            {contactConfig.data && (
              <div className="text-sm space-y-1">
                <div><strong>Email:</strong> {contactConfig.data.email}</div>
                <div><strong>Téléphone:</strong> {contactConfig.data.phone}</div>
                <div><strong>Adresse:</strong> {contactConfig.data.address}</div>
                <div><strong>Horaires:</strong> {contactConfig.data.hours}</div>
              </div>
            )}
          </div>

          {/* Configuration d'apparence */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <i className="ri-palette-line mr-2 text-purple-600"></i>
              Apparence
              {appearanceConfig.isCached && <span className="ml-1 text-green-600 text-xs">✅</span>}
            </h3>
            {appearanceConfig.data && (
              <div className="text-sm space-y-1">
                <div><strong>Nom:</strong> {appearanceConfig.data.siteName}</div>
                <div><strong>Slogan:</strong> {appearanceConfig.data.tagline}</div>
                <div className="flex items-center space-x-2">
                  <span><strong>Couleur:</strong></span>
                  <div 
                    className="w-4 h-4 rounded border" 
                    style={{ backgroundColor: appearanceConfig.data.primaryColor }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Configuration SEO */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <i className="ri-search-line mr-2 text-orange-600"></i>
              SEO
              {seoConfig.isCached && <span className="ml-1 text-green-600 text-xs">✅</span>}
            </h3>
            {seoConfig.data && (
              <div className="text-sm space-y-1">
                <div><strong>Titre:</strong> {seoConfig.data.title}</div>
                <div><strong>Description:</strong> {seoConfig.data.description}</div>
                <div><strong>Mots-clés:</strong> {seoConfig.data.keywords}</div>
              </div>
            )}
          </div>

          {/* Configuration de réservation */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <i className="ri-calendar-line mr-2 text-blue-600"></i>
              Réservation
              {bookingConfig.isCached && <span className="ml-1 text-green-600 text-xs">✅</span>}
            </h3>
            {bookingConfig.data && (
              <div className="text-sm space-y-1">
                <div><strong>Jours d'avance:</strong> {bookingConfig.data.maxAdvanceDays}</div>
                <div><strong>Jours ouvrés:</strong> {bookingConfig.data.workingDays.start}-{bookingConfig.data.workingDays.end}</div>
                <div><strong>Créneaux:</strong> {bookingConfig.data.timeSlots.join(', ')}</div>
                <div><strong>Services:</strong> {bookingConfig.data.services.length}</div>
              </div>
            )}
          </div>

          {/* Configuration email */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <i className="ri-mail-line mr-2 text-red-600"></i>
              Email
              {emailConfig.isCached && <span className="ml-1 text-green-600 text-xs">✅</span>}
            </h3>
            {emailConfig.data && (
              <div className="text-sm space-y-1">
                <div><strong>De:</strong> {emailConfig.data.fromEmail}</div>
                <div><strong>Nom:</strong> {emailConfig.data.fromName}</div>
                <div><strong>Réponse:</strong> {emailConfig.data.replyTo}</div>
              </div>
            )}
          </div>

          {/* Configuration légale */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <i className="ri-file-text-line mr-2 text-gray-600"></i>
              Légal
              {legalConfig.isCached && <span className="ml-1 text-green-600 text-xs">✅</span>}
            </h3>
            {legalConfig.data && (
              <div className="text-sm space-y-1">
                <div><strong>Entreprise:</strong> {legalConfig.data.companyName}</div>
                <div><strong>SIRET:</strong> {legalConfig.data.siret}</div>
                <div><strong>TVA:</strong> {legalConfig.data.tva}</div>
              </div>
            )}
          </div>

          {/* Informations de l'entreprise */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <i className="ri-building-line mr-2 text-blue-600"></i>
              Informations Entreprise
              {companyInfo.isCached && <span className="ml-1 text-green-600 text-xs">✅</span>}
            </h3>
            {companyInfo.data && (
              <div className="text-sm space-y-1">
                <div><strong>Nom:</strong> {companyInfo.data.companyName}</div>
                <div><strong>Forme juridique:</strong> {companyInfo.data.legalForm}</div>
                <div><strong>Créée le:</strong> {companyInfo.data.creationDate}</div>
                <div><strong>SIREN:</strong> {companyInfo.data.siren}</div>
                <div><strong>Code APE:</strong> {companyInfo.data.apeCode}</div>
                <div><strong>Ville:</strong> {companyInfo.data.city}, {companyInfo.data.country}</div>
                <div><strong>Services:</strong> {companyInfo.data.serviceType?.join(', ')}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Résumé des performances */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Résumé des performances</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Données CMS en cache:</span>
            <span className="ml-2 text-green-600">
              {[stats, services, zones, reasons, testimonials, projects].filter(d => d.isCached).length}/6
            </span>
          </div>
          <div>
            <span className="font-medium">Configs en cache:</span>
            <span className="ml-2 text-green-600">
              {[siteConfig, bookingConfig, contactConfig, emailConfig, appearanceConfig, legalConfig, seoConfig, companyInfo].filter(d => d.isCached).length}/8
            </span>
          </div>
          <div>
            <span className="font-medium">Total chargé:</span>
            <span className="ml-2 text-green-600">
              {[...[stats, services, zones, reasons, testimonials, projects], ...[siteConfig, bookingConfig, contactConfig, emailConfig, appearanceConfig, legalConfig, seoConfig, companyInfo]].filter(d => d.data && (Array.isArray(d.data) ? d.data.length > 0 : true)).length}/14
            </span>
          </div>
          <div>
            <span className="font-medium">En cours:</span>
            <span className="ml-2 text-orange-600">
              {[...[stats, services, zones, reasons, testimonials, projects], ...[siteConfig, bookingConfig, contactConfig, emailConfig, appearanceConfig, legalConfig, seoConfig, companyInfo]].filter(d => d.isLoading).length}/14
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook pour utiliser les données prioritaires dans d'autres composants
export function usePriorityCmsData() {
  const statistics = usePriorityStatistics();
  const services = usePriorityServices();
  const zones = usePriorityZones();
  const reasons = usePriorityReasons();
  const testimonials = usePriorityTestimonials();
  const projects = usePriorityPortfolioProjects();

  return {
    statistics,
    services,
    zones,
    reasons,
    testimonials,
    projects,
    allLoaded: [statistics, services, zones, reasons, testimonials, projects].every(
      data => data.data && data.data.length > 0
    ),
    allCached: [statistics, services, zones, reasons, testimonials, projects].every(
      data => data.isCached
    ),
    anyLoading: [statistics, services, zones, reasons, testimonials, projects].some(
      data => data.isLoading
    )
  };
}

// Hook pour utiliser les configurations du site avec cache prioritaire
export function usePrioritySiteConfigData() {
  const siteConfig = usePrioritySiteConfig();
  const bookingConfig = usePriorityBookingConfig();
  const contactConfig = usePriorityContactConfig();
  const emailConfig = usePriorityEmailConfig();
  const appearanceConfig = usePriorityAppearanceConfig();
  const legalConfig = usePriorityLegalConfig();
  const seoConfig = usePrioritySeoConfig();
  const companyInfo = usePriorityCompanyInfo();

  return {
    siteConfig,
    bookingConfig,
    contactConfig,
    emailConfig,
    appearanceConfig,
    legalConfig,
    seoConfig,
    companyInfo,
    allConfigsLoaded: [siteConfig, bookingConfig, contactConfig, emailConfig, appearanceConfig, legalConfig, seoConfig, companyInfo].every(
      config => config.data && (Array.isArray(config.data) ? config.data.length > 0 : true)
    ),
    allConfigsCached: [siteConfig, bookingConfig, contactConfig, emailConfig, appearanceConfig, legalConfig, seoConfig, companyInfo].every(
      config => config.isCached
    ),
    anyConfigLoading: [siteConfig, bookingConfig, contactConfig, emailConfig, appearanceConfig, legalConfig, seoConfig, companyInfo].some(
      config => config.isLoading
    )
  };
}

// Hook combiné pour toutes les données avec cache prioritaire
export function useAllPriorityData() {
  const cmsData = usePriorityCmsData();
  const configData = usePrioritySiteConfigData();

  return {
    ...cmsData,
    ...configData,
    allDataLoaded: cmsData.allLoaded && configData.allConfigsLoaded,
    allDataCached: cmsData.allCached && configData.allConfigsCached,
    anyDataLoading: cmsData.anyLoading || configData.anyConfigLoading
  };
}
