/**
 * .jest/setEnvVars.js
 *
 * Configure les variables d'environnement pour les tests Jest.
 * Utilisé dans package.json avec --setupFiles
 */

// API URL pour les tests (JSONPlaceholder)
process.env.REACT_APP_API_URL = 'https://jsonplaceholder.typicode.com';

// Environnement de test
process.env.NODE_ENV = 'test';

// Désactiver les warnings dans les tests si nécessaire
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
