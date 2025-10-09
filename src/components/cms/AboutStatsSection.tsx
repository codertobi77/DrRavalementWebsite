import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { validateCmsData, deduplicateStatistics, logCmsError, createLoadingState } from "../../lib/cms-utils";

export default function AboutStatsSection() {
  const rawStatistics = useQuery(api.cms.getStatistics);

  // Validation et déduplication des données
  const statistics = validateCmsData(
    rawStatistics,
    deduplicateStatistics,
    "Aucune statistique disponible"
  );

  if (!statistics) {
    return (
      <div className="grid grid-cols-2 gap-6">
        {createLoadingState(2).map((item) => (
          <div key={item._id} className="text-center animate-pulse">
            <div className="h-10 bg-gray-300 rounded mb-2"></div>
            <div className="h-5 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  try {
    // Prendre seulement les 2 premières statistiques pour cette section
    const displayStats = statistics.slice(0, 2);

    return (
      <div className="grid grid-cols-2 gap-6">
        {displayStats.map((stat) => (
          <div key={stat._id} className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {stat.value}
            </div>
            <div className="text-gray-600">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    logCmsError("AboutStatsSection", error, statistics);
    return (
      <div className="text-center text-gray-600">
        <p>Erreur lors du chargement des statistiques</p>
      </div>
    );
  }
}
