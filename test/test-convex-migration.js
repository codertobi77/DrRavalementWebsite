#!/usr/bin/env node

/**
 * Script de test pour vérifier la migration Convex
 * Exécuter avec: node test-convex-migration.js
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";
import fs from 'fs';

// Lire l'URL Convex depuis le fichier .env
let convexUrl = "https://your-convex-url.convex.cloud";

try {
  const envContent = fs.readFileSync('.env', 'utf8');
  const match = envContent.match(/VITE_CONVEX_URL=(.+)/);
  if (match) {
    convexUrl = match[1].trim();
  }
} catch (error) {
  console.error("❌ Erreur lors de la lecture du fichier .env:", error.message);
  process.exit(1);
}

if (!convexUrl || convexUrl.includes("your-convex-url")) {
  console.error("❌ VITE_CONVEX_URL non configuré dans .env");
  console.error("   Ajoutez: VITE_CONVEX_URL=https://your-project.convex.cloud");
  process.exit(1);
}

const client = new ConvexHttpClient(convexUrl);

async function testConvexConnection() {
  console.log("🧪 Test de la migration Convex\n");
  
  try {
    // Test 1: Connexion Convex
    console.log("1️⃣ Test de connexion Convex...");
    const config = await client.query(api.siteConfig.getConfigByKey, { key: "booking_config" });
    if (config) {
      console.log("✅ Connexion Convex réussie");
    } else {
      console.log("⚠️  Connexion réussie mais pas de configuration trouvée");
    }
  } catch (error) {
    console.error("❌ Erreur de connexion Convex:", error.message);
    return false;
  }

  try {
    // Test 2: Configuration du site
    console.log("\n2️⃣ Test de la configuration du site...");
    const bookingConfig = await client.query(api.siteConfig.getConfigByKey, { key: "booking_config" });
    const contactConfig = await client.query(api.siteConfig.getConfigByKey, { key: "contact_config" });
    
    if (bookingConfig && contactConfig) {
      console.log("✅ Configuration du site chargée");
      console.log(`   - Services disponibles: ${bookingConfig.services?.length || 0}`);
      console.log(`   - Créneaux horaires: ${bookingConfig.timeSlots?.length || 0}`);
    } else {
      console.log("⚠️  Configuration partielle ou manquante");
    }
  } catch (error) {
    console.error("❌ Erreur lors du chargement de la configuration:", error.message);
  }

  try {
    // Test 3: Pages
    console.log("\n3️⃣ Test des pages...");
    const pages = await client.query(api.pages.getAllPages);
    if (pages && pages.length > 0) {
      console.log(`✅ ${pages.length} pages trouvées`);
      pages.forEach(page => {
        console.log(`   - ${page.title} (/${page.slug}) - ${page.status}`);
      });
    } else {
      console.log("⚠️  Aucune page trouvée");
    }
  } catch (error) {
    console.error("❌ Erreur lors du chargement des pages:", error.message);
  }

  try {
    // Test 4: Réservations
    console.log("\n4️⃣ Test des réservations...");
    const bookings = await client.query(api.bookings.getBookings);
    const stats = await client.query(api.bookings.getBookingStats);
    
    if (bookings && stats) {
      console.log(`✅ ${bookings.length} réservations trouvées`);
      console.log(`   - En attente: ${stats.pending}`);
      console.log(`   - Confirmées: ${stats.confirmed}`);
      console.log(`   - Annulées: ${stats.cancelled}`);
      console.log(`   - Terminées: ${stats.completed}`);
    } else {
      console.log("⚠️  Aucune réservation trouvée");
    }
  } catch (error) {
    console.error("❌ Erreur lors du chargement des réservations:", error.message);
  }

  try {
    // Test 5: Articles
    console.log("\n5️⃣ Test des articles...");
    const articles = await client.query(api.articles.getAllArticles);
    if (articles && articles.length > 0) {
      console.log(`✅ ${articles.length} articles trouvés`);
    } else {
      console.log("⚠️  Aucun article trouvé");
    }
  } catch (error) {
    console.error("❌ Erreur lors du chargement des articles:", error.message);
  }

  try {
    // Test 6: Création d'une réservation de test
    console.log("\n6️⃣ Test de création d'une réservation...");
    const testBooking = await client.mutation(api.bookings.createBooking, {
      client_name: "Test Client",
      client_email: "test@example.com",
      client_phone: "0123456789",
      service_type: "Test Service",
      booking_date: "2024-12-31",
      booking_time: "10:00",
      duration: 60,
      address: "123 Test Street",
      notes: "Réservation de test",
      status: "pending"
    });
    
    if (testBooking) {
      console.log("✅ Réservation de test créée avec succès");
      
      // Nettoyer la réservation de test
      await client.mutation(api.bookings.deleteBooking, { id: testBooking });
      console.log("✅ Réservation de test supprimée");
    }
  } catch (error) {
    console.error("❌ Erreur lors de la création de réservation:", error.message);
  }

  console.log("\n🎉 Tests terminés !");
  console.log("\n📋 Prochaines étapes:");
  console.log("   1. Vérifiez que l'application fonctionne correctement");
  console.log("   2. Testez les fonctionnalités principales");
  console.log("   3. Supprimez les dépendances Supabase si tout fonctionne");
  
  return true;
}

// Gestion des erreurs
process.on('unhandledRejection', (error) => {
  console.error('❌ Erreur non gérée:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Exception non capturée:', error);
  process.exit(1);
});

// Exécuter les tests
testConvexConnection().catch(console.error);
