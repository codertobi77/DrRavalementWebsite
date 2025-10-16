/**
 * Page de test pour les informations dynamiques du header et footer
 * Vérification du chargement instantané avec cache prioritaire
 */

import React from 'react';
import PriorityHeader from '../components/feature/PriorityHeader';
import PriorityFooter from '../components/feature/PriorityFooter';
import PriorityContactInfoSection from '../components/cms/PriorityContactInfoSection';
import PriorityCompanyInfoSection from '../components/cms/PriorityCompanyInfoSection';
import PriorityFooterServicesSection from '../components/cms/PriorityFooterServicesSection';
import { usePriorityContactConfig, usePriorityAppearanceConfig, usePriorityServices, usePriorityZones } from '../lib/priority-cache';

export default function TestHeaderFooterCache() {
  const contactConfig = usePriorityContactConfig();
  const appearanceConfig = usePriorityAppearanceConfig();
  const services = usePriorityServices();
  const zones = usePriorityZones();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec cache prioritaire */}
      <PriorityHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">Test Header & Footer Cache</h1>
          <p className="text-center text-gray-600">
            Vérification du chargement instantané des informations dynamiques
          </p>
        </div>

        {/* Test des composants individuels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Test Contact Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <i className="ri-phone-line mr-2 text-green-600"></i>
              Informations de Contact
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Header</h3>
                <PriorityContactInfoSection variant="header" />
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Footer</h3>
                <PriorityContactInfoSection variant="footer" showHours={true} showSocial={true} />
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Page</h3>
                <PriorityContactInfoSection variant="page" />
              </div>
            </div>
          </div>

          {/* Test Services */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <i className="ri-tools-line mr-2 text-blue-600"></i>
              Services Footer
            </h2>
            <PriorityFooterServicesSection />
          </div>

          {/* Test Company Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <i className="ri-building-line mr-2 text-purple-600"></i>
              Informations Entreprise
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Footer</h3>
                <PriorityCompanyInfoSection variant="footer" />
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">About</h3>
                <div className="bg-gradient-to-r from-orange-500 to-orange-700 p-6 rounded-lg text-white">
                  <PriorityCompanyInfoSection variant="about" />
                </div>
              </div>
            </div>
          </div>

          {/* Test Zones */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <i className="ri-map-pin-line mr-2 text-orange-600"></i>
              Zones d'Intervention
            </h2>
            <div className="space-y-2">
              {zones.data?.map((zone, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <i className="ri-map-pin-line text-orange-500"></i>
                  <span className="text-gray-700">{zone.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Test complet Header + Footer */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <i className="ri-layout-line mr-2 text-indigo-600"></i>
            Test Complet Header + Footer
          </h2>
          <p className="text-gray-600 mb-4">
            Les composants ci-dessous utilisent le cache prioritaire pour un chargement instantané
          </p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <div className="text-center text-gray-500 mb-4">
              Header et Footer avec cache prioritaire
            </div>
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-sm font-medium text-gray-700 mb-2">Header (simulé)</div>
                <div className="text-xs text-gray-600">
                  Téléphone, email, adresse, nom du site, slogan - tous en cache
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-sm font-medium text-gray-700 mb-2">Footer (simulé)</div>
                <div className="text-xs text-gray-600">
                  Services, zones, contact, informations entreprise - tous en cache
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Métriques de performance */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-4">Métriques de Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Contact en cache:</span>
            <span className="ml-2 text-gray-600">
              {contactConfig.isCached ? 'Oui' : 'Non'}
            </span>
            </div>
            <div>
              <span className="font-medium">Apparence en cache:</span>
              <span className="ml-2 text-gray-600">
                {appearanceConfig.isCached ? 'Oui' : 'Non'}
              </span>
            </div>
            <div>
              <span className="font-medium">Services en cache:</span>
              <span className="ml-2 text-gray-600">
                {services.isCached ? 'Oui' : 'Non'}
              </span>
            </div>
            <div>
              <span className="font-medium">Zones en cache:</span>
              <span className="ml-2 text-gray-600">
                {zones.isCached ? 'Oui' : 'Non'}
              </span>
            </div>
          </div>
        </div>

        {/* Instructions de test */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
          <h3 className="font-semibold text-yellow-800 mb-3">Instructions de test :</h3>
          <ul className="text-sm text-yellow-700 space-y-2">
            <li>• <strong>Premier chargement :</strong> Les données se chargent depuis Convex</li>
            <li>• <strong>Rechargement :</strong> Toutes les informations s'affichent instantanément depuis le cache</li>
            <li>• <strong>Navigation :</strong> Header et footer restent en cache entre les pages</li>
            <li>• <strong>Indicateurs :</strong> Les données en cache se chargent instantanément</li>
            <li>• <strong>Performance :</strong> Le chargement doit être instantané après le premier accès</li>
            <li>• <strong>Données testées :</strong> Téléphone, email, adresse, nom du site, services, zones</li>
          </ul>
        </div>
      </div>

      {/* Footer avec cache prioritaire */}
      <PriorityFooter />
    </div>
  );
}
