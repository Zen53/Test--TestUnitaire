import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the home page with navigation', () => {
  render(<App />);
  const heading = screen.getByText(/Bienvenue/i);
  expect(heading).toBeInTheDocument();
});

test('renders navigation links', () => {
  render(<App />);
  expect(screen.getByTestId('nav-home')).toBeInTheDocument();
  expect(screen.getByTestId('nav-register')).toBeInTheDocument();
});
