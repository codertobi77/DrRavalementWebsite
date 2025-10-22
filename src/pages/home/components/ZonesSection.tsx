
import ZonesSection from '../../../components/cms/ZonesSection';

export default function ZonesSectionWrapper() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Zones d'Intervention</h2>
          <p className="text-gray-600 mb-8">
            DR RAVALEMENT intervient dans toute l'Île-de-France
          </p>
          <ZonesSection />
        </div>
      </div>
    </section>
  );
}
