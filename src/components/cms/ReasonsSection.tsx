import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { validateCmsData, deduplicateReasons, logCmsError, createLoadingState } from "../../lib/cms-utils";

export default function ReasonsSection() {
  const rawReasons = useQuery(api.cms.getReasons);

  // Validation et déduplication des données
  const reasons = validateCmsData(
    rawReasons,
    deduplicateReasons,
    "Aucune raison disponible"
  );

  if (!reasons) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {createLoadingState(3).map((item) => (
          <div key={item._id} className="text-center animate-pulse">
            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <div className="h-6 bg-gray-300 rounded mb-3"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  try {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reasons.map((reason) => (
          <div key={reason._id} className="text-center hover:transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-orange-700 transition-colors">
              <i className={`${reason.icon} text-2xl text-white`}></i>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">{reason.title}</h3>
            <p className="text-gray-300">{reason.description}</p>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    logCmsError("ReasonsSection", error, reasons);
    return (
      <div className="text-center text-gray-300">
        <p>Erreur lors du chargement des raisons</p>
      </div>
    );
  }
}
