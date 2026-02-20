/**
 * api.js – Couche d'appels API
 *
 * Centralise tous les appels HTTP vers l'API backend.
 * Utilise axios pour les requêtes avec jest.mock('axios') pour les tests.
 *
 * Gestion des erreurs HTTP :
 *   - 400 : Erreur métier (email dupliqué, données invalides)
 *   - 500 : Crash serveur (indisponible)
 *   - Réseau : Erreur de connexion
 *
 * API utilisée : JSONPlaceholder (https://jsonplaceholder.typicode.com)
 * ⚠️  Pour production : remplacer par votre backend réel
 */

import axios from 'axios';

// ⚙️ Configuration de l'API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://jsonplaceholder.typicode.com';

// Lazy initialization du client axios pour faciliter le mocking dans les tests
let apiClient = null;
const getApiClient = () => {
  if (!apiClient) {
    apiClient = axios.create({
      baseURL: API_BASE_URL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  return apiClient;
};

/**
 * Réinitialise le client axios (utilisé dans les tests).
 * Permet de recréer l'instance avec un nouveau mock entre chaque test.
 */
export const _resetApiClient = () => {
  apiClient = null;
};

/**
 * Récupère la liste des utilisateurs depuis l'API.
 *
 * @returns {Promise<Array>} Tableau des utilisateurs
 * @throws {Error} Erreur avec propriété `status` pour le code HTTP
 */
export const fetchUsers = async () => {
  try {
    const response = await getApiClient().get('/users');
    // Transformer les données JSONPlaceholder en format attendu
    return response.data.map((user) => ({
      id: user.id,
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ').slice(1).join(' ') || '',
      email: user.email,
      dateOfBirth: '2001-01-01', // JSONPlaceholder ne fournit pas ce champ
      city: user.address?.city || '',
      postalCode: user.address?.zipcode || '',
      registeredAt: new Date().toISOString(),
    }));
  } catch (error) {
    if (error.response && error.response.status >= 500) {
      const err = new Error('Le serveur est temporairement indisponible. Veuillez réessayer plus tard.');
      err.status = error.response.status;
      throw err;
    }
    const err = new Error(`Impossible de récupérer les utilisateurs: ${error.message}`);
    err.status = error.response?.status || 0;
    throw err;
  }
};

/**
 * Ajoute un nouvel utilisateur via l'API.
 * La vérification d'unicité de l'email est déléguée au serveur (architecture découplée).
 *
 * @param {Object} userData - Données de l'utilisateur
 * @returns {Promise<Object>} L'utilisateur créé avec ID
 * @throws {Error} Erreur avec propriété `status` (400 = email dupliqué, 500 = crash serveur)
 */
export const createUser = async (userData) => {
  try {
    // Préparer les données au format JSONPlaceholder
    const payload = {
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      address: {
        city: userData.city,
        zipcode: userData.postalCode,
      },
    };

    const response = await getApiClient().post('/users', payload);

    // Retourner au format attendu
    return {
      id: response.data.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      dateOfBirth: userData.dateOfBirth,
      city: userData.city,
      postalCode: userData.postalCode,
      registeredAt: new Date().toISOString(),
    };
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      if (status === 400) {
        // Erreur métier : email déjà utilisé, données invalides, etc.
        const err = new Error(error.response.data?.message || 'Les données envoyées sont invalides.');
        err.status = 400;
        throw err;
      }
      if (status >= 500) {
        // Crash serveur
        const err = new Error('Le serveur est temporairement indisponible. Veuillez réessayer plus tard.');
        err.status = status;
        throw err;
      }
    }
    const err = new Error(`Impossible de créer l'utilisateur: ${error.message}`);
    err.status = error.response?.status || 0;
    throw err;
  }
};

/**
 * Supprime un utilisateur par son ID.
 *
 * @param {number} userId - ID de l'utilisateur
 * @returns {Promise<void>}
 * @throws {Error} Erreur avec propriété `status` pour le code HTTP
 */
export const deleteUser = async (userId) => {
  try {
    await getApiClient().delete(`/users/${userId}`);
  } catch (error) {
    if (error.response && error.response.status >= 500) {
      const err = new Error('Le serveur est temporairement indisponible.');
      err.status = error.response.status;
      throw err;
    }
    const err = new Error(`Impossible de supprimer l'utilisateur: ${error.message}`);
    err.status = error.response?.status || 0;
    throw err;
  }
};

// Export pour tests et usage défaut
export default getApiClient;
