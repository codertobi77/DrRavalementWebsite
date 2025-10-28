import { validateCmsData, deduplicateServices, logCmsError, createLoadingState } from "../../lib/cms-utils";
import { useCachedServices } from "../../lib/cms-cache";
import { useState } from "react";
import ServiceDetailsModal from "./ServiceDetailsModal";
import { Link } from "react-router-dom";

/**
 * Props:
 * - variant: "homepage" | "services"
 *   - "homepage": compact card, fewer details, no modal, show max 3, no "objective" section, not clickable (no CTA "en savoir plus")
 *   - "services": default detailed cards, include modal, show all and always show "en savoir plus" etc.
 * Default: "services"
 */
function ServicesSection({ variant = "services" }: { variant?: "homepage" | "services" }) {
  const { data: rawServices, isLoading, error, isCached } = useCachedServices();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Validation et déduplication des données
  // Fix TS warning by forcing empty array if nullish
  const services = validateCmsData(
    rawServices ?? [],
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
    // Use 3 loaders for both variants, but could make this conditional too
    const loadingCount = 3;
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {createLoadingState(loadingCount).map((item) => (
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
    // HOMEPAGE: compact, no CTA, only 3, no modal, no "objective"
    if (variant === "homepage") {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(services.slice(0, 3)).map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-service.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 line-clamp-3">
                    {service.title === "Ravalement & Maçonnerie" && (
                      <>
                        Redonnez éclat et solidité à votre habitation grâce à nos services complets de rénovation, de ravalement et de maçonnerie.
                      </>
                    )}
                    {service.title === "Isolation & Performance Énergétique" && (
                      <>
                        Montage de structures porteuses, réalisation d’ouvertures sur porteurs, chaînages raidisseurs avec ferraillage, et scellement chimique pour renforts. Nos équipes manipulent béton armé, moellons, parpaings et briques avec procédures de coulage et de vibration strictes. Respect total des normes parasismiques et DTU.
                      </>
                    )}
                    {service.title === "Électricité" && (
                      <>
                        Nous garantissons la sécurité et la performance de vos installations électriques, en neuf comme en rénovation...
                      </>
                    )}
                    {!["Ravalement & Maçonnerie", "Isolation & Performance Énergétique", "Électricité"].includes(service.title) && (
                      <>
                        {service.description}
                      </>
                    )}
                  </p>
                  {/* No button, no modal, no objective for homepage */}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Link
              to="/services"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-orange-600 text-white font-semibold text-lg shadow hover:bg-orange-700 transition-colors"
            >
              Voir tous nos services
              <i className="ri-arrow-right-line ml-2"></i>
            </Link>
          </div>
        </>
      );
    }

    // SERVICES: detailed, full CTA and modal
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
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

export default ServicesSection;

