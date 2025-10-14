
import Button from '../../../components/base/Button';
import StatisticsSection from '../../../components/cms/StatisticsSection';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-900 via-orange-800 to-red-900">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0"></div>
      </div>
      <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-16 h-16 sm:w-20 sm:h-20 bg-orange-400 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-24 h-24 sm:w-32 sm:h-32 bg-red-400 rounded-full opacity-20 blur-xl"></div>

      <div className="relative w-full px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-hero text-white mb-4 sm:mb-6">
            DR RAVALEMENT,
            <span className="block bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Votre partenaire de confiance
            </span>
          </h1>
          <p className="text-large text-orange-100 mb-6 sm:mb-8 max-w-4xl mx-auto px-4">
            Pour tous vos travaux de ravalement de façades, couverture, électricité, plomberie, serrurerie, carrelage, isolation et étude technique en Seine-et-Marne et en Île-de-France.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4">
          <Button variant="secondary" size="lg" href="/contact" className="shadow-xl flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-sm sm:text-base">Devis Gratuit Immédiat</span>
          </Button>
          <a href="/portfolio" className="flex items-center space-x-3 text-white hover:text-orange-200 transition-colors group w-full sm:w-auto justify-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center group-hover:bg-opacity-30 transition-all">
              <i className="ri-play-fill text-lg sm:text-xl"></i>
            </div>
            <span className="font-medium text-sm sm:text-base">Voir Nos Réalisations</span>
          </a>
        </div>

        <StatisticsSection />
      </div>
    </section>
  );
}