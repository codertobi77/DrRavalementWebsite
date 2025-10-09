# 🚀 Guide de Configuration Convex

## 1. Créer un Projet Convex

1. Allez sur [convex.dev](https://convex.dev)
2. Créez un compte ou connectez-vous
3. Créez un nouveau projet
4. Suivez les instructions d'installation

## 2. Installer Convex CLI

```bash
npm install -g convex
```

## 3. Initialiser Convex dans le Projet

```bash
# Dans le dossier du projet
npx convex dev

# Suivez les instructions pour :
# - Se connecter à votre compte Convex
# - Sélectionner le projet
# - Configurer l'environnement
```

## 4. Configurer les Variables d'Environnement

Créez ou modifiez votre fichier `.env` :

```env
# Convex Configuration
VITE_CONVEX_URL=https://your-project-name.convex.cloud

# Autres variables existantes...
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
VITE_RESEND_API_KEY=your-resend-api-key
# etc...
```

## 5. Initialiser les Données

```bash
# Initialiser les données par défaut
npx convex run initData:initializeDefaultData
```

## 6. Tester la Migration

```bash
# Tester la connexion
node test-convex-migration.js

# Démarrer l'application
npm run dev
```

## 7. Déployer en Production

```bash
# Déployer les fonctions Convex
npx convex deploy

# Mettre à jour VITE_CONVEX_URL avec l'URL de production
```

## 🔧 Commandes Utiles

```bash
# Démarrer Convex en mode développement
npx convex dev

# Déployer en production
npx convex deploy

# Voir les logs
npx convex logs

# Ouvrir le dashboard
npx convex dashboard
```

## 📊 Vérification

Une fois configuré, vous devriez voir :

1. **Dashboard Convex** : Données en temps réel
2. **Application** : Fonctionne sans erreurs
3. **Tests** : `node test-convex-migration.js` réussit

## 🆘 Dépannage

### Erreur "VITE_CONVEX_URL non configuré"
- Vérifiez que le fichier `.env` contient `VITE_CONVEX_URL`
- Redémarrez l'application après modification

### Erreur de connexion Convex
- Vérifiez que `npx convex dev` est en cours d'exécution
- Vérifiez l'URL dans `.env`

### Données manquantes
- Exécutez `npx convex run initData:initializeDefaultData`
- Vérifiez le dashboard Convex

---

**Une fois configuré, votre application sera entièrement migrée vers Convex ! 🎉**
