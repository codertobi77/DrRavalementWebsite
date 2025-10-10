import { useState } from 'react';
import { validateCmsData, deduplicateStatistics, deduplicateServices, deduplicateZones, deduplicateReasons, deduplicateTestimonials } from "../../lib/cms-utils";
import { useCachedStatistics, useCachedServices, useCachedZones, useCachedReasons, useCachedTestimonials } from "../../lib/cms-cache";

export default function TestCMSConnection() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Récupérer toutes les données CMS avec cache
  const { data: rawStatistics, isCached: statsCached } = useCachedStatistics();
  const { data: rawServices, isCached: servicesCached } = useCachedServices();
  const { data: rawZones, isCached: zonesCached } = useCachedZones();
  const { data: rawReasons, isCached: reasonsCached } = useCachedReasons();
  const { data: rawTestimonials, isCached: testimonialsCached } = useCachedTestimonials();

  // Appliquer la déduplication
  const statistics = validateCmsData(rawStatistics, deduplicateStatistics);
  const services = validateCmsData(rawServices, deduplicateServices);
  const zones = validateCmsData(rawZones, deduplicateZones);
  const reasons = validateCmsData(rawReasons, deduplicateReasons);
  const testimonials = validateCmsData(rawTestimonials, deduplicateTestimonials);

  const getDuplicationInfo = (raw: any[], processed: any[], name: string, isCached: boolean) => {
    const duplicates = raw ? raw.length - (processed?.length || 0) : 0;
    return {
      name,
      total: raw?.length || 0,
      unique: processed?.length || 0,
      duplicates,
      hasDuplicates: duplicates > 0,
      isCached
    };
  };

  const dataInfo = [
    getDuplicationInfo(rawStatistics, statistics, "Statistiques", statsCached),
    getDuplicationInfo(rawServices, services, "Services", servicesCached),
    getDuplicationInfo(rawZones, zones, "Zones", zonesCached),
    getDuplicationInfo(rawReasons, reasons, "Raisons", reasonsCached),
    getDuplicationInfo(rawTestimonials, testimonials, "Témoignages", testimonialsCached),
  ];

  const totalDuplicates = dataInfo.reduce((sum, info) => sum + info.duplicates, 0);
  const hasAnyDuplicates = dataInfo.some(info => info.hasDuplicates);

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className={`px-4 py-2 rounded-lg shadow-lg transition-all ${
            hasAnyDuplicates 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          <i className="ri-database-line mr-2"></i>
          CMS Status
          {hasAnyDuplicates && (
            <span className="ml-2 bg-red-600 text-xs px-2 py-1 rounded-full">
              {totalDuplicates}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-xl border p-4 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">État CMS</h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <i className="ri-close-line"></i>
        </button>
      </div>

      <div className="space-y-2">
        {dataInfo.map((info) => (
          <div key={info.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">{info.name}:</span>
              {info.isCached && (
                <i className="ri-database-line text-blue-500 text-xs" title="Données en cache"></i>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded text-xs ${
                info.hasDuplicates ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {info.unique}/{info.total}
              </span>
              {info.hasDuplicates && (
                <span className="text-red-600 text-xs">
                  -{info.duplicates}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {hasAnyDuplicates && (
        <div className="mt-3 p-2 bg-red-50 rounded text-xs text-red-700">
          <i className="ri-warning-line mr-1"></i>
          {totalDuplicates} élément(s) dupliqué(s) détecté(s) et supprimé(s)
        </div>
      )}

      <div className="mt-3 space-y-1">
        <div className="text-xs text-gray-500">
          <i className="ri-check-line mr-1"></i>
          Déduplication automatique active
        </div>
        <div className="text-xs text-blue-500">
          <i className="ri-database-line mr-1"></i>
          Cache localStorage activé
        </div>
      </div>
    </div>
  );
}