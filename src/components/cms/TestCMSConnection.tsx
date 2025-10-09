import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function TestCMSConnection() {
  const statistics = useQuery(api.cms.getStatistics);
  const services = useQuery(api.cms.getServices);
  const teamMembers = useQuery(api.cms.getTeamMembers);

  console.log("🔍 TestCMSConnection - Données reçues:");
  console.log("📊 Statistiques:", statistics);
  console.log("🔧 Services:", services);
  console.log("👥 Membres d'équipe:", teamMembers);

  return (
    <div className="p-4 bg-blue-100 border border-blue-300 rounded-lg">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">Test de Connexion CMS</h3>
      
      <div className="space-y-2">
        <p><strong>Statistiques:</strong> {statistics ? `${statistics.length} trouvées` : 'Chargement...'}</p>
        <p><strong>Services:</strong> {services ? `${services.length} trouvés` : 'Chargement...'}</p>
        <p><strong>Membres d'équipe:</strong> {teamMembers ? `${teamMembers.length} trouvés` : 'Chargement...'}</p>
      </div>

      {statistics && statistics.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-blue-900 mb-2">Première statistique:</h4>
          <p className="text-sm text-blue-700">
            {statistics[0].label}: {statistics[0].value}
          </p>
        </div>
      )}

      {teamMembers && teamMembers.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-blue-900 mb-2">Premier membre d'équipe:</h4>
          <p className="text-sm text-blue-700">
            {teamMembers[0].name} - {teamMembers[0].role}
          </p>
          <p className="text-xs text-blue-600">
            Image: {teamMembers[0].image ? 'Présente' : 'Absente'}
          </p>
        </div>
      )}
    </div>
  );
}
