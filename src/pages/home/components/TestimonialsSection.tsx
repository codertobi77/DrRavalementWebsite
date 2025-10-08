
import { useState } from 'react';

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      text: "RénoVision Pro a transformé notre maison au-delà de nos attentes. Leur expertise technologique et leur attention aux détails sont remarquables. Le projet a été livré dans les temps et le budget respecté.",
      author: "Marie Dubois",
      role: "Propriétaire",
      project: "Rénovation complète maison 200m²",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      text: "Excellent travail de ravalement sur notre façade. L'équipe DR RAVALEMENT est professionnelle et respecte les délais. Je recommande vivement leurs services.",
      author: "Jean Martin",
      role: "Propriétaire",
      project: "Ravalement façade 150m²",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      text: "Travaux de maçonnerie impeccables. DR RAVALEMENT a su répondre à toutes nos exigences avec un savoir-faire remarquable. Très satisfait du résultat final.",
      author: "Sophie Laurent",
      role: "Propriétaire",
      project: "Extension maison 80m²",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Témoignages Clients</h2>
          <p className="text-xl text-gray-300">La satisfaction de nos clients témoigne de notre expertise</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm p-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="ri-star-fill text-yellow-400 text-xl"></i>
                ))}
              </div>
              <blockquote className="text-xl md:text-2xl text-white mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              <div className="flex items-center justify-center space-x-4">
                <img 
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].author}
                  className="w-16 h-16 rounded-full object-cover border-3 border-white/20"
                />
                <div className="text-left">
                  <h4 className="text-white font-semibold text-lg">{testimonials[currentTestimonial].author}</h4>
                  <p className="text-blue-200">{testimonials[currentTestimonial].role}</p>
                  <p className="text-blue-300 text-sm">{testimonials[currentTestimonial].project}</p>
                </div>
              </div>
            </div>

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
          </div>

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
        </div>
      </div>
    </section>
  );
}
