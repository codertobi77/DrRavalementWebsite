import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

export default function InteractiveMap() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-8">
              <i className="ri-map-pin-line text-4xl text-orange-600"></i>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Carte Interactive
            </h1>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-8 mb-8">
              <h2 className="text-xl font-semibold text-orange-800 mb-4">
                Service Temporairement Indisponible
              </h2>
              <p className="text-orange-700 mb-6">
                Notre carte interactive des zones d'intervention est actuellement en maintenance. 
                Nous travaillons pour vous offrir une expérience de navigation optimale.
              </p>
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Nos zones d'intervention :</strong>
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Seine-et-Marne (77)</li>
                  <li>• Île-de-France</li>
                  <li>• Paris et proche banlieue</li>
                  <li>• Contactez-nous pour d'autres zones</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Vérifier la Zone
              </a>
              <a
                href="/booking"
                className="border border-orange-600 text-orange-600 px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors font-medium"
              >
                Prendre Rendez-vous
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}