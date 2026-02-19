/**
 * navigation.cy.js
 * Tests E2E de navigation SPA – Activité 4
 *
 * Scénario Nominal  : Accueil → Formulaire → Inscription → Accueil (vérification compteur + liste)
 * Scénario d'Erreur : Tentative invalide → compteur et liste inchangés
 */

describe('Navigation E2E – Parcours multi-vues', () => {

  /* ── Scénario Nominal ────────────────────────────────────── */
  it('Scénario Nominal : inscription puis vérification sur l\'accueil', () => {
    // Préparer un localStorage vide
    cy.window().then((win) => win.localStorage.clear());
    cy.visit('/');

    // 1 – Accueil : 0 utilisateur inscrit, liste vide
    cy.get('[data-testid="home-user-counter"]')
      .should('contain', '0 utilisateur');
    cy.get('[data-testid="empty-list"]').should('exist');
    cy.get('[data-testid="users-list"]').should('not.exist');

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

    // Vérifier le message de succès
    cy.get('[data-testid="success-message"]').should('be.visible');

    // 4 – Redirection automatique vers l'accueil (après 2 s)
    cy.url({ timeout: 5000 }).should('eq', Cypress.config('baseUrl') + '/');

    // 5 – Vérifier "1 utilisateur inscrit" et présence dans la liste
    cy.get('[data-testid="home-user-counter"]')
      .should('contain', '1 utilisateur');
    cy.get('[data-testid="users-list"]').should('exist');
    cy.get('[data-testid="user-firstName-0"]').should('contain', 'Jean');
    cy.get('[data-testid="user-lastName-0"]').should('contain', 'Dupont');
  });

  /* ── Scénario d'Erreur ───────────────────────────────────── */
  it('Scénario d\'Erreur : ajout invalide ne change pas le compteur ni la liste', () => {
    // Préparer un état avec 1 utilisateur déjà inscrit (reprise de l'état précédent)
    const existingUser = {
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      dateOfBirth: '2001-01-01',
      city: 'Paris',
      postalCode: '75001',
      registeredAt: new Date().toISOString(),
    };
    cy.window().then((win) => {
      win.localStorage.setItem('users', JSON.stringify([existingUser]));
    });
    cy.visit('/');

    // Vérifier l'état initial : 1 utilisateur inscrit
    cy.get('[data-testid="home-user-counter"]')
      .should('contain', '1 utilisateur');
    cy.get('[data-testid="user-firstName-0"]').should('contain', 'Jean');

    // Navigation vers le formulaire
    cy.get('[data-testid="link-register"]').click();
    cy.url().should('include', '/register');

    // Tentative 1 : email déjà pris (même email que Jean Dupont)
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

    // Vérifier l'erreur affichée (email déjà utilisé)
    cy.get('[data-testid="error-email"]').should('be.visible');
    cy.get('[data-testid="success-message"]').should('not.exist');

    // Retour vers l'accueil
    cy.get('[data-testid="nav-home"]').click();
    cy.url().should('eq', Cypress.config('baseUrl') + '/');

    // Vérifier "toujours 1 utilisateur inscrit" et liste inchangée
    cy.get('[data-testid="home-user-counter"]')
      .should('contain', '1 utilisateur');
    cy.get('[data-testid="user-firstName-0"]').should('contain', 'Jean');
    cy.get('[data-testid="user-lastName-0"]').should('contain', 'Dupont');
    cy.get('[data-testid="user-row-1"]').should('not.exist'); // pas de 2e utilisateur
  });
});
