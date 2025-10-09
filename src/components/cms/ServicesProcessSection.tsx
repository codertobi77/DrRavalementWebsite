import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { validateCmsData, deduplicateByKey, logCmsError, createLoadingState } from "../../lib/cms-utils";

export default function ServicesProcessSection() {
  const rawProcessSteps = useQuery(api.cms.getProcessSteps);

  // Validation et déduplication des données
  const processSteps = validateCmsData(
    rawProcessSteps,
    (items) => deduplicateByKey(items, 'title'),
    "Aucune étape de processus disponible"
  );

  if (!processSteps) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {createLoadingState(4).map((item, index) => (
          <div key={item._id} className="text-center animate-pulse">
            <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-6"></div>
            <div className="h-6 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  try {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {processSteps.map((step, index) => (
          <div key={step._id} className="text-center hover:transform hover:scale-105 transition-all duration-300">
            <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 hover:bg-orange-700 transition-colors">
              <span className="text-2xl font-bold text-white">{index + 1}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
            <p className="text-gray-600">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    logCmsError("ServicesProcessSection", error, processSteps);
    return (
      <div className="text-center text-gray-600">
        <p>Erreur lors du chargement du processus</p>
      </div>
    );
  }
}
