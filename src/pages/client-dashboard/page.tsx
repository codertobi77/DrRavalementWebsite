import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

export default function ClientDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Icône de maintenance */}
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <i className="ri-tools-line text-4xl text-orange-600"></i>
            </div>
            
            {/* Titre principal */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Maintenance en cours
            </h1>
            
            {/* Sous-titre */}
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Notre espace client est temporairement indisponible pour des améliorations. 
              Nous travaillons pour vous offrir une meilleure expérience.
            </p>
            

            {/* Actions alternatives */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <a 
                href="/quote-calculator"
                className="bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center"
              >
                <i className="ri-calculator-line mr-2"></i>
                Demander un devis
              </a>
              
              <a 
                href="/contact"
                className="border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-xl font-semibold hover:bg-orange-50 transition-colors flex items-center justify-center"
              >
                <i className="ri-message-line mr-2"></i>
                Nous contacter
              </a>
              
              <a 
                href="/services"
                className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <i className="ri-service-line mr-2"></i>
                Nos services
                            </a>
                          </div>
            
            {/* Message d'excuse */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start">
                <i className="ri-information-line text-blue-600 text-xl mr-3 mt-1"></i>
                        <div>
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Merci pour votre patience
                  </h3>
                  <p className="text-blue-800">
                    Nous nous excusons pour la gêne occasionnée. L'espace client sera de nouveau 
                    accessible dans les plus brefs délais avec de nouvelles fonctionnalités.
                  </p>
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