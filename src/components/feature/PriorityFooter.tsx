/**
 * Footer optimisé avec cache prioritaire
 * Version améliorée du Footer avec chargement instantané des données
 */

import PriorityContactInfoSection from '../cms/PriorityContactInfoSection';
import PriorityCompanyInfoSection from '../cms/PriorityCompanyInfoSection';
import PriorityFooterServicesSection from '../cms/PriorityFooterServicesSection';
import { usePriorityAppearanceConfig, usePriorityZones } from '../../lib/priority-cache';

export default function PriorityFooter() {
  const appearanceConfig = usePriorityAppearanceConfig();
  const zones = usePriorityZones();

  // Données d'apparence avec fallback
  const siteName = appearanceConfig.data?.siteName || 'DR RAVALEMENT';
  const tagline = appearanceConfig.data?.tagline || 'Expert Façades & Maçonnerie';
  const primaryColor = appearanceConfig.data?.primaryColor || '#ea580c';

  // Zones d'intervention avec fallback
  const interventionZones = zones.data?.map(zone => zone.name) || ['Le Pecq', 'Île-de-France'];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)` 
                }}
              >
                <span className="text-white font-bold text-lg sm:text-xl">DR</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold">{siteName}</h3>
                <p className="text-orange-400 text-caption">{tagline}</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <i className="ri-facebook-fill text-lg sm:text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <i className="ri-twitter-fill text-lg sm:text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <i className="ri-linkedin-fill text-lg sm:text-xl"></i>
              </a>
            </div>
            {/* Indicateur de cache pour l'apparence */}
            {appearanceConfig.isCached && (
              <div className="mt-3 text-xs text-green-400">
                ✅ Apparence en cache
              </div>
            )}
          </div>

          {/* Services */}
          <div>
            <PriorityFooterServicesSection />
          </div>

          {/* Zones */}
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h4 className="text-card-title">Zones d'Intervention</h4>
              {zones.isCached && (
                <span className="text-green-400 text-xs">✅ Cache</span>
              )}
            </div>
            <ul className="space-y-2 sm:space-y-3">
              {interventionZones.map((zone, index) => (
                <li key={index} className="text-gray-300 text-caption">
                  {zone}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-card-title mb-4 sm:mb-6">Contact</h4>
            <PriorityContactInfoSection variant="footer" showHours={true} showSocial={true} />
          </div>
        </div>

        {/* Navigation Links */}
        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
            <a href="/" className="text-gray-300 hover:text-orange-400 transition-colors text-small">Accueil</a>
            <a href="/about" className="text-gray-300 hover:text-orange-400 transition-colors text-small">À Propos</a>
            <a href="/services" className="text-gray-300 hover:text-orange-400 transition-colors text-small">Services</a>
            <a href="/portfolio" className="text-gray-300 hover:text-orange-400 transition-colors text-small">Réalisations</a>
            <a href="/contact" className="text-gray-300 hover:text-orange-400 transition-colors text-small">Contact</a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-caption text-center md:text-left">© 2025 {siteName}. Tous droits réservés.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-caption">Mentions Légales</a>
            <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-caption">Politique de Confidentialité</a>
            <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-caption">CGV</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
