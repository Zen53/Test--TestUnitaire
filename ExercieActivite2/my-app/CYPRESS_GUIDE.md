# Tests E2E avec Cypress

## Installation

```bash
npm install --save-dev cypress
```

## Configuration

Le fichier `cypress.config.js` configure :
- **baseUrl** : `http://localhost:3000` (URL de base de l'application)

## Exécuter les tests E2E

### Mode interactif (interface graphique)
```bash
npm run cypress
```

Cela ouvre l'interface Cypress où vous pouvez :
- Voir tous les tests disponibles
- Exécuter les tests individuellement
- Observer la démonstration en temps réel
- Déboguer avec le DevTools intégré

### Mode headless (ligne de commande)
```bash
npx cypress run
```

### Exécuter un test spécifique
```bash
npx cypress run --spec "cypress/e2e/register-form.cy.js"
npx cypress run --spec "cypress/e2e/user-counter.cy.js"
```

## Tests Disponibles

### 📝 `register-form.cy.js` (8 tests)
Tests pour la fonctionnalité du formulaire d'enregistrement :

1. **should load the register form on homepage**
   - Vérifie que le formulaire s'affiche correctement

2. **should display validation errors when submitting empty form**
   - Teste les messages d'erreur pour champs vides

3. **should successfully register a new user**
   - Teste l'enregistrement d'un utilisateur valide

4. **should register multiple users and persist data**
   - Vérifie la sauvegarde de plusieurs utilisateurs

5. **should show error for invalid email**
   - Teste la validation de l'email

6. **should show error for invalid postal code**
   - Teste la validation du code postal

7. **should reject users under 18 years old**
   - Teste le blocage des mineurs

8. **should clear form after successful submission**
   - Vérifie le nettoyage du formulaire après succès

9. **should support hyphenated names**
   - Teste les noms composés (tirets)

### 👥 `user-counter.cy.js` (4 tests)
Tests pour le compteur d'utilisateurs enregistrés :

1. **should display initial user count as 0**
   - Vérifie que le compteur commence à 0

2. **should increment user counter after successful registration**
   - Vérifie que le compteur augmente après un enregistrement

3. **should increment user counter with 2 users**
   - Teste l'incrémentation du compteur avec multiple enregistrements

4. **should persist user count on page reload**
   - Vérifie la persistance du compteur après rechargement

## Structure des Tests

Chaque test E2E suit le pattern **AAA** (Arrange, Act, Assert) :

```javascript
describe('Feature Group', () => {
  beforeEach(() => {
    // Setup avant chaque test
    cy.visit('/');
    // Nettoyer le localStorage
  });

  it('should do something', () => {
    // Arrange - Préparer les données
    cy.get('[data-testid="input"]').type('value');
    
    // Act - Effectuer l'action
    cy.get('button').click();
    
    // Assert - Vérifier le résultat
    cy.get('[data-testid="success"]').should('exist');
  });
});
```

## Sélecteurs Utilisés

Les tests utilisent des `data-testid` pour une sélection fiable :

| Sélecteur | Élément |
|-----------|---------|
| `input-firstName` | Champ Prénom |
| `input-lastName` | Champ Nom |
| `input-email` | Champ Email |
| `input-dateOfBirth` | Champ Date de naissance |
| `input-city` | Champ Ville |
| `input-postalCode` | Champ Code postal |
| `error-*` | Messages d'erreur |
| `success-message` | Message de succès |
| `user-counter` | Compteur d'utilisateurs |

## Commandes Cypress Courantes

| Commande | Action |
|----------|--------|
| `cy.visit('/')` | Visite la page d'accueil |
| `cy.get('[data-testid="..."]')` | Sélectionne un élément |
| `cy.type('text')` | Tape du texte |
| `cy.click()` | Clique sur un élément |
| `cy.should('exist')` | Vérifie l'existance |
| `cy.should('contain', 'text')` | Vérifie le contenu |
| `cy.reload()` | Recharge la page |
| `cy.window()` | Accède à la fenêtre |
| `cy.get('[data-testid="..."]').should('have.value', '')` | Vérifie la valeur |

## Architecture des Tests

```
cypress/
├── e2e/
│   ├── register-form.cy.js      # Tests du formulaire (8 tests)
│   └── user-counter.cy.js       # Tests du compteur (4 tests)
├── support/
│   └── e2e.js                   # Commandes personnalisées
└── cypress.config.js
```

## Dépannage

### Les tests ne trouvent pas les éléments
- Vérifiez que les `data-testid` correspondent dans le composant React
- Assurez-vous que l'application est bien lancée sur `http://localhost:3000`

### Les tests sont trop rapides
- Utilisez `cy.wait(500)` pour ajouter des délais si nécessaire
- Les assertions automatiques attendent que les éléments existent

### Le localStorage n'est pas vide
- `beforeEach` nettoie le localStorage
- Sinon, utilisez `cy.window().then((win) => win.localStorage.clear())`

## Amélioration Future

Possibles améliorations des tests E2E :
- ✅ Tests du compteur d'utilisateurs
- 🔄 Tests de performance
- 🔄 Tests d'accessibilité
- 🔄 Tests de capture d'écran
- 🔄 Tests parallélisés

## Intégration CI/CD

Les tests Cypress peuvent être intégrés dans GitHub Actions :

```yaml
- name: Run Cypress tests
  run: npx cypress run --headless
```

## Ressources

- [Documentation Cypress](https://docs.cypress.io)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [API Reference](https://docs.cypress.io/api/table-of-contents)
