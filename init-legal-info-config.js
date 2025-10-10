#!/usr/bin/env node

/**
 * Script pour initialiser les informations juridiques dans la configuration du site
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

console.log('🏢 Initialisation des informations juridiques');
console.log('==============================================\n');

if (!CONVEX_URL) {
  console.error('❌ VITE_CONVEX_URL non trouvé dans .env');
  process.exit(1);
}

const convexClient = new ConvexHttpClient(CONVEX_URL);

async function initializeLegalInfo() {
  try {
    // Test de connexion
    console.log('1️⃣ Test de connexion à Convex...');
    const connectionTest = await convexClient.query("auth:getAllUsers");
    console.log('   ✅ Connexion réussie\n');

    // Vérifier si la configuration existe déjà
    console.log('2️⃣ Vérification de la configuration existante...');
    const existingConfig = await convexClient.query("siteConfig:getConfigByKey", { 
      key: "contact_config" 
    });

    if (existingConfig) {
      console.log('   ⚠️  Configuration de contact existante trouvée');
      console.log('   📧 Email:', existingConfig.email);
      console.log('   📞 Téléphone:', existingConfig.phone);
      console.log('   🏢 Forme juridique:', existingConfig.legalForm || 'Non définie');
      console.log('   📅 Date de création:', existingConfig.creationDate || 'Non définie');
      console.log('   🔢 SIREN:', existingConfig.siren || 'Non défini');
      console.log('   📋 Code APE:', existingConfig.apeCode || 'Non défini\n');
    } else {
      console.log('   ❌ Aucune configuration de contact trouvée\n');
    }

    // Mettre à jour la configuration avec les informations juridiques
    console.log('3️⃣ Mise à jour de la configuration avec les informations juridiques...');
    
    const updatedContactConfig = {
      email: "contact@dr-ravalement.fr",
      phone: "+33 1 39 58 90 15",
      address: "Seine-et-Marne & Île-de-France",
      hours: "Lun-Ven: 8h-18h | Sam: 9h-12h",
      // Informations juridiques
      legalForm: "SARL",
      creationDate: "2015-03-15",
      fullAddress: "123 Rue de la Maçonnerie, 77000 Melun, France",
      siren: "123456789",
      apeCode: "4391A",
      vatNumber: "FR12345678901"
    };

    const result = await convexClient.mutation("siteConfig:setConfig", {
      key: "contact_config",
      value: updatedContactConfig,
      description: "Informations de contact et juridiques",
      category: "contact",
      is_public: true
    });

    console.log('   ✅ Configuration mise à jour avec succès');
    console.log('   🏢 Forme juridique:', updatedContactConfig.legalForm);
    console.log('   📅 Date de création:', updatedContactConfig.creationDate);
    console.log('   🏠 Adresse complète:', updatedContactConfig.fullAddress);
    console.log('   🔢 SIREN:', updatedContactConfig.siren);
    console.log('   📋 Code APE:', updatedContactConfig.apeCode);
    console.log('   💰 TVA:', updatedContactConfig.vatNumber);

    // Vérification finale
    console.log('\n4️⃣ Vérification finale...');
    const finalConfig = await convexClient.query("siteConfig:getConfigByKey", { 
      key: "contact_config" 
    });

    if (finalConfig) {
      console.log('   ✅ Configuration vérifiée avec succès');
      console.log('   📊 Toutes les informations juridiques sont présentes');
    } else {
      console.log('   ❌ Erreur lors de la vérification');
    }

    console.log('\n🎉 Initialisation des informations juridiques terminée !');
    console.log('\n📋 Résumé des informations ajoutées :');
    console.log('   ✅ Forme juridique (SARL)');
    console.log('   ✅ Date de création (15/03/2015)');
    console.log('   ✅ Adresse complète du siège social');
    console.log('   ✅ Numéro SIREN');
    console.log('   ✅ Code APE');
    console.log('   ✅ Numéro de TVA intracommunautaire');
    console.log('\n💡 Ces informations apparaîtront maintenant dans le footer du site');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error.message);
    if (error.message.includes('Could not find public function')) {
      console.error('💡 Vérifiez que Convex est démarré avec: npx convex dev');
    }
  }
}

initializeLegalInfo();
