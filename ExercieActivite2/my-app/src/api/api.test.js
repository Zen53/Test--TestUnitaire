/**
 * api.test.js – Tests d'intégration API avec jest.mock('axios')
 *
 * Couvre les 3 scénarios requis pour chaque endpoint :
 *   ✅ Succès (200/201) : Parcours nominal
 *   ❌ Erreur Métier (400) : Email déjà utilisé / données invalides
 *   ❌ Crash Serveur (500) : Serveur indisponible, l'app ne plante pas
 *   ❌ Erreur Réseau : Perte de connexion
 */

jest.mock('axios');

import axios from 'axios';
import { fetchUsers, createUser, deleteUser, _resetApiClient } from './api';

describe('API – Tests d\'intégration avec mocks axios', () => {
  let mockGet, mockPost, mockDelete;

  beforeEach(() => {
    jest.clearAllMocks();
    _resetApiClient();

    mockGet = jest.fn();
    mockPost = jest.fn();
    mockDelete = jest.fn();

    axios.create.mockReturnValue({
      get: mockGet,
      post: mockPost,
      delete: mockDelete,
    });
  });

  /* ══════════════════════════════════════════════════════
   * fetchUsers
   * ══════════════════════════════════════════════════════ */
  describe('fetchUsers', () => {
    it('✅ 200 – Transforme correctement les données JSONPlaceholder', async () => {
      mockGet.mockResolvedValue({
        data: [
          {
            id: 1,
            name: 'Jean Dupont',
            email: 'jean@example.com',
            address: { city: 'Paris', zipcode: '75001' },
          },
          {
            id: 2,
            name: 'Marie Martin Leroy',
            email: 'marie@example.com',
            address: { city: 'Lyon', zipcode: '69000' },
          },
        ],
      });

      const users = await fetchUsers();

      expect(users).toHaveLength(2);
      expect(users[0]).toMatchObject({
        id: 1,
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean@example.com',
        city: 'Paris',
        postalCode: '75001',
      });
      // Nom composé : "Martin Leroy" concaténé
      expect(users[1].lastName).toBe('Martin Leroy');
      expect(mockGet).toHaveBeenCalledWith('/users');
    });

    it('✅ 200 – Retourne un tableau vide si aucun utilisateur', async () => {
      mockGet.mockResolvedValue({ data: [] });

      const users = await fetchUsers();
      expect(users).toEqual([]);
    });

    it('❌ 500 – Lève une erreur "serveur indisponible"', async () => {
      const serverError = new Error('Internal Server Error');
      serverError.response = { status: 500 };
      mockGet.mockRejectedValue(serverError);

      await expect(fetchUsers()).rejects.toThrow('temporairement indisponible');
    });

    it('❌ Réseau – Gère les erreurs de connexion', async () => {
      mockGet.mockRejectedValue(new Error('Network Error'));

      await expect(fetchUsers()).rejects.toThrow('Impossible de récupérer');
    });
  });

  /* ══════════════════════════════════════════════════════
   * createUser
   * ══════════════════════════════════════════════════════ */
  describe('createUser', () => {
    const validUserData = {
      firstName: 'Marie',
      lastName: 'Martin',
      email: 'marie@example.com',
      dateOfBirth: '1995-06-15',
      city: 'Lyon',
      postalCode: '69000',
    };

    it('✅ 201 – Crée un utilisateur et retourne les données complètes', async () => {
      mockPost.mockResolvedValue({ data: { id: 11 } });

      const result = await createUser(validUserData);

      expect(result).toMatchObject({
        id: 11,
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie@example.com',
        city: 'Lyon',
        postalCode: '69000',
      });
      expect(result).toHaveProperty('registeredAt');
      expect(mockPost).toHaveBeenCalledWith('/users', {
        name: 'Marie Martin',
        email: 'marie@example.com',
        address: { city: 'Lyon', zipcode: '69000' },
      });
    });

    it('❌ 400 – Email déjà utilisé → message d\'erreur spécifique du back', async () => {
      const error400 = new Error('Bad Request');
      error400.response = {
        status: 400,
        data: { message: 'Cet email est déjà utilisé' },
      };
      mockPost.mockRejectedValue(error400);

      try {
        await createUser(validUserData);
        throw new Error('Should have thrown');
      } catch (err) {
        expect(err.message).toBe('Cet email est déjà utilisé');
        expect(err.status).toBe(400);
      }
    });

    it('❌ 400 – Données invalides sans message spécifique du serveur', async () => {
      const error400 = new Error('Bad Request');
      error400.response = { status: 400, data: {} };
      mockPost.mockRejectedValue(error400);

      await expect(createUser(validUserData)).rejects.toThrow('invalides');
    });

    it('❌ 500 – Serveur indisponible → l\'app ne plante pas', async () => {
      const error500 = new Error('Internal Server Error');
      error500.response = { status: 500 };
      mockPost.mockRejectedValue(error500);

      try {
        await createUser(validUserData);
        throw new Error('Should have thrown');
      } catch (err) {
        expect(err.message).toContain('temporairement indisponible');
        expect(err.status).toBe(500);
      }
    });

    it('❌ Réseau – Erreur de connexion', async () => {
      mockPost.mockRejectedValue(new Error('Network Error'));

      await expect(createUser(validUserData)).rejects.toThrow("Impossible de créer");
    });
  });

  /* ══════════════════════════════════════════════════════
   * deleteUser
   * ══════════════════════════════════════════════════════ */
  describe('deleteUser', () => {
    it('✅ 200 – Supprime un utilisateur avec succès', async () => {
      mockDelete.mockResolvedValue({ status: 200 });

      await deleteUser(1);
      expect(mockDelete).toHaveBeenCalledWith('/users/1');
    });

    it('❌ 500 – Serveur indisponible', async () => {
      const error500 = new Error('Server Error');
      error500.response = { status: 500 };
      mockDelete.mockRejectedValue(error500);

      await expect(deleteUser(999)).rejects.toThrow('indisponible');
    });
  });

  /* ══════════════════════════════════════════════════════
   * Configuration axios
   * ══════════════════════════════════════════════════════ */
  describe('Configuration', () => {
    it('✅ Crée une instance axios avec la bonne baseURL et timeout', async () => {
      mockGet.mockResolvedValue({ data: [] });
      await fetchUsers();

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://jsonplaceholder.typicode.com',
          timeout: 5000,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('✅ Réutilise le même client pour les appels successifs (singleton)', async () => {
      mockGet.mockResolvedValue({ data: [] });
      mockPost.mockResolvedValue({ data: { id: 1 } });

      await fetchUsers();
      await createUser({
        firstName: 'A', lastName: 'B', email: 'a@b.com',
        dateOfBirth: '2000-01-01', city: 'X', postalCode: '00000',
      });

      // axios.create n'est appelé qu'une seule fois (singleton lazy)
      expect(axios.create).toHaveBeenCalledTimes(1);
    });
  });
});
