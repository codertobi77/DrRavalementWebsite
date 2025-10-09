import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { validateCmsData, logCmsError } from "../../lib/cms-utils";

interface CTALinksProps {
  variant?: 'button' | 'text' | 'hero';
  className?: string;
  children?: React.ReactNode;
}

export default function CTALinksSection({ 
  variant = 'button', 
  className = "",
  children
}: CTALinksProps) {
  const rawContactConfig = useQuery(api.siteConfig.getConfigByKey, { key: "contact_config" });

  // Validation des données
  const contactConfig = rawContactConfig as any;

  if (!contactConfig) {
    // Fallback avec les informations par défaut
    const defaultConfig = {
      phone: '+33 1 39 58 90 15',
      email: 'contact@dr-ravalement.fr',
      website: 'https://dr-ravalement.fr'
    };

    if (variant === 'button') {
      return (
        <div className={`flex flex-col sm:flex-row gap-4 justify-center ${className}`}>
          <a 
            href="/contact" 
            className="bg-white text-orange-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
          >
            Devis Gratuit
          </a>
          <a 
            href={`tel:${defaultConfig.phone.replace(/\s/g, '')}`} 
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-orange-900 transition-all duration-300 whitespace-nowrap"
          >
            Nous Appeler
          </a>
        </div>
      );
    }

    if (variant === 'text') {
      return (
        <div className={`text-center ${className}`}>
          <p className="text-lg text-orange-100 mb-4">
            Contactez-nous au <a href={`tel:${defaultConfig.phone.replace(/\s/g, '')}`} className="font-semibold hover:text-white transition-colors">{defaultConfig.phone}</a>
          </p>
          <p className="text-orange-100 mb-6">
            ou par email : <a href={`mailto:${defaultConfig.email}`} className="font-semibold hover:text-white transition-colors">{defaultConfig.email}</a>
          </p>
        </div>
      );
    }

    return null;
  }

  try {
    const formatPhone = (phone: string) => {
      if (phone.startsWith('+33')) {
        return phone.replace('+33', '+33 ').replace(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
      }
      return phone;
    };

    const formatPhoneLink = (phone: string) => {
      return phone.replace(/\s/g, '');
    };

    if (variant === 'button') {
      return (
        <div className={`flex flex-col sm:flex-row gap-4 justify-center ${className}`}>
          <a 
            href="/contact" 
            className="bg-white text-orange-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
          >
            Devis Gratuit
          </a>
          <a 
            href={`tel:${formatPhoneLink(contactConfig.phone)}`} 
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-orange-900 transition-all duration-300 whitespace-nowrap"
          >
            Nous Appeler
          </a>
        </div>
      );
    }

    if (variant === 'text') {
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

    if (variant === 'hero') {
      return (
        <div className={`text-center ${className}`}>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {children || "Votre Projet Sera Notre Prochaine Réalisation"}
          </h1>
          <p className="text-xl text-orange-100 mb-8">
            Rejoignez nos clients satisfaits et confiez-nous votre projet de rénovation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="bg-white text-orange-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
            >
              Demander un Devis
            </a>
            <a 
              href={`tel:${formatPhoneLink(contactConfig.phone)}`} 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-orange-900 transition-all duration-300 whitespace-nowrap"
            >
              Nous Appeler
            </a>
          </div>
        </div>
      );
    }

    return null;
  } catch (error) {
    logCmsError("CTALinksSection", error, contactConfig);
    return (
      <div className={`text-center text-gray-600 ${className}`}>
        <p>Erreur lors du chargement des liens de contact</p>
      </div>
    );
  }
}
