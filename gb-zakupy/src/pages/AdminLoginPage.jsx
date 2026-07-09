import { useState } from 'react';
import { loginAdmin } from '../firebase/auth';
import Logo from '../components/shared/Logo';

export default function AdminLoginPage({ goBack, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    setError('');

    try {
      setLoading(true);

      await loginAdmin(email, password);

      sessionStorage.setItem('admin', 'true');
      onLogin();
    } catch (error) {
      console.error(error);

      setError('Nieprawidłowy adres e-mail lub hasło.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-page login-view">
      <form className="login-card" onSubmit={handleLogin}>
        <button
          type="button"
          onClick={goBack}
          className="back-button"
        >
          Wróć do listy
        </button>

        <Logo className="admin-logo" />

        <h1>Panel admina</h1>
        <p>Zaloguj się jako administrator.</p>

        <input
          type="email"
          placeholder="Adres e-mail"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoFocus
          required
        />

        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error && <div className="admin-error">{error}</div>}

        <button
          className="admin-button"
          disabled={loading}
        >
          {loading ? 'Logowanie...' : 'Zaloguj'}
        </button>
      </form>
    </main>
  );
}
