
import TestimonialsSection from '../../../components/cms/TestimonialsSection';

export default function TestimonialsSectionWrapper() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Témoignages Clients</h2>
          <p className="text-xl text-gray-300">La satisfaction de nos clients témoigne de notre expertise</p>
        </div>

        <TestimonialsSection />
      </div>
    </section>
  );
}
