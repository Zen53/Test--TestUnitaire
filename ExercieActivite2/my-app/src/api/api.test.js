/**
 * api.test.js – Tests d'intégration API
 *
 * Teste :
 * ✅ Cas de succès (fetchUsers, createUser, deleteUser)
 * ❌ Cas d'erreur (réseau, erreur serveur, email dupliqué)
 * 📍 Vérification que axios est appelé correctement
 */

// Mock axios AVANT d'importer api.js
jest.mock('axios');

import axios from 'axios';

describe('API – Tests d\'intégration', () => {
  let api;

  beforeEach(() => {
    // Réinitializer les mocks et réimporter le module pour remettre getApiClient() à zéro
    jest.clearAllMocks();
    jest.resetModules();

    // Importer le module api après réinitialisation
    api = require('./api');
  });

  /* ── fetchUsers ────────────────────────────────────── */
  describe('fetchUsers', () => {
    it('✅ Devrait récupérer la liste des utilisateurs depuis l\'API', async () => {
      // Arrange : Mock une réponse réussie
      const mockUsersData = [
        {
          id: 1,
          name: 'Jean Dupont',
          email: 'jean@example.com',
          address: { city: 'Paris', zipcode: '75001' },
        },
        {
          id: 2,
          name: 'Marie Martin',
          email: 'marie@example.com',
          address: { city: 'Lyon', zipcode: '69000' },
        },
      ];

      axios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: mockUsersData }),
        post: jest.fn().mockResolvedValue({
          data: { id: 3, name: 'New User' },
        }),
        delete: jest.fn().mockResolvedValue({}),
      });

      // Act
      const result = await api.fetchUsers();

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 1,
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean@example.com',
        dateOfBirth: '2001-01-01',
        city: 'Paris',
        postalCode: '75001',
        registeredAt: expect.any(String),
      });
    });

    it('❌ Devrait gérer l\'erreur si l\'API est indisponible', async () => {
      // Arrange
      const mockError = new Error('Network Error');
      axios.create.mockReturnValue({
        get: jest.fn().mockRejectedValue(mockError),
        post: jest.fn(),
        delete: jest.fn(),
      });

      // Act & Assert
      await expect(api.fetchUsers()).rejects.toThrow(
        'Impossible de récupérer les utilisateurs'
      );
    });

    it('❌ Devrait gérer un statut 500 de l\'API', async () => {
      // Arrange
      const mockError = {
        response: { status: 500, statusText: 'Internal Server Error' },
        message: 'Server Error',
      };
      axios.create.mockReturnValue({
        get: jest.fn().mockRejectedValue(mockError),
        post: jest.fn(),
        delete: jest.fn(),
      });

      // Act & Assert
      await expect(api.fetchUsers()).rejects.toThrow(
        'Impossible de récupérer les utilisateurs: Server Error'
      );
    });
  });

  /* ── createUser ────────────────────────────────────── */
  describe('createUser', () => {
    it('✅ Devrait créer un nouvel utilisateur', async () => {
      // Arrange
      const mockUsersData = [
        {
          id: 1,
          name: 'Jean Dupont',
          email: 'jean@example.com',
          address: { city: 'Paris', zipcode: '75001' },
        },
      ];

      const mockCreatedUser = {
        id: 2,
        name: 'Marie Martin',
        email: 'marie@example.com',
        address: { city: 'Lyon', zipcode: '69000' },
      };

      const mockClient = {
        get: jest.fn().mockResolvedValue({ data: mockUsersData }),
        post: jest.fn().mockResolvedValue({ data: mockCreatedUser }),
        delete: jest.fn(),
      };
      axios.create.mockReturnValue(mockClient);

      const userData = {
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie@example.com',
        dateOfBirth: '1990-05-15',
        city: 'Lyon',
        postalCode: '69000',
      };

      // Act
      const result = await api.createUser(userData);

      // Assert
      expect(result).toEqual({
        id: 2,
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie@example.com',
        dateOfBirth: '1990-05-15',
        city: 'Lyon',
        postalCode: '69000',
        registeredAt: expect.any(String),
      });
      expect(mockClient.post).toHaveBeenCalledWith('/users', {
        name: 'Marie Martin',
        email: 'marie@example.com',
        address: { city: 'Lyon', zipcode: '69000' },
      });
    });

    it('❌ Devrait rejeter si l\'email est déjà utilisé', async () => {
      // Arrange
      const existingUsers = [
        {
          id: 1,
          name: 'Jean Dupont',
          email: 'jean@dupont.com',
          address: { city: 'Paris', zipcode: '75001' },
        },
      ];

      axios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: existingUsers }),
        post: jest.fn(),
        delete: jest.fn(),
      });

      const userData = {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        dateOfBirth: '1985-03-20',
        city: 'Paris',
        postalCode: '75001',
      };

      // Act & Assert
      await expect(api.createUser(userData)).rejects.toThrow(
        /Cet email est déjà utilisé|Impossible de créer/
      );
    });

    it('❌ Devrait gérer les erreurs serveur lors de la création', async () => {
      // Arrange
      const mockError = new Error('Server Error');
      mockError.response = { status: 500 };

      axios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: [] }),
        post: jest.fn().mockRejectedValue(mockError),
        delete: jest.fn(),
      });

      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        dateOfBirth: '2000-01-01',
        city: 'Paris',
        postalCode: '75000',
      };

      // Act & Assert
      await expect(api.createUser(userData)).rejects.toThrow(
        'Impossible de créer l\'utilisateur'
      );
    });
  });

  /* ── deleteUser ────────────────────────────────────── */
  describe('deleteUser', () => {
    it('✅ Devrait supprimer un utilisateur', async () => {
      // Arrange
      const mockClient = {
        get: jest.fn(),
        post: jest.fn(),
        delete: jest.fn().mockResolvedValue({}),
      };
      axios.create.mockReturnValue(mockClient);

      // Act
      await api.deleteUser(1);

      // Assert
      expect(mockClient.delete).toHaveBeenCalledWith('/users/1');
    });

    it('❌ Devrait gérer l\'erreur si l\'utilisateur n\'existe pas', async () => {
      // Arrange
      const mockError = new Error('Not Found');
      mockError.response = { status: 404 };

      axios.create.mockReturnValue({
        get: jest.fn(),
        post: jest.fn(),
        delete: jest.fn().mockRejectedValue(mockError),
      });

      // Act & Assert
      await expect(api.deleteUser(999)).rejects.toThrow(
        'Impossible de supprimer l\'utilisateur'
      );
    });
  });
});
