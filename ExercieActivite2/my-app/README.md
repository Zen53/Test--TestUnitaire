# Formulaire d'Enregistrement React

Une application React robuste avec un formulaire d'enregistrement complet, validations côté client, et gestion du stockage localStorage. Ce projet démontre les meilleures pratiques en React testing avec une couverture de test de **99.11%**.

## 🎯 Objectifs du Projet

Ce projet met en pratique :
- ✅ Développement React avec hooks (useState, useEffect)
- ✅ Validations côté client exhaustives
- ✅ Gestion d'état et localStorage
- ✅ Tests unitaires avec Jest/React Testing Library
- ✅ Tests d'intégration complets
- ✅ Tests E2E avec Cypress
- ✅ Génération de documentation JSDoc
- ✅ Architecture modulaire et maintenable

## 🚀 Démarrage Rapide

```bash
# Installation
npm install

# Développement
npm start

# Tests unitaires et d'intégration
npm test

# Tests E2E (interface interactive)
npm run cypress

# Tests E2E (mode headless)
npx cypress run

# Générer documentation JSDoc
npm run jsdoc

# Build production
npm run build
```

## 📋 Fonctionnalités

### Formulaire d'Enregistrement
- **6 champs validés** : Prénom, Nom, Email, Date de naissance, Ville, Code postal
- **Validations robustes** :
  - ✅ Noms/Prénoms : 2-50 caractères, support accents et tirets
  - ✅ Email : Validation format
  - ✅ Date de naissance : **Minimum 18 ans** (bloque les mineurs)
  - ✅ Code postal : Format français exact (5 chiffres)
  - ✅ Ville : 2-50 caractères, support accents et tirets

### Gestion des Données
- 💾 Sauvegarde persisted dans localStorage
- 📦 Support de multiples utilisateurs
- � Compteur utilisateur en temps réel
- �🔍 Chaque enregistrement inclut ID unique et timestamp

### UX/UI
- 📝 Messages d'erreur spécifiques par champ
- ✨ Message de succès avec fermeture auto (3s)
- 🔄 Nettoyage des erreurs lors de la saisie
- 🔁 Réinitialisation du formulaire après succès

## 📊 Couverture de Test

**Total : 79 tests**
```
✅ Tests Unitaires : 51 tests (validations.test.js)
✅ Tests d'Intégration : 15 tests (RegisterForm.test.js + App.test.js)
✅ Tests E2E Cypress : 13 tests
   - Validation formulaire: 9 tests (register-form.cy.js)
   - Compteur utilisateur: 4 tests (user-counter.cy.js)

Couverture de code métier: 99.11%
Métriques détaillées:
- Statements: 99.11%
- Branches: 98.76%
- Functions: 100%
- Lines: 99.09%
```

### Résultats des Tests

```
Test Suites: 3 passed, 3 total ✅
Tests: 66 passed, 66 total ✅
Snapshots: 0 total
Time: ~5s
Cypress E2E: 13 tests additional ✅
```

## 📁 Structure du Projet

```
src/
├── validations.js              # Logique de validation pure (100%)
├── validations.test.js         # 51 tests unitaires
├── App.js                      # Composant principal (100%)
├── App.test.js                 # Test du composant App
├── App.css
├── components/
│   ├── RegisterForm.js         # Composant formulaire avec compteur (96.96%)
│   ├── RegisterForm.test.js    # 15 tests d'intégration
│   └── RegisterForm.css
├── DOCUMENTATION.md            # Documentation complète
└── index.js

cypress/
├── e2e/
│   ├── register-form.cy.js     # 9 tests E2E validation formulaire
│   └── user-counter.cy.js      # 4 tests E2E compteur utilisateur
├── support/
│   └── e2e.js                  # Configuration support Cypress
└── cypress.config.js           # Configuration Cypress

Racine du projet/
├── README.md                   # Ce fichier
├── DOCUMENTATION.md            # Détails techniques complets
├── CYPRESS_GUIDE.md            # Guide des tests E2E
├── RESUME_PROJET.md            # Résumé exécutif
├── package.json                # Dépendances et scripts
├── cypress.config.js           # Config Cypress
├── jsdoc.config.json           # Config JSDoc
└── babel.config.js             # Config Babel
```

## 🔄 Compteur Utilisateur

Le formulaire affiche en temps réel combien d'utilisateurs se sont enregistrés :
```javascript
// Chargement au montage du composant
useEffect(() => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  setUserCount(users.length);
}, []);

// Incrémentation après chaque enregistrement réussi
setUserCount(existingUsers.length);

// Affichage avec grammaire correcte
<p className="user-counter">
  {userCount} user{userCount !== 1 ? '(s)' : ''} already registered
</p>
```

## 🎯 Tests E2E avec Cypress

Tests end-to-end simulant le comportement d'un utilisateur réel.

### Tests de Validation Formulaire (9 tests)
- ✅ Charge le formulaire correctement
- ✅ Affiche les erreurs de validation
- ✅ Refuse les données invalides
- ✅ Accepte les noms avec tirets (Jean-Claude)
- ✅ Enregistrement réussi avec données valides
- ✅ Nettoyage du formulaire après succès
- ✅ Message de succès avec disparition auto
- ✅ Caractères spéciaux et espaces gérés
- ✅ Support des accents

### Tests Compteur Utilisateur (4 tests)
- ✅ Compteur à 0 initial
- ✅ Incrémentation après enregistrement
- ✅ Incrémentations multiples successives
- ✅ Persistance du compteur après rechargement

### Exécution des Tests E2E

```bash
# Mode interactif (recommandé pour développement)
npm run cypress

# Mode headless (CI/CD)
npx cypress run

# Tests spécifiques
npx cypress run --spec "cypress/e2e/register-form.cy.js"
npx cypress run --spec "cypress/e2e/user-counter.cy.js"
```

Voir [CYPRESS_GUIDE.md](./CYPRESS_GUIDE.md) pour le guide complet.

## 📚 Documentation Générée

Documentation JSDoc auto-générée à partir des commentaires :
```bash
npm run jsdoc
```

La documentation HTML est disponible dans `public/docs/`.

## 🧪 Exemples de Tests

### Tests Unitaires (Validations)
```javascript
// Exemple: Validation de majorité
it('should reject someone under 18', () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 17);
  const dateString = date.toISOString().split('T')[0];
  
  const result = validateDateOfBirth(dateString);
  expect(result.isValid).toBe(false);
  expect(result.error).toContain('18 ans');
});
```

### Tests d'Intégration (Composant)
```javascript
// Exemple: Soumission réussie
it('should successfully submit valid form and save to localStorage', async () => {
  render(<RegisterForm />);
  
  // Remplir le formulaire...
  fireEvent.change(screen.getByTestId('input-firstName'), 
    { target: { value: 'Jean' } });
  
  // Soumettre
  fireEvent.click(screen.getByRole('button', { name: /S'enregistrer/ }));
  
  // Vérifier la sauvegarde
  await waitFor(() => {
    const users = JSON.parse(localStorage.getItem('users'));
    expect(users).toHaveLength(1);
  });
});
```

## 🔍 Cas de Test Couverts

### ✅ Validations Positives
- Prénoms simples et composés (Jean, Jean-Claude)
- Prénoms avec accents (Joël, José)
- Emails valides avec domaines multiples
- Dates de majorité exacte et dépassée
- Codes postaux français
- Villes simples et composées

### ❌ Validations Négatives
- Noms trop courts (<2 chars) / longs (>50)
- Caractères invalides (chiffres, @, etc.)
- Emails invalides (pas @, pas domaine)
- Personnes mineures
- Codes postaux invalides
- Dates futures/invalides

### 🔗 Cas d'Intégration
- Soumission avec champs vides
- Erreurs multiples simultanées
- Sauvegarde unique et multiple
- Message de succès et disparition
- Nettoyage du formulaire
- localStorage persistant

## 💾 Données Stockées

Structure dans localStorage:
```javascript
{
  "users": [
    {
      "id": 1705102030000,
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "jean@example.com",
      "dateOfBirth": "2000-01-01",
      "city": "Paris",
      "postalCode": "75001",
      "registeredAt": "2025-02-13T10:30:45.123Z"
    }
  ]
}
```

## 📖 Fonction de Validation

Chaque fonction retourne :
```javascript
{
  isValid: boolean,
  error: string  // Message d'erreur si invalide
}
```

Exemples:
```javascript
validateName('Jean')           // { isValid: true, error: '' }
validateName('J')              // { isValid: false, error: '...' }
validateEmail('user@test.com') // { isValid: true, error: '' }
validatePostalCode('75001')    // { isValid: true, error: '' }
validatePostalCode('750')      // { isValid: false, error: '...' }
```

## 🛠️ Commandes Disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Lance l'app en développement |
| `npm test` | Lance les tests unitaires/intégration (mode watch) |
| `npm run cypress` | Ouvre l'interface Cypress interactive |
| `npx cypress run` | Exécute les tests E2E en mode headless |
| `npm run jsdoc` | Génère la documentation JSDoc dans public/docs |
| `npm run build` | Build production |
| `npm run test -- --coverage --watchAll=false` | Tests avec rapport couverture complet |

## 📚 Documentation Complète

Fichiers de documentation disponibles :

- [DOCUMENTATION.md](./DOCUMENTATION.md) - Documentation technique exhaustive
  - Détails de chaque fonction de validation
  - Guide de test complet
  - Architecture détaillée
  - Dépannage
  
- [CYPRESS_GUIDE.md](./CYPRESS_GUIDE.md) - Guide des tests E2E
  - Configuration Cypress
  - Écriture de tests E2E
  - Patterns et bonnes pratiques
  - Résolution de problèmes
  
- [RESUME_PROJET.md](./RESUME_PROJET.md) - Résumé exécutif du projet
  - Vue d'ensemble
  - Points forts
  - Statistiques du projet

## 🎓 Points d'Apprentissage

Ce projet couvre :
- **React fundamentals** : Hooks (useState, useEffect), lifecycle, state management
- **Testing** : Tests unitaires avec Jest, tests d'intégration avec React Testing Library, tests E2E avec Cypress
- **Validation** : Expressions régulières, logique de validation complexe, gestion d'erreurs
- **localStorage API** : Persistance de données côté client
- **Patterns de test** : AAA (Arrange, Act, Assert), Best practices
- **Documentation** : JSDoc, Markdown, commentaires descriptifs
- **Best practices** : Tests first, code modulaire, couverture maximale

## ✨ Points Forts

✅ **Couverture maximale** : 99.11% de code métier testé
✅ **Tests exhaustifs** : 79 tests (unitaires + intégration + E2E)
✅ **Tests E2E** : Cypress avec 13 tests réalistes
✅ **Documentation** : JSDoc auto-généré + guides complets
✅ **Code maintenable** : Architecture modulaire, fonctions pures
✅ **Validation robuste** : Cas limites couverts (accents, tirets, majuscules)
✅ **UX/UI soignée** : Messages clairs, compteur utilisateur, responsive
✅ **Version control** : GitHub avec CI/CD workflows

## 📞 Dépannage

**Les tests échouent ?**
```bash
rm -rf node_modules
npm install
npm test
```

**Erreur localStorage ?**
- Vérifier console (F12)
- LocalStorage requiert HTTPS en production
- Vérifier paramètres navigateur

## 📄 Licence

Projet créé à titre pédagogique pour l'École YNOV.

---

**Projet finalisé** avec succès ✅

**Statistiques du Projet :**
- Couverture de code : 99.11% (métier), 90.69% (overall)
- 79 tests au total
- 2 fichiers de configuration (Cypress, JSDoc)
- 4 fichiers de documentation
- 100% de couverture des cas d'usage

**Technologies utilisées :**
- React 18+ avec Hooks
- Jest pour les tests unitaires
- React Testing Library pour les tests d'intégration
- Cypress pour les tests E2E
- JSDoc pour la documentation
- localStorage pour la persistance
- GitHub pour le version control

---
