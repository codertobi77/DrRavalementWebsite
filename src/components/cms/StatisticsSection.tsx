import { validateCmsData, deduplicateStatistics, logCmsError, createLoadingState } from "../../lib/cms-utils";
import { useCachedStatistics } from "../../lib/cms-cache";

export default function StatisticsSection() {
  const { data: rawStatistics, isLoading, isCached } = useCachedStatistics();

  // Validation et déduplication des données
  const statistics = validateCmsData(
    rawStatistics ?? undefined,
    deduplicateStatistics,
    "Aucune statistique disponible"
  );

  if (!statistics || isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto px-4">
        {createLoadingState(4).map((item) => (
          <div key={item._id} className="text-center animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
        {isCached && (
          <div className="col-span-full text-center text-sm text-orange-200 mt-2">
            <i className="ri-database-line mr-1"></i>
            Données chargées depuis le cache
          </div>
        )}
      </div>
    );
  }

  try {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto px-4">
        {statistics.map((stat) => (
          <div key={stat._id} className="text-center">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
              {stat.value}
            </div>
            <div className="text-orange-200 font-medium text-xs sm:text-sm lg:text-base">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    logCmsError("StatisticsSection", error, statistics);
    return (
      <div className="text-center text-white/70">
        <p>Erreur lors du chargement des statistiques</p>
      </div>
    );
  }
}
