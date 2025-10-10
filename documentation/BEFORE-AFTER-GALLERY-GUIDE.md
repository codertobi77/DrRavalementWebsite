# Guide de la Galerie Avant/Après

## Vue d'ensemble

La galerie avant-après permet d'afficher des réalisations avec des images de comparaison interactives. Les utilisateurs peuvent glisser sur les images pour voir la transformation avant/après.

## Fonctionnalités

### 🖼️ Affichage des Images
- **Images côte à côte** : Affichage simultané des images avant et après
- **Curseur interactif** : Glissement pour révéler progressivement l'image "après"
- **Labels visuels** : Indicateurs "Avant" et "Après" sur les images
- **Badges de catégorie** : Indication du type de projet (Ravalement, Maçonnerie, Couverture)

### 🎨 Interface Utilisateur
- **Design responsive** : Adaptation automatique aux différentes tailles d'écran
- **Animations fluides** : Transitions et effets hover
- **Instructions d'utilisation** : Guide visuel pour l'interaction
- **États de chargement** : Squelettes d'animation pendant le chargement

## Structure des Données

### Champs Requis pour les Projets Avant-Après

```typescript
{
  title: string;           // Titre du projet
  category: string;        // "ravalement", "maconnerie", "couverture"
  description: string;     // Description du projet
  details: string;         // Détails techniques
  before_image: string;    // URL de l'image "avant"
  after_image: string;     // URL de l'image "après"
  is_before_after: boolean; // true pour les projets avant-après
  is_active: boolean;      // true pour afficher le projet
  order_index: number;     // Ordre d'affichage
}
```

## Installation et Configuration

### 1. Mise à jour du Schéma

Le schéma Convex a été mis à jour pour inclure les nouveaux champs :

```typescript
// Dans convex/schema.ts
portfolio_projects: defineTable({
  // ... champs existants
  before_image: v.optional(v.string()),
  after_image: v.optional(v.string()),
  is_before_after: v.optional(v.boolean()),
})
```

### 2. Fonctions Convex

Nouvelles fonctions disponibles :

- `getBeforeAfterProjects()` : Récupère tous les projets avant-après
- `createPortfolioProject()` : Création avec support avant-après
- `updatePortfolioProject()` : Mise à jour avec support avant-après

### 3. Composant React

Le composant `BeforeAfterGallery` gère l'affichage et l'interactivité :

```tsx
import BeforeAfterGallery from '../../components/cms/BeforeAfterGallery';

// Dans votre page
<BeforeAfterGallery />
```

## Utilisation

### Ajouter des Projets Avant-Après

1. **Via l'interface admin** (à implémenter) :
   - Créer un nouveau projet
   - Cocher "Projet avant-après"
   - Uploader les images avant et après

2. **Via script d'initialisation** :
   ```bash
   node init-before-after-projects.js
   ```

3. **Via API Convex** :
   ```javascript
   await client.mutation("cms:createPortfolioProject", {
     title: "Mon Projet",
     category: "ravalement",
     before_image: "url-avant.jpg",
     after_image: "url-apres.jpg",
     is_before_after: true,
     // ... autres champs
   });
   ```

### Personnalisation

#### Styles CSS
Les classes Tailwind utilisées peuvent être personnalisées :
- `.before-after-card` : Carte de projet
- `.slider-container` : Conteneur du curseur
- `.before-label` / `.after-label` : Labels des images

#### Comportement Interactif
- **Sensibilité du curseur** : Modifiable dans `handleMouseMove`
- **Position par défaut** : `sliderPosition` initial (50%)
- **Animations** : Durées dans les classes `transition-*`

## Tests

### Script de Test
```bash
node test-before-after-gallery.js
```

### Vérifications
- ✅ Récupération des projets avant-après
- ✅ Structure des données complète
- ✅ Images avant et après présentes
- ✅ Filtrage par catégorie
- ✅ Responsive design

## Dépannage

### Problèmes Courants

1. **Images ne s'affichent pas** :
   - Vérifier les URLs des images
   - Contrôler les permissions d'accès
   - Vérifier la configuration CORS

2. **Curseur ne fonctionne pas** :
   - Vérifier les événements de souris/touch
   - Contrôler les styles CSS
   - Tester sur différents navigateurs

3. **Projets ne s'affichent pas** :
   - Vérifier `is_before_after: true`
   - Contrôler `is_active: true`
   - Vérifier les requêtes Convex

### Logs de Debug
```javascript
// Activer les logs dans le composant
console.log('Projets avant-après:', beforeAfterProjects);
console.log('Position du curseur:', sliderPosition);
```

## Améliorations Futures

### Fonctionnalités Possibles
- [ ] **Mode plein écran** : Affichage en grand format
- [ ] **Zoom sur les images** : Détails des transformations
- [ ] **Comparaison côte à côte** : Mode fixe sans curseur
- [ ] **Filtres avancés** : Par date, type, localisation
- [ ] **Partage social** : Boutons de partage
- [ ] **Téléchargement** : Export des images

### Optimisations
- [ ] **Lazy loading** : Chargement différé des images
- [ ] **Compression** : Optimisation automatique
- [ ] **Cache** : Mise en cache des images
- [ ] **CDN** : Distribution globale

## Support

Pour toute question ou problème :
1. Consulter ce guide
2. Vérifier les logs de debug
3. Tester avec le script de test
4. Contacter l'équipe de développement

---

*Dernière mise à jour : $(date)*
