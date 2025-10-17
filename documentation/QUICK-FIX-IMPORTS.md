# ⚡ Correction rapide des imports Convex

## 🚨 Problème
```
[plugin:vite:import-analysis] Failed to resolve import "../../../convex/_generated/api"
```

## 🔧 Solution rapide

### **Étape 1 : Script automatique**
```bash
node scripts/fix-imports-and-start.js
```

### **Étape 2 : Correction manuelle**

#### **1. Déployer Convex**
```bash
npx convex dev --once
```

#### **2. Vérifier la configuration Vite**
Le fichier `vite.config.ts` doit contenir :
```typescript
resolve: {
  alias: {
    '@': resolve(__dirname, './src'),
    'convex': resolve(__dirname, './convex')
  }
}
```

#### **3. Utiliser l'alias dans les imports**
```typescript
// ✅ Correct
import { api } from 'convex/_generated/api';

// ❌ Incorrect
import { api } from '../../../convex/_generated/api';
```

#### **4. Redémarrer le serveur**
```bash
npm run dev
```

## 🧪 Test de validation

### **Script de test**
```bash
node scripts/test-vite-imports.js
```

### **Vérifications manuelles**
1. **Fichiers générés** : `convex/_generated/` doit contenir 5 fichiers
2. **Configuration** : `.env` avec `VITE_CONVEX_URL`
3. **Alias Vite** : `convex` alias configuré
4. **Imports** : Utilisation de `'convex/_generated/api'`

## ✅ Résolution confirmée

Une fois corrigé, vous devriez voir :
- ✅ Aucune erreur d'import
- ✅ Page `/admin/articles` accessible
- ✅ CMS Articles fonctionnel
- ✅ Dashboard avec statistiques

## 🆘 Si le problème persiste

1. **Nettoyer le cache** :
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

2. **Réinstaller Convex** :
   ```bash
   npm uninstall convex
   npm install convex
   npx convex dev --once
   ```

3. **Vérifier les chemins** :
   - Fichier dans `src/pages/admin/articles/`
   - Import : `'convex/_generated/api'`
   - Alias : `convex` → `./convex`

---

## 🎉 Succès !

Le système CMS Articles est maintenant opérationnel avec :
- ✅ Imports résolus
- ✅ Convex déployé
- ✅ Serveur fonctionnel
- ✅ CMS accessible
