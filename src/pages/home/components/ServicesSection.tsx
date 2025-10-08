
export default function ServicesSection() {
  const services = [
    {
      title: "Ravalement de Façades",
      description: "Rénovation complète de façades avec techniques modernes de projection machine et finitions variées.",
      image: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=600",
      features: [
        "Projection machine",
        "Finitions grattée, talochée, lissée",
        "Isolation thermique",
        "Nettoyage haute pression"
      ]
    },
    {
      title: "Maçonnerie Générale",
      description: "Travaux de maçonnerie pour constructions neuves, extensions et réparations de structures.",
      image: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=600",
      features: [
        "Murs en parpaing",
        "Clôtures et murets",
        "Fondations",
        "Réparations structurelles"
      ]
    },
    {
      title: "Couverture & Étanchéité",
      description: "Services complets de couverture, réparation de toitures et solutions d'étanchéité.",
      image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600",
      features: [
        "Réfection de toiture",
        "Étanchéité terrasse",
        "Zinguerie",
        "Isolation toiture"
      ]
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Spécialités DR RAVALEMENT</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Techniques modernes de ravalement par projection machine, maçonnerie générale et solutions de couverture pour tous vos projets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <i className="ri-check-line text-orange-600"></i>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a href="/services" className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                  En savoir plus
                  <i className="ri-arrow-right-line ml-2"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
