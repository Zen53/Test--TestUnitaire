/**
 * navigation.cy.js
 * Tests E2E de navigation SPA avec cy.intercept (architecture découplée)
 *
 * Remplace les manipulations directes de localStorage par
 * le mocking des appels API via cy.intercept.
 *
 * Scénarios testés :
 *   ✅ Nominal (200/201) : Accueil → Formulaire → Inscription → Accueil (vérification compteur + liste)
 *   ❌ Erreur Métier (400) : Email déjà utilisé → message d'erreur spécifique du back
 *   ❌ Crash Serveur (500) : Serveur down → alerte utilisateur, l'app ne plante pas
 */

describe('Navigation E2E – API Mocking avec cy.intercept', () => {

  /* ── Scénario Nominal (200 / 201) ────────────────────────── */
  it('✅ Scénario Nominal : inscription via API puis vérification sur l\'accueil', () => {
    const usersDB = [];

    // Intercepter GET /users – liste dynamique
    cy.intercept('GET', '**/users', (req) => {
      req.reply(usersDB);
    }).as('getUsers');

    // Intercepter POST /users – succès 201
    cy.intercept('POST', '**/users', (req) => {
      const newUser = {
        id: usersDB.length + 1,
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
      };
      usersDB.push(newUser);
      req.reply({ statusCode: 201, body: newUser });
    }).as('createUser');

    cy.visit('/');
    cy.wait('@getUsers');

    // 1 – Accueil : 0 utilisateur inscrit, liste vide
    cy.get('[data-testid="home-user-counter"]')
      .should('contain', '0 utilisateur');
    cy.get('[data-testid="empty-list"]').should('exist');

    // 2 – Navigation vers le formulaire
    cy.get('[data-testid="link-register"]').click();
    cy.url().should('include', '/register');

    // 3 – Remplir et soumettre un formulaire valide
    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - 25);
    const dateString = birthDate.toISOString().split('T')[0];

    cy.get('[data-testid="input-firstName"]').type('Jean');
    cy.get('[data-testid="input-lastName"]').type('Dupont');
    cy.get('[data-testid="input-email"]').type('jean.dupont@example.com');
    cy.get('[data-testid="input-dateOfBirth"]').type(dateString);
    cy.get('[data-testid="input-city"]').type('Paris');
    cy.get('[data-testid="input-postalCode"]').type('75001');

    cy.get('[data-testid="submit-button"]').click();
    cy.wait('@createUser');

    // 4 – Vérifier le message de succès
    cy.get('[data-testid="success-message"]').should('be.visible');

    // 5 – Redirection automatique vers l'accueil (après ~2 s)
    cy.url({ timeout: 5000 }).should('eq', Cypress.config('baseUrl') + '/');
    cy.wait('@getUsers');

    // 6 – Vérifier "1 utilisateur inscrit" et présence dans la liste
    cy.get('[data-testid="home-user-counter"]')
      .should('contain', '1 utilisateur');
    cy.get('[data-testid="users-list"]').should('exist');
    cy.get('[data-testid="user-firstName-0"]').should('contain', 'Jean');
    cy.get('[data-testid="user-lastName-0"]').should('contain', 'Dupont');
  });

  /* ── Scénario Erreur 400 (Email déjà utilisé) ────────────── */
  it('❌ Erreur 400 : email déjà utilisé → message d\'erreur spécifique affiché', () => {
    // Un utilisateur existe déjà dans la « BDD »
    const existingUsers = [
      {
        id: 1,
        name: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        address: { city: 'Paris', zipcode: '75001' },
      },
    ];

    // GET /users → retourne l'utilisateur existant
    cy.intercept('GET', '**/users', existingUsers).as('getUsers');

    // POST /users → 400 (email déjà utilisé)
    cy.intercept('POST', '**/users', {
      statusCode: 400,
      body: { message: 'Cet email est déjà utilisé' },
    }).as('createUser400');

    cy.visit('/');
    cy.wait('@getUsers');

    // Vérifier 1 utilisateur existant
    cy.get('[data-testid="home-user-counter"]')
      .should('contain', '1 utilisateur');
    cy.get('[data-testid="user-firstName-0"]').should('contain', 'Jean');

    // Navigation vers le formulaire
    cy.get('[data-testid="link-register"]').click();
    cy.url().should('include', '/register');

    // Remplir le formulaire avec le même email
    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - 25);
    const dateString = birthDate.toISOString().split('T')[0];

    cy.get('[data-testid="input-firstName"]').type('Marie');
    cy.get('[data-testid="input-lastName"]').type('Martin');
    cy.get('[data-testid="input-email"]').type('jean.dupont@example.com');
    cy.get('[data-testid="input-dateOfBirth"]').type(dateString);
    cy.get('[data-testid="input-city"]').type('Lyon');
    cy.get('[data-testid="input-postalCode"]').type('69001');

    cy.get('[data-testid="submit-button"]').click();
    cy.wait('@createUser400');

    // Vérifier que le message d'erreur spécifique du back s'affiche
    cy.get('[data-testid="error-email"]').should('be.visible');
    cy.get('[data-testid="success-message"]').should('not.exist');

    // Retour à l'accueil → compteur inchangé
    cy.get('[data-testid="nav-home"]').click();
    cy.wait('@getUsers');

    cy.get('[data-testid="home-user-counter"]')
      .should('contain', '1 utilisateur');
    cy.get('[data-testid="user-row-1"]').should('not.exist'); // pas de 2e utilisateur
  });

  /* ── Scénario Erreur 500 (Crash serveur) ──────────────────── */
  it('❌ Erreur 500 : serveur down → alerte utilisateur, l\'app ne plante pas', () => {
    // GET /users → OK (liste vide)
    cy.intercept('GET', '**/users', []).as('getUsers');

    // POST /users → 500 (crash serveur)
    cy.intercept('POST', '**/users', {
      statusCode: 500,
      body: { message: 'Internal Server Error' },
    }).as('createUser500');

    cy.visit('/register');
    cy.wait('@getUsers');

    // Remplir le formulaire
    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - 25);
    const dateString = birthDate.toISOString().split('T')[0];

    cy.get('[data-testid="input-firstName"]').type('Test');
    cy.get('[data-testid="input-lastName"]').type('User');
    cy.get('[data-testid="input-email"]').type('test@example.com');
    cy.get('[data-testid="input-dateOfBirth"]').type(dateString);
    cy.get('[data-testid="input-city"]').type('Paris');
    cy.get('[data-testid="input-postalCode"]').type('75000');

    cy.get('[data-testid="submit-button"]').click();
    cy.wait('@createUser500');

    // Vérifier l'alerte utilisateur (erreur serveur globale)
    cy.get('[data-testid="error-form"]').should('be.visible');
    cy.get('[data-testid="error-form"]').should('contain', 'indisponible');
    cy.get('[data-testid="success-message"]').should('not.exist');

    // L'application ne plante pas – le formulaire reste interactif
    cy.get('[data-testid="input-firstName"]').should('be.visible');
    cy.get('[data-testid="submit-button"]').should('not.be.disabled');

    // La navigation fonctionne toujours
    cy.get('[data-testid="nav-home"]').click();
    cy.get('[data-testid="home-user-counter"]').should('exist');
  });
});
