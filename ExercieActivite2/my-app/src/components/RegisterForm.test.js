import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from './RegisterForm';
import { UsersProvider } from '../context/UsersContext';

// Mock API calls
jest.mock('../api/api', () => ({
  fetchUsers: jest.fn().mockResolvedValue([]),
  createUser: jest.fn(),
  deleteUser: jest.fn(),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      if (typeof value !== 'string') {
        store[key] = String(value);
      } else {
        store[key] = value;
      }
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

/** Helper : rend le formulaire enveloppé dans le Provider */
const renderForm = (props = {}) =>
  render(
    <UsersProvider>
      <RegisterForm {...props} />
    </UsersProvider>
  );

describe('RegisterForm Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should render the form with all fields', async () => {
    renderForm();

    // Wait for async loading in UsersContext to complete
    await waitFor(() => {
      expect(screen.queryByText(/Chargement/i)).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Formulaire d\'enregistrement')).toBeInTheDocument();
    expect(screen.getByLabelText(/Prénom/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nom/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date de naissance/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ville/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Code postal/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /S'enregistrer/ })).toBeInTheDocument();
  });

  it('should show validation errors when submitting empty form', async () => {
    renderForm();

    // Wait for async loading in UsersContext to complete
    await waitFor(() => {
      expect(screen.queryByText(/Chargement/i)).not.toBeInTheDocument();
    });
    
    const submitButton = screen.getByRole('button', { name: /S'enregistrer/ });
    fireEvent.click(submitButton);

    expect(screen.getByTestId('error-firstName')).toBeInTheDocument();
    expect(screen.getByTestId('error-lastName')).toBeInTheDocument();
    expect(screen.getByTestId('error-email')).toBeInTheDocument();
    expect(screen.getByTestId('error-dateOfBirth')).toBeInTheDocument();
    expect(screen.getByTestId('error-city')).toBeInTheDocument();
    expect(screen.getByTestId('error-postalCode')).toBeInTheDocument();
  });

  it('should show error for invalid email', async () => {
    renderForm();

    // Wait for async loading in UsersContext to complete
    await waitFor(() => {
      expect(screen.queryByText(/Chargement/i)).not.toBeInTheDocument();
    });
    
    const emailInput = screen.getByTestId('input-email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const submitButton = screen.getByRole('button', { name: /S'enregistrer/ });
    fireEvent.click(submitButton);

    expect(screen.getByTestId('error-email')).toBeInTheDocument();
    expect(screen.getByTestId('error-email')).toHaveTextContent('invalide');
  });

  it('should show error for invalid postal code', async () => {
    renderForm();

    // Wait for async loading in UsersContext to complete
    await waitFor(() => {
      expect(screen.queryByText(/Chargement/i)).not.toBeInTheDocument();
    });
    
    const postalCodeInput = screen.getByTestId('input-postalCode');
    fireEvent.change(postalCodeInput, { target: { value: '750' } });
    
    const submitButton = screen.getByRole('button', { name: /S'enregistrer/ });
    fireEvent.click(submitButton);

    expect(screen.getByTestId('error-postalCode')).toBeInTheDocument();
    expect(screen.getByTestId('error-postalCode')).toHaveTextContent('5 chiffres');
  });

  it('should show error for person under 18', async () => {
    renderForm();

    // Wait for async loading in UsersContext to complete
    await waitFor(() => {
      expect(screen.queryByText(/Chargement/i)).not.toBeInTheDocument();
    });
    
    const today = new Date();
    const minAge = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
    const dateString = minAge.toISOString().split('T')[0];
    
    const dateInput = screen.getByTestId('input-dateOfBirth');
    fireEvent.change(dateInput, { target: { value: dateString } });
    
    const submitButton = screen.getByRole('button', { name: /S'enregistrer/ });
    fireEvent.click(submitButton);

    expect(screen.getByTestId('error-dateOfBirth')).toBeInTheDocument();
    expect(screen.getByTestId('error-dateOfBirth')).toHaveTextContent('18 ans');
  });

  it('should successfully submit valid form and call API', async () => {
    const { createUser } = require('../api/api');
    createUser.mockResolvedValue({
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      dateOfBirth: '1999-01-01',
      city: 'Paris',
      postalCode: '75001',
      registeredAt: new Date().toISOString(),
    });

    renderForm();

    // Wait for async loading in UsersContext to complete
    await waitFor(() => {
      expect(screen.queryByText(/Chargement/i)).not.toBeInTheDocument();
    });
    
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    const dateString = birthDate.toISOString().split('T')[0];

    const firstNameInput = screen.getByTestId('input-firstName');
    const lastNameInput = screen.getByTestId('input-lastName');
    const emailInput = screen.getByTestId('input-email');
    const dateInput = screen.getByTestId('input-dateOfBirth');
    const cityInput = screen.getByTestId('input-city');
    const postalCodeInput = screen.getByTestId('input-postalCode');
    const submitButton = screen.getByRole('button', { name: /S'enregistrer/ });

    fireEvent.change(firstNameInput, { target: { value: 'Jean' } });
    fireEvent.change(lastNameInput, { target: { value: 'Dupont' } });
    fireEvent.change(emailInput, { target: { value: 'jean.dupont@example.com' } });
    fireEvent.change(dateInput, { target: { value: dateString } });
    fireEvent.change(cityInput, { target: { value: 'Paris' } });
    fireEvent.change(postalCodeInput, { target: { value: '75001' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });

    // Vérifier que createUser a été appelé avec les données correctes
    expect(createUser).toHaveBeenCalledWith({
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      dateOfBirth: dateString,
      city: 'Paris',
      postalCode: '75001',
    });
  });

  it('should clear form after successful submission', async () => {
    renderForm();
    
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    const dateString = birthDate.toISOString().split('T')[0];

    const firstNameInput = screen.getByTestId('input-firstName');
    const lastNameInput = screen.getByTestId('input-lastName');
    const emailInput = screen.getByTestId('input-email');
    const dateInput = screen.getByTestId('input-dateOfBirth');
    const cityInput = screen.getByTestId('input-city');
    const postalCodeInput = screen.getByTestId('input-postalCode');
    const submitButton = screen.getByRole('button', { name: /S'enregistrer/ });

    fireEvent.change(firstNameInput, { target: { value: 'Jean' } });
    fireEvent.change(lastNameInput, { target: { value: 'Dupont' } });
    fireEvent.change(emailInput, { target: { value: 'jean.dupont@example.com' } });
    fireEvent.change(dateInput, { target: { value: dateString } });
    fireEvent.change(cityInput, { target: { value: 'Paris' } });
    fireEvent.change(postalCodeInput, { target: { value: '75001' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(firstNameInput.value).toBe('');
      expect(lastNameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(dateInput.value).toBe('');
      expect(cityInput.value).toBe('');
      expect(postalCodeInput.value).toBe('');
    });
  });

  it('should save multiple users to localStorage', async () => {
    renderForm();
    
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    const dateString = birthDate.toISOString().split('T')[0];

    // Submit first user
    fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'Jean' } });
    fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Dupont' } });
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'jean@example.com' } });
    fireEvent.change(screen.getByTestId('input-dateOfBirth'), { target: { value: dateString } });
    fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'Paris' } });
    fireEvent.change(screen.getByTestId('input-postalCode'), { target: { value: '75001' } });

    fireEvent.click(screen.getByRole('button', { name: /S'enregistrer/ }));

    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });

    // Submit second user
    fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'Marie' } });
    fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Martin' } });
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'marie@example.com' } });
    fireEvent.change(screen.getByTestId('input-dateOfBirth'), { target: { value: dateString } });
    fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'Lyon' } });
    fireEvent.change(screen.getByTestId('input-postalCode'), { target: { value: '69000' } });

    fireEvent.click(screen.getByRole('button', { name: /S'enregistrer/ }));

    await waitFor(() => {
      const users = JSON.parse(localStorage.getItem('users'));
      expect(users).toHaveLength(2);
    });
  });

  it('should clear error messages when user types in field', () => {
    renderForm();
    
    const firstNameInput = screen.getByTestId('input-firstName');
    const submitButton = screen.getByRole('button', { name: /S'enregistrer/ });

    fireEvent.click(submitButton);
    expect(screen.getByTestId('error-firstName')).toBeInTheDocument();

    fireEvent.change(firstNameInput, { target: { value: 'J' } });
    expect(screen.queryByTestId('error-firstName')).not.toBeInTheDocument();
  });

  it('should show error for name with numbers', () => {
    renderForm();
    
    const firstNameInput = screen.getByTestId('input-firstName');
    fireEvent.change(firstNameInput, { target: { value: 'Jean123' } });
    
    const submitButton = screen.getByRole('button', { name: /S'enregistrer/ });
    fireEvent.click(submitButton);

    expect(screen.getByTestId('error-firstName')).toBeInTheDocument();
  });

  it('should show error for city with special characters', () => {
    renderForm();
    
    const cityInput = screen.getByTestId('input-city');
    fireEvent.change(cityInput, { target: { value: 'Paris@' } });
    
    const submitButton = screen.getByRole('button', { name: /S'enregistrer/ });
    fireEvent.click(submitButton);

    expect(screen.getByTestId('error-city')).toBeInTheDocument();
  });

  it('should handle form submission with valid hyphenated names', async () => {
    renderForm();
    
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    const dateString = birthDate.toISOString().split('T')[0];

    fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'Jean-Claude' } });
    fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Dupont-Martin' } });
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'jean.claude@example.com' } });
    fireEvent.change(screen.getByTestId('input-dateOfBirth'), { target: { value: dateString } });
    fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'Villefranche-sur-Mer' } });
    fireEvent.change(screen.getByTestId('input-postalCode'), { target: { value: '06230' } });

    fireEvent.click(screen.getByRole('button', { name: /S'enregistrer/ }));

    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });
  });

  it('should hide success message after 3 seconds', async () => {
    jest.useFakeTimers();
    renderForm();
    
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    const dateString = birthDate.toISOString().split('T')[0];

    fireEvent.change(screen.getByTestId('input-firstName'), { target: { value: 'Jean' } });
    fireEvent.change(screen.getByTestId('input-lastName'), { target: { value: 'Dupont' } });
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'jean.dupont@example.com' } });
    fireEvent.change(screen.getByTestId('input-dateOfBirth'), { target: { value: dateString } });
    fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'Paris' } });
    fireEvent.change(screen.getByTestId('input-postalCode'), { target: { value: '75001' } });

    fireEvent.click(screen.getByRole('button', { name: /S'enregistrer/ }));

    // Message should be visible
    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });

    // Fast-forward time by 3 seconds wrapped in act
    jest.runAllTimers();

    // Message should be hidden
    await waitFor(() => {
      expect(screen.queryByTestId('success-message')).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });});