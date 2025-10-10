import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { logCmsError } from "../../lib/cms-utils";

interface CompanyInfoProps {
  variant?: 'footer' | 'about';
  className?: string;
}

// Fonction utilitaire pour obtenir les données SEO
export function getCompanySEOData(contactConfig: any) {
  if (!contactConfig) {
    return {
      name: 'DR RAVALEMENT',
      description: 'Expert en ravalement de façades, maçonnerie générale et couverture en Seine-et-Marne et Île-de-France',
      url: 'https://dr-ravalement.fr',
      telephone: '+33139589015',
      email: 'contact@dr-ravalement.fr',
      address: {
        streetAddress: 'Adresse de l\'entreprise',
        addressLocality: 'Seine-et-Marne',
        addressRegion: 'Île-de-France',
        addressCountry: 'FR',
        postalCode: '75001'
      },
      sameAs: [
        'https://www.facebook.com/dr-ravalement',
        'https://www.linkedin.com/company/dr-ravalement',
        'https://www.instagram.com/dr_ravalement'
      ],
      areaServed: [
        'Seine-et-Marne',
        'Île-de-France',
        'Paris'
      ],
      serviceType: [
        'Ravalement de façades',
        'Maçonnerie générale',
        'Couverture',
        'Isolation thermique',
        'Rénovation extérieure'
      ]
    };
  }

  return {
    name: contactConfig.companyName || 'DR RAVALEMENT',
    description: 'Expert en ravalement de façades, maçonnerie générale et couverture en Seine-et-Marne et Île-de-France',
    url: contactConfig.website || 'https://dr-ravalement.fr',
    telephone: contactConfig.phone,
    email: contactConfig.email,
    address: {
      streetAddress: contactConfig.address,
      addressLocality: contactConfig.city,
      addressRegion: contactConfig.country,
      addressCountry: 'FR',
      postalCode: contactConfig.postalCode
    },
    sameAs: [
      contactConfig.socialMedia?.facebook,
      contactConfig.socialMedia?.linkedin,
      contactConfig.socialMedia?.instagram,
      contactConfig.socialMedia?.twitter
    ].filter(Boolean),
    areaServed: [
      contactConfig.city,
      contactConfig.country,
      'Paris'
    ],
    serviceType: [
      'Ravalement de façades',
      'Maçonnerie générale',
      'Couverture',
      'Isolation thermique',
      'Rénovation extérieure'
    ]
  };
}

export default function CompanyInfoSection({ 
  variant = 'footer', 
  className = ""
}: CompanyInfoProps) {
  const rawContactConfig = useQuery(api.siteConfig.getConfigByKey, { key: "contact_config" });

  // Validation des données
  const contactConfig = rawContactConfig as any;

  if (!contactConfig) {
    return null;
  }

  try {

    if (variant === 'footer') {
      return (
        <div className={className}>
          <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">À Propos</h4>
          
          
          {/* Informations juridiques */}
          <div className="text-sm text-gray-200">
            {contactConfig.legalForm && (
              <p>
                <span className="font-medium">Forme juridique :</span> {contactConfig.legalForm}
              </p>
            )}
            {contactConfig.creationDate && (
              <p>
                <span className="font-medium">Créée le :</span> {new Date(contactConfig.creationDate).toLocaleDateString('fr-FR')}
              </p>
            )}
            {contactConfig.siren && (
              <p>
                <span className="font-medium">SIREN :</span> {contactConfig.siren}
              </p>
            )}
            {contactConfig.apeCode && (
              <p>
                <span className="font-medium">Code APE :</span> {contactConfig.apeCode}
              </p>
            )}
            {contactConfig.vatNumber && (
              <p>
                <span className="font-medium">TVA :</span> {contactConfig.vatNumber}
              </p>
            )}
            {contactConfig.fullAddress && (
              <p className="mt-2">
                <span className="font-medium">Siège social :</span><br />
                {contactConfig.fullAddress}
              </p>
            )}
          </div>
        </div>
      );
    }

    if (variant === 'about') {
      return (
        <div className={className}>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            À Propos de <span className="text-orange-400">{contactConfig.companyName}</span>
          </h1>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto">
            Depuis 2008, nous sommes votre partenaire de confiance pour tous vos travaux de ravalement de façades et de maçonnerie en {contactConfig.city} et {contactConfig.country}.
          </p>
        </div>
      );
    }

    return null;
  } catch (error) {
    logCmsError("CompanyInfoSection", error, contactConfig);
    return null;
  }
}
