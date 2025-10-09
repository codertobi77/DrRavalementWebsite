
import ServicesSection from '../../../components/cms/ServicesSection';

export default function ServicesSectionWrapper() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Spécialités DR RAVALEMENT</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Techniques modernes de ravalement par projection machine, maçonnerie générale et solutions de couverture pour tous vos projets.
          </p>
        </div>

        <ServicesSection />
      </div>
    </section>
  );
}
