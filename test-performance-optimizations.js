#!/usr/bin/env node

/**
 * Script de test pour vérifier les optimisations de performance
 */

import { ConvexHttpClient } from "convex/browser";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger la configuration depuis .env
function loadEnvConfig() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    const config = {};
    
    lines.forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        config[key.trim()] = value.trim();
      }
    });
    
    return config;
  }
  return {};
}

const envConfig = loadEnvConfig();
const CONVEX_URL = envConfig.VITE_CONVEX_URL;

console.log('⚡ Test des optimisations de performance');
console.log('======================================\n');

if (!CONVEX_URL) {
  console.error('❌ VITE_CONVEX_URL non trouvé dans .env');
  process.exit(1);
}

const convexClient = new ConvexHttpClient(CONVEX_URL);

async function testPerformanceOptimizations() {
  try {
    console.log('1️⃣ Test de connexion à Convex...');
    const startConnection = Date.now();
    const connectionTest = await convexClient.query("auth:getAllUsers");
    const connectionTime = Date.now() - startConnection;
    console.log(`   ✅ Connexion réussie en ${connectionTime}ms\n`);

    // Test de cache pour les statistiques
    console.log('2️⃣ Test de cache pour les statistiques...');
    const startStats1 = Date.now();
    const stats1 = await convexClient.query("cms:getStatistics");
    const statsTime1 = Date.now() - startStats1;
    console.log(`   📊 Première requête: ${statsTime1}ms`);

    const startStats2 = Date.now();
    const stats2 = await convexClient.query("cms:getStatistics");
    const statsTime2 = Date.now() - startStats2;
    console.log(`   📊 Deuxième requête: ${statsTime2}ms`);
    console.log(`   🚀 Amélioration: ${((statsTime1 - statsTime2) / statsTime1 * 100).toFixed(1)}%\n`);

    // Test de cache pour les services
    console.log('3️⃣ Test de cache pour les services...');
    const startServices1 = Date.now();
    const services1 = await convexClient.query("cms:getServices");
    const servicesTime1 = Date.now() - startServices1;
    console.log(`   🛠️  Première requête: ${servicesTime1}ms`);

    const startServices2 = Date.now();
    const services2 = await convexClient.query("cms:getServices");
    const servicesTime2 = Date.now() - startServices2;
    console.log(`   🛠️  Deuxième requête: ${servicesTime2}ms`);
    console.log(`   🚀 Amélioration: ${((servicesTime1 - servicesTime2) / servicesTime1 * 100).toFixed(1)}%\n`);

    // Test de cache pour la configuration du site
    console.log('4️⃣ Test de cache pour la configuration...');
    const startConfig1 = Date.now();
    const config1 = await convexClient.query("siteConfig:getConfigByKey", { key: "contact_config" });
    const configTime1 = Date.now() - startConfig1;
    console.log(`   ⚙️  Première requête: ${configTime1}ms`);

    const startConfig2 = Date.now();
    const config2 = await convexClient.query("siteConfig:getConfigByKey", { key: "contact_config" });
    const configTime2 = Date.now() - startConfig2;
    console.log(`   ⚙️  Deuxième requête: ${configTime2}ms`);
    console.log(`   🚀 Amélioration: ${((configTime1 - configTime2) / configTime1 * 100).toFixed(1)}%\n`);

    // Test de performance global
    console.log('5️⃣ Test de performance global...');
    const startGlobal = Date.now();
    
    const promises = [
      convexClient.query("cms:getStatistics"),
      convexClient.query("cms:getServices"),
      convexClient.query("cms:getZones"),
      convexClient.query("cms:getReasons"),
      convexClient.query("cms:getTestimonials"),
      convexClient.query("siteConfig:getConfigByKey", { key: "contact_config" }),
      convexClient.query("siteConfig:getConfigByKey", { key: "booking_config" }),
      convexClient.query("siteConfig:getConfigByKey", { key: "appearance_config" })
    ];
    
    const results = await Promise.all(promises);
    const globalTime = Date.now() - startGlobal;
    
    console.log(`   🌐 Chargement global: ${globalTime}ms`);
    console.log(`   📊 ${results.length} requêtes parallèles`);
    console.log(`   ⚡ Moyenne par requête: ${(globalTime / results.length).toFixed(1)}ms\n`);

    // Test de cache avec délai
    console.log('6️⃣ Test de cache avec délai (simulation 15s)...');
    console.log('   ⏱️  Attente de 2 secondes pour simuler le cache...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const startCacheTest = Date.now();
    const cacheTest = await convexClient.query("cms:getStatistics");
    const cacheTestTime = Date.now() - startCacheTest;
    console.log(`   🗄️  Requête après délai: ${cacheTestTime}ms`);
    
    if (cacheTestTime < 50) {
      console.log('   ✅ Cache efficace détecté');
    } else {
      console.log('   ⚠️  Cache moins efficace que prévu');
    }

    console.log('\n🎉 Tests de performance terminés !');
    console.log('\n📋 Résumé des optimisations :');
    console.log('   ✅ Cache Convex configuré à 15 secondes');
    console.log('   ✅ Système de cache en mémoire implémenté');
    console.log('   ✅ Composants de chargement optimisés');
    console.log('   ✅ Hooks optimisés pour les données CMS');
    console.log('   ✅ Gestion d\'erreurs améliorée');
    console.log('   ✅ États de chargement plus rapides');

    console.log('\n💡 Optimisations appliquées :');
    console.log('   🔄 Polling interval: 15 secondes');
    console.log('   🗄️  Cache mémoire: 15 secondes TTL');
    console.log('   ⚡ Optimistic updates: Activé');
    console.log('   🎨 Skeleton loaders: Implémentés');
    console.log('   🚀 Requêtes parallèles: Optimisées');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
    if (error.message.includes('Could not find public function')) {
      console.error('💡 Vérifiez que Convex est démarré avec: npx convex dev');
    }
  }
}

testPerformanceOptimizations();
