# 🗄️ Guide de Migration Base de Données Supabase

## ✅ **Configuration Vérifiée**
- ✅ Variables d'environnement Supabase configurées
- ✅ Fichier de schéma `database/schema.sql` prêt
- ✅ Service de réservation mis à jour

## 🚀 **Étapes de Migration**

### **1. Accéder à Supabase**
1. Ouvrez [https://supabase.com](https://supabase.com)
2. Connectez-vous à votre compte
3. Sélectionnez votre projet

### **2. Exécuter la Migration**
1. Dans le menu de gauche, cliquez sur **SQL Editor**
2. Cliquez sur **New Query**
3. Copiez tout le contenu du fichier `database/schema.sql`
4. Collez-le dans l'éditeur SQL
5. Cliquez sur **Run** pour exécuter le script

### **3. Vérifier les Tables Créées**
Après l'exécution, vérifiez que ces tables existent :
- ✅ `users` - Utilisateurs du système
- ✅ `projects` - Projets de ravalement
- ✅ `quotes` - Devis clients
- ✅ **`bookings`** - Rendez-vous (IMPORTANT)
- ✅ `articles` - Articles de blog
- ✅ `pages` - Pages CMS
- ✅ `media_files` - Fichiers média
- ✅ `project_documents` - Documents de projet
- ✅ `project_photos` - Photos de projet
- ✅ `timeline_events` - Événements de projet
- ✅ `team_members` - Membres d'équipe

## 🔧 **Configuration des Permissions**

### **Row Level Security (RLS)**
Le script configure automatiquement :
- ✅ **Politiques de sécurité** pour chaque table
- ✅ **Accès public** en lecture pour les données publiques
- ✅ **Accès restreint** pour les données sensibles

### **Triggers Automatiques**
- ✅ **updated_at** : Mise à jour automatique des timestamps
- ✅ **Index** : Optimisation des requêtes fréquentes

## 🧪 **Test de la Migration**

### **1. Test de Connexion**
```bash
# Démarrer le serveur de développement
npm run dev

# Ouvrir http://localhost:3000/booking
```

### **2. Test de Réservation**
1. **Sélectionner une date** → Les créneaux doivent se charger
2. **Choisir une heure** → Le créneau doit être sélectionnable
3. **Remplir le formulaire** → Tous les champs obligatoires
4. **Soumettre** → Réservation créée en base de données

### **3. Vérification en Base**
Dans Supabase, allez dans **Table Editor** → **bookings** :
- ✅ Nouvelle réservation visible
- ✅ Tous les champs remplis correctement
- ✅ Status = 'pending'

## 🐛 **Résolution des Problèmes**

### **Erreur de Connexion**
```bash
# Vérifier les variables d'environnement
node setup-database.js
```

### **Erreur de Permissions**
- Vérifiez que RLS est activé
- Vérifiez les politiques de sécurité
- Testez avec un utilisateur authentifié

### **Erreur de Schéma**
- Vérifiez que toutes les tables sont créées
- Vérifiez les types de données
- Vérifiez les contraintes

## 📊 **Données de Test**

### **Créer un Rendez-vous Test**
```sql
INSERT INTO bookings (
  client_name, 
  client_email, 
  client_phone, 
  service_type, 
  booking_date, 
  booking_time, 
  duration, 
  status
) VALUES (
  'Test Client',
  'test@example.com',
  '0123456789',
  'Consultation gratuite',
  '2024-01-15',
  '10:00',
  60,
  'pending'
);
```

## ✅ **Validation Finale**

Après migration réussie :
- ✅ **Page de réservation** fonctionnelle
- ✅ **Créneaux dynamiques** selon la base de données
- ✅ **Réservations persistantes** en base
- ✅ **Emails de confirmation** envoyés
- ✅ **Gestion des conflits** opérationnelle

## 🎯 **Prochaines Étapes**

1. **Tester le système complet**
2. **Configurer les emails** (Resend)
3. **Tester les notifications**
4. **Déployer en production**

---

**La migration est maintenant prête !** 🚀
