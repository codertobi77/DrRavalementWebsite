# 📖 Guide du Modal Blog

## 🎯 Fonctionnalité

Le modal blog permet d'afficher le contenu complet des articles directement sur la page blog, sans redirection vers une page séparée.

## 🏗️ Architecture

### **Composants créés**

#### **`src/components/blog/ArticleModal.tsx`**
- **Rôle :** Composant modal pour afficher l'article complet
- **Props :**
  - `articleId`: ID de l'article à afficher
  - `isOpen`: État d'ouverture du modal
  - `onClose`: Fonction de fermeture

#### **Fonctions Convex ajoutées**

#### **`convex/articles.ts`**
- **`getArticleById`** : Récupère un article par son ID
- **`incrementViews`** : Incrémente le compteur de vues

### **Page modifiée**

#### **`src/pages/blog/page.tsx`**
- **État ajouté :**
  - `selectedArticleId`: ID de l'article sélectionné
  - `isModalOpen`: État d'ouverture du modal
- **Fonctions ajoutées :**
  - `openArticleModal()`: Ouvre le modal avec un article
  - `closeArticleModal()`: Ferme le modal
- **Boutons modifiés :**
  - "Lire l'Article" (article principal)
  - "Lire la suite" (articles de la grille)

## 🎨 Fonctionnalités du Modal

### **Interface utilisateur**
- ✅ **Overlay sombre** avec fermeture au clic
- ✅ **Bouton de fermeture** (X) en haut à droite
- ✅ **Fermeture avec Escape**
- ✅ **Design responsive** (mobile/desktop)
- ✅ **Scroll vertical** pour les longs articles

### **Contenu affiché**
- 🖼️ **Image principale** de l'article
- 📝 **Titre** de l'article
- 📄 **Extrait** dans un encadré orange
- 🏷️ **Catégorie** et **date de publication**
- ⏱️ **Temps de lecture**
- 🏷️ **Tags** de l'article
- 📖 **Contenu complet** avec rendu markdown simple
- 📊 **Compteur de vues**
- 🔄 **Boutons d'action** (Partager, J'aime)

### **Rendu Markdown**
Le modal inclut un rendu markdown simple pour :
- **Titres** (`#`, `##`, `###`)
- **Listes** (`-`, `*`)
- **Paragraphes** avec espacement approprié

## 🔧 Utilisation

### **Ouverture du modal**
```typescript
// Dans la page blog
const openArticleModal = (articleId: Id<"articles">) => {
  setSelectedArticleId(articleId);
  setIsModalOpen(true);
};

// Bouton d'ouverture
<button onClick={() => openArticleModal(article._id)}>
  Lire l'Article
</button>
```

### **Fermeture du modal**
```typescript
// Fermeture programmatique
const closeArticleModal = () => {
  setIsModalOpen(false);
  setSelectedArticleId(null);
};

// Fermeture avec Escape (automatique)
// Fermeture en cliquant sur l'overlay (automatique)
```

## 📱 Design Responsive

### **Desktop**
- Modal centré avec `max-w-4xl`
- Image principale `h-64 md:h-80`
- Contenu en colonne unique

### **Mobile**
- Modal plein écran avec marges
- Image adaptative
- Boutons empilés verticalement

## 🎨 Styles CSS

### **Classes principales**
```css
.fixed.inset-0.z-50          /* Position fixe, z-index élevé */
.bg-black.bg-opacity-50      /* Overlay sombre */
.max-w-4xl.rounded-2xl       /* Taille et coins arrondis */
.overflow-y-auto             /* Scroll vertical */
.prose.prose-lg              /* Typographie améliorée */
```

### **États interactifs**
```css
.hover:bg-orange-700         /* Boutons orange */
.hover:text-orange-700       /* Liens orange */
.transition-colors           /* Transitions fluides */
```

## 🧪 Test

### **Script de validation**
```bash
node scripts/test-blog-modal.js
```

### **Tests manuels**
1. **Ouverture :** Cliquer sur "Lire l'Article" ou "Lire la suite"
2. **Fermeture :** Cliquer sur X, Escape, ou l'overlay
3. **Contenu :** Vérifier l'affichage complet de l'article
4. **Responsive :** Tester sur mobile et desktop
5. **Vues :** Vérifier l'incrémentation du compteur

## 🚀 Déploiement

### **Prérequis**
- ✅ Convex déployé
- ✅ Articles créés dans la base de données
- ✅ Fonctions `getArticleById` et `incrementViews` déployées

### **Commandes**
```bash
# Déployer Convex
npx convex dev --once

# Démarrer le serveur
npm run dev

# Accéder au blog
http://localhost:3000/blog
```

## 🔍 Dépannage

### **Problèmes courants**

#### **Modal ne s'ouvre pas**
- Vérifier que `isModalOpen` est `true`
- Vérifier que `selectedArticleId` est défini
- Vérifier les imports Convex

#### **Contenu ne s'affiche pas**
- Vérifier que `getArticleById` fonctionne
- Vérifier la structure des données article
- Vérifier les logs de la console

#### **Styles cassés**
- Vérifier les classes Tailwind
- Vérifier la structure HTML
- Vérifier les imports CSS

## ✅ Résolution

Le modal blog est maintenant **entièrement fonctionnel** avec :
- ✅ Affichage complet des articles
- ✅ Interface utilisateur intuitive
- ✅ Design responsive
- ✅ Rendu markdown
- ✅ Compteur de vues
- ✅ Fermeture multiple (bouton, Escape, overlay)

---

## 🎉 Succès !

Le système de modal blog est **opérationnel** ! Les utilisateurs peuvent maintenant lire les articles complets directement sur la page blog. 🚀
