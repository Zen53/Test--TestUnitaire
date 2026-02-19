import React, { createContext, useState, useContext, useEffect } from 'react';

/**
 * Contexte React pour la gestion d'état partagé des utilisateurs.
 * Permet à tous les composants (Accueil, Formulaire) de partager
 * la même source de vérité pour la liste des inscrits.
 */
const UsersContext = createContext();

/**
 * Hook personnalisé pour accéder au contexte des utilisateurs.
 * @returns {{ users: Array, addUser: Function, userCount: number }}
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
 * Charge les utilisateurs depuis localStorage au montage,
 * et les synchronise à chaque ajout.
 *
 * @param {{ children: React.ReactNode }} props
 */
export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  // Charger les utilisateurs depuis localStorage au montage
  useEffect(() => {
    const stored = localStorage.getItem('users');
    if (stored) {
      try {
        setUsers(JSON.parse(stored));
      } catch {
        setUsers([]);
      }
    }
  }, []);

  /**
   * Ajoute un utilisateur. Vérifie le doublon d'email.
   * @param {object} userData - Données du formulaire
   * @returns {{ success: boolean, error?: string }}
   */
  const addUser = (userData) => {
    // Vérifier doublon email
    const emailExists = users.some(
      (u) => u.email.toLowerCase() === userData.email.trim().toLowerCase()
    );
    if (emailExists) {
      return { success: false, error: 'Cet email est déjà utilisé par un autre inscrit' };
    }

    const newUser = {
      id: Date.now(),
      ...userData,
      registeredAt: new Date().toISOString(),
    };
    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem('users', JSON.stringify(updated));
    return { success: true };
  };

  return (
    <UsersContext.Provider value={{ users, addUser, userCount: users.length }}>
      {children}
    </UsersContext.Provider>
  );
};

export default UsersContext;
