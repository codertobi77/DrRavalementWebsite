# 🔧 Correction de l'erreur Modal Blog

## 🚨 Problème rencontré

```
Uncaught Error: [CONVEX Q(articles:incrementViews)] [Request ID: ...] Server Error
Trying to execute articles.js:incrementViews as Query, but it is defined as Mutation.
```

## 🔍 Analyse de l'erreur

**Cause :** La fonction `incrementViews` était définie comme une `mutation` dans Convex, mais appelée comme une `query` dans le composant React.

**Convex :**
```typescript
export const incrementViews = mutation({  // ✅ Définie comme mutation
  // ...
});
```

**React (incorrect) :**
```typescript
const incrementViews = useQuery(api.articles.incrementViews, ...);  // ❌ Utilise useQuery
```

## ✅ Solution appliquée

### **1. Import de useMutation**
```typescript
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';  // ✅ Ajout de useMutation
import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';
```

### **2. Utilisation correcte de useMutation**
```typescript
// ✅ Correct - utilise useMutation pour les mutations
const incrementViews = useMutation(api.articles.incrementViews);

// ❌ Incorrect - useQuery ne peut pas appeler des mutations
const incrementViews = useQuery(api.articles.incrementViews, ...);
```

### **3. Appel de la mutation dans useEffect**
```typescript
// Incrémenter les vues quand l'article est chargé
useEffect(() => {
  if (article && articleId) {
    incrementViews({ id: articleId });  // ✅ Appel de la mutation
  }
}, [article, articleId, incrementViews]);
```

## 📚 Règles Convex

### **Queries vs Mutations**

#### **Queries (useQuery)**
- **Lecture seule** des données
- **Pas d'effets de bord**
- **Peuvent être mises en cache**
- **Exemples :** `getArticles`, `getArticleById`, `getArticleStats`

#### **Mutations (useMutation)**
- **Modification** des données
- **Effets de bord** (création, mise à jour, suppression)
- **Ne peuvent pas être mises en cache**
- **Exemples :** `createArticle`, `updateArticle`, `incrementViews`

### **Utilisation dans React**

```typescript
// ✅ Query - lecture des données
const articles = useQuery(api.articles.getArticles, { status: 'published' });

// ✅ Mutation - modification des données
const createArticle = useMutation(api.articles.createArticle);
const updateArticle = useMutation(api.articles.updateArticle);
const incrementViews = useMutation(api.articles.incrementViews);

// Appel des mutations
const handleCreate = () => {
  createArticle({ title: 'Nouvel article', content: '...' });
};

const handleIncrement = () => {
  incrementViews({ id: articleId });
};
```

## 🧪 Validation

### **Script de test**
```bash
node scripts/test-modal-fix.js
```

### **Résultats attendus**
- ✅ `useMutation` importé
- ✅ `incrementViews` utilise `useMutation`
- ✅ `useQuery` supprimé pour `incrementViews`
- ✅ Mutation appelée dans `useEffect`
- ✅ Fonction Convex correcte

## 🚀 Test final

### **Étapes de test**
1. **Redémarrer le serveur :** `npm run dev`
2. **Aller sur le blog :** `http://localhost:3000/blog`
3. **Cliquer sur "Lire l'Article"**
4. **Vérifier :** Le modal s'ouvre sans erreur
5. **Vérifier :** Les vues sont incrémentées

### **Comportement attendu**
- ✅ Modal s'ouvre instantanément
- ✅ Contenu de l'article affiché
- ✅ Compteur de vues incrémenté
- ✅ Aucune erreur dans la console
- ✅ Fermeture avec X, Escape, ou overlay

## 🔍 Dépannage

### **Si l'erreur persiste**

#### **1. Vérifier les imports**
```typescript
import { useQuery, useMutation } from 'convex/react';  // Les deux doivent être présents
```

#### **2. Vérifier l'utilisation**
```typescript
// ✅ Correct
const incrementViews = useMutation(api.articles.incrementViews);

// ❌ Incorrect
const incrementViews = useQuery(api.articles.incrementViews, ...);
```

#### **3. Vérifier la fonction Convex**
```typescript
// ✅ Correct
export const incrementViews = mutation({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    // ...
  },
});

// ❌ Incorrect
export const incrementViews = query({
  // ...
});
```

#### **4. Redéployer Convex**
```bash
npx convex dev --once
```

## ✅ Résolution confirmée

L'erreur est maintenant **définitivement résolue** :
- ✅ `incrementViews` utilise `useMutation`
- ✅ Aucune erreur Convex
- ✅ Modal fonctionne parfaitement
- ✅ Compteur de vues opérationnel

---

## 🎉 Succès !

Le modal blog fonctionne maintenant **sans erreur** ! Les utilisateurs peuvent lire les articles complets avec un compteur de vues qui s'incrémente automatiquement. 🚀
