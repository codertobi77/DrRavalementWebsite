import { validateCmsData, logCmsError, createLoadingState } from "../../lib/cms-utils";
import { useCachedCompanyHistory } from "../../lib/cms-cache";

interface CompanyHistorySectionProps {
  className?: string;
}

export default function CompanyHistorySection({ 
  className = "" 
}: CompanyHistorySectionProps) {
  const { data: rawHistory, isLoading, isCached } = useCachedCompanyHistory();

  // Validation des données
  const history = validateCmsData(
    rawHistory ?? undefined,
    (data) => data,
    "Aucune information sur l'histoire de l'entreprise disponible"
  );

  if (!history || isLoading) {
    return (
      <div className={`py-20 bg-white ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="h-8 bg-gray-300 rounded mb-6 animate-pulse"></div>
              <div className="space-y-4 mb-6">
                {createLoadingState(2).map((item) => (
                  <div key={item._id} className="h-4 bg-gray-300 rounded animate-pulse"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {createLoadingState(2).map((item) => (
                  <div key={item._id} className="text-center animate-pulse">
                    <div className="h-8 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="h-96 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>
          </div>
          {isCached && (
            <div className="text-center text-sm text-gray-500 mt-4">
              <i className="ri-database-line mr-1"></i>
              Données chargées depuis le cache
            </div>
          )}
        </div>
      </div>
    );
  }

  try {
    return (
      <div className={`py-20 bg-white ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {history.title}
              </h2>
              <div className="space-y-6">
                {history.paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-lg text-gray-600">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              {/* Statistiques */}
              {history.statistics && history.statistics.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  {history.statistics.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {stat.value}
                      </div>
                      <div className="text-gray-600">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Image */}
            <div className="relative">
              {history.image && (
                <div className="relative rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src={history.image} 
                    alt={history.title || "Histoire de l'entreprise"}
                    className="w-full h-96 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              )}
            </div>
          </div>
          
          {isCached && (
            <div className="text-center text-sm text-gray-500 mt-8">
              <i className="ri-database-line mr-1"></i>
              Données chargées depuis le cache
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    logCmsError("CompanyHistorySection", error, history);
    return (
      <div className={`py-20 bg-white ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <i className="ri-error-warning-line text-2xl text-red-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Erreur de chargement
            </h2>
            <p className="text-gray-600">
              Impossible de charger l'histoire de l'entreprise. Veuillez réessayer plus tard.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
