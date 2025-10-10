#!/usr/bin/env node

import { ConvexHttpClient } from "convex/browser";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

console.log('🧪 Test de la configuration mise à jour');
console.log('======================================\n');

if (!CONVEX_URL) {
  console.error('❌ VITE_CONVEX_URL non trouvé');
  process.exit(1);
}

const convexClient = new ConvexHttpClient(CONVEX_URL);

async function testConfig() {
  try {
    console.log('📡 Connexion à Convex...');
    const contactConfig = await convexClient.query("siteConfig:getConfigByKey", { 
      key: "contact_config" 
    });

    if (contactConfig) {
      console.log('✅ Configuration récupérée');
      console.log('📧 Email:', contactConfig.email);
      console.log('📞 Phone:', contactConfig.phone);
      console.log('🏢 Legal Form:', contactConfig.legalForm || 'Non défini');
      console.log('📅 Creation Date:', contactConfig.creationDate || 'Non définie');
      console.log('🔢 SIREN:', contactConfig.siren || 'Non défini');
      console.log('📋 APE Code:', contactConfig.apeCode || 'Non défini');
      console.log('💰 VAT:', contactConfig.vatNumber || 'Non défini');
      console.log('🏠 Full Address:', contactConfig.fullAddress || 'Non définie');
    } else {
      console.log('❌ Aucune configuration trouvée');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testConfig();
