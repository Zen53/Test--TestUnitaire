# Formulaire d'Enregistrement React

Une application React robuste avec un formulaire d'enregistrement complet, validations côté client, intégration API via Axios, et isolation des tests par mocking réseau. Ce projet démontre les meilleures pratiques en React testing avec **82 tests Jest** et des **tests E2E Cypress avec `cy.intercept`**.

## 🎯 Objectifs du Projet

Ce projet met en pratique :
- ✅ Développement React avec hooks (useState, useEffect, useContext)
- ✅ Validations côté client exhaustives
- ✅ Intégration API avec Axios (JSONPlaceholder)
- ✅ Architecture découplée front-end / back-end
- ✅ Mocking réseau avec `jest.mock('axios')` et `cy.intercept`
- ✅ Gestion des erreurs HTTP (200, 400, 500)
- ✅ Tests unitaires, d'intégration et E2E
- ✅ Context API pour la gestion d'état partagé
- ✅ Navigation SPA avec React Router v6
- ✅ Pipeline CI/CD GitHub Actions
- ✅ Génération de documentation JSDoc

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

### Intégration API (Axios + JSONPlaceholder)
- 🌐 `fetchUsers()` – GET /users avec transformation des données
- 📝 `createUser()` – POST /users avec payload adapté
- 🗑️ `deleteUser()` – DELETE /users/:id
- ⚡ Client axios lazy-init (singleton) pour faciliter le mocking
- 🔄 Fallback localStorage si l'API est indisponible

### Gestion des Erreurs HTTP
- ✅ **200/201** : Succès nominal (création, lecture)
- ❌ **400** : Erreur métier (email déjà utilisé) → message sur le champ email
- ❌ **500** : Crash serveur → alerte globale, l'app ne plante pas
- 🔌 **Réseau** : Erreur de connexion gérée gracieusement

### Navigation SPA (React Router v6)
- 🏠 Page d'accueil : compteur d'inscrits + table des utilisateurs
- 📝 Page d'inscription : formulaire avec validation et soumission API
- 🔗 Navigation avec redirection automatique après inscription

### UX/UI
- 📝 Messages d'erreur spécifiques par champ
- 🚨 Alerte serveur globale (erreur 500) via `data-testid="error-form"`
- ✨ Message de succès avec fermeture auto (2s)
- ⏳ État de chargement (loading) pendant les appels API
- 🔄 Nettoyage des erreurs lors de la saisie
- 🔁 Réinitialisation du formulaire après succès

## 📊 Couverture de Test

**Total : 82 tests Jest + tests E2E Cypress**

```
✅ Tests Unitaires    : 54 tests (validations.test.js)
✅ Tests API          : 14 tests (api.test.js) – jest.mock('axios')
✅ Tests d'Intégration: 15 tests (RegisterForm.test.js) – dont 400/500
✅ Tests App          :  2 tests (App.test.js)
✅ Tests E2E Cypress  : 14 tests
   - Navigation API mocking  : 3 tests (navigation.cy.js) – cy.intercept
   - Validation formulaire   : 8 tests (register-form.cy.js) – cy.intercept
   - Compteur utilisateur    : 3 tests (user-counter.cy.js) – cy.intercept
```

### Résultats des Tests Jest

```
Test Suites: 4 passed, 4 total ✅
Tests:       82 passed, 82 total ✅
Snapshots:   0 total
Time:        ~7s
```

## 📁 Structure du Projet

```
src/
├── validations.js              # Logique de validation pure
├── validations.test.js         # 54 tests unitaires
├── App.js                      # Routeur SPA + Provider
├── App.test.js                 # Tests avec mock API
├── App.css
├── api/
│   ├── api.js                  # Couche HTTP Axios (fetchUsers, createUser, deleteUser)
│   └── api.test.js             # 14 tests avec jest.mock('axios') – 200/400/500
├── context/
│   └── UsersContext.js          # Context API (state partagé, appels async)
├── pages/
│   └── HomePage.js              # Page accueil (compteur, table, loading/error)
├── components/
│   ├── RegisterForm.js          # Formulaire avec soumission API async
│   ├── RegisterForm.test.js     # 15 tests d'intégration (dont 400/500)
│   └── RegisterForm.css
└── index.js

cypress/
├── e2e/
│   ├── navigation.cy.js        # 3 tests – Nominal 201, Erreur 400, Crash 500
│   ├── register-form.cy.js     # 8 tests – Formulaire avec cy.intercept
│   └── user-counter.cy.js      # 3 tests – Compteur avec cy.intercept
├── support/
│   └── e2e.js

.github/
└── workflows/
    └── ci.yml                   # Pipeline CI/CD (3 jobs + REACT_APP_API_URL)

.jest/
└── setEnvVars.js               # Variables d'environnement pour tests
```

## 🧪 Architecture de Mocking

### Jest – `jest.mock('axios')`

Les tests d'intégration API utilisent le mocking d'axios au niveau module :

```javascript
jest.mock('axios');

import axios from 'axios';
import { fetchUsers, createUser, _resetApiClient } from './api';

beforeEach(() => {
  _resetApiClient(); // Réinitialise le singleton entre chaque test
  axios.create.mockReturnValue({
    get: mockGet,
    post: mockPost,
    delete: mockDelete,
  });
});
```

**Scénarios testés :**
| Scénario | Code HTTP | Test |
|----------|-----------|------|
| Succès lecture | 200 | Transformation données JSONPlaceholder |
| Succès création | 201 | Retour données complètes + ID |
| Email dupliqué | 400 | Message spécifique du serveur |
| Serveur down | 500 | Message "indisponible", pas de crash |
| Réseau coupé | — | Gestion gracieuse de l'erreur |

### Cypress – `cy.intercept`

Les tests E2E utilisent `cy.intercept` pour isoler le frontend :

```javascript
// Intercepter GET /users → liste mockée
cy.intercept('GET', '**/users', []).as('getUsers');

// Intercepter POST /users → succès 201
cy.intercept('POST', '**/users', {
  statusCode: 201,
  body: { id: 11 },
}).as('createUser');

// Intercepter POST /users → erreur 400
cy.intercept('POST', '**/users', {
  statusCode: 400,
  body: { message: 'Cet email est déjà utilisé' },
}).as('createUser400');

// Intercepter POST /users → crash 500
cy.intercept('POST', '**/users', {
  statusCode: 500,
  body: { message: 'Internal Server Error' },
}).as('createUser500');
```

## 🔄 Context API et Gestion d'État

```javascript
// UsersContext fournit l'état partagé à toute l'app
const { users, addUser, userCount, isLoading, error } = useUsers();

// addUser retourne { success, error, status } pour distinguer 400 vs 500
const result = await addUser(formData);
if (!result.success) {
  if (result.status >= 500) {
    // Alerte serveur globale
  } else {
    // Erreur métier sur le champ email
  }
}
```

## 🔗 Pipeline CI/CD

Le fichier `.github/workflows/ci.yml` définit 3 jobs :

```yaml
jobs:
  unit-integration:   # npm test (Jest 82 tests)
  e2e:                # npm run build → serve → cypress run
  build:              # npm run build (production)
```

Chaque job configure `REACT_APP_API_URL: https://jsonplaceholder.typicode.com`.

## 🎯 Tests E2E avec Cypress

### Navigation avec mocking API (3 tests)
- ✅ **Nominal 201** : Accueil → Inscription → API POST 201 → Redirection → Vérification compteur
- ❌ **Erreur 400** : Email dupliqué → API POST 400 → Erreur affichée, compteur inchangé
- ❌ **Crash 500** : Serveur down → API POST 500 → Alerte globale, app reste fonctionnelle

### Validation Formulaire (8 tests)
- ✅ Charge le formulaire correctement
- ✅ Affiche les erreurs de validation (formulaire vide)
- ✅ Enregistrement réussi avec données valides
- ✅ Refuse les données invalides (email, code postal, âge)
- ✅ Accepte les noms avec tirets (Jean-Claude)
- ✅ Nettoyage du formulaire après succès

### Compteur Utilisateur (3 tests)
- ✅ Compteur à 0 initial (API retourne liste vide)
- ✅ Incrémentation après enregistrement via API
- ✅ Affichage correct avec utilisateurs pré-existants

### Exécution des Tests E2E

```bash
# Mode interactif (recommandé pour développement)
npm run cypress

# Mode headless (CI/CD)
npx cypress run

# Tests spécifiques
npx cypress run --spec "cypress/e2e/navigation.cy.js"
npx cypress run --spec "cypress/e2e/register-form.cy.js"
npx cypress run --spec "cypress/e2e/user-counter.cy.js"
```

## 📚 Documentation Générée

Documentation JSDoc auto-générée à partir des commentaires :
```bash
npm run jsdoc
```

La documentation HTML est disponible dans `public/docs/`.

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

### 🌐 Cas API (Mocking)
- Succès 200/201 : Lecture et création d'utilisateurs
- Erreur 400 : Email déjà utilisé → message spécifique
- Erreur 500 : Serveur indisponible → alerte globale
- Erreur réseau : Connexion coupée → gestion gracieuse
- Singleton axios : Réutilisation du client entre appels

### 🔗 Cas d'Intégration
- Soumission avec champs vides
- Erreurs multiples simultanées
- Soumission réussie via API mock
- Message de succès et disparition (2s)
- Nettoyage du formulaire
- Erreur 400 sur le champ email
- Erreur 500 affichée en alerte globale

## 🛠️ Commandes Disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Lance l'app en développement |
| `npm test` | Lance les 82 tests Jest avec couverture |
| `npm run cypress` | Ouvre l'interface Cypress interactive |
| `npx cypress run` | Exécute les tests E2E en mode headless |
| `npm run jsdoc` | Génère la documentation JSDoc dans public/docs |
| `npm run build` | Build production |

## 📚 Documentation Complète

Fichiers de documentation disponibles :

- [CYPRESS_GUIDE.md](./CYPRESS_GUIDE.md) - Guide des tests E2E avec cy.intercept

## 🎓 Points d'Apprentissage

Ce projet couvre :
- **React fundamentals** : Hooks (useState, useEffect, useContext), Context API, React Router v6
- **Intégration API** : Axios, JSONPlaceholder, architecture découplée
- **Mocking réseau** : `jest.mock('axios')` pour tests unitaires/intégration, `cy.intercept` pour E2E
- **Résilience** : Gestion des erreurs HTTP 400/500, fallback localStorage
- **Testing** : Tests unitaires (Jest), tests d'intégration (RTL), tests E2E (Cypress)
- **Validation** : Expressions régulières, logique de validation complexe
- **CI/CD** : GitHub Actions pipeline (3 jobs : UT/IT → E2E → Build)
- **Patterns de test** : AAA (Arrange, Act, Assert), async/await, act(), waitFor()

## ✨ Points Forts

✅ **82 tests Jest** : 4 suites, 0 échec
✅ **14 tests E2E Cypress** : Avec `cy.intercept` (plus de localStorage)
✅ **Mocking complet** : `jest.mock('axios')` + `cy.intercept` pour isolation réseau
✅ **Résilience testée** : Scénarios 200, 400, 500 couverts en Jest ET Cypress
✅ **Architecture découplée** : API layer séparé, Context API, lazy-init singleton
✅ **CI/CD** : Pipeline GitHub Actions avec `REACT_APP_API_URL`
✅ **Code maintenable** : Architecture modulaire, fonctions pures, documentation JSDoc

## 📞 Dépannage

**Les tests échouent ?**
```bash
rm -rf node_modules
npm install
npm test
```

**Erreur API en développement ?**
- Vérifier la variable `REACT_APP_API_URL` dans `.env`
- JSONPlaceholder peut avoir des limites de requêtes
- L'app utilise un fallback localStorage automatique

## 📄 Licence

Projet créé à titre pédagogique pour l'École YNOV.

---

**Technologies utilisées :**
- React 19 avec Hooks + Context API
- React Router v6 (navigation SPA)
- Axios (appels HTTP)
- JSONPlaceholder (API de test)
- Jest + React Testing Library (tests unitaires/intégration)
- Cypress 15 (tests E2E avec `cy.intercept`)
- GitHub Actions (CI/CD)
- JSDoc (documentation)

---
