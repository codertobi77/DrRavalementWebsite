import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { validateCmsData, deduplicateZones, logCmsError, createLoadingState } from "../../lib/cms-utils";

export default function ZonesSection() {
  const rawZones = useQuery(api.cms.getZones);

  // Validation et déduplication des données
  const zones = validateCmsData(
    rawZones,
    deduplicateZones,
    "Aucune zone d'intervention disponible"
  );

  if (!zones) {
    return (
      <div className="flex flex-wrap justify-center gap-4">
        {createLoadingState(6).map((item) => (
          <div key={item._id} className="bg-gray-300 rounded-full px-4 py-2 h-8 w-24 animate-pulse"></div>
        ))}
      </div>
    );
  }

  try {
    return (
      <div className="flex flex-wrap justify-center gap-4">
        {zones.map((zone) => (
          <span 
            key={zone._id}
            className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-medium hover:bg-orange-200 transition-colors"
          >
            {zone.name}
          </span>
        ))}
      </div>
    );
  } catch (error) {
    logCmsError("ZonesSection", error, zones);
    return (
      <div className="text-center text-gray-600">
        <p>Erreur lors du chargement des zones</p>
      </div>
    );
  }
}
