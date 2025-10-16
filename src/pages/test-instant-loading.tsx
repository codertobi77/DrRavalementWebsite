/**
 * Page de test pour le chargement instantané
 * Permet de vérifier que le chargement est vraiment instantané
 */

import React, { useState, useEffect } from 'react';
import InstantCmsSection, { InstantCmsTest } from '../components/cms/InstantCmsSection';
import { useInstantCmsData } from '../components/cms/InstantCmsSection';
import { useInstantCmsData as useInstantData } from '../components/cms/InstantLoadingSection';

export default function TestInstantLoading() {
  const [startTime, setStartTime] = useState<number>(0);
  const [loadTime, setLoadTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const { allLoaded, allCached } = useInstantData();

  useEffect(() => {
    setStartTime(performance.now());
  }, []);

  useEffect(() => {
    if (allLoaded && isLoading) {
      const endTime = performance.now();
      setLoadTime(endTime - startTime);
      setIsLoading(false);
    }
  }, [allLoaded, isLoading, startTime]);

  return (
    <InstantCmsSection showNetworkStatus={true} enablePreload={true}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-center mb-6">Test de Chargement Instantané</h1>
            
            {/* Métriques de performance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {isLoading ? '...' : `${loadTime.toFixed(0)}ms`}
                </div>
                <div className="text-sm text-blue-800">Temps de chargement</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {allCached ? '100%' : '0%'}
                </div>
                <div className="text-sm text-green-800">Données en cache</div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {allLoaded ? '✅' : '⏳'}
                </div>
                <div className="text-sm text-purple-800">État du chargement</div>
              </div>
            </div>

            {/* Indicateur de performance */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Performance</span>
                <span className="text-sm text-gray-500">
                  {loadTime < 100 ? 'Excellent' : 
                   loadTime < 500 ? 'Bon' : 
                   loadTime < 1000 ? 'Moyen' : 'Lent'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    loadTime < 100 ? 'bg-green-500' : 
                    loadTime < 500 ? 'bg-yellow-500' : 
                    loadTime < 1000 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ 
                    width: `${Math.min(100, (1000 - loadTime) / 10)}%` 
                  }}
                ></div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-yellow-800 mb-2">Instructions de test :</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Rechargez la page pour tester le chargement initial</li>
                <li>• Naviguez vers d'autres pages puis revenez ici</li>
                <li>• Vérifiez que les données s'affichent instantanément</li>
                <li>• Le temps de chargement devrait être inférieur à 100ms</li>
              </ul>
            </div>
          </div>

          {/* Test des composants */}
          <InstantCmsTest />
        </div>
      </div>
    </InstantCmsSection>
  );
}

