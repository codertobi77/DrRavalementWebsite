import { validateCmsData, deduplicateStatistics, logCmsError, createLoadingState } from "../../lib/cms-utils";
import { useCachedStatistics } from "../../lib/cms-cache";

export default function PortfolioStatsSection() {
  const { data: rawStatistics, isLoading, isCached } = useCachedStatistics();

  // Validation et déduplication des données
  const statistics = validateCmsData(
    rawStatistics,
    deduplicateStatistics,
    "Aucune statistique disponible"
  );

  if (!statistics || isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {createLoadingState(4).map((item) => (
              <div key={item._id} className="text-center animate-pulse">
                <div className="h-12 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
          {isCached && (
            <div className="text-center text-sm text-gray-500 mt-4">
              <i className="ri-database-line mr-1"></i>
              Données chargées depuis le cache
            </div>
          )}
        </div>
      </section>
    );
  }

  try {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statistics.map((stat) => (
              <div key={stat._id} className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          
          {/* Lien vers la galerie Avant-Après */}
          <div className="text-center mt-12">
            <p className="text-lg text-gray-600 mb-4">
              Vous voulez voir notre galerie avant/après ?
            </p>
            <a 
              href="/before-after"
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <i className="ri-image-line mr-2"></i>
              Découvrir nos transformations
            </a>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    logCmsError("PortfolioStatsSection", error, statistics);
    return (
      <div className="text-center py-8 text-gray-600">
        <p>Erreur lors du chargement des statistiques</p>
      </div>
    );
  }
}
