import React from 'react';
import { Link } from 'react-router-dom';
import { useUsers } from '../context/UsersContext';
import './HomePage.css';

/**
 * Page d'accueil de l'application.
 * Affiche un message de bienvenue, le compteur d'inscrits,
 * et la liste des utilisateurs (Nom + Prénom).
 */
function HomePage() {
  const { users, userCount } = useUsers();

  return (
    <div className="home-container">
      <h1>Bienvenue sur notre plateforme</h1>

      <p className="user-counter" data-testid="home-user-counter">
        {userCount} utilisateur{userCount !== 1 ? '(s)' : ''} inscrit{userCount !== 1 ? '(s)' : ''}
      </p>

      {userCount === 0 ? (
        <p data-testid="empty-list">Aucun utilisateur inscrit pour le moment.</p>
      ) : (
        <table className="users-table" data-testid="users-list">
          <thead>
            <tr>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} data-testid={`user-row-${index}`}>
                <td data-testid={`user-firstName-${index}`}>{user.firstName}</td>
                <td data-testid={`user-lastName-${index}`}>{user.lastName}</td>
                <td data-testid={`user-email-${index}`}>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link to="/register" className="btn-register" data-testid="link-register">
        S'inscrire
      </Link>
    </div>
  );
}

export default HomePage;
