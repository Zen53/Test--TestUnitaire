import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the register form', () => {
  render(<App />);
  const formTitle = screen.getByText(/Formulaire d'enregistrement/i);
  expect(formTitle).toBeInTheDocument();
});
