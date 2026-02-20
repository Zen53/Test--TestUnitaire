/**
 * api.test.js – Tests d'intégration API
 *
 * Teste :
 * ✅ Transformation des données
 * ✅ Gestion des erreurs
 * 📍 Vérification des appels axios
 */

jest.mock('axios');

import axios from 'axios';
import { fetchUsers, createUser } from './api';

describe('API – Service d\'intégration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchUsers', () => {
    it('✅ Devrait transformer les données JSON en format attendu', async () => {
      const mockResponse = {
        data: [
          {
            id: 1,
            name: 'Jean Dupont',
            email: 'jean@example.com',
            address: { city: 'Paris', zipcode: '75001' },
          },
        ],
      };

      axios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse),
        post: jest.fn(),
        delete: jest.fn(),
      });

      const users = await fetchUsers();

      expect(users).toHaveLength(1);
      expect(users[0]).toHaveProperty('firstName', 'Jean');
      expect(users[0]).toHaveProperty('lastName', 'Dupont');
      expect(users[0]).toHaveProperty('email');
    });

    it('❌ Devrait lever une erreur si la requête échoue', async () => {
      axios.create.mockReturnValue({
        get: jest.fn().mockRejectedValue(new Error('Network failed')),
        post: jest.fn(),
        delete: jest.fn(),
      });

      await expect(fetchUsers()).rejects.toThrow();
    });
  });

  describe('createUser', () => {
    it('✅ Devrait créer un utilisateur avec données valides', async () => {
      axios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: [] }),
        post: jest.fn().mockResolvedValue({ data: { id: 1 } }),
        delete: jest.fn(),
      });

      const newUser = { firstName: 'Test', lastName: 'User', email: 'test@example.com', dateOfBirth: '1990-01-01', city: 'Paris', postalCode: '75000' };
      const result = await createUser(newUser);

      expect(result.firstName).toBe('Test');
      expect(result.email).toBe('test@example.com');
    });
  });
});
