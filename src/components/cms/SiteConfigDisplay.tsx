/**
 * Composant d'affichage des configurations du site avec cache prioritaire
 * Utilise les données de siteConfig avec chargement instantané
 */

import React from 'react';
import { 
  usePriorityContactConfig,
  usePriorityAppearanceConfig,
  usePriorityBookingConfig,
  usePriorityEmailConfig,
  usePriorityLegalConfig,
  usePrioritySeoConfig
} from '../../lib/priority-cache';

interface SiteConfigDisplayProps {
  showContact?: boolean;
  showAppearance?: boolean;
  showBooking?: boolean;
  showEmail?: boolean;
  showLegal?: boolean;
  showSeo?: boolean;
  className?: string;
}

export default function SiteConfigDisplay({
  showContact = true,
  showAppearance = true,
  showBooking = false,
  showEmail = false,
  showLegal = false,
  showSeo = false,
  className = ''
}: SiteConfigDisplayProps) {
  const contactConfig = usePriorityContactConfig();
  const appearanceConfig = usePriorityAppearanceConfig();
  const bookingConfig = usePriorityBookingConfig();
  const emailConfig = usePriorityEmailConfig();
  const legalConfig = usePriorityLegalConfig();
  const seoConfig = usePrioritySeoConfig();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Configuration de contact */}
      {showContact && contactConfig.data && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <i className="ri-phone-line mr-2 text-green-600"></i>
            Informations de contact
            {contactConfig.isCached && <span className="ml-2 text-green-600 text-sm">✅ Cache</span>}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-800">{contactConfig.data.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Téléphone</label>
              <p className="text-gray-800">{contactConfig.data.phone}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Adresse</label>
              <p className="text-gray-800">{contactConfig.data.address}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Horaires</label>
              <p className="text-gray-800">{contactConfig.data.hours}</p>
            </div>
          </div>
        </div>
      )}

      {/* Configuration d'apparence */}
      {showAppearance && appearanceConfig.data && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <i className="ri-palette-line mr-2 text-purple-600"></i>
            Apparence du site
            {appearanceConfig.isCached && <span className="ml-2 text-green-600 text-sm">✅ Cache</span>}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Nom du site</label>
              <p className="text-gray-800 font-semibold">{appearanceConfig.data.siteName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Slogan</label>
              <p className="text-gray-800">{appearanceConfig.data.tagline}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Couleur principale</label>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded border" 
                  style={{ backgroundColor: appearanceConfig.data.primaryColor }}
                ></div>
                <span className="text-gray-800">{appearanceConfig.data.primaryColor}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Couleur secondaire</label>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded border" 
                  style={{ backgroundColor: appearanceConfig.data.secondaryColor }}
                ></div>
                <span className="text-gray-800">{appearanceConfig.data.secondaryColor}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuration de réservation */}
      {showBooking && bookingConfig.data && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <i className="ri-calendar-line mr-2 text-blue-600"></i>
            Configuration des réservations
            {bookingConfig.isCached && <span className="ml-2 text-green-600 text-sm">✅ Cache</span>}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Jours d'avance maximum</label>
              <p className="text-gray-800">{bookingConfig.data.maxAdvanceDays} jours</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Jours ouvrés</label>
              <p className="text-gray-800">Lundi {bookingConfig.data.workingDays.start} - Vendredi {bookingConfig.data.workingDays.end}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Créneaux horaires</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {bookingConfig.data.timeSlots.map((slot: string, index: number) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {slot}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Services disponibles</label>
              <p className="text-gray-800">{bookingConfig.data.services.length} service(s)</p>
            </div>
          </div>
        </div>
      )}

      {/* Configuration email */}
      {showEmail && emailConfig.data && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <i className="ri-mail-line mr-2 text-red-600"></i>
            Configuration des emails
            {emailConfig.isCached && <span className="ml-2 text-green-600 text-sm">✅ Cache</span>}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Email expéditeur</label>
              <p className="text-gray-800">{emailConfig.data.fromEmail}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Nom expéditeur</label>
              <p className="text-gray-800">{emailConfig.data.fromName}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Email de réponse</label>
              <p className="text-gray-800">{emailConfig.data.replyTo}</p>
            </div>
          </div>
        </div>
      )}

      {/* Configuration légale */}
      {showLegal && legalConfig.data && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <i className="ri-file-text-line mr-2 text-gray-600"></i>
            Informations légales
            {legalConfig.isCached && <span className="ml-2 text-green-600 text-sm">✅ Cache</span>}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Nom de l'entreprise</label>
              <p className="text-gray-800">{legalConfig.data.companyName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">SIRET</label>
              <p className="text-gray-800 font-mono text-sm">{legalConfig.data.siret}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Numéro TVA</label>
              <p className="text-gray-800 font-mono text-sm">{legalConfig.data.tva}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Adresse</label>
              <p className="text-gray-800">{legalConfig.data.address}</p>
            </div>
          </div>
        </div>
      )}

      {/* Configuration SEO */}
      {showSeo && seoConfig.data && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <i className="ri-search-line mr-2 text-orange-600"></i>
            Configuration SEO
            {seoConfig.isCached && <span className="ml-2 text-green-600 text-sm">✅ Cache</span>}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Titre de la page</label>
              <p className="text-gray-800">{seoConfig.data.title}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Description</label>
              <p className="text-gray-800">{seoConfig.data.description}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Mots-clés</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {seoConfig.data.keywords.split(', ').map((keyword: string, index: number) => (
                  <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Image Open Graph</label>
                <p className="text-gray-800 text-sm">{seoConfig.data.ogImage}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">URL canonique</label>
                <p className="text-gray-800 text-sm">{seoConfig.data.canonical}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Composant compact pour l'affichage des informations essentielles
export function SiteConfigSummary() {
  const contactConfig = usePriorityContactConfig();
  const appearanceConfig = usePriorityAppearanceConfig();

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Informations du site</h3>
        <div className="flex space-x-2">
          {contactConfig.isCached && <span className="text-green-600 text-sm">✅ Contact</span>}
          {appearanceConfig.isCached && <span className="text-green-600 text-sm">✅ Apparence</span>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {contactConfig.data && (
          <div>
            <div className="font-medium text-gray-600">Contact</div>
            <div className="text-gray-800">{contactConfig.data.email}</div>
            <div className="text-gray-800">{contactConfig.data.phone}</div>
          </div>
        )}
        
        {appearanceConfig.data && (
          <div>
            <div className="font-medium text-gray-600">Site</div>
            <div className="text-gray-800 font-semibold">{appearanceConfig.data.siteName}</div>
            <div className="text-gray-800">{appearanceConfig.data.tagline}</div>
          </div>
        )}
      </div>
    </div>
  );
}
