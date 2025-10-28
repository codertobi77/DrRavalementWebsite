
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import PortfolioStatsSection from '../../components/cms/PortfolioStatsSection';
import PortfolioProjectsSection from '../../components/cms/PortfolioProjectsSection';
import TestimonialsSection from '../../components/cms/TestimonialsSection';
import TestCMSConnection from '../../components/cms/TestCMSConnection';
import CTALinksSection from '../../components/cms/CTALinksSection';

export default function Portfolio() {

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-orange-900 via-orange-800 to-red-900">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Nos <span className="text-orange-400">Réalisations</span>
              </h1>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto">
                Découvrez des ouvrages de rénovation alliant solidité et précision.
              </p>
            </div>
          </div>
        </section>

        {/* Statistiques */}
        <PortfolioStatsSection />

        {/* Galerie de Projets avec Filtres */}
        <PortfolioProjectsSection />

        {/* Témoignages */}
        <section className="py-20 bg-gradient-to-br from-orange-900 via-orange-800 to-red-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Ce Que Disent Nos Clients</h2>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto">
                La satisfaction de nos clients témoigne de la qualité de nos réalisations
              </p>
            </div>
            <TestimonialsSection />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-900 to-red-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <CTALinksSection variant="hero" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
