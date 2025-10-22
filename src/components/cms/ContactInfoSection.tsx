import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { validateCmsData, logCmsError, createLoadingState } from "../../lib/cms-utils";

interface ContactInfoProps {
  variant?: 'header' | 'footer' | 'page' | 'cta';
  showHours?: boolean;
  showSocial?: boolean;
  className?: string;
}

export default function ContactInfoSection({ 
  variant = 'page', 
  showHours = true, 
  showSocial = false,
  className = ""
}: ContactInfoProps) {
  const rawContactConfig = useQuery(api.siteConfig.getConfigByKey, { key: "contact_config" });

  // Validation des données
  const contactConfig = rawContactConfig as any;

  if (!contactConfig) {
    return (
      <div className={`animate-pulse ${className}`}>
        {variant === 'header' && (
          <div className="flex items-center space-x-2 sm:space-x-6">
            <div className="h-4 bg-gray-300 rounded w-32"></div>
            <div className="h-4 bg-gray-300 rounded w-40 hidden sm:block"></div>
            <div className="h-4 bg-gray-300 rounded w-48 hidden lg:block"></div>
          </div>
        )}
        {variant === 'footer' && (
          <div className="space-y-3">
            {createLoadingState(4).map((item) => (
              <div key={item._id} className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-32"></div>
              </div>
            ))}
          </div>
        )}
        {variant === 'page' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {createLoadingState(3).map((item) => (
              <div key={item._id} className="text-center animate-pulse">
                <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-6"></div>
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-5 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  try {
    const formatPhone = (phone: string) => {
      // Formatage du téléphone pour l'affichage
      if (phone.startsWith('+33')) {
        return phone.replace('+33', '+33 ').replace(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
      }
      return phone;
    };

    const formatPhoneLink = (phone: string) => {
      // Formatage pour les liens tel:
      return phone.replace(/\s/g, '');
    };

    if (variant === 'header') {
      return (
        <div className={`flex items-center space-x-2 sm:space-x-6 ${className}`}>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <i className="ri-phone-line text-xs sm:text-sm"></i>
            <a 
              href={`tel:${formatPhoneLink(contactConfig.phone)}`}
              className="text-xs sm:text-sm hover:text-orange-200 transition-colors"
            >
              <span className="hidden sm:inline">{formatPhone(contactConfig.phone)}</span>
              <span className="sm:hidden">{contactConfig.phone.replace('+33 ', '0')}</span>
            </a>
          </div>
          <div className="hidden sm:flex items-center space-x-2">
            <i className="ri-mail-line"></i>
            <a 
              href={`mailto:${contactConfig.email}`}
              className="text-xs sm:text-sm hover:text-orange-200 transition-colors"
            >
              {contactConfig.email}
            </a>
          </div>
          <div className="hidden lg:flex items-center space-x-2">
            <i className="ri-map-pin-line"></i>
            <span className="text-xs sm:text-sm">{contactConfig.fullAddress || contactConfig.address}</span>
          </div>
        </div>
      );
    }

    if (variant === 'footer') {
      return (
        <div className={`space-y-3 sm:space-y-4 ${className}`}>
          <div className="flex items-center space-x-3">
            <i className="ri-phone-line text-orange-400 flex-shrink-0"></i>
            <a 
              href={`tel:${formatPhoneLink(contactConfig.phone)}`}
              className="text-gray-300 text-xs sm:text-sm hover:text-orange-400 transition-colors"
            >
              {formatPhone(contactConfig.phone)}
            </a>
          </div>
          <div className="flex items-center space-x-3">
            <i className="ri-mail-line text-orange-400 flex-shrink-0"></i>
            <a 
              href={`mailto:${contactConfig.email}`}
              className="text-gray-300 text-xs sm:text-sm break-all hover:text-orange-400 transition-colors"
            >
              {contactConfig.email}
            </a>
          </div>
          <div className="flex items-center space-x-3">
            <i className="ri-map-pin-line text-orange-400 flex-shrink-0"></i>
            <span className="text-gray-300 text-xs sm:text-sm">
              {contactConfig.fullAddress || contactConfig.address}
            </span>
          </div>
          {showHours && (
            <div className="flex items-center space-x-3">
              <i className="ri-time-line text-orange-400 flex-shrink-0"></i>
              <span className="text-gray-300 text-xs sm:text-sm">Lun-Ven: 8h-18h | Sam: 9h-12h</span>
            </div>
          )}
          {showSocial && contactConfig.socialMedia && (
            <div className="flex items-center space-x-3">
              <i className="ri-share-line text-orange-400 flex-shrink-0"></i>
              <div className="flex space-x-2">
                {contactConfig.socialMedia.facebook && (
                  <a href={contactConfig.socialMedia.facebook} className="text-gray-300 hover:text-orange-400 transition-colors">
                    <i className="ri-facebook-line"></i>
                  </a>
                )}
                {contactConfig.socialMedia.instagram && (
                  <a href={contactConfig.socialMedia.instagram} className="text-gray-300 hover:text-orange-400 transition-colors">
                    <i className="ri-instagram-line"></i>
                  </a>
                )}
                {contactConfig.socialMedia.linkedin && (
                  <a href={contactConfig.socialMedia.linkedin} className="text-gray-300 hover:text-orange-400 transition-colors">
                    <i className="ri-linkedin-line"></i>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (variant === 'page') {
      return (
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${className}`}>
          <div className="text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-phone-line text-3xl text-orange-600"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Appelez-nous</h3>
            <p className="text-lg text-orange-600 font-semibold mb-2">{formatPhone(contactConfig.phone)}</p>
            <p className="text-gray-600 mb-4">Lun-Ven: 8h-18h | Sam: 9h-12h</p>
            <a 
              href={`tel:${formatPhoneLink(contactConfig.phone)}`}
              className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors whitespace-nowrap"
            >
              Appeler Maintenant
            </a>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-mail-line text-3xl text-orange-600"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Écrivez-nous</h3>
              <p className="text-lg text-orange-600 font-semibold mb-2">{contactConfig.email}</p>
            <p className="text-gray-600 mb-4">Réponse sous 24h</p>
            <a 
              href={`mailto:${contactConfig.email}`}
              className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors whitespace-nowrap"
            >
              Envoyer un Email
            </a>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-map-pin-line text-3xl text-orange-600"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Zone d'intervention</h3>
            <p className="text-lg text-orange-600 font-semibold mb-2">
              {contactConfig.address}
            </p>
            <p className="text-gray-600 mb-4">{contactConfig.fullAddress || contactConfig.address}</p>
            <a 
              href="/contact" 
              className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors whitespace-nowrap"
            >
              Voir la Carte
            </a>
          </div>
        </div>
      );
    }

    if (variant === 'cta') {
      return (
        <div className={`text-center ${className}`}>
          <p className="text-lg text-orange-100 mb-4">
            Contactez-nous au <a href={`tel:${formatPhoneLink(contactConfig.phone)}`} className="font-semibold hover:text-white transition-colors">{formatPhone(contactConfig.phone)}</a>
          </p>
          <p className="text-orange-100 mb-6">
            ou par email : <a href={`mailto:${contactConfig.email}`} className="font-semibold hover:text-white transition-colors">{contactConfig.email}</a>
          </p>
        </div>
      );
    }

    return null;
  } catch (error) {
    logCmsError("ContactInfoSection", error, contactConfig);
    return (
      <div className={`text-center text-gray-600 ${className}`}>
        <p>Erreur lors du chargement des informations de contact</p>
      </div>
    );
  }
}
