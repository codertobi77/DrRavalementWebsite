/**
 * Configuration d'exemple pour les scripts de mise à jour des objectifs
 * 
 * Copiez ce fichier vers config.js et modifiez les valeurs selon vos besoins
 */

export const CONFIG = {
  // URL de votre déploiement Convex
  CONVEX_URL: "https://votre-deployment.convex.cloud",
  
  // Délai entre les mises à jour (en millisecondes)
  UPDATE_DELAY: 100,
  
  // Objectifs personnalisés (optionnel)
  CUSTOM_OBJECTIVES: {
    // Ajoutez vos propres objectifs ici
    "votre_mot_cle": "Votre objectif personnalisé",
  },
  
  // Objectifs par défaut personnalisés (optionnel)
  CUSTOM_DEFAULT_OBJECTIVES: [
    "Objectif personnalisé 1",
    "Objectif personnalisé 2",
    "Objectif personnalisé 3",
  ]
};

// Exemple d'utilisation dans les scripts :
// import { CONFIG } from './config.js';
// const client = new ConvexHttpClient(CONFIG.CONVEX_URL);
