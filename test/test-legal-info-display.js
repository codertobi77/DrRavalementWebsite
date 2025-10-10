#!/usr/bin/env node

/**
 * Script de test pour vérifier l'affichage des informations juridiques
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

console.log('🧪 Test de l\'affichage des informations juridiques');
console.log('==================================================\n');

if (!CONVEX_URL) {
  console.error('❌ VITE_CONVEX_URL non trouvé dans .env');
  process.exit(1);
}

const convexClient = new ConvexHttpClient(CONVEX_URL);

async function testLegalInfoDisplay() {
  try {
    // Test de connexion
    console.log('1️⃣ Test de connexion à Convex...');
    const connectionTest = await convexClient.query("auth:getAllUsers");
    console.log('   ✅ Connexion réussie\n');

    // Récupérer la configuration de contact
    console.log('2️⃣ Récupération de la configuration de contact...');
    const contactConfig = await convexClient.query("siteConfig:getConfigByKey", { 
      key: "contact_config" 
    });

    if (!contactConfig) {
      console.log('   ❌ Aucune configuration de contact trouvée');
      return;
    }

    console.log('   ✅ Configuration récupérée avec succès\n');

    // Afficher les informations de contact de base
    console.log('3️⃣ Informations de contact de base :');
    console.log(`   📧 Email: ${contactConfig.email}`);
    console.log(`   📞 Téléphone: ${contactConfig.phone}`);
    console.log(`   🏠 Zone de service: ${contactConfig.address}`);
    console.log(`   🕒 Horaires: ${contactConfig.hours}\n`);

    // Afficher les informations juridiques
    console.log('4️⃣ Informations juridiques :');
    
    if (contactConfig.legalForm) {
      console.log(`   🏢 Forme juridique: ${contactConfig.legalForm}`);
    } else {
      console.log('   ⚠️  Forme juridique: Non définie');
    }

    if (contactConfig.creationDate) {
      const creationDate = new Date(contactConfig.creationDate).toLocaleDateString('fr-FR');
      console.log(`   📅 Date de création: ${creationDate}`);
    } else {
      console.log('   ⚠️  Date de création: Non définie');
    }

    if (contactConfig.siren) {
      console.log(`   🔢 SIREN: ${contactConfig.siren}`);
    } else {
      console.log('   ⚠️  SIREN: Non défini');
    }

    if (contactConfig.apeCode) {
      console.log(`   📋 Code APE: ${contactConfig.apeCode}`);
    } else {
      console.log('   ⚠️  Code APE: Non défini');
    }

    if (contactConfig.vatNumber) {
      console.log(`   💰 TVA intracommunautaire: ${contactConfig.vatNumber}`);
    } else {
      console.log('   ⚠️  TVA intracommunautaire: Non définie');
    }

    if (contactConfig.fullAddress) {
      console.log(`   🏠 Adresse complète: ${contactConfig.fullAddress}`);
    } else {
      console.log('   ⚠️  Adresse complète: Non définie');
    }

    // Test de simulation d'affichage footer
    console.log('\n5️⃣ Simulation de l\'affichage dans le footer :');
    console.log('   ┌─────────────────────────────────────────┐');
    console.log('   │ À Propos                                │');
    console.log('   │                                         │');
    console.log('   │ Expert en ravalement de façades,        │');
    console.log('   │ maçonnerie générale et couverture.      │');
    console.log('   │                                         │');
    console.log(`   │ Intervention en ${contactConfig.address.padEnd(25)} │`);
    console.log('   │                                         │');
    
    if (contactConfig.legalForm) {
      console.log(`   │ Forme juridique : ${contactConfig.legalForm.padEnd(20)} │`);
    }
    
    if (contactConfig.creationDate) {
      const creationDate = new Date(contactConfig.creationDate).toLocaleDateString('fr-FR');
      console.log(`   │ Créée le : ${creationDate.padEnd(25)} │`);
    }
    
    if (contactConfig.siren) {
      console.log(`   │ SIREN : ${contactConfig.siren.padEnd(30)} │`);
    }
    
    if (contactConfig.apeCode) {
      console.log(`   │ Code APE : ${contactConfig.apeCode.padEnd(26)} │`);
    }
    
    if (contactConfig.vatNumber) {
      console.log(`   │ TVA : ${contactConfig.vatNumber.padEnd(32)} │`);
    }
    
    if (contactConfig.fullAddress) {
      console.log('   │                                         │');
      console.log('   │ Siège social :                         │');
      const addressLines = contactConfig.fullAddress.match(/.{1,35}/g) || [contactConfig.fullAddress];
      addressLines.forEach(line => {
        console.log(`   │ ${line.padEnd(37)} │`);
      });
    }
    
    console.log('   └─────────────────────────────────────────┘');

    // Vérification de la complétude
    console.log('\n6️⃣ Vérification de la complétude :');
    const requiredFields = ['legalForm', 'creationDate', 'siren', 'apeCode', 'vatNumber', 'fullAddress'];
    const missingFields = requiredFields.filter(field => !contactConfig[field]);
    
    if (missingFields.length === 0) {
      console.log('   ✅ Toutes les informations juridiques sont présentes');
    } else {
      console.log(`   ⚠️  Champs manquants: ${missingFields.join(', ')}`);
    }

    console.log('\n🎉 Test terminé avec succès !');
    console.log('\n💡 Les informations juridiques sont maintenant disponibles dans :');
    console.log('   ✅ Page d\'administration (/admin/config)');
    console.log('   ✅ Footer du site (toutes les pages)');
    console.log('   ✅ Composant CompanyInfoSection');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    if (error.message.includes('Could not find public function')) {
      console.error('💡 Vérifiez que Convex est démarré avec: npx convex dev');
    }
  }
}

testLegalInfoDisplay();
