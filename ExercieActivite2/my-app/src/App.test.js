import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock API calls pour éviter les appels réseau dans les tests
jest.mock('./api/api', () => ({
  fetchUsers: jest.fn().mockResolvedValue([]),
  createUser: jest.fn(),
  deleteUser: jest.fn(),
  _resetApiClient: jest.fn(),
  default: jest.fn(),
}));

test('renders the home page with navigation', async () => {
  render(<App />);

  await waitFor(() => {
    const heading = screen.getByText(/Bienvenue/i);
    expect(heading).toBeInTheDocument();
  });
});

test('renders navigation links', async () => {
  render(<App />);

  await waitFor(() => {
    expect(screen.getByTestId('nav-home')).toBeInTheDocument();
    expect(screen.getByTestId('nav-register')).toBeInTheDocument();
  });
});
