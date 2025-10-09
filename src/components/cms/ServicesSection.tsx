import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function ServicesSection() {
  const services = useQuery(api.cms.getServices);

  if (!services) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-xl animate-pulse">
            <div className="h-64 bg-gray-300"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-300 rounded mb-3"></div>
              <div className="h-4 bg-gray-300 rounded mb-4"></div>
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-3 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {services.map((service) => (
        <div key={service._id} className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
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
  );
}
