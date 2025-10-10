import { validateCmsData, deduplicateStatistics, logCmsError, useOptimizedCmsData } from "../../lib/cms-utils";
import { useCachedStatistics } from "../../lib/cms-cache";
import OptimizedLoader, { CardSkeleton } from "../base/OptimizedLoader";

export default function StatisticsSection() {
  const { data: rawStatistics, isLoading, isCached } = useCachedStatistics();

  // Utilisation du hook optimisé avec cache de 15 secondes
  const { data: optimizedStatistics, isLoading: isOptimizedLoading, error } = useOptimizedCmsData(
    () => rawStatistics,
    'statistics-section',
    deduplicateStatistics
  );

  // Validation des données
  const statistics = validateCmsData(
    optimizedStatistics ?? undefined,
    deduplicateStatistics,
    "Aucune statistique disponible"
  );

  if (!statistics || isLoading || isOptimizedLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto px-4">
        <CardSkeleton className="col-span-1" />
        <CardSkeleton className="col-span-1" />
        <CardSkeleton className="col-span-1" />
        <CardSkeleton className="col-span-1" />
        {isCached && (
          <div className="col-span-full text-center text-sm text-orange-200 mt-2">
            <i className="ri-database-line mr-1"></i>
            Données chargées depuis le cache (15s)
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">
          <i className="ri-error-warning-line text-2xl"></i>
        </div>
        <p className="text-gray-600">Erreur lors du chargement des statistiques</p>
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
