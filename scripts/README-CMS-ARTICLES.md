# 📝 Scripts CMS Articles - DR RAVALEMENT

## 🚀 Démarrage rapide

### 1. Configuration initiale
```bash
# Configurer l'URL Convex
node scripts/setup-convex-url.js

# Configuration complète automatique
node scripts/setup-cms-articles.js
```

### 2. Scripts individuels

#### Configuration de l'URL Convex
```bash
node scripts/setup-convex-url.js
```
- Crée le fichier `.env` si nécessaire
- Guide pour configurer l'URL Convex
- Vérifie la configuration

#### Initialisation des articles d'exemple
```bash
node scripts/init-sample-articles.js
```
- Crée 6 articles d'exemple
- Catégories : Ravalement, Techniques, Isolation, Couverture, Maçonnerie, Entretien
- Articles prêts à être publiés

#### Test du système CMS
```bash
node scripts/test-articles-cms.js
```
- Teste toutes les fonctionnalités
- Vérifie la connexion Convex
- Valide les opérations CRUD

## 🔧 Configuration requise

### Prérequis
- Node.js installé
- Convex configuré et déployé
- URL Convex définie dans `.env`

### Variables d'environnement
```env
VITE_CONVEX_URL=https://your-convex-deployment.convex.cloud
VITE_CONVEX_DEPLOYMENT=your-convex-deployment
```

## 📋 Articles d'exemple créés

1. **Comment choisir la finition de votre ravalement de façade ?**
   - Catégorie : Ravalement
   - Statut : Publié
   - À la une : Oui

2. **Les avantages de la projection machine pour vos façades**
   - Catégorie : Techniques
   - Statut : Publié

3. **Isolation thermique par l'extérieur : guide complet**
   - Catégorie : Isolation
   - Statut : Publié

4. **Quand faut-il rénover sa toiture ?**
   - Catégorie : Couverture
   - Statut : Publié

5. **Construction de murs en parpaing : les étapes clés**
   - Catégorie : Maçonnerie
   - Statut : Publié

6. **Entretien de façade : conseils pour préserver votre investissement**
   - Catégorie : Entretien
   - Statut : Publié

## 🎯 Utilisation

### Interface d'administration
- URL : `/admin/articles`
- Fonctionnalités : Créer, modifier, publier, supprimer
- Filtres : Par catégorie, statut, recherche

### Page blog publique
- URL : `/blog`
- Affichage : Articles publiés
- Filtres : Par catégorie

## 🔍 Dépannage

### Erreur "require is not defined"
- Le projet utilise ES modules
- Les scripts ont été convertis en ES6
- Utilisez `import` au lieu de `require`

### Erreur de connexion Convex
- Vérifiez l'URL dans `.env`
- Déployez Convex : `npx convex dev`
- Vérifiez les permissions

### Articles non visibles
- Vérifiez le statut "publié"
- Vérifiez la catégorie
- Actualisez la page

## 📚 Documentation

- **Guide complet** : `documentation/CMS-ARTICLES-GUIDE.md`
- **API Convex** : `convex/articles.ts`
- **Interface admin** : `src/pages/admin/articles/page.tsx`
- **Page blog** : `src/pages/blog/page.tsx`

## 🆘 Support

En cas de problème :
1. Consultez les logs d'erreur
2. Vérifiez la configuration Convex
3. Testez avec le script de diagnostic
4. Consultez la documentation complète
