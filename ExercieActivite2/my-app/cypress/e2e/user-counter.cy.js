describe('Register Form User Counter E2E', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.visit('/'); // Rafraîchir après avoir vidé le localStorage
  });

  it('should display initial user count as 0', () => {
    cy.visit('/');
    cy.get('[data-testid="user-counter"]').should('contain', '0 user already registered');
  });

  it('should increment user counter after successful registration', () => {
    cy.visit('/');
    
    // Vérifier le compteur initial
    cy.get('[data-testid="user-counter"]').should('contain', '0 user already registered');

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

    cy.get('button').contains(/S'enregistrer/).click();
    cy.get('[data-testid="success-message"]').should('exist');

    // Vérifier que le compteur a augmenté
    cy.get('[data-testid="user-counter"]').should('contain', '1 user(s) already registered');
  });

  it('should increment user counter with 2 users', () => {
    cy.visit('/');
    
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    const dateString = birthDate.toISOString().split('T')[0];

    // Premier utilisateur
    cy.get('[data-testid="input-firstName"]').type('Jean');
    cy.get('[data-testid="input-lastName"]').type('Dupont');
    cy.get('[data-testid="input-email"]').type('jean@example.com');
    cy.get('[data-testid="input-dateOfBirth"]').type(dateString);
    cy.get('[data-testid="input-city"]').type('Paris');
    cy.get('[data-testid="input-postalCode"]').type('75001');
    cy.get('button').contains(/S'enregistrer/).click();
    cy.get('[data-testid="success-message"]').should('exist');

    // Vérifier le compteur à 1
    cy.get('[data-testid="user-counter"]').should('contain', '1 user(s) already registered');

    // Deuxième utilisateur
    cy.get('[data-testid="input-firstName"]').type('Marie');
    cy.get('[data-testid="input-lastName"]').type('Martin');
    cy.get('[data-testid="input-email"]').type('marie@example.com');
    cy.get('[data-testid="input-dateOfBirth"]').type(dateString);
    cy.get('[data-testid="input-city"]').type('Lyon');
    cy.get('[data-testid="input-postalCode"]').type('69000');
    cy.get('button').contains(/S'enregistrer/).click();
    cy.get('[data-testid="success-message"]').should('exist');

    // Vérifier que le compteur est à 2
    cy.get('[data-testid="user-counter"]').should('contain', '2 user(s) already registered');
  });

  it('should persist user count on page reload', () => {
    cy.visit('/');
    
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    const dateString = birthDate.toISOString().split('T')[0];

    // Enregistrer un utilisateur
    cy.get('[data-testid="input-firstName"]').type('Jean');
    cy.get('[data-testid="input-lastName"]').type('Dupont');
    cy.get('[data-testid="input-email"]').type('jean@example.com');
    cy.get('[data-testid="input-dateOfBirth"]').type(dateString);
    cy.get('[data-testid="input-city"]').type('Paris');
    cy.get('[data-testid="input-postalCode"]').type('75001');
    cy.get('button').contains(/S'enregistrer/).click();
    cy.get('[data-testid="success-message"]').should('exist');

    // Recharger la page
    cy.reload();

    // Vérifier que le compteur affiche toujours le bon nombre
    cy.get('[data-testid="user-counter"]').should('contain', '1 user(s) already registered');
  });
});
