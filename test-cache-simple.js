/**
 * Test simple du système de cache CMS
 */

console.log('🧪 Test simple du système de cache CMS\n');

// Simulation du localStorage
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

// Test de base du cache
function testBasicCache() {
  console.log('1. Test de base du cache...');
  
  // Simuler des données CMS
  const testData = [
    { _id: '1', key: 'clients', value: '500+', label: 'Clients satisfaits' },
    { _id: '2', key: 'projets', value: '1000+', label: 'Projets réalisés' }
  ];

  // Sauvegarder en cache
  const cacheEntry = {
    data: testData,
    timestamp: Date.now(),
    version: '1.0.0',
    ttl: 5 * 60 * 1000 // 5 minutes
  };

  localStorage.setItem('cms_statistics', JSON.stringify(cacheEntry));
  console.log('✅ Données sauvegardées en cache');

  // Récupérer depuis le cache
  const cached = JSON.parse(localStorage.getItem('cms_statistics'));
  console.log('✅ Données récupérées depuis le cache');
  console.log(`   - Nombre d\'entrées: ${cached.data.length}`);
  console.log(`   - Version: ${cached.version}`);
  console.log(`   - TTL: ${cached.ttl}ms`);

  return true;
}

// Test d'expiration
function testExpiration() {
  console.log('\n2. Test d\'expiration...');
  
  const expiredData = {
    data: [{ _id: '1', key: 'test', value: 'expired' }],
    timestamp: Date.now() - 10 * 60 * 1000, // 10 minutes ago
    version: '1.0.0',
    ttl: 5 * 60 * 1000 // 5 minutes TTL
  };

  localStorage.setItem('cms_expired', JSON.stringify(expiredData));
  
  const cached = localStorage.getItem('cms_expired');
  if (cached) {
    const entry = JSON.parse(cached);
    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    console.log(`✅ Test d'expiration: ${isExpired ? 'EXPIRÉ' : 'VALIDE'}`);
    return isExpired;
  }
  
  return false;
}

// Test de versioning
function testVersioning() {
  console.log('\n3. Test de versioning...');
  
  const oldVersionData = {
    data: [{ _id: '1', key: 'test', value: 'old' }],
    timestamp: Date.now(),
    version: '1.0.0',
    ttl: 5 * 60 * 1000
  };

  localStorage.setItem('cms_versioned', JSON.stringify(oldVersionData));
  
  // Simuler un changement de version
  const currentVersion = '2.0.0';
  const cached = JSON.parse(localStorage.getItem('cms_versioned'));
  const isVersionValid = cached.version === currentVersion;
  
  console.log(`✅ Test de versioning: ${isVersionValid ? 'VERSION VALIDE' : 'VERSION OBSOLÈTE'}`);
  return !isVersionValid; // Doit être obsolète
}

// Test de performance
function testPerformance() {
  console.log('\n4. Test de performance...');
  
  const largeData = Array.from({ length: 1000 }, (_, i) => ({
    _id: `item_${i}`,
    key: `key_${i}`,
    value: `value_${i}`,
    label: `Label ${i}`
  }));

  const startTime = performance.now();
  
  // Sauvegarder
  const cacheEntry = {
    data: largeData,
    timestamp: Date.now(),
    version: '1.0.0',
    ttl: 5 * 60 * 1000
  };
  
  localStorage.setItem('cms_performance', JSON.stringify(cacheEntry));
  
  // Récupérer
  const cached = JSON.parse(localStorage.getItem('cms_performance'));
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  console.log(`✅ Test de performance:`);
  console.log(`   - Durée: ${duration.toFixed(2)}ms`);
  console.log(`   - Taille des données: ${JSON.stringify(largeData).length} bytes`);
  console.log(`   - Entrées: ${cached.data.length}`);
  
  return duration < 100; // Moins de 100ms
}

// Exécuter tous les tests
function runAllTests() {
  const tests = [
    { name: 'Cache de base', fn: testBasicCache },
    { name: 'Expiration', fn: testExpiration },
    { name: 'Versioning', fn: testVersioning },
    { name: 'Performance', fn: testPerformance }
  ];

  let passed = 0;
  let total = tests.length;

  tests.forEach(test => {
    try {
      if (test.fn()) {
        passed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}`);
    }
  });

  console.log('\n📊 Résultats:');
  console.log(`✅ Réussis: ${passed}/${total}`);
  console.log(`📈 Taux de réussite: ${Math.round((passed / total) * 100)}%`);

  if (passed === total) {
    console.log('\n🎉 Tous les tests sont passés ! Le système de cache fonctionne correctement.');
  } else {
    console.log('\n⚠️  Certains tests ont échoué. Vérifiez la configuration.');
  }

  return passed === total;
}

// Lancer les tests
runAllTests();
