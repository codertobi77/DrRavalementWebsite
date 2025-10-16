/**
 * Composant d'affichage des informations de l'entreprise avec cache prioritaire
 * Utilise les données companyInfo avec chargement instantané
 */

import React from 'react';
import { usePriorityCompanyInfo } from '../../lib/priority-cache';

interface CompanyInfoDisplayProps {
  variant?: 'full' | 'compact' | 'legal' | 'seo';
  showLogo?: boolean;
  showSocial?: boolean;
  className?: string;
}

export default function CompanyInfoDisplay({
  variant = 'full',
  showLogo = false,
  showSocial = false,
  className = ''
}: CompanyInfoDisplayProps) {
  const companyInfo = usePriorityCompanyInfo();

  if (!companyInfo.data) {
    return null;
  }

  const { data: info, isCached, isLoading } = companyInfo;

  if (variant === 'compact') {
    return (
      <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">Informations Entreprise</h3>
        </div>
        <div className="text-sm space-y-1">
          <div><strong>Nom:</strong> {info.companyName}</div>
          <div><strong>Ville:</strong> {info.city}, {info.country}</div>
          <div><strong>Services:</strong> {info.serviceType?.slice(0, 2).join(', ')}</div>
        </div>
      </div>
    );
  }

  if (variant === 'legal') {
    return (
      <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <i className="ri-file-text-line mr-2 text-gray-600"></i>
          Informations Légales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="text-sm font-medium text-gray-600">Nom de l'entreprise</label>
            <p className="text-gray-800 font-semibold">{info.companyName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Forme juridique</label>
            <p className="text-gray-800">{info.legalForm}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Date de création</label>
            <p className="text-gray-800">{new Date(info.creationDate).toLocaleDateString('fr-FR')}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">SIREN</label>
            <p className="text-gray-800 font-mono">{info.siren}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Code APE</label>
            <p className="text-gray-800 font-mono">{info.apeCode}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Numéro TVA</label>
            <p className="text-gray-800 font-mono">{info.vatNumber}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600">Adresse complète</label>
            <p className="text-gray-800">{info.fullAddress}</p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'seo') {
    return (
      <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <i className="ri-search-line mr-2 text-orange-600"></i>
          Données Structurées SEO
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Description</label>
            <p className="text-gray-800">{info.description}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">URL du site</label>
            <p className="text-gray-800">{info.url}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Zones d'intervention</label>
            <div className="flex flex-wrap gap-1 mt-1">
              {info.areaServed?.map((zone: string, index: number) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {zone}
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Types de services</label>
            <div className="flex flex-wrap gap-1 mt-1">
              {info.serviceType?.map((service: string, index: number) => (
                <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  {service}
                </span>
              ))}
            </div>
          </div>
          {showSocial && info.sameAs && (
            <div>
              <label className="text-sm font-medium text-gray-600">Réseaux sociaux</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {info.sameAs.map((url: string, index: number) => (
                  <a 
                    key={index} 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm hover:bg-gray-200"
                  >
                    {url.split('/')[2]}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Variant 'full' par défaut
  return (
    <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <i className="ri-building-line mr-2 text-blue-600"></i>
          Informations de l'Entreprise
        </h3>
        <div className="flex items-center space-x-2">
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Informations de base */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700 border-b pb-1">Informations de base</h4>
          <div className="text-sm space-y-2">
            <div>
              <span className="font-medium text-gray-600">Nom:</span>
              <p className="text-gray-800 font-semibold">{info.companyName}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Forme juridique:</span>
              <p className="text-gray-800">{info.legalForm}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Créée le:</span>
              <p className="text-gray-800">{new Date(info.creationDate).toLocaleDateString('fr-FR')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Localisation:</span>
              <p className="text-gray-800">{info.city}, {info.country}</p>
            </div>
          </div>
        </div>

        {/* Informations légales */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700 border-b pb-1">Informations légales</h4>
          <div className="text-sm space-y-2">
            <div>
              <span className="font-medium text-gray-600">SIREN:</span>
              <p className="text-gray-800 font-mono">{info.siren}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Code APE:</span>
              <p className="text-gray-800 font-mono">{info.apeCode}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">TVA:</span>
              <p className="text-gray-800 font-mono">{info.vatNumber}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Adresse:</span>
              <p className="text-gray-800">{info.fullAddress}</p>
            </div>
          </div>
        </div>

        {/* Services et zones */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700 border-b pb-1">Services & Zones</h4>
          <div className="text-sm space-y-3">
            <div>
              <span className="font-medium text-gray-600">Services:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {info.serviceType?.map((service: string, index: number) => (
                  <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    {service}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Zones d'intervention:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {info.areaServed?.map((zone: string, index: number) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {zone}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-700 mb-2">Description de l'entreprise</h4>
        <p className="text-gray-800 text-sm">{info.description}</p>
      </div>

      {/* Réseaux sociaux */}
      {showSocial && info.sameAs && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-700 mb-3">Réseaux sociaux</h4>
          <div className="flex flex-wrap gap-2">
            {info.sameAs.map((url: string, index: number) => (
              <a 
                key={index} 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-100 text-gray-800 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors"
              >
                {url.split('/')[2]}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Composant compact pour l'affichage des informations essentielles
export function CompanyInfoSummary() {
  const companyInfo = usePriorityCompanyInfo();

  if (!companyInfo.data) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Informations Entreprise</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <div className="font-medium text-gray-600">Entreprise</div>
          <div className="text-gray-800 font-semibold">{companyInfo.data.companyName}</div>
          <div className="text-gray-800">{companyInfo.data.legalForm}</div>
        </div>
        
        <div>
          <div className="font-medium text-gray-600">Localisation</div>
          <div className="text-gray-800">{companyInfo.data.city}, {companyInfo.data.country}</div>
          <div className="text-gray-800 text-xs">{companyInfo.data.areaServed?.join(', ')}</div>
        </div>
      </div>
    </div>
  );
}
