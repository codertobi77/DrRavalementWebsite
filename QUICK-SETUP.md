# ⚡ Configuration Rapide Convex

## 🎯 Étapes Essentielles

### 1. Créer un Projet Convex
1. Allez sur [convex.dev](https://convex.dev)
2. Créez un compte (gratuit)
3. Créez un nouveau projet
4. **Copiez l'URL de votre projet** (ex: `https://your-project.convex.cloud`)

### 2. Configurer l'Environnement
Ajoutez cette ligne à votre fichier `.env` :
```env
VITE_CONVEX_URL=https://your-project.convex.cloud
```

### 3. Initialiser Convex
```bash
# Initialiser Convex (suivez les instructions)
npx convex dev

# Dans un autre terminal, initialiser les données
npx convex run initData:initializeDefaultData
```

### 4. Tester
```bash
# Tester la migration
node test-convex-migration.js

# Démarrer l'application
npm run dev
```

## ✅ Vérification

Si tout fonctionne, vous devriez voir :
- ✅ Connexion Convex réussie
- ✅ Configuration chargée
- ✅ Pages et réservations fonctionnelles
- ✅ Application qui démarre sans erreurs

## 🆘 Problèmes Courants

### "VITE_CONVEX_URL non configuré"
- Vérifiez que `.env` contient `VITE_CONVEX_URL=https://your-project.convex.cloud`

### "Connexion Convex échouée"
- Vérifiez que `npx convex dev` est en cours d'exécution
- Vérifiez l'URL dans `.env`

### "Données manquantes"
- Exécutez `npx convex run initData:initializeDefaultData`

---

**Une fois configuré, votre application sera entièrement migrée vers Convex ! 🎉**
