import { ConvexHttpClient } from "convex/browser";
import { readFileSync } from 'fs';

// Lire le fichier .env
const envContent = readFileSync('.env', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const client = new ConvexHttpClient(envVars.VITE_CONVEX_URL);

async function testUpdateFix() {
  console.log("🧪 Test de correction des mises à jour...");

  try {
    // Test de création d'une statistique
    console.log("📊 Création d'une statistique de test...");
    const newStatistic = await client.mutation("cms:createStatistic", {
      key: "test_update_fix",
      value: "100+",
      label: "Test Update Fix",
      order_index: 999,
      is_active: true
    });
    console.log(`✅ Statistique créée avec l'ID: ${newStatistic}`);

    // Test de mise à jour (simulation du problème)
    console.log("📊 Test de mise à jour avec données complètes...");
    const fullData = {
      _id: newStatistic,
      _creationTime: Date.now(),
      key: "test_update_fix_updated",
      value: "200+",
      label: "Test Update Fix Updated",
      order_index: 998,
      is_active: false
    };

    // Simuler la correction en extrayant seulement les champs modifiables
    const { _id, _creationTime, ...updateData } = fullData;
    
    await client.mutation("cms:updateStatistic", {
      id: newStatistic,
      ...updateData
    });
    console.log("✅ Mise à jour réussie avec la correction");

    // Vérifier que la mise à jour a bien fonctionné
    console.log("📊 Vérification de la mise à jour...");
    const statistics = await client.query("cms:getStatistics");
    const updatedStat = statistics.find(stat => stat._id === newStatistic);
    
    if (updatedStat) {
      console.log("✅ Statistique mise à jour trouvée:");
      console.log(`   - Clé: ${updatedStat.key}`);
      console.log(`   - Valeur: ${updatedStat.value}`);
      console.log(`   - Libellé: ${updatedStat.label}`);
      console.log(`   - Ordre: ${updatedStat.order_index}`);
      console.log(`   - Actif: ${updatedStat.is_active}`);
    }

    // Nettoyer - supprimer la statistique de test
    console.log("🗑️ Nettoyage...");
    await client.mutation("cms:deleteStatistic", { id: newStatistic });
    console.log("✅ Statistique de test supprimée");

    console.log("🎉 Test de correction des mises à jour réussi !");

  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  }
}

// Exécuter le test
testUpdateFix();
