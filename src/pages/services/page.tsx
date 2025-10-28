
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import ServicesSection from '../../components/cms/ServicesSection';
import ServicesProcessSection from '../../components/cms/ServicesProcessSection';
import TestCMSConnection from '../../components/cms/TestCMSConnection';
import CTALinksSection from '../../components/cms/CTALinksSection';

export default function Services() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-orange-900 via-orange-800 to-red-900">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Nos <span className="text-orange-400">Services</span>
              </h1>
              <p className="text-large text-orange-100 max-w-3xl mx-auto">
                Découvrez notre gamme complète de services.
              </p>
            </div>
          </div>
        </section>

        {/* Services Principaux */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-section-title text-gray-900 mb-4">Nos Spécialités</h2>
              <p className="text-large text-gray-600 max-w-3xl mx-auto">
                Des services complets pour tous vos projets de rénovation intérieure et extérieure.
              </p>
            </div>
            <ServicesSection />
          </div>
        </section>

        {/* Services Complémentaires */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-section-title text-gray-900 mb-4">Services Complémentaires</h2>
              <p className="text-large text-gray-600 max-w-3xl mx-auto">
                Une gamme étendue pour répondre à tous vos besoins
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <i className="ri-paint-brush-line text-2xl text-orange-600"></i>
                </div>
                <h3 className="text-card-title text-gray-900 mb-4">Peinture Extérieure Intérieure</h3>
                <p className="text-body text-gray-600 mb-4">
                  Application de peintures spécialisées avec protection longue durée.
                </p>
                <ul className="text-small text-gray-600 space-y-2">
                  <li>• Peintures anti-mousse</li>
                  <li>• Revêtements hydrofuges</li>
                  <li>• Finitions décoratives</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <i className="ri-hammer-line text-2xl text-orange-600"></i>
                </div>
                <h3 className="text-card-title text-gray-900 mb-4">Réparations Urgentes</h3>
                <p className="text-body text-gray-600 mb-4">
                  Intervention rapide pour tous types de réparations d'urgence.
                </p>
                <ul className="text-small text-gray-600 space-y-2">
                  <li>• Fissures façades</li>
                  <li>• Infiltrations d'eau</li>
                  <li>• Éléments détachés</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <i className="ri-leaf-line text-2xl text-orange-600"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Isolation Thermique</h3>
                <p className="text-gray-600 mb-4">
                  Solutions d'isolation pour améliorer les performances énergétiques.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• ITE (Isolation par l'extérieur)</li>
                  <li>• Matériaux écologiques</li>
                  <li>• Aides financières</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <i className="ri-water-percent-line text-2xl text-orange-600"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Rénovation d'intérieur</h3>
                <p className="text-gray-600 mb-4">
                  Travaux complets pour redonner confort, style et valeur à vos espaces intérieurs.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Peinture et revêtements muraux</li>
                  <li>• Pose de carrelage, parquet et faux plafonds</li>
                  <li>• Rénovation de cuisine et salle de bain</li>
                  <li>• Amélioration de l'isolation et de l'éclairage</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <i className="ri-building-line text-2xl text-orange-600"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Extensions</h3>
                <p className="text-gray-600 mb-4">
                  Agrandissement de votre habitat avec respect de l'existant.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Études de faisabilité</li>
                  <li>• Gros œuvre</li>
                  <li>• Finitions</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <i className="ri-tools-line text-2xl text-orange-600"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Maintenance</h3>
                <p className="text-gray-600 mb-4">
                  Contrats de maintenance pour préserver vos investissements.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Inspections régulières</li>
                  <li>• Entretien préventif</li>
                  <li>• Garantie étendue</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Processus */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre Processus</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Une méthode éprouvée pour la réussite de votre projet
              </p>
            </div>
            <ServicesProcessSection />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-900 to-red-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <CTALinksSection variant="hero">
              Besoin d'un Devis Personnalisé ?
            </CTALinksSection>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
