/**
 * register-form.cy.js
 * Tests E2E du formulaire d'inscription avec cy.intercept
 *
 * Utilise cy.intercept pour isoler le frontend des appels réseau.
 */

describe('Register Form E2E Tests', () => {
  beforeEach(() => {
    // Intercepter GET /users → liste vide (état initial propre)
    cy.intercept('GET', '**/users', []).as('getUsers');

    // Intercepter POST /users → succès 201 par défaut
    cy.intercept('POST', '**/users', {
      statusCode: 201,
      body: { id: 11 },
    }).as('createUser');

    cy.visit('/register');
    cy.wait('@getUsers');
  });

  it('should load the register form', () => {
    cy.contains('Formulaire d\'enregistrement').should('be.visible');
    cy.get('form').should('be.visible');
  });

  it('should display validation errors when submitting empty form', () => {
    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="error-firstName"]').should('exist');
    cy.get('[data-testid="error-lastName"]').should('exist');
    cy.get('[data-testid="error-email"]').should('exist');
    cy.get('[data-testid="error-dateOfBirth"]').should('exist');
    cy.get('[data-testid="error-city"]').should('exist');
    cy.get('[data-testid="error-postalCode"]').should('exist');
  });

  it('should successfully register a new user', () => {
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    const dateString = birthDate.toISOString().split('T')[0];

    cy.get('[data-testid="input-firstName"]').type('Jean');
    cy.get('[data-testid="input-lastName"]').type('Dupont');
    cy.get('[data-testid="input-email"]').type('jean.dupont@example.com');
    cy.get('[data-testid="input-dateOfBirth"]').type(dateString);
    cy.get('[data-testid="input-city"]').type('Paris');
    cy.get('[data-testid="input-postalCode"]').type('75001');

    cy.get('[data-testid="submit-button"]').click();
    cy.wait('@createUser');

    cy.get('[data-testid="success-message"]').should('exist');
    cy.get('[data-testid="success-message"]').should('contain', 'Enregistrement réussi');
  });

  it('should show error for invalid email', () => {
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    const dateString = birthDate.toISOString().split('T')[0];

    cy.get('[data-testid="input-firstName"]').type('Jean');
    cy.get('[data-testid="input-lastName"]').type('Dupont');
    cy.get('[data-testid="input-email"]').type('invalid-email');
    cy.get('[data-testid="input-dateOfBirth"]').type(dateString);
    cy.get('[data-testid="input-city"]').type('Paris');
    cy.get('[data-testid="input-postalCode"]').type('75001');

    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="error-email"]').should('exist');
    cy.get('[data-testid="error-email"]').should('contain', 'invalide');
  });

  it('should show error for invalid postal code', () => {
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    const dateString = birthDate.toISOString().split('T')[0];

    cy.get('[data-testid="input-firstName"]').type('Jean');
    cy.get('[data-testid="input-lastName"]').type('Dupont');
    cy.get('[data-testid="input-email"]').type('jean@example.com');
    cy.get('[data-testid="input-dateOfBirth"]').type(dateString);
    cy.get('[data-testid="input-city"]').type('Paris');
    cy.get('[data-testid="input-postalCode"]').type('750');

    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="error-postalCode"]').should('exist');
    cy.get('[data-testid="error-postalCode"]').should('contain', '5 chiffres');
  });

  it('should reject users under 18 years old', () => {
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
    const dateString = birthDate.toISOString().split('T')[0];

    cy.get('[data-testid="input-firstName"]').type('Jeune');
    cy.get('[data-testid="input-lastName"]').type('Personne');
    cy.get('[data-testid="input-email"]').type('young@example.com');
    cy.get('[data-testid="input-dateOfBirth"]').type(dateString);
    cy.get('[data-testid="input-city"]').type('Paris');
    cy.get('[data-testid="input-postalCode"]').type('75001');

    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="error-dateOfBirth"]').should('exist');
    cy.get('[data-testid="error-dateOfBirth"]').should('contain', '18 ans');
  });

  it('should clear form after successful submission', () => {
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    const dateString = birthDate.toISOString().split('T')[0];

    cy.get('[data-testid="input-firstName"]').type('Jean');
    cy.get('[data-testid="input-lastName"]').type('Dupont');
    cy.get('[data-testid="input-email"]').type('jean@example.com');
    cy.get('[data-testid="input-dateOfBirth"]').type(dateString);
    cy.get('[data-testid="input-city"]').type('Paris');
    cy.get('[data-testid="input-postalCode"]').type('75001');

    cy.get('[data-testid="submit-button"]').click();
    cy.wait('@createUser');

    cy.get('[data-testid="success-message"]').should('exist');

    cy.get('[data-testid="input-firstName"]').should('have.value', '');
    cy.get('[data-testid="input-lastName"]').should('have.value', '');
    cy.get('[data-testid="input-email"]').should('have.value', '');
    cy.get('[data-testid="input-dateOfBirth"]').should('have.value', '');
    cy.get('[data-testid="input-city"]').should('have.value', '');
    cy.get('[data-testid="input-postalCode"]').should('have.value', '');
  });

  it('should support hyphenated names', () => {
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    const dateString = birthDate.toISOString().split('T')[0];

    cy.get('[data-testid="input-firstName"]').type('Jean-Claude');
    cy.get('[data-testid="input-lastName"]').type('Dupont-Martin');
    cy.get('[data-testid="input-email"]').type('jean.claude@example.com');
    cy.get('[data-testid="input-dateOfBirth"]').type(dateString);
    cy.get('[data-testid="input-city"]').type('Villefranche-sur-Mer');
    cy.get('[data-testid="input-postalCode"]').type('06230');

    cy.get('[data-testid="submit-button"]').click();
    cy.wait('@createUser');

    cy.get('[data-testid="success-message"]').should('exist');
  });
});
