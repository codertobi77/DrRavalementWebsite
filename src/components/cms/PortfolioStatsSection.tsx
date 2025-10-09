import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { validateCmsData, deduplicateStatistics, logCmsError, createLoadingState } from "../../lib/cms-utils";

export default function PortfolioStatsSection() {
  const rawStatistics = useQuery(api.cms.getStatistics);

  // Validation et déduplication des données
  const statistics = validateCmsData(
    rawStatistics,
    deduplicateStatistics,
    "Aucune statistique disponible"
  );

  if (!statistics) {
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
