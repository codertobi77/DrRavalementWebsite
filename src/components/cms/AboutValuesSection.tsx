import { validateCmsData, deduplicateByKey, logCmsError, createLoadingState } from "../../lib/cms-utils";
import { useCachedValues } from "../../lib/cms-cache";

export default function AboutValuesSection() {
  const { data: rawValues, isLoading, isCached } = useCachedValues();

  // Validation et déduplication des données
  const values = validateCmsData(
    rawValues,
    (items) => deduplicateByKey(items, 'title'),
    "Aucune valeur disponible"
  );

  if (!values || isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {createLoadingState(3).map((item) => (
          <div key={item._id} className="bg-white rounded-2xl p-8 shadow-lg text-center animate-pulse">
            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-6"></div>
            <div className="h-6 bg-gray-300 rounded mb-4"></div>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {values.map((value) => (
          <div key={value._id} className="bg-white rounded-2xl p-8 shadow-lg text-center hover:transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 hover:bg-orange-700 transition-colors">
              <i className={`${value.icon} text-2xl text-white`}></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
            <p className="text-gray-600">
              {value.description}
            </p>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    logCmsError("AboutValuesSection", error, values);
    return (
      <div className="text-center text-gray-600">
        <p>Erreur lors du chargement des valeurs</p>
      </div>
    );
  }
}
