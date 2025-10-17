# 📝 Guide de l'Éditeur de Texte Riche

## 🎯 Objectif

L'éditeur de texte riche permet aux utilisateurs de formater leur contenu d'articles sans connaître le markdown, en utilisant des outils similaires à Microsoft Word.

## 🏗️ Architecture

### **Composants créés**

#### **`src/components/admin/RichTextEditor.tsx`**
- **Rôle :** Éditeur de texte riche avec barre d'outils
- **Props :**
  - `value`: Contenu HTML actuel
  - `onChange`: Fonction de callback pour les changements
  - `placeholder`: Texte d'aide
  - `className`: Classes CSS additionnelles

#### **`src/components/blog/FormattedContent.tsx`**
- **Rôle :** Affichage du contenu HTML formaté
- **Props :**
  - `content`: Contenu HTML à afficher
  - `className`: Classes CSS additionnelles

### **Intégrations**

#### **Page Admin Articles**
- Remplacement du `textarea` par `RichTextEditor`
- Sauvegarde du contenu HTML dans la base de données

#### **Modal Blog**
- Remplacement du rendu markdown par `FormattedContent`
- Affichage exact du formatage créé par l'utilisateur

## 🛠️ Outils de Formatage

### **Formatage de Base**
- **Gras** : `Ctrl+B` ou bouton `ri-bold`
- **Italique** : `Ctrl+I` ou bouton `ri-italic`
- **Souligné** : `Ctrl+U` ou bouton `ri-underline`
- **Barré** : Bouton `ri-strikethrough`

### **Titres et Paragraphes**
- **Titre 1** : Bouton `ri-h-1` (H1)
- **Titre 2** : Bouton `ri-h-2` (H2)
- **Titre 3** : Bouton `ri-h-3` (H3)
- **Paragraphe normal** : Bouton `ri-paragraph` (P)

### **Listes**
- **Liste à puces** : Bouton `ri-list-unordered` (UL)
- **Liste numérotée** : Bouton `ri-list-ordered` (OL)

### **Alignement**
- **Gauche** : Bouton `ri-align-left`
- **Centre** : Bouton `ri-align-center`
- **Droite** : Bouton `ri-align-right`
- **Justifié** : Bouton `ri-align-justify`

### **Couleurs**
- **Couleur du texte** : Bouton `ri-text` (rouge par défaut)
- **Couleur de fond** : Bouton `ri-text-color` (jaune par défaut)

### **Actions**
- **Supprimer le formatage** : Bouton `ri-format-clear`
- **Annuler** : Bouton `ri-arrow-go-back-line` ou `Ctrl+Z`
- **Refaire** : Bouton `ri-arrow-go-forward-line` ou `Ctrl+Y`

## 🎨 Interface Utilisateur

### **Barre d'Outils**
```typescript
// Groupes d'outils organisés
<div className="flex flex-wrap gap-1">
  {/* Formatage de base */}
  <div className="flex border-r border-gray-300 pr-2 mr-2">
    <ToolButton command="bold" icon="ri-bold" title="Gras" />
    <ToolButton command="italic" icon="ri-italic" title="Italique" />
    // ...
  </div>
  
  {/* Titres */}
  <div className="flex border-r border-gray-300 pr-2 mr-2">
    <ToolButton command="formatBlock" value="h1" icon="ri-h-1" title="Titre 1" />
    // ...
  </div>
  
  // ... autres groupes
</div>
```

### **Zone d'Édition**
```typescript
<div
  ref={editorRef}
  contentEditable
  onInput={handleInput}
  className="min-h-[300px] p-4 focus:outline-none"
  style={{ lineHeight: '1.6', fontSize: '16px' }}
  data-placeholder={placeholder}
/>
```

### **Styles Visuels**
- **Focus** : Anneau orange autour de l'éditeur
- **Placeholder** : Texte gris en italique quand vide
- **Boutons actifs** : Fond orange pour les formats appliqués
- **Hover** : Effet de survol sur tous les boutons

## 🔧 Fonctionnement Technique

### **API execCommand**
```typescript
const execCommand = (command: string, value?: string) => {
  document.execCommand(command, false, value);
  editorRef.current?.focus();
  handleInput();
};
```

### **Gestion des Changements**
```typescript
const handleInput = () => {
  if (editorRef.current) {
    const html = editorRef.current.innerHTML;
    onChange(html);
  }
};
```

### **Détection des Formats Actifs**
```typescript
const isFormatActive = (command: string) => {
  return document.queryCommandState(command);
};
```

## 📱 Responsive Design

### **Desktop**
- Barre d'outils complète sur une ligne
- Éditeur de 300px de hauteur minimum
- Boutons avec icônes et tooltips

### **Mobile**
- Barre d'outils avec wrap automatique
- Boutons adaptés aux écrans tactiles
- Éditeur plein écran

## 🧪 Test et Validation

### **Script de Test**
```bash
node scripts/test-rich-text-editor.js
```

### **Tests Manuels**
1. **Création d'article** : Utiliser tous les outils de formatage
2. **Sauvegarde** : Vérifier que le HTML est sauvegardé
3. **Affichage** : Vérifier que le formatage est préservé dans le modal
4. **Responsive** : Tester sur mobile et desktop

### **Fonctionnalités à Tester**
- ✅ Formatage de base (gras, italique, etc.)
- ✅ Titres et paragraphes
- ✅ Listes ordonnées et non ordonnées
- ✅ Alignement du texte
- ✅ Couleurs de texte et de fond
- ✅ Annuler/Refaire
- ✅ Suppression de formatage
- ✅ Rendu identique dans le modal

## 🔍 Dépannage

### **Problèmes Courants**

#### **Formatage non appliqué**
- Vérifier que le texte est sélectionné
- Vérifier que `execCommand` est appelé
- Vérifier que `handleInput` est déclenché

#### **Contenu non sauvegardé**
- Vérifier que `onChange` est appelé
- Vérifier que `formData.content` est mis à jour
- Vérifier la sauvegarde en base de données

#### **Affichage incorrect dans le modal**
- Vérifier que `FormattedContent` est utilisé
- Vérifier que `dangerouslySetInnerHTML` est activé
- Vérifier les styles CSS appliqués

### **Debug**
```typescript
// Ajouter des logs pour debug
const handleInput = () => {
  if (editorRef.current) {
    const html = editorRef.current.innerHTML;
    console.log('Contenu HTML:', html);
    onChange(html);
  }
};
```

## 🚀 Utilisation

### **Pour les Utilisateurs**
1. **Créer un article** : Aller sur `/admin/articles`
2. **Remplir les champs** : Titre, extrait, etc.
3. **Formater le contenu** : Utiliser les outils de la barre
4. **Sauvegarder** : Cliquer sur "Créer l'article"
5. **Vérifier** : Aller sur `/blog` pour voir le résultat

### **Pour les Développeurs**
```typescript
// Utilisation du composant
<RichTextEditor
  value={content}
  onChange={setContent}
  placeholder="Saisissez votre contenu..."
  className="w-full"
/>
```

## ✅ Avantages

### **Pour les Utilisateurs**
- ✅ **Interface familière** : Similaire à Word
- ✅ **Pas de markdown** : Formatage visuel
- ✅ **Prévisualisation** : Formatage exact dans le modal
- ✅ **Outils complets** : Tous les formats nécessaires

### **Pour les Développeurs**
- ✅ **Composant réutilisable** : Utilisable partout
- ✅ **API simple** : Props standardisées
- ✅ **HTML natif** : Pas de dépendances externes
- ✅ **Responsive** : Fonctionne sur tous les écrans

---

## 🎉 Succès !

L'éditeur de texte riche est maintenant **entièrement fonctionnel** ! Les utilisateurs peuvent formater leur contenu comme dans Word, et le rendu est identique dans le modal blog. 🚀
