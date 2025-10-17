# 🔧 Résolution des problèmes d'imports Convex

## 🚨 Erreur : "Failed to resolve import"

### **Erreur typique**
```
[plugin:vite:import-analysis] Failed to resolve import "../../../convex/_generated/api" from "src/pages/admin/articles/page.tsx". Does the file exist?
```

## 🔍 Diagnostic

### **1. Vérifier les fichiers générés**
```bash
# Vérifier que les fichiers existent
ls convex/_generated/
```

**Fichiers requis :**
- `api.d.ts`
- `api.js`
- `dataModel.d.ts`
- `server.d.ts`
- `server.js`

### **2. Vérifier la configuration Convex**
```bash
# Vérifier l'URL Convex
cat .env | grep VITE_CONVEX_URL
```

**Doit contenir :**
```
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

### **3. Vérifier l'installation**
```bash
# Vérifier que Convex est installé
npm list convex
```

## 🛠️ Solutions

### **Solution 1 : Régénérer les fichiers**
```bash
# Déployer Convex et générer les fichiers
npx convex dev --once
```

### **Solution 2 : Redémarrer le serveur**
```bash
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer
npm run dev
```

### **Solution 3 : Nettoyer et réinstaller**
```bash
# Nettoyer le cache
rm -rf node_modules/.vite
rm -rf convex/_generated

# Régénérer
npx convex dev --once
```

### **Solution 4 : Vérifier les chemins d'import**
```typescript
// Correct
import { api } from '../../../convex/_generated/api';

// Incorrect
import { api } from '../../convex/_generated/api';
```

## 🧪 Test de diagnostic

### **Script de test automatique**
```bash
node scripts/test-imports.js
```

**Ce script vérifie :**
- ✅ Existence des fichiers générés
- ✅ Configuration .env
- ✅ Connexion Convex
- ✅ Fonctions disponibles

## 📋 Checklist de résolution

### **Étape 1 : Vérifications de base**
- [ ] Convex est installé (`npm list convex`)
- [ ] Fichier `.env` existe
- [ ] URL Convex est configurée
- [ ] Dossier `convex/_generated` existe

### **Étape 2 : Régénération**
- [ ] Exécuter `npx convex dev --once`
- [ ] Vérifier que les fichiers sont générés
- [ ] Redémarrer le serveur de développement

### **Étape 3 : Test**
- [ ] Exécuter `node scripts/test-imports.js`
- [ ] Vérifier que tous les tests passent
- [ ] Tester l'accès à `/admin/articles`

## 🚀 Prévention

### **Bonnes pratiques**
1. **Toujours déployer Convex** après modification des fonctions
2. **Redémarrer le serveur** après ajout de nouvelles fonctions
3. **Vérifier les chemins d'import** avant de commiter
4. **Utiliser le script de test** pour valider la configuration

### **Workflow recommandé**
```bash
# 1. Modifier les fonctions Convex
# 2. Déployer
npx convex dev --once

# 3. Tester
node scripts/test-imports.js

# 4. Redémarrer le serveur
npm run dev
```

## 🆘 Support

### **Si le problème persiste**
1. Vérifier les logs Convex
2. Consulter la documentation Convex
3. Vérifier la version de Convex
4. Contacter l'équipe de développement

### **Logs utiles**
```bash
# Logs détaillés Convex
npx convex dev --once --verbose

# Logs Vite
npm run dev --verbose
```

---

## 🎉 Résolution réussie

Une fois le problème résolu, vous devriez voir :
- ✅ Aucune erreur d'import
- ✅ Page `/admin/articles` accessible
- ✅ Fonctions Convex opérationnelles
- ✅ CMS Articles fonctionnel

Le système est maintenant prêt à être utilisé !
