
import { useState } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';

interface QuoteData {
  projectType: string;
  surface: number;
  materials: string[];
  urgency: string;
  location: string;
}

export default function QuoteCalculator() {
  const [step, setStep] = useState(1);
  const [quoteData, setQuoteData] = useState<QuoteData>({
    projectType: '',
    surface: 0,
    materials: [],
    urgency: '',
    location: ''
  });
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  const projectTypes = [
    { id: 'ravalement', name: 'Ravalement de façade', basePrice: 45 },
    { id: 'isolation', name: 'Isolation thermique', basePrice: 65 },
    { id: 'maconnerie', name: 'Maçonnerie générale', basePrice: 55 },
    { id: 'couverture', name: 'Couverture', basePrice: 75 },
    { id: 'cloture', name: 'Clôture parpaing', basePrice: 35 }
  ];

  const materials = [
    { id: 'standard', name: 'Matériaux standard', multiplier: 1 },
    { id: 'premium', name: 'Matériaux premium', multiplier: 1.3 },
    { id: 'eco', name: 'Matériaux écologiques', multiplier: 1.2 },
    { id: 'luxury', name: 'Matériaux haut de gamme', multiplier: 1.6 }
  ];

  const urgencyOptions = [
    { id: 'normal', name: 'Délai normal (4-6 semaines)', multiplier: 1 },
    { id: 'urgent', name: 'Urgent (2-3 semaines)', multiplier: 1.2 },
    { id: 'emergency', name: 'Urgence (1 semaine)', multiplier: 1.5 }
  ];

  const calculateEstimate = () => {
    const projectType = projectTypes.find(p => p.id === quoteData.projectType);
    const materialMultiplier = materials.find(m => quoteData.materials.includes(m.id))?.multiplier || 1;
    const urgencyMultiplier = urgencyOptions.find(u => u.id === quoteData.urgency)?.multiplier || 1;
    
    if (projectType && quoteData.surface > 0) {
      const basePrice = projectType.basePrice * quoteData.surface;
      const finalPrice = basePrice * materialMultiplier * urgencyMultiplier;
      setEstimatedPrice(Math.round(finalPrice));
    }
  };

  const handleMaterialChange = (materialId: string) => {
    setQuoteData(prev => ({
      ...prev,
      materials: prev.materials.includes(materialId) 
        ? prev.materials.filter(m => m !== materialId)
        : [...prev.materials, materialId]
    }));
  };

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
    if (step === 4) calculateEstimate();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Calculateur de Devis Interactif
            </h1>
            <p className="text-xl text-gray-600">
              Obtenez une estimation instantanée pour vos travaux de rénovation
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4, 5].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    stepNumber <= step
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {stepNumber}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Step 1: Project Type */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Quel type de projet souhaitez-vous réaliser ?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setQuoteData(prev => ({ ...prev, projectType: type.id }))}
                      className={`p-6 rounded-xl border-2 text-left transition-all ${
                        quoteData.projectType === type.id
                          ? 'border-orange-600 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <h3 className="font-semibold text-lg mb-2">{type.name}</h3>
                      <p className="text-gray-600">À partir de {type.basePrice}€/m²</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Surface */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Quelle est la surface à traiter ?
                </h2>
                <div className="max-w-md mx-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Surface en m²
                  </label>
                  <input
                    type="number"
                    value={quoteData.surface || ''}
                    onChange={(e) => setQuoteData(prev => ({ ...prev, surface: Number(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                    placeholder="Ex: 150"
                    min="1"
                  />
                  <p className="text-gray-500 text-sm mt-2">
                    Entrez la surface totale à traiter en mètres carrés
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Materials */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Quels matériaux souhaitez-vous utiliser ?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {materials.map((material) => (
                    <button
                      key={material.id}
                      onClick={() => handleMaterialChange(material.id)}
                      className={`p-6 rounded-xl border-2 text-left transition-all ${
                        quoteData.materials.includes(material.id)
                          ? 'border-orange-600 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <h3 className="font-semibold text-lg mb-2">{material.name}</h3>
                      <p className="text-gray-600">
                        {material.multiplier > 1 ? `+${Math.round((material.multiplier - 1) * 100)}%` : 'Prix de base'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Urgency */}
            {step === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Quel est votre délai souhaité ?
                </h2>
                <div className="space-y-4">
                  {urgencyOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setQuoteData(prev => ({ ...prev, urgency: option.id }))}
                      className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
                        quoteData.urgency === option.id
                          ? 'border-orange-600 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <h3 className="font-semibold text-lg mb-2">{option.name}</h3>
                      <p className="text-gray-600">
                        {option.multiplier > 1 ? `Supplément: +${Math.round((option.multiplier - 1) * 100)}%` : 'Aucun supplément'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Results */}
            {step === 5 && (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Votre estimation personnalisée
                </h2>
                
                {estimatedPrice && (
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl p-8 mb-8">
                    <div className="text-5xl font-bold mb-2">
                      {estimatedPrice.toLocaleString('fr-FR')}€
                    </div>
                    <p className="text-xl opacity-90">Estimation pour vos travaux</p>
                    <p className="text-sm opacity-75 mt-2">
                      *Prix indicatif, devis détaillé sur demande
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                  <h3 className="font-semibold text-lg mb-4">Récapitulatif de votre projet</h3>
                  <div className="space-y-2 text-left">
                    <div className="flex justify-between">
                      <span>Type de projet:</span>
                      <span className="font-medium">
                        {projectTypes.find(p => p.id === quoteData.projectType)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Surface:</span>
                      <span className="font-medium">{quoteData.surface} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Matériaux:</span>
                      <span className="font-medium">
                        {materials.find(m => quoteData.materials.includes(m.id))?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Délai:</span>
                      <span className="font-medium">
                        {urgencyOptions.find(u => u.id === quoteData.urgency)?.name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button href="/contact" className="bg-orange-600 hover:bg-orange-700">
                    Demander un devis détaillé
                  </Button>
                  <button
                    onClick={() => {
                      setStep(1);
                      setQuoteData({ projectType: '', surface: 0, materials: [], urgency: '', location: '' });
                      setEstimatedPrice(null);
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    Nouvelle estimation
                  </button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {step < 5 && (
              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  disabled={step === 1}
                  className={`px-6 py-3 rounded-lg transition-colors whitespace-nowrap ${
                    step === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Précédent
                </button>
                <button
                  onClick={nextStep}
                  disabled={
                    (step === 1 && !quoteData.projectType) ||
                    (step === 2 && quoteData.surface <= 0) ||
                    (step === 3 && quoteData.materials.length === 0) ||
                    (step === 4 && !quoteData.urgency)
                  }
                  className={`px-6 py-3 rounded-lg transition-colors whitespace-nowrap ${
                    (step === 1 && !quoteData.projectType) ||
                    (step === 2 && quoteData.surface <= 0) ||
                    (step === 3 && quoteData.materials.length === 0) ||
                    (step === 4 && !quoteData.urgency)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                >
                  {step === 4 ? 'Calculer' : 'Suivant'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
