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

async function testCRUDOperations() {
  console.log("🧪 Test des opérations CRUD du CMS...");

  try {
    // Test de création d'une statistique
    console.log("📊 Test de création d'une statistique...");
    const newStatistic = await client.mutation("cms:createStatistic", {
      key: "test_statistic",
      value: "100+",
      label: "Test Statistic",
      order_index: 999,
      is_active: true
    });
    console.log(`✅ Statistique créée avec l'ID: ${newStatistic}`);

    // Test de lecture des statistiques
    console.log("📊 Test de lecture des statistiques...");
    const statistics = await client.query("cms:getStatistics");
    console.log(`✅ ${statistics.length} statistiques trouvées`);

    // Test de mise à jour d'une statistique
    console.log("📊 Test de mise à jour d'une statistique...");
    await client.mutation("cms:updateStatistic", {
      id: newStatistic,
      key: "test_statistic_updated",
      value: "200+",
      label: "Test Statistic Updated",
      order_index: 998,
      is_active: false
    });
    console.log("✅ Statistique mise à jour");

    // Test de création d'un service
    console.log("🔧 Test de création d'un service...");
    const newService = await client.mutation("cms:createService", {
      title: "Service Test",
      description: "Description du service test",
      image: "https://example.com/test.jpg",
      features: ["Fonctionnalité 1", "Fonctionnalité 2"],
      order_index: 999,
      is_active: true
    });
    console.log(`✅ Service créé avec l'ID: ${newService}`);

    // Test de création d'une zone
    console.log("📍 Test de création d'une zone...");
    const newZone = await client.mutation("cms:createZone", {
      name: "Zone Test",
      order_index: 999,
      is_active: true
    });
    console.log(`✅ Zone créée avec l'ID: ${newZone}`);

    // Test de création d'une raison
    console.log("👍 Test de création d'une raison...");
    const newReason = await client.mutation("cms:createReason", {
      title: "Raison Test",
      description: "Description de la raison test",
      icon: "ri-star-line",
      order_index: 999,
      is_active: true
    });
    console.log(`✅ Raison créée avec l'ID: ${newReason}`);

    // Test de création d'un témoignage
    console.log("💬 Test de création d'un témoignage...");
    const newTestimonial = await client.mutation("cms:createTestimonial", {
      text: "Témoignage de test",
      author: "Auteur Test",
      role: "Client Test",
      project: "Projet Test",
      image: "https://example.com/author.jpg",
      order_index: 999,
      is_active: true
    });
    console.log(`✅ Témoignage créé avec l'ID: ${newTestimonial}`);

    // Test de suppression des éléments de test
    console.log("🗑️ Test de suppression des éléments de test...");
    await client.mutation("cms:deleteStatistic", { id: newStatistic });
    await client.mutation("cms:deleteService", { id: newService });
    await client.mutation("cms:deleteZone", { id: newZone });
    await client.mutation("cms:deleteReason", { id: newReason });
    await client.mutation("cms:deleteTestimonial", { id: newTestimonial });
    console.log("✅ Tous les éléments de test supprimés");

    console.log("🎉 Tous les tests CRUD sont passés avec succès !");

  } catch (error) {
    console.error("❌ Erreur lors des tests CRUD:", error);
  }
}

// Exécuter les tests
testCRUDOperations();
