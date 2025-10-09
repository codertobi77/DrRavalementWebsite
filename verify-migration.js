#!/usr/bin/env node

/**
 * Script de vérification finale de la migration
 * Exécuter avec: node verify-migration.js
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

const client = new ConvexHttpClient(convexUrl);

async function verifyMigration() {
  console.log("🔍 Vérification finale de la migration Convex\n");
  
  let allTestsPassed = true;

  try {
    // Test 1: Connexion Convex
    console.log("1️⃣ Test de connexion Convex...");
    const config = await client.query(api.siteConfig.getConfigByKey, { key: "booking_config" });
    if (config) {
      console.log("✅ Connexion Convex réussie");
    } else {
      console.log("❌ Connexion Convex échouée");
      allTestsPassed = false;
    }
  } catch (error) {
    console.log("❌ Erreur de connexion Convex:", error.message);
    allTestsPassed = false;
  }

  try {
    // Test 2: Configuration du site
    console.log("\n2️⃣ Test de la configuration du site...");
    const bookingConfig = await client.query(api.siteConfig.getConfigByKey, { key: "booking_config" });
    const contactConfig = await client.query(api.siteConfig.getConfigByKey, { key: "contact_config" });
    
    if (bookingConfig && contactConfig) {
      console.log("✅ Configuration du site chargée");
      console.log(`   - Services: ${bookingConfig.services?.length || 0}`);
      console.log(`   - Créneaux: ${bookingConfig.timeSlots?.length || 0}`);
      console.log(`   - Email: ${contactConfig.email || 'N/A'}`);
    } else {
      console.log("❌ Configuration du site manquante");
      allTestsPassed = false;
    }
  } catch (error) {
    console.log("❌ Erreur lors du chargement de la configuration:", error.message);
    allTestsPassed = false;
  }

  try {
    // Test 3: Pages
    console.log("\n3️⃣ Test des pages...");
    const pages = await client.query(api.pages.getAllPages);
    if (pages && pages.length > 0) {
      console.log(`✅ ${pages.length} pages trouvées`);
      const publishedPages = pages.filter(p => p.status === 'published');
      console.log(`   - Publiées: ${publishedPages.length}`);
    } else {
      console.log("❌ Aucune page trouvée");
      allTestsPassed = false;
    }
  } catch (error) {
    console.log("❌ Erreur lors du chargement des pages:", error.message);
    allTestsPassed = false;
  }

  try {
    // Test 4: Réservations
    console.log("\n4️⃣ Test des réservations...");
    const bookings = await client.query(api.bookings.getBookings);
    const stats = await client.query(api.bookings.getBookingStats);
    
    if (bookings !== undefined && stats !== undefined) {
      console.log(`✅ Système de réservations fonctionnel`);
      console.log(`   - Total: ${stats.total}`);
      console.log(`   - En attente: ${stats.pending}`);
      console.log(`   - Confirmées: ${stats.confirmed}`);
    } else {
      console.log("❌ Système de réservations défaillant");
      allTestsPassed = false;
    }
  } catch (error) {
    console.log("❌ Erreur lors du chargement des réservations:", error.message);
    allTestsPassed = false;
  }

  try {
    // Test 5: Création d'une réservation de test
    console.log("\n5️⃣ Test de création d'une réservation...");
    const testBooking = await client.mutation(api.bookings.createBooking, {
      client_name: "Test Migration",
      client_email: "test@migration.com",
      client_phone: "0123456789",
      service_type: "Test Service",
      booking_date: "2024-12-31",
      booking_time: "10:00",
      duration: 60,
      address: "123 Test Street",
      notes: "Test de migration Convex",
      status: "pending"
    });
    
    if (testBooking) {
      console.log("✅ Création de réservation réussie");
      
      // Nettoyer la réservation de test
      await client.mutation(api.bookings.deleteBooking, { id: testBooking });
      console.log("✅ Suppression de réservation réussie");
    } else {
      console.log("❌ Création de réservation échouée");
      allTestsPassed = false;
    }
  } catch (error) {
    console.log("❌ Erreur lors de la création de réservation:", error.message);
    allTestsPassed = false;
  }

  // Résultat final
  console.log("\n" + "=".repeat(50));
  if (allTestsPassed) {
    console.log("🎉 MIGRATION CONVEX RÉUSSIE !");
    console.log("\n✅ Tous les tests sont passés");
    console.log("✅ L'application est prête à être utilisée");
    console.log("✅ Vous pouvez maintenant supprimer les dépendances Supabase");
    
    console.log("\n📋 Prochaines étapes:");
    console.log("   1. Démarrez l'application: npm run dev");
    console.log("   2. Testez les fonctionnalités dans le navigateur");
    console.log("   3. Supprimez les dépendances Supabase si tout fonctionne");
    console.log("   4. Déployez en production avec: npx convex deploy");
  } else {
    console.log("❌ MIGRATION INCOMPLÈTE");
    console.log("\n⚠️  Certains tests ont échoué");
    console.log("⚠️  Vérifiez la configuration avant de continuer");
  }
  console.log("=".repeat(50));

  return allTestsPassed;
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

// Exécuter la vérification
verifyMigration().catch(console.error);
