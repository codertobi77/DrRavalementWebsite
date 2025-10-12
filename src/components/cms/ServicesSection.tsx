import { validateCmsData, deduplicateServices, logCmsError, createLoadingState } from "../../lib/cms-utils";
import { useCachedServices } from "../../lib/cms-cache";
import { useState } from "react";
import ServiceDetailsModal from "./ServiceDetailsModal";

export default function ServicesSection() {
  const { data: rawServices, isLoading, error, isCached } = useCachedServices();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Validation et déduplication des données
  const services = validateCmsData(
    rawServices,
    deduplicateServices,
    "Aucun service disponible"
  );

  const handleServiceClick = (service: any) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  if (!services || isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {createLoadingState(3).map((item) => (
          <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-xl animate-pulse">
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
        {isCached && (
          <div className="col-span-full text-center text-sm text-gray-500 mt-2">
            <i className="ri-database-line mr-1"></i>
            Données chargées depuis le cache
          </div>
        )}
      </div>
    );
  }

  try {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service._id} className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-service.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                {service.objective && (
                  <div className="mb-4 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                    <h4 className="text-sm font-semibold text-orange-800 mb-1">Objectif</h4>
                    <p className="text-sm text-orange-700">{service.objective}</p>
                  </div>
                )}
                <ul className="space-y-2 mb-6">
                  {service.features?.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <i className="ri-check-line text-orange-600"></i>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  )) || []}
                </ul>
                <button 
                  onClick={() => handleServiceClick(service)}
                  className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                >
                  En savoir plus
                  <i className="ri-arrow-right-line ml-2"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Modal des détails du service */}
        <ServiceDetailsModal 
          service={selectedService}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </>
    );
  } catch (error) {
    logCmsError("ServicesSection", error, services);
    return (
      <div className="text-center text-gray-600">
        <p>Erreur lors du chargement des services</p>
      </div>
    );
  }
}
