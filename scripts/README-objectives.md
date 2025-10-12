# Script de mise à jour des objectifs des services

Ce script permet d'ajouter automatiquement des objectifs aux services existants dans la base de données Convex.

## Fonctionnalités

- **Mode Preview** : Affiche les services existants et les objectifs proposés sans modifier la base de données
- **Mode Update** : Met à jour les services existants en ajoutant des objectifs appropriés
- **Intelligence** : Génère des objectifs basés sur le titre et la description de chaque service
- **Sécurité** : Ignore les services qui ont déjà un objectif défini

## Utilisation

### 1. Mode Preview (recommandé en premier)

```bash
npm run update-objectives preview
```

Cette commande affiche :
- La liste des services existants
- Leur description actuelle
- L'objectif actuel (s'il existe)
- L'objectif proposé par le script

### 2. Mode Update

```bash
npm run update-objectives update
```

Cette commande :
- Met à jour les services qui n'ont pas d'objectif
- Ignore les services qui ont déjà un objectif
- Affiche un résumé des opérations effectuées

## Configuration

### Variables d'environnement

Assurez-vous que votre variable d'environnement `CONVEX_URL` est définie :

```bash
export CONVEX_URL="https://votre-deployment.convex.cloud"
```

Ou créez un fichier `.env.local` :

```
CONVEX_URL=https://votre-deployment.convex.cloud
```

### Objectifs prédéfinis

Le script utilise une base de données d'objectifs basée sur des mots-clés :

- **Ravalement** : "Améliorer l'esthétique et la durabilité de votre façade..."
- **Maçonnerie** : "Renforcer la structure et réparer les éléments de maçonnerie..."
- **Couverture** : "Protéger votre toit contre les intempéries..."
- **Isolation** : "Améliorer l'efficacité énergétique..."
- **Rénovation** : "Transformer et moderniser votre espace..."

## Exemples d'utilisation

### Exemple 1 : Vérifier les services existants

```bash
npm run update-objectives preview
```

Sortie :
```
🔍 Mode preview - Affichage des services existants...

1. Ravalement de Façade
   Description: Service complet de ravalement de façade...
   Objectif actuel: Aucun
   Objectif proposé: Améliorer l'esthétique et la durabilité de votre façade...
---
2. Maçonnerie Générale
   Description: Réparation et construction d'éléments en maçonnerie...
   Objectif actuel: Aucun
   Objectif proposé: Renforcer la structure et réparer les éléments de maçonnerie...
---
```

### Exemple 2 : Mettre à jour les services

```bash
npm run update-objectives update
```

Sortie :
```
🚀 Script de mise à jour des objectifs des services

⚠️  ATTENTION: Cette opération va modifier la base de données!
   Appuyez sur Ctrl+C pour annuler, ou attendez 5 secondes...

🔄 Récupération des services existants...
📋 5 service(s) trouvé(s)

🔄 Mise à jour du service "Ravalement de Façade"...
   Objectif: Améliorer l'esthétique et la durabilité de votre façade...
✅ Service "Ravalement de Façade" mis à jour avec succès

📊 Résumé de l'opération:
   ✅ Services mis à jour: 4
   ⏭️  Services ignorés: 1
   📋 Total traité: 5
```

## Sécurité

- Le script ne modifie que les services qui n'ont pas d'objectif
- Un délai de 5 secondes est appliqué avant l'exécution en mode update
- Possibilité d'annuler avec Ctrl+C
- Gestion d'erreurs complète

## Personnalisation

Pour modifier les objectifs générés, éditez le fichier `scripts/update-services-objectives.js` :

1. Modifiez l'objet `SERVICE_OBJECTIVES` pour ajouter de nouveaux mots-clés
2. Modifiez le tableau `DEFAULT_OBJECTIVES` pour changer les objectifs par défaut
3. Ajustez la fonction `generateObjective()` pour changer la logique de génération

## Dépannage

### Erreur de connexion Convex

```
❌ Erreur lors de l'exécution du script: Error: Invalid Convex URL
```

**Solution** : Vérifiez que `CONVEX_URL` est correctement définie.

### Aucun service trouvé

```
❌ Aucun service trouvé dans la base de données
```

**Solution** : Vérifiez que des services existent dans votre base de données Convex.

### Erreur de permissions

```
❌ Erreur lors de la mise à jour du service: Unauthorized
```

**Solution** : Vérifiez que votre clé API Convex a les permissions nécessaires.
