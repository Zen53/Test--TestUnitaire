import './App.css';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { UsersProvider } from './context/UsersContext';
import HomePage from './pages/HomePage';
import RegisterForm from './components/RegisterForm';

/**
 * Page d'inscription qui encapsule le formulaire
 * et gère la redirection vers l'accueil après inscription.
 */
function RegisterPage() {
  const navigate = useNavigate();
  return <RegisterForm onRegistered={() => navigate('/')} />;
}

/**
 * Composant racine de l'application SPA.
 * Configure le routeur et le provider de contexte.
 */
function App() {
  return (
    <BrowserRouter>
      <UsersProvider>
        <div className="App">
          <nav className="app-nav">
            <Link to="/" data-testid="nav-home">Accueil</Link>
            <Link to="/register" data-testid="nav-register">Inscription</Link>
          </nav>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </div>
      </UsersProvider>
    </BrowserRouter>
  );
}

export default App;
