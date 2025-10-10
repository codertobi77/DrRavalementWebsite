/**
 * Script de test pour le système de cache CMS
 * Teste les performances et la fonctionnalité du cache
 */

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

// Configuration
const CONVEX_URL = envVars.VITE_CONVEX_URL || 'https://your-convex-url.convex.cloud';

if (!CONVEX_URL || CONVEX_URL.includes('your-convex-url')) {
  console.error('❌ VITE_CONVEX_URL non configuré');
  console.log('Définissez VITE_CONVEX_URL dans votre fichier .env');
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

// Simulation du cache localStorage
class MockLocalStorage {
  constructor() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value;
  }

  removeItem(key) {
    delete this.store[key];
  }

  clear() {
    this.store = {};
  }

  key(index) {
    return Object.keys(this.store)[index];
  }

  get length() {
    return Object.keys(this.store).length;
  }
}

// Remplacer localStorage global
global.localStorage = new MockLocalStorage();

// Import du système de cache (simulation)
const CMS_CACHE_KEYS = {
  STATISTICS: 'cms_statistics',
  SERVICES: 'cms_services',
  ZONES: 'cms_zones',
  REASONS: 'cms_reasons',
  TESTIMONIALS: 'cms_testimonials'
};

class LocalStorageCache {
  constructor(config = { ttl: 5 * 60 * 1000, maxSize: 100, version: '1.0.0' }) {
    this.config = config;
  }

  get(key) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const cacheEntry = JSON.parse(item);
      
      if (this.isExpired(cacheEntry)) {
        this.remove(key);
        return null;
      }

      if (cacheEntry.version !== this.config.version) {
        this.remove(key);
        return null;
      }

      return cacheEntry.data;
    } catch (error) {
      console.warn(`Erreur lors de la lecture du cache pour ${key}:`, error);
      this.remove(key);
      return null;
    }
  }

  set(key, data, ttl) {
    try {
      const cacheEntry = {
        data,
        timestamp: Date.now(),
        version: this.config.version,
        ttl: ttl || this.config.ttl
      };

      this.cleanupIfNeeded();
      localStorage.setItem(key, JSON.stringify(cacheEntry));
    } catch (error) {
      console.warn(`Erreur lors de la sauvegarde du cache pour ${key}:`, error);
    }
  }

  remove(key) {
    localStorage.removeItem(key);
  }

  isExpired(entry) {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  cleanupIfNeeded() {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('cms_'));
    
    if (keys.length >= this.config.maxSize) {
      const entries = keys.map(key => {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const entry = JSON.parse(item);
            return { key, timestamp: entry.timestamp };
          }
        } catch (error) {
          localStorage.removeItem(key);
        }
        return null;
      }).filter(Boolean).sort((a, b) => a.timestamp - b.timestamp);

      const toRemove = Math.floor(entries.length * 0.2);
      for (let i = 0; i < toRemove; i++) {
        localStorage.removeItem(entries[i].key);
      }
    }
  }

  getStats() {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('cms_'));
    return { size: keys.length, keys };
  }
}

// Tests
async function testCacheSystem() {
  console.log('🧪 Test du système de cache CMS\n');

  const cache = new LocalStorageCache();
  const results = {
    tests: 0,
    passed: 0,
    failed: 0,
    performance: []
  };

  function test(name, testFn) {
    results.tests++;
    try {
      const startTime = performance.now();
      const result = testFn();
      const endTime = performance.now();
      
      if (result) {
        results.passed++;
        results.performance.push({
          test: name,
          duration: endTime - startTime
        });
        console.log(`✅ ${name}`);
      } else {
        results.failed++;
        console.log(`❌ ${name}`);
      }
    } catch (error) {
      results.failed++;
      console.log(`❌ ${name}: ${error.message}`);
    }
  }

  // Test 1: Récupération des données Convex
  test('Récupération des données Convex', async () => {
    try {
      const statistics = await client.query('cms:getStatistics');
      const services = await client.query('cms:getServices');
      const zones = await client.query('cms:getZones');
      
      return statistics && services && zones;
    } catch (error) {
      console.warn('Erreur lors de la récupération des données:', error.message);
      return false;
    }
  });

  // Test 2: Sauvegarde en cache
  test('Sauvegarde en cache', () => {
    const testData = [{ id: 1, name: 'Test' }];
    cache.set(CMS_CACHE_KEYS.STATISTICS, testData);
    const cached = cache.get(CMS_CACHE_KEYS.STATISTICS);
    return cached && cached.length === 1 && cached[0].name === 'Test';
  });

  // Test 3: Récupération depuis le cache
  test('Récupération depuis le cache', () => {
    const testData = [{ id: 2, name: 'Cached' }];
    cache.set(CMS_CACHE_KEYS.SERVICES, testData);
    const cached = cache.get(CMS_CACHE_KEYS.SERVICES);
    return cached && cached[0].name === 'Cached';
  });

  // Test 4: Expiration du cache
  test('Expiration du cache', () => {
    const testData = [{ id: 3, name: 'Expired' }];
    cache.set(CMS_CACHE_KEYS.ZONES, testData, 1); // 1ms TTL
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const cached = cache.get(CMS_CACHE_KEYS.ZONES);
        resolve(cached === null);
      }, 10);
    });
  });

  // Test 5: Nettoyage automatique
  test('Nettoyage automatique', () => {
    // Remplir le cache au-delà de la limite
    for (let i = 0; i < 120; i++) {
      cache.set(`cms_test_${i}`, [{ id: i }]);
    }
    
    const stats = cache.getStats();
    return stats.size <= 100; // Doit être nettoyé
  });

  // Test 6: Performance du cache
  test('Performance du cache', () => {
    const largeData = Array.from({ length: 1000 }, (_, i) => ({ id: i, data: `Item ${i}` }));
    
    const startTime = performance.now();
    cache.set(CMS_CACHE_KEYS.REASONS, largeData);
    const cached = cache.get(CMS_CACHE_KEYS.REASONS);
    const endTime = performance.now();
    
    const duration = endTime - startTime;
    return cached && cached.length === 1000 && duration < 100; // Moins de 100ms
  });

  // Test 7: Gestion des erreurs
  test('Gestion des erreurs', () => {
    // Simuler des données corrompues
    localStorage.setItem(CMS_CACHE_KEYS.TESTIMONIALS, 'invalid json');
    const cached = cache.get(CMS_CACHE_KEYS.TESTIMONIALS);
    return cached === null; // Doit retourner null pour les données corrompues
  });

  // Test 8: Versioning
  test('Versioning du cache', () => {
    const testData = [{ id: 4, name: 'Versioned' }];
    cache.set(CMS_CACHE_KEYS.STATISTICS, testData);
    
    // Changer la version
    cache.config.version = '2.0.0';
    const cached = cache.get(CMS_CACHE_KEYS.STATISTICS);
    return cached === null; // Doit être invalidé
  });

  // Attendre que tous les tests asynchrones se terminent
  await new Promise(resolve => setTimeout(resolve, 100));

  // Résultats
  console.log('\n📊 Résultats des tests:');
  console.log(`Total: ${results.tests}`);
  console.log(`✅ Réussis: ${results.passed}`);
  console.log(`❌ Échoués: ${results.failed}`);
  console.log(`📈 Taux de réussite: ${Math.round((results.passed / results.tests) * 100)}%`);

  // Performance
  if (results.performance.length > 0) {
    console.log('\n⚡ Performance:');
    const avgDuration = results.performance.reduce((sum, p) => sum + p.duration, 0) / results.performance.length;
    console.log(`Durée moyenne: ${avgDuration.toFixed(2)}ms`);
    
    const slowest = results.performance.reduce((max, p) => p.duration > max.duration ? p : max);
    console.log(`Plus lent: ${slowest.test} (${slowest.duration.toFixed(2)}ms)`);
  }

  // Statistiques du cache
  const finalStats = cache.getStats();
  console.log('\n💾 État final du cache:');
  console.log(`Entrées: ${finalStats.size}`);
  console.log(`Clés: ${finalStats.keys.join(', ')}`);

  // Recommandations
  console.log('\n💡 Recommandations:');
  if (results.failed === 0) {
    console.log('✅ Tous les tests sont passés ! Le système de cache fonctionne correctement.');
  } else {
    console.log('⚠️  Certains tests ont échoué. Vérifiez la configuration.');
  }

  if (finalStats.size > 50) {
    console.log('📝 Le cache contient beaucoup d\'entrées. Surveillez l\'utilisation de la mémoire.');
  }

  if (results.performance.some(p => p.duration > 50)) {
    console.log('🐌 Certaines opérations sont lentes. Considérez optimiser les données.');
  }

  return results.failed === 0;
}

// Exécuter les tests
if (require.main === module) {
  testCacheSystem()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Erreur lors des tests:', error);
      process.exit(1);
    });
}

module.exports = { testCacheSystem };
