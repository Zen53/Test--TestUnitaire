/**
 * Validation des données du formulaire d'enregistrement
 */

/**
 * Valide le nom ou prénom
 * @param {string} name - Le nom ou prénom à valider
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Le nom/prénom est requis' };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    return { isValid: false, error: 'Le nom/prénom doit contenir au moins 2 caractères' };
  }

  if (trimmedName.length > 50) {
    return { isValid: false, error: 'Le nom/prénom ne doit pas dépasser 50 caractères' };
  }

  // Vérifie que le nom ne contient que des lettres, espaces et tirets
  const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
  if (!nameRegex.test(trimmedName)) {
    return { isValid: false, error: 'Le nom/prénom ne peut contenir que des lettres, espaces et tirets' };
  }

  return { isValid: true, error: '' };
};

/**
 * Valide l'adresse email
 * @param {string} email - L'email à valider
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'L\'email est requis' };
  }

  const trimmedEmail = email.trim();

  // Regex simple pour validation d'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, error: 'L\'email est invalide' };
  }

  if (trimmedEmail.length > 100) {
    return { isValid: false, error: 'L\'email ne doit pas dépasser 100 caractères' };
  }

  return { isValid: true, error: '' };
};

/**
 * Valide la date de naissance (minimum 18 ans)
 * @param {string} dateString - La date au format YYYY-MM-DD
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateDateOfBirth = (dateString) => {
  if (!dateString || typeof dateString !== 'string') {
    return { isValid: false, error: 'La date de naissance est requise' };
  }

  const birthDate = new Date(dateString);

  if (isNaN(birthDate.getTime())) {
    return { isValid: false, error: 'La date est invalide' };
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 18) {
    return { isValid: false, error: 'Vous devez avoir au moins 18 ans' };
  }

  return { isValid: true, error: '' };
};

/**
 * Valide le code postal français
 * @param {string} postalCode - Le code postal à valider
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validatePostalCode = (postalCode) => {
  if (!postalCode || typeof postalCode !== 'string') {
    return { isValid: false, error: 'Le code postal est requis' };
  }

  const trimmedPostalCode = postalCode.trim();

  // Code postal français : 5 chiffres
  const postalCodeRegex = /^\d{5}$/;
  if (!postalCodeRegex.test(trimmedPostalCode)) {
    return { isValid: false, error: 'Le code postal doit contenir 5 chiffres' };
  }

  return { isValid: true, error: '' };
};

/**
 * Valide la ville
 * @param {string} city - La ville à valider
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateCity = (city) => {
  if (!city || typeof city !== 'string') {
    return { isValid: false, error: 'La ville est requise' };
  }

  const trimmedCity = city.trim();

  if (trimmedCity.length < 2) {
    return { isValid: false, error: 'La ville doit contenir au moins 2 caractères' };
  }

  if (trimmedCity.length > 50) {
    return { isValid: false, error: 'La ville ne doit pas dépasser 50 caractères' };
  }

  // Vérifie que la ville ne contient que des lettres, espaces et tirets
  const cityRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
  if (!cityRegex.test(trimmedCity)) {
    return { isValid: false, error: 'La ville ne peut contenir que des lettres, espaces et tirets' };
  }

  return { isValid: true, error: '' };
};

/**
 * Valide tous les champs du formulaire
 * @param {object} formData - Objet contenant tous les champs à valider
 * @returns {object} - { isValid: boolean, errors: object }
 */
export const validateForm = (formData) => {
  const errors = {};

  const firstNameValidation = validateName(formData.firstName);
  if (!firstNameValidation.isValid) {
    errors.firstName = firstNameValidation.error;
  }

  const lastNameValidation = validateName(formData.lastName);
  if (!lastNameValidation.isValid) {
    errors.lastName = lastNameValidation.error;
  }

  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }

  const dateOfBirthValidation = validateDateOfBirth(formData.dateOfBirth);
  if (!dateOfBirthValidation.isValid) {
    errors.dateOfBirth = dateOfBirthValidation.error;
  }

  const postalCodeValidation = validatePostalCode(formData.postalCode);
  if (!postalCodeValidation.isValid) {
    errors.postalCode = postalCodeValidation.error;
  }

  const cityValidation = validateCity(formData.city);
  if (!cityValidation.isValid) {
    errors.city = cityValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
