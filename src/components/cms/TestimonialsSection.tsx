import { useState } from 'react';
import { validateCmsData, deduplicateTestimonials, logCmsError, createLoadingState } from "../../lib/cms-utils";
import { useCachedTestimonials } from "../../lib/cms-cache";

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { data: rawTestimonials, isLoading, isCached } = useCachedTestimonials();

  // Validation et déduplication des données
  const testimonials = validateCmsData(
    rawTestimonials,
    deduplicateTestimonials,
    "Aucun témoignage disponible"
  );

  const nextTestimonial = () => {
    if (testimonials && testimonials.length > 0) {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }
  };

  const prevTestimonial = () => {
    if (testimonials && testimonials.length > 0) {
      setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  if (!testimonials || testimonials.length === 0 || isLoading) {
    return (
      <div className="relative max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm p-8 animate-pulse">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              {createLoadingState(5).map((item) => (
                <div key={item._id} className="w-6 h-6 bg-gray-300 rounded mr-1"></div>
              ))}
            </div>
            <div className="h-8 bg-gray-300 rounded mb-8"></div>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
              <div className="text-left">
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        {isCached && (
          <div className="text-center text-sm text-white/70 mt-4">
            <i className="ri-database-line mr-1"></i>
            Données chargées depuis le cache
          </div>
        )}
      </div>
    );
  }

  try {
    const current = testimonials[currentTestimonial];

    return (
      <div className="relative max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm p-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="ri-star-fill text-yellow-400 text-xl"></i>
              ))}
            </div>
            <blockquote className="text-xl md:text-2xl text-white mb-8 leading-relaxed">
              "{current.text}"
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <img 
                src={current.image}
                alt={current.author}
                className="w-16 h-16 rounded-full object-cover border-3 border-white/20"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-avatar.jpg';
                }}
              />
              <div className="text-left">
                <h4 className="text-white font-semibold text-lg">{current.author}</h4>
                <p className="text-blue-200">{current.role}</p>
                <p className="text-blue-300 text-sm">{current.project}</p>
              </div>
            </div>
          </div>

          {testimonials.length > 1 && (
            <>
              <button 
                onClick={prevTestimonial}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200"
              >
                <i className="ri-arrow-left-line text-white text-xl"></i>
              </button>
              <button 
                onClick={nextTestimonial}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200"
              >
                <i className="ri-arrow-right-line text-white text-xl"></i>
              </button>
            </>
          )}
        </div>

        {testimonials.length > 1 && (
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentTestimonial ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    logCmsError("TestimonialsSection", error, testimonials);
    return (
      <div className="text-center text-white/70">
        <p>Erreur lors du chargement des témoignages</p>
      </div>
    );
  }
}
