import React, { useState } from 'react';
import {
  validateName,
  validateEmail,
  validateDateOfBirth,
  validatePostalCode,
  validateCity,
  validateForm,
} from '../validations';
import { useUsers } from '../context/UsersContext';
import './RegisterForm.css';

/**
 * Composant formulaire d'inscription.
 * Utilise le Context React pour l'état partagé des utilisateurs.
 * @param {{ onRegistered?: Function }} props - Callback optionnel après inscription réussie
 */
function RegisterForm({ onRegistered }) {
  const { addUser, userCount } = useUsers();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    city: '',
    postalCode: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    // Validate form
    const validation = validateForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setSubmitted(false);
      return;
    }

    // Ajouter via le contexte (appel asynchrone API)
    try {
      setIsLoading(true);
      const result = await addUser(formData);

      if (!result.success) {
        if (result.status >= 500) {
          // Crash serveur → alerte utilisateur globale
          setErrors({ form: result.error });
        } else {
          // Erreur métier (400) → message spécifique sur le champ email
          setErrors({ email: result.error });
        }
        setSubmitted(false);
        return;
      }

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        city: '',
        postalCode: '',
      });
      setErrors({});
      setSubmitted(true);
      setSuccessMessage('✓ Enregistrement réussi !');

      // Redirection ou masquage du message après 2 secondes
      setTimeout(() => {
        setSuccessMessage('');
        setSubmitted(false);
        if (onRegistered) {
          onRegistered();
        }
      }, 2000);
    } catch (err) {
      setErrors({ form: `Erreur serveur: ${err.message}` });
      setSubmitted(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-form-container">
      <h1>Formulaire d'enregistrement</h1>
      <p className="user-counter" data-testid="user-counter">
        {userCount} user{userCount !== 1 ? '(s)' : ''} already registered
      </p>

      {successMessage && (
        <div className="success-message" data-testid="success-message">
          {successMessage}
        </div>
      )}

      {errors.form && (
        <div className="error-message" data-testid="error-form">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="register-form">
        {/* First Name */}
        <div className="form-group">
          <label htmlFor="firstName">Prénom *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Jean"
            data-testid="input-firstName"
          />
          {errors.firstName && (
            <span className="error" data-testid="error-firstName">
              {errors.firstName}
            </span>
          )}
        </div>

        {/* Last Name */}
        <div className="form-group">
          <label htmlFor="lastName">Nom *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Dupont"
            data-testid="input-lastName"
          />
          {errors.lastName && (
            <span className="error" data-testid="error-lastName">
              {errors.lastName}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="jean.dupont@example.com"
            data-testid="input-email"
          />
          {errors.email && (
            <span className="error" data-testid="error-email">
              {errors.email}
            </span>
          )}
        </div>

        {/* Date of Birth */}
        <div className="form-group">
          <label htmlFor="dateOfBirth">Date de naissance *</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            data-testid="input-dateOfBirth"
          />
          {errors.dateOfBirth && (
            <span className="error" data-testid="error-dateOfBirth">
              {errors.dateOfBirth}
            </span>
          )}
        </div>

        {/* City */}
        <div className="form-group">
          <label htmlFor="city">Ville *</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Paris"
            data-testid="input-city"
          />
          {errors.city && (
            <span className="error" data-testid="error-city">
              {errors.city}
            </span>
          )}
        </div>

        {/* Postal Code */}
        <div className="form-group">
          <label htmlFor="postalCode">Code postal *</label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="75001"
            maxLength="5"
            data-testid="input-postalCode"
          />
          {errors.postalCode && (
            <span className="error" data-testid="error-postalCode">
              {errors.postalCode}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="submit-btn" 
          data-testid="submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Chargement...' : 'S\'enregistrer'}
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
