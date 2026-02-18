describe('Register Form E2E Tests', () => {
  beforeEach(() => {
    // Vider le localStorage avant chaque test
    cy.visit('/');
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    // Recharger la page après avoir vidé le localStorage
    cy.visit('/');
  });

  it('should load the register form on homepage', () => {
    cy.visit('/');
    cy.contains('Formulaire d\'enregistrement').should('be.visible');
    cy.get('form').should('be.visible');
  });

  it('should display validation errors when submitting empty form', () => {
    cy.visit('/');
    cy.get('button').contains(/S'enregistrer/).click();
    
    // Vérifier que les messages d'erreur apparaissent
    cy.get('[data-testid="error-firstName"]').should('exist');
    cy.get('[data-testid="error-lastName"]').should('exist');
    cy.get('[data-testid="error-email"]').should('exist');
    cy.get('[data-testid="error-dateOfBirth"]').should('exist');
    cy.get('[data-testid="error-city"]').should('exist');
    cy.get('[data-testid="error-postalCode"]').should('exist');
  });

  it('should successfully register a new user', () => {
    cy.visit('/');
    
    // Calculer la date de naissance (25 ans)
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    const dateString = birthDate.toISOString().split('T')[0];

    // Remplir le formulaire
    cy.get('[data-testid="input-firstName"]').type('Jean');
    cy.get('[data-testid="input-lastName"]').type('Dupont');
    cy.get('[data-testid="input-email"]').type('jean.dupont@example.com');
    cy.get('[data-testid="input-dateOfBirth"]').type(dateString);
    cy.get('[data-testid="input-city"]').type('Paris');
    cy.get('[data-testid="input-postalCode"]').type('75001');

    // Soumettre le formulaire
    cy.get('button').contains(/S'enregistrer/).click();

    // Vérifier le message de succès
    cy.get('[data-testid="success-message"]').should('exist');
    cy.get('[data-testid="success-message"]').should('contain', 'Enregistrement réussi');
  });

  it('should register multiple users and persist data', () => {
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

    // Attendre le message de succès
    cy.get('[data-testid="success-message"]').should('exist');

    // Deuxième utilisateur
    cy.get('[data-testid="input-firstName"]').type('Marie');
    cy.get('[data-testid="input-lastName"]').type('Martin');
    cy.get('[data-testid="input-email"]').type('marie@example.com');
    cy.get('[data-testid="input-dateOfBirth"]').type(dateString);
    cy.get('[data-testid="input-city"]').type('Lyon');
    cy.get('[data-testid="input-postalCode"]').type('69000');
    cy.get('button').contains(/S'enregistrer/).click();

    // Attendre le message de succès
    cy.get('[data-testid="success-message"]').should('exist');

    // Vérifier que les données sont stockées
    cy.window().then((win) => {
      const users = JSON.parse(win.localStorage.getItem('users'));
      expect(users).to.have.length(2);
      expect(users[0].firstName).to.equal('Jean');
      expect(users[1].firstName).to.equal('Marie');
    });
  });

  it('should show error for invalid email', () => {
    cy.visit('/');
    
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    const dateString = birthDate.toISOString().split('T')[0];

    cy.get('[data-testid="input-firstName"]').type('Jean');
    cy.get('[data-testid="input-lastName"]').type('Dupont');
    cy.get('[data-testid="input-email"]').type('invalid-email');
    cy.get('[data-testid="input-dateOfBirth"]').type(dateString);
    cy.get('[data-testid="input-city"]').type('Paris');
    cy.get('[data-testid="input-postalCode"]').type('75001');

    cy.get('button').contains(/S'enregistrer/).click();

    cy.get('[data-testid="error-email"]').should('exist');
    cy.get('[data-testid="error-email"]').should('contain', 'invalide');
  });

  it('should show error for invalid postal code', () => {
    cy.visit('/');
    
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    const dateString = birthDate.toISOString().split('T')[0];

    cy.get('[data-testid="input-firstName"]').type('Jean');
    cy.get('[data-testid="input-lastName"]').type('Dupont');
    cy.get('[data-testid="input-email"]').type('jean@example.com');
    cy.get('[data-testid="input-dateOfBirth"]').type(dateString);
    cy.get('[data-testid="input-city"]').type('Paris');
    cy.get('[data-testid="input-postalCode"]').type('750'); // Invalide

    cy.get('button').contains(/S'enregistrer/).click();

    cy.get('[data-testid="error-postalCode"]').should('exist');
    cy.get('[data-testid="error-postalCode"]').should('contain', '5 chiffres');
  });

  it('should reject users under 18 years old', () => {
    cy.visit('/');
    
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
    const dateString = birthDate.toISOString().split('T')[0];

    cy.get('[data-testid="input-firstName"]').type('Jeune');
    cy.get('[data-testid="input-lastName"]').type('Personne');
    cy.get('[data-testid="input-email"]').type('young@example.com');
    cy.get('[data-testid="input-dateOfBirth"]').type(dateString);
    cy.get('[data-testid="input-city"]').type('Paris');
    cy.get('[data-testid="input-postalCode"]').type('75001');

    cy.get('button').contains(/S'enregistrer/).click();

    cy.get('[data-testid="error-dateOfBirth"]').should('exist');
    cy.get('[data-testid="error-dateOfBirth"]').should('contain', '18 ans');
  });

  it('should clear form after successful submission', () => {
    cy.visit('/');
    
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    const dateString = birthDate.toISOString().split('T')[0];

    // Remplir le formulaire
    cy.get('[data-testid="input-firstName"]').type('Jean');
    cy.get('[data-testid="input-lastName"]').type('Dupont');
    cy.get('[data-testid="input-email"]').type('jean@example.com');
    cy.get('[data-testid="input-dateOfBirth"]').type(dateString);
    cy.get('[data-testid="input-city"]').type('Paris');
    cy.get('[data-testid="input-postalCode"]').type('75001');

    // Soumettre
    cy.get('button').contains(/S'enregistrer/).click();

    // Attendre le message de succès
    cy.get('[data-testid="success-message"]').should('exist');

    // Vérifier que les champs sont vidés
    cy.get('[data-testid="input-firstName"]').should('have.value', '');
    cy.get('[data-testid="input-lastName"]').should('have.value', '');
    cy.get('[data-testid="input-email"]').should('have.value', '');
    cy.get('[data-testid="input-dateOfBirth"]').should('have.value', '');
    cy.get('[data-testid="input-city"]').should('have.value', '');
    cy.get('[data-testid="input-postalCode"]').should('have.value', '');
  });

  it('should support hyphenated names', () => {
    cy.visit('/');
    
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    const dateString = birthDate.toISOString().split('T')[0];

    cy.get('[data-testid="input-firstName"]').type('Jean-Claude');
    cy.get('[data-testid="input-lastName"]').type('Dupont-Martin');
    cy.get('[data-testid="input-email"]').type('jean.claude@example.com');
    cy.get('[data-testid="input-dateOfBirth"]').type(dateString);
    cy.get('[data-testid="input-city"]').type('Villefranche-sur-Mer');
    cy.get('[data-testid="input-postalCode"]').type('06230');

    cy.get('button').contains(/S'enregistrer/).click();

    cy.get('[data-testid="success-message"]').should('exist');
  });
});
