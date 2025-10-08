
import { useState } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

interface Color {
  id: string;
  name: string;
  hex: string;
  category: 'neutral' | 'warm' | 'cool' | 'bold';
}

export default function ColorSimulator() {
  const [selectedColor, setSelectedColor] = useState<string>('#FFFFFF');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [houseStyle, setHouseStyle] = useState<string>('modern');

  const colors: Color[] = [
    // Neutral colors
    { id: '1', name: 'Blanc Pur', hex: '#FFFFFF', category: 'neutral' },
    { id: '2', name: 'Blanc Cassé', hex: '#F8F8F0', category: 'neutral' },
    { id: '3', name: 'Beige Sable', hex: '#F5E6D3', category: 'neutral' },
    { id: '4', name: 'Gris Perle', hex: '#E8E8E8', category: 'neutral' },
    { id: '5', name: 'Gris Anthracite', hex: '#4A4A4A', category: 'neutral' },
    
    // Warm colors
    { id: '6', name: 'Ocre Jaune', hex: '#CC9900', category: 'warm' },
    { id: '7', name: 'Terre de Sienne', hex: '#A0522D', category: 'warm' },
    { id: '8', name: 'Rouge Brique', hex: '#B22222', category: 'warm' },
    { id: '9', name: 'Orange Provence', hex: '#FF8C00', category: 'warm' },
    
    // Cool colors
    { id: '10', name: 'Bleu Gris', hex: '#6B8CAE', category: 'cool' },
    { id: '11', name: 'Vert Sauge', hex: '#9CAF88', category: 'cool' },
    { id: '12', name: 'Bleu Lavande', hex: '#8A9BA8', category: 'cool' },
    
    // Bold colors
    { id: '13', name: 'Bleu Marine', hex: '#1E3A8A', category: 'bold' },
    { id: '14', name: 'Vert Forêt', hex: '#228B22', category: 'bold' },
    { id: '15', name: 'Bordeaux', hex: '#800020', category: 'bold' }
  ];

  const categories = [
    { id: 'all', name: 'Toutes les couleurs' },
    { id: 'neutral', name: 'Couleurs neutres' },
    { id: 'warm', name: 'Couleurs chaudes' },
    { id: 'cool', name: 'Couleurs froides' },
    { id: 'bold', name: 'Couleurs audacieuses' }
  ];

  const houseStyles = [
    { id: 'modern', name: 'Maison moderne', image: 'https://readdy.ai/api/search-image?query=modern%20house%20facade%20with%20clean%20lines%2C%20contemporary%20architecture%2C%20large%20windows%2C%20minimalist%20design%2C%20white%20background%2C%20architectural%20photography%2C%20detailed%20exterior&width=600&height=400&seq=modern1&orientation=landscape' },
    { id: 'traditional', name: 'Maison traditionnelle', image: 'https://readdy.ai/api/search-image?query=traditional%20French%20house%20facade%2C%20classic%20architecture%2C%20stone%20details%2C%20traditional%20windows%2C%20elegant%20design%2C%20white%20background%2C%20architectural%20photography%2C%20detailed%20exterior&width=600&height=400&seq=traditional1&orientation=landscape' },
    { id: 'haussmann', name: 'Immeuble Haussmannien', image: 'https://readdy.ai/api/search-image?query=Haussmann%20building%20facade%2C%20Parisian%20architecture%2C%20ornate%20details%2C%20classic%20French%20style%2C%20elegant%20stonework%2C%20white%20background%2C%20architectural%20photography%2C%20detailed%20exterior&width=600&height=400&seq=haussmann1&orientation=landscape' }
  ];

  const filteredColors = selectedCategory === 'all' 
    ? colors 
    : colors.filter(color => color.category === selectedCategory);

  const selectedColorData = colors.find(c => c.hex === selectedColor);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Simulateur de Couleurs de Façade
            </h1>
            <p className="text-xl text-gray-600">
              Visualisez votre façade avec différentes couleurs avant de commencer les travaux
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Controls */}
            <div className="lg:col-span-1 space-y-6">
              {/* House Style Selection */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Style de bâtiment
                </h2>
                <div className="space-y-3">
                  {houseStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setHouseStyle(style.id)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        houseStyle === style.id
                          ? 'border-orange-600 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Categories */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Catégories de couleurs
                </h2>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        selectedCategory === category.id
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Palette */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Palette de couleurs
                </h2>
                <div className="grid grid-cols-4 gap-3">
                  {filteredColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.hex)}
                      className={`aspect-square rounded-lg border-4 transition-all hover:scale-110 ${
                        selectedColor === color.hex
                          ? 'border-orange-600 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {color.hex === '#FFFFFF' && (
                        <div className="w-full h-full border border-gray-200 rounded"></div>
                      )}
                    </button>
                  ))}
                </div>
                
                {selectedColorData && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-lg mb-2">{selectedColorData.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Code: {selectedColorData.hex}</span>
                      <div 
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: selectedColorData.hex }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Custom Color */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Couleur personnalisée
                </h2>
                <div className="space-y-4">
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-900">
                    Aperçu de votre façade
                  </h2>
                  <p className="text-gray-600">
                    {houseStyles.find(s => s.id === houseStyle)?.name} - {selectedColorData?.name || 'Couleur personnalisée'}
                  </p>
                </div>
                
                <div className="relative">
                  <div className="aspect-w-16 aspect-h-10">
                    <img
                      src={houseStyles.find(s => s.id === houseStyle)?.image}
                      alt="Façade"
                      className="w-full h-96 object-cover"
                    />
                    {/* Color overlay simulation */}
                    <div 
                      className="absolute inset-0 mix-blend-multiply opacity-60"
                      style={{ backgroundColor: selectedColor }}
                    ></div>
                  </div>
                  
                  {/* Comparison toggle */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-white rounded-lg shadow-lg p-2">
                      <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded">
                        Voir l'original
                      </button>
                    </div>
                  </div>
                </div>

                {/* Color Information */}
                <div className="p-6 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-1">
                        {selectedColorData?.category === 'neutral' ? 'Intemporel' :
                         selectedColorData?.category === 'warm' ? 'Chaleureux' :
                         selectedColorData?.category === 'cool' ? 'Apaisant' : 'Moderne'}
                      </div>
                      <div className="text-sm text-gray-600">Style</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-1">
                        15-20 ans
                      </div>
                      <div className="text-sm text-gray-600">Durabilité</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-1">
                        Excellent
                      </div>
                      <div className="text-sm text-gray-600">Résistance UV</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="mt-6 bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Recommandations pour cette couleur
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <i className="ri-check-line text-green-600 mr-3 mt-1"></i>
                    <div>
                      <span className="font-medium">Peinture recommandée:</span>
                      <span className="text-gray-600 ml-2">Peinture acrylique haute qualité</span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <i className="ri-check-line text-green-600 mr-3 mt-1"></i>
                    <div>
                      <span className="font-medium">Nombre de couches:</span>
                      <span className="text-gray-600 ml-2">2 couches + sous-couche</span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <i className="ri-check-line text-green-600 mr-3 mt-1"></i>
                    <div>
                      <span className="font-medium">Entretien:</span>
                      <span className="text-gray-600 ml-2">Nettoyage annuel recommandé</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl p-8 text-center">
                <h3 className="text-xl font-bold mb-4">
                  Cette couleur vous plaît ?
                </h3>
                <p className="mb-6 opacity-90">
                  Demandez un devis personnalisé pour votre projet
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => window.REACT_APP_NAVIGATE('/quote-calculator')}
                    className="bg-white text-orange-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap font-medium"
                  >
                    Calculer mon devis
                  </button>
                  <button
                    onClick={() => window.REACT_APP_NAVIGATE('/contact')}
                    className="border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-orange-600 transition-colors whitespace-nowrap font-medium"
                  >
                    Demander conseil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
