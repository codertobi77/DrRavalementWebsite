
import { useState } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

interface Zone {
  id: string;
  name: string;
  distance: number;
  projects: number;
  coordinates: [number, number];
}

export default function InteractiveMap() {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const zones: Zone[] = [
    { id: '1', name: 'Meaux', distance: 15, projects: 45, coordinates: [48.9606, 2.8789] },
    { id: '2', name: 'Chelles', distance: 25, projects: 32, coordinates: [48.8833, 2.5833] },
    { id: '3', name: 'Torcy', distance: 30, projects: 28, coordinates: [48.8481, 2.6531] },
    { id: '4', name: 'Melun', distance: 35, projects: 22, coordinates: [48.5333, 2.6667] },
    { id: '5', name: 'Le Pecq', distance: 40, projects: 18, coordinates: [48.8944, 2.1089] },
    { id: '6', name: 'Bussy-Saint-Georges', distance: 28, projects: 25, coordinates: [48.8406, 2.7131] },
    { id: '7', name: 'Lagny-sur-Marne', distance: 32, projects: 20, coordinates: [48.8789, 2.7056] },
    { id: '8', name: 'Pontault-Combault', distance: 38, projects: 15, coordinates: [48.7833, 2.6] }
  ];

  const filteredZones = zones.filter(zone =>
    zone.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateDeliveryFee = (distance: number) => {
    if (distance <= 20) return 0;
    if (distance <= 30) return 50;
    if (distance <= 40) return 80;
    return 120;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Carte Interactive des Interventions
            </h1>
            <p className="text-xl text-gray-600">
              Découvrez nos zones d'intervention et calculez vos frais de déplacement
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Zone List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Zones d'intervention
                </h2>
                
                {/* Search */}
                <div className="relative mb-6">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher une ville..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>

                {/* Zone List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredZones.map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => setSelectedZone(zone)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        selectedZone?.id === zone.id
                          ? 'border-orange-600 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{zone.name}</h3>
                        <span className="text-sm text-gray-500">{zone.distance} km</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {zone.projects} projets réalisés
                        </span>
                        <span className="text-sm font-medium text-orange-600">
                          {calculateDeliveryFee(zone.distance) === 0 
                            ? 'Gratuit' 
                            : `${calculateDeliveryFee(zone.distance)}€`
                          }
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="h-96 relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d83998.9!2d2.8789!3d48.9606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e8a4b0b0b0b0b0%3A0x0!2sMeaux%2C%20France!5e0!3m2!1sen!2sfr!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Carte des interventions DR RAVALEMENT"
                  ></iframe>
                  
                  {/* Overlay with zone info */}
                  {selectedZone && (
                    <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg p-4 max-w-sm">
                      <h3 className="font-bold text-lg mb-2">{selectedZone.name}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Distance:</span>
                          <span className="font-medium">{selectedZone.distance} km</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Projets réalisés:</span>
                          <span className="font-medium">{selectedZone.projects}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Frais de déplacement:</span>
                          <span className="font-medium text-orange-600">
                            {calculateDeliveryFee(selectedZone.distance) === 0 
                              ? 'Gratuit' 
                              : `${calculateDeliveryFee(selectedZone.distance)}€`
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Zone Details */}
                {selectedZone && (
                  <div className="p-6 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600 mb-1">
                          {selectedZone.distance} km
                        </div>
                        <div className="text-sm text-gray-600">Distance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600 mb-1">
                          {selectedZone.projects}
                        </div>
                        <div className="text-sm text-gray-600">Projets réalisés</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600 mb-1">
                          {calculateDeliveryFee(selectedZone.distance) === 0 
                            ? 'Gratuit' 
                            : `${calculateDeliveryFee(selectedZone.distance)}€`
                          }
                        </div>
                        <div className="text-sm text-gray-600">Frais déplacement</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Table */}
          <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Grille Tarifaire des Déplacements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-6 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-2">0€</div>
                <div className="text-sm font-medium text-gray-700 mb-1">0-20 km</div>
                <div className="text-xs text-gray-500">Zone prioritaire</div>
              </div>
              <div className="text-center p-6 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                <div className="text-3xl font-bold text-yellow-600 mb-2">50€</div>
                <div className="text-sm font-medium text-gray-700 mb-1">21-30 km</div>
                <div className="text-xs text-gray-500">Zone étendue</div>
              </div>
              <div className="text-center p-6 bg-orange-50 rounded-xl border-2 border-orange-200">
                <div className="text-3xl font-bold text-orange-600 mb-2">80€</div>
                <div className="text-sm font-medium text-gray-700 mb-1">31-40 km</div>
                <div className="text-xs text-gray-500">Zone éloignée</div>
              </div>
              <div className="text-center p-6 bg-red-50 rounded-xl border-2 border-red-200">
                <div className="text-3xl font-bold text-red-600 mb-2">120€</div>
                <div className="text-sm font-medium text-gray-700 mb-1">40+ km</div>
                <div className="text-xs text-gray-500">Sur devis</div>
              </div>
            </div>
            <p className="text-center text-gray-600 mt-6">
              *Frais de déplacement appliqués une seule fois par chantier
            </p>
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Votre ville n'apparaît pas ?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Contactez-nous pour connaître nos conditions d'intervention
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.REACT_APP_NAVIGATE('/contact')}
                className="bg-white text-orange-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap font-medium"
              >
                Nous contacter
              </button>
              <button
                onClick={() => document.querySelector('#vapi-widget-floating-button')?.click()}
                className="border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-orange-600 transition-colors whitespace-nowrap font-medium"
              >
                Chat en direct
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
