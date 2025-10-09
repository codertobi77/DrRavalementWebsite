import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

export default function BeforeAfter() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-8">
              <i className="ri-image-line text-4xl text-orange-600"></i>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Avant/Après
            </h1>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-8 mb-8">
              <h2 className="text-xl font-semibold text-orange-800 mb-4">
                Galerie Temporairement Indisponible
              </h2>
              <p className="text-orange-700 mb-6">
                Notre galerie avant/après est actuellement en maintenance. 
                Nous mettons à jour nos réalisations pour vous offrir une meilleure expérience.
              </p>
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Découvrez nos réalisations :</strong>
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Consultez notre portfolio de réalisations</li>
                  <li>• Demandez des références par téléphone</li>
                  <li>• Visitez nos chantiers en cours</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/portfolio"
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Voir le Portfolio
              </a>
              <a
                href="/contact"
                className="border border-orange-600 text-orange-600 px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors font-medium"
              >
                Demander des Références
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}