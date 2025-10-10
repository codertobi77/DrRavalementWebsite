import { validateCmsData, deduplicateByKey, logCmsError, createLoadingState } from "../../lib/cms-utils";
import { useCachedCertifications } from "../../lib/cms-cache";

export default function AboutCertificationsSection() {
  const { data: rawCertifications, isLoading, isCached } = useCachedCertifications();

  // Validation et déduplication des données
  const certifications = validateCmsData(
    rawCertifications,
    (items) => deduplicateByKey(items, 'title'),
    "Aucune certification disponible"
  );

  if (!certifications || isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {createLoadingState(4).map((item) => (
          <div key={item._id} className="bg-white rounded-xl p-6 text-center shadow-lg animate-pulse">
            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
        {isCached && (
          <div className="col-span-full text-center text-sm text-gray-500 mt-4">
            <i className="ri-database-line mr-1"></i>
            Données chargées depuis le cache
          </div>
        )}
      </div>
    );
  }

  try {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {certifications.map((certification) => (
          <div key={certification._id} className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-orange-200 transition-colors">
              <i className={`${certification.icon} text-2xl text-orange-600`}></i>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{certification.title}</h3>
            <p className="text-gray-600 text-sm">{certification.description}</p>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    logCmsError("AboutCertificationsSection", error, certifications);
    return (
      <div className="text-center text-gray-600">
        <p>Erreur lors du chargement des certifications</p>
      </div>
    );
  }
}
