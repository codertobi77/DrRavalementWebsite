import { validateCmsData, deduplicateByKey, logCmsError, createLoadingState } from "../../lib/cms-utils";
import { useCachedTeamMembers } from "../../lib/cms-cache";

export default function AboutTeamSection() {
  const { data: rawTeamMembers, isLoading, isCached } = useCachedTeamMembers();

  // Validation et déduplication des données
  const teamMembers = validateCmsData(
    rawTeamMembers,
    (items) => deduplicateByKey(items, 'name'),
    "Aucun membre d'équipe disponible"
  );

  if (!teamMembers || isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {createLoadingState(3).map((item) => (
          <div key={item._id} className="text-center animate-pulse">
            <div className="w-48 h-48 bg-gray-300 rounded-full mx-auto mb-6"></div>
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-5 bg-gray-300 rounded mb-4"></div>
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
        {teamMembers.map((member) => (
          <div key={member._id} className="text-center hover:transform hover:scale-105 transition-all duration-300">
            <img 
              src={member.image}
              alt={member.name}
              className="w-48 h-48 rounded-full mx-auto mb-6 object-cover border-4 border-orange-100 hover:border-orange-300 transition-colors"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-avatar.jpg';
              }}
            />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
            <p className="text-orange-600 font-medium mb-4">{member.role}</p>
            <p className="text-gray-600">
              {member.description}
            </p>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    logCmsError("AboutTeamSection", error, teamMembers);
    return (
      <div className="text-center text-gray-600">
        <p>Erreur lors du chargement de l'équipe</p>
      </div>
    );
  }
}
