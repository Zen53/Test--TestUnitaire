/**
 * api.js – Couche d'appels API
 *
 * Centralise tous les appels HTTP vers l'API backend.
 * Utilise axios pour les requêtes.
 * Facilite le mocking dans les tests.
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
 * Récupère la liste des utilisateurs depuis l'API.
 *
 * @returns {Promise<Array>} Tableau des utilisateurs
 * @throws {Error} Si la requête échoue
 */
export const fetchUsers = async () => {
  try {
    const response = await getApiClient().get('/users');
    // Transformer les données JSONPlaceholder en format attendu
    return response.data.map((user) => ({
      id: user.id,
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ')[1] || '',
      email: user.email,
      dateOfBirth: '2001-01-01', // JSONPlaceholder ne fournit pas ce champ
      city: user.address?.city || '',
      postalCode: user.address?.zipcode || '',
      registeredAt: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    throw new Error(`Impossible de récupérer les utilisateurs: ${error.message}`);
  }
};

/**
 * Ajoute un nouvel utilisateur via l'API.
 *
 * @param {Object} userData - Données de l'utilisateur
 * @returns {Promise<Object>} L'utilisateur créé avec ID
 * @throws {Error} Si l'email existe déjà ou la requête échoue
 */
export const createUser = async (userData) => {
  try {
    // Vérifier si l'email existe déjà (à faire côté serveur en production)
    const existingUsers = await fetchUsers();
    const emailExists = existingUsers.some(
      (u) => u.email.toLowerCase() === userData.email.toLowerCase()
    );

    if (emailExists) {
      throw new Error('Cet email est déjà utilisé');
    }

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
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    throw new Error(`Impossible de créer l'utilisateur: ${error.message}`);
  }
};

/**
 * Supprime un utilisateur par son ID.
 *
 * @param {number} userId - ID de l'utilisateur
 * @returns {Promise<void>}
 * @throws {Error} Si la suppression échoue
 */
export const deleteUser = async (userId) => {
  try {
    await getApiClient().delete(`/users/${userId}`);
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'utilisateur ${userId}:`, error);
    throw new Error(`Impossible de supprimer l'utilisateur: ${error.message}`);
  }
};

// Export pour tests et usage défaut
export default getApiClient;
