# 🚨 URGENT: Configuration Convex Manquante

## ❌ Erreur Actuelle
```
Uncaught Error: Could not find Convex client! `useQuery` must be used in the React component tree under `ConvexProvider`.
```

## ✅ Solution Rapide

### 1. Créer le fichier .env
Créez un fichier `.env` à la racine du projet avec :

```env
# Convex Configuration
VITE_CONVEX_URL=https://your-convex-url.convex.cloud
```

### 2. Déployer Convex
```bash
# Installer Convex (si pas déjà fait)
npm install convex

# Se connecter à Convex
npx convex login

# Déployer le projet
npx convex deploy

# Copier l'URL générée dans .env
```

### 3. Initialiser les données
```bash
# Initialiser les données par défaut
npx convex run initData:initializeDefaultData
```

## 🔧 Configuration Complète

### Fichier .env complet
```env
# Convex Configuration
VITE_CONVEX_URL=https://your-project.convex.cloud

# Email Configuration (Resend)
VITE_RESEND_API_KEY=your-resend-api-key

# SMS Configuration (Twilio)
VITE_TWILIO_ACCOUNT_SID=your-twilio-account-sid
VITE_TWILIO_AUTH_TOKEN=your-twilio-auth-token
VITE_TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

## 🚀 Étapes de Déploiement

1. **Créer le fichier .env** avec VITE_CONVEX_URL
2. **Se connecter à Convex** : `npx convex login`
3. **Déployer** : `npx convex deploy`
4. **Copier l'URL** dans .env
5. **Initialiser** : `npx convex run initData:initializeDefaultData`
6. **Redémarrer** : `npm run dev`

## ✅ Vérification

Après configuration, l'application devrait fonctionner sans erreur ConvexProvider.

---

**🎯 Le ConvexProvider a été ajouté à App.tsx, il ne manque que la configuration de l'URL Convex !**
