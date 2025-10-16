/**
 * Page de test pour les configurations du site avec cache prioritaire
 */

import React from 'react';
import PriorityCmsSection, { PriorityCmsTest } from '../components/cms/PriorityCmsSection';
import SiteConfigDisplay, { SiteConfigSummary } from '../components/cms/SiteConfigDisplay';

export default function TestSiteConfig() {
  return (
    <PriorityCmsSection showNetworkStatus={true}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center mb-4">Test des Configurations du Site</h1>
            <p className="text-center text-gray-600">
              Vérification du chargement instantané des configurations avec cache prioritaire
            </p>
          </div>

          {/* Résumé compact */}
          <div className="mb-8">
            <SiteConfigSummary />
          </div>

          {/* Test complet des configurations */}
          <div className="mb-8">
            <SiteConfigDisplay 
              showContact={true}
              showAppearance={true}
              showBooking={true}
              showEmail={true}
              showLegal={true}
              showSeo={true}
            />
          </div>

          {/* Test complet des données CMS */}
          <div className="mb-8">
            <PriorityCmsTest />
          </div>

          {/* Instructions de test */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-semibold text-yellow-800 mb-3">Instructions de test :</h3>
            <ul className="text-sm text-yellow-700 space-y-2">
              <li>• <strong>Premier chargement :</strong> Les configurations se chargent depuis Convex</li>
              <li>• <strong>Rechargement :</strong> Les configurations s'affichent instantanément depuis le cache</li>
              <li>• <strong>Navigation :</strong> Les configurations restent en cache entre les pages</li>
              <li>• <strong>Indicateurs :</strong> ✅ = Données en cache, ⏳ = Chargement en cours</li>
              <li>• <strong>Performance :</strong> Le chargement doit être instantané après le premier accès</li>
            </ul>
          </div>
        </div>
      </div>
    </PriorityCmsSection>
  );
}
