
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import CompanyHistorySection from '../../components/cms/CompanyHistorySection';
import AboutValuesSection from '../../components/cms/AboutValuesSection';
import AboutTeamSection from '../../components/cms/AboutTeamSection';
import AboutCertificationsSection from '../../components/cms/AboutCertificationsSection';
import TestCMSConnection from '../../components/cms/TestCMSConnection';
import CTALinksSection from '../../components/cms/CTALinksSection';

export default function About() {
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
                À Propos de <span className="text-orange-400 max-sm:text-4xl max-sm:block max-sm:mt-2">DR RAVALEMENT</span>
              </h1>
              <p className="text-large text-orange-100 max-w-3xl mx-auto">
                Depuis 2008, nous sommes votre partenaire de confiance pour tous vos travaux de ravalement de façades et de maçonnerie en Seine-et-Marne et Île-de-France.
              </p>
            </div>
          </div>
        </section>

        {/* Notre Histoire */}
        <CompanyHistorySection />

        {/* Nos Valeurs */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-section-title text-gray-900 mb-4">Nos Valeurs</h2>
              <p className="text-large text-gray-600 max-w-3xl mx-auto">
                Des principes qui guident chacune de nos interventions
              </p>
            </div>
            <AboutValuesSection />
          </div>
        </section>

        {/* Notre Équipe */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-section-title text-gray-900 mb-4">Notre Équipe</h2>
              <p className="text-large text-gray-600 max-w-3xl mx-auto">
                Des professionnels expérimentés à votre service
              </p>
            </div>
            <AboutTeamSection />
          </div>
        </section>

        {/* Certifications */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-section-title text-gray-900 mb-4">Certifications & Garanties</h2>
              <p className="text-large text-gray-600 max-w-3xl mx-auto">
                Votre sécurité et votre tranquillité d'esprit sont nos priorités
              </p>
            </div>
            <AboutCertificationsSection />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-900 to-red-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <CTALinksSection variant="hero">
              Prêt à Démarrer Votre Projet ?
            </CTALinksSection>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
