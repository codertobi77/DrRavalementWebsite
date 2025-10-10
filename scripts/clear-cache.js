// Script pour vider le cache et forcer un refresh
console.log("🧹 Nettoyage du cache...");

// Vider le localStorage
if (typeof window !== 'undefined') {
  // Supprimer toutes les clés de cache CMS
  const keys = Object.keys(localStorage).filter(key => key.startsWith('cms_'));
  keys.forEach(key => {
    localStorage.removeItem(key);
    console.log(`✅ Supprimé: ${key}`);
  });
  
  console.log(`🧹 ${keys.length} entrées de cache supprimées`);
  
  // Déclencher un événement de refresh
  window.dispatchEvent(new CustomEvent('cms-cache-refresh'));
  console.log("🔄 Événement de refresh déclenché");
} else {
  console.log("⚠️ Ce script doit être exécuté dans un navigateur");
}

export {};
