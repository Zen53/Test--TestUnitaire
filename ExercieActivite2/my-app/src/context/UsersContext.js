import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchUsers, createUser as apiCreateUser } from '../api/api';

/**
 * Contexte React pour la gestion d'état partagé des utilisateurs.
 * Utilise l'API backend pour la persistance.
 */
const UsersContext = createContext();

/**
 * Hook personnalisé pour accéder au contexte des utilisateurs.
 * @returns {{ users: Array, addUser: Function, userCount: number, isLoading: boolean, error: string }}
 */
export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers doit être utilisé dans un UsersProvider');
  }
  return context;
};

/**
 * Provider qui centralise l'état des utilisateurs.
 * Charge les utilisateurs depuis l'API au montage.
 *
 * @param {{ children: React.ReactNode }} props
 */
export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les utilisateurs depuis l'API au montage
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchUsers();
        setUsers(data);
        // Synchroniser avec localStorage pour fallback offline
        localStorage.setItem('users', JSON.stringify(data));
      } catch (err) {
        console.error('Erreur lors du chargement des utilisateurs:', err);
        // Fallback : charger depuis localStorage si l'API échoue
        const fallback = localStorage.getItem('users');
        if (fallback) {
          try {
            setUsers(JSON.parse(fallback));
          } catch {
            setUsers([]);
          }
        }
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  /**
   * Ajoute un utilisateur. Appelle l'API et met à jour l'état local.
   * @param {object} userData - Données du formulaire
   * @returns {{ success: boolean, error?: string }}
   */
  const addUser = async (userData) => {
    try {
      setError(null);
      const newUser = await apiCreateUser(userData);
      const updated = [...users, newUser];
      setUsers(updated);
      // Synchroniser localStorage
      localStorage.setItem('users', JSON.stringify(updated));
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de l\'ajout de l\'utilisateur';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return (
    <UsersContext.Provider
      value={{
        users,
        addUser,
        userCount: users.length,
        isLoading,
        error,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export default UsersContext;
