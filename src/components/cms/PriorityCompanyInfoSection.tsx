/**
 * Composant d'informations de l'entreprise avec cache prioritaire
 * Version optimisée de CompanyInfoSection pour le footer
 */

import React from 'react';
import { usePriorityCompanyInfo } from '../../lib/priority-cache';

interface PriorityCompanyInfoProps {
  variant?: 'footer' | 'about' | 'seo';
  className?: string;
}

export default function PriorityCompanyInfoSection({ 
  variant = 'footer', 
  className = ""
}: PriorityCompanyInfoProps) {
  const companyInfo = usePriorityCompanyInfo();

  if (companyInfo.isLoading && !companyInfo.data) {
    return (
      <div className={`animate-pulse ${className}`}>
        {variant === 'footer' && (
          <div className="space-y-3">
            <div className="h-6 bg-gray-300 rounded w-32"></div>
            <div className="h-4 bg-gray-300 rounded w-48"></div>
            <div className="h-4 bg-gray-300 rounded w-40"></div>
          </div>
        )}
        {variant === 'about' && (
          <div className="text-center">
            <div className="h-12 bg-gray-300 rounded w-96 mx-auto mb-6"></div>
            <div className="h-6 bg-gray-300 rounded w-80 mx-auto"></div>
          </div>
        )}
      </div>
    );
  }

  if (!companyInfo.data) {
    return null;
  }

  const { data: info } = companyInfo;

  try {
    if (variant === 'footer') {
      return (
        <div className={`space-y-3 sm:space-y-4 ${className}`}>
          <div className="flex items-center space-x-3">
            <i className="ri-building-line text-orange-400 flex-shrink-0"></i>
            <div>
              <p className="text-gray-300 text-xs sm:text-sm font-medium">{info.companyName}</p>
              <p className="text-gray-400 text-xs">{info.legalForm}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <i className="ri-map-pin-line text-orange-400 flex-shrink-0"></i>
            <span className="text-gray-300 text-xs sm:text-sm">{info.city}, {info.country}</span>
          </div>
          <div className="flex items-center space-x-3">
            <i className="ri-calendar-line text-orange-400 flex-shrink-0"></i>
            <span className="text-gray-300 text-xs sm:text-sm">
              Depuis {new Date(info.creationDate).getFullYear()}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <i className="ri-tools-line text-orange-400 flex-shrink-0"></i>
            <span className="text-gray-300 text-xs sm:text-sm">
              {info.serviceType?.slice(0, 2).join(', ')}
            </span>
          </div>
          {/* Indicateur de cache */}
          {companyInfo.isCached && (
            <div className="flex items-center space-x-3">
              <i className="ri-database-line text-green-400 flex-shrink-0"></i>
              <span className="text-green-400 text-xs">Données en cache</span>
            </div>
          )}
        </div>
      );
    }

    if (variant === 'about') {
      return (
        <div className={`text-center ${className}`}>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            À Propos de <span className="text-orange-400">{info.companyName}</span>
          </h1>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto">
            {info.description}
          </p>
          <div className="mt-8 flex justify-center">
            {companyInfo.isCached && (
              <span className="text-green-400 text-sm">✅ Données en cache</span>
            )}
          </div>
        </div>
      );
    }

    if (variant === 'seo') {
      return (
        <div className={`space-y-4 ${className}`}>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{info.companyName}</h2>
            <p className="text-gray-600">{info.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Forme juridique:</span>
              <p className="text-gray-800">{info.legalForm}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Créée en:</span>
              <p className="text-gray-800">{new Date(info.creationDate).getFullYear()}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">SIREN:</span>
              <p className="text-gray-800 font-mono">{info.siren}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Localisation:</span>
              <p className="text-gray-800">{info.city}, {info.country}</p>
            </div>
          </div>
          <div>
            <span className="font-medium text-gray-600">Services:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {info.serviceType?.map((service: string, index: number) => (
                <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
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
      );
    }

    return null;
  } catch (error) {
    console.error("PriorityCompanyInfoSection error:", error);
    return null;
  }
}
