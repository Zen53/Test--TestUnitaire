/**
 * user-counter.cy.js
 * Tests E2E du compteur d'utilisateurs avec cy.intercept
 *
 * Utilise cy.intercept pour mocker les appels API.
 */

describe('User Counter E2E avec cy.intercept', () => {
  it('should display initial user count as 0', () => {
    cy.intercept('GET', '**/users', []).as('getUsers');
    cy.visit('/');
    cy.wait('@getUsers');

    cy.get('[data-testid="home-user-counter"]').should('contain', '0 utilisateur');
  });

  it('should increment user counter after successful registration', () => {
    const usersDB = [];

    cy.intercept('GET', '**/users', (req) => {
      req.reply(usersDB);
    }).as('getUsers');

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

    // Vérifier le compteur initial
    cy.get('[data-testid="home-user-counter"]').should('contain', '0 utilisateur');

    // Naviguer vers le formulaire
    cy.get('[data-testid="link-register"]').click();

    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    const dateString = birthDate.toISOString().split('T')[0];

    // Remplir et soumettre le formulaire
    cy.get('[data-testid="input-firstName"]').type('Jean');
    cy.get('[data-testid="input-lastName"]').type('Dupont');
    cy.get('[data-testid="input-email"]').type('jean@example.com');
    cy.get('[data-testid="input-dateOfBirth"]').type(dateString);
    cy.get('[data-testid="input-city"]').type('Paris');
    cy.get('[data-testid="input-postalCode"]').type('75001');

    cy.get('[data-testid="submit-button"]').click();
    cy.wait('@createUser');
    cy.get('[data-testid="success-message"]').should('exist');

    // Attendre la redirection vers l'accueil
    cy.url({ timeout: 5000 }).should('eq', Cypress.config('baseUrl') + '/');
    cy.wait('@getUsers');

    // Vérifier que le compteur a augmenté
    cy.get('[data-testid="home-user-counter"]').should('contain', '1 utilisateur');
  });

  it('should show correct count with pre-existing users', () => {
    // 2 utilisateurs déjà existants dans l'API
    const existingUsers = [
      { id: 1, name: 'Jean Dupont', email: 'jean@ex.com', address: { city: 'Paris', zipcode: '75001' } },
      { id: 2, name: 'Marie Martin', email: 'marie@ex.com', address: { city: 'Lyon', zipcode: '69000' } },
    ];

    cy.intercept('GET', '**/users', existingUsers).as('getUsers');
    cy.visit('/');
    cy.wait('@getUsers');

    cy.get('[data-testid="home-user-counter"]').should('contain', '2 utilisateur');
    cy.get('[data-testid="users-list"]').should('exist');
    cy.get('[data-testid="user-firstName-0"]').should('contain', 'Jean');
    cy.get('[data-testid="user-firstName-1"]').should('contain', 'Marie');
  });
});
