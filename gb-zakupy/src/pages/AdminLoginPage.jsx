import { useState } from 'react';
import { loginAdmin } from '../firebase/auth';
import { ADMIN_EMAIL } from '../utils/constants';
import Logo from '../components/shared/Logo';

export default function AdminLoginPage({ goBack }) {
  const [email, setEmail] = useState(ADMIN_EMAIL || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError('');
      await loginAdmin(email.trim(), password);
    } catch {
      setError('Nieprawidłowy email lub hasło.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-page login-view">
      <form className="login-card" onSubmit={handleLogin}>
        <button type="button" onClick={goBack} className="back-button">
          Wróć do listy
        </button>

        <Logo className="admin-logo" />

        <h1>Panel admina</h1>
        <p>Zaloguj się, aby zarządzać listą zakupową.</p>

        <input
          type="email"
          value={email}
          placeholder="Email administratora"
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          type="password"
          value={password}
          placeholder="Hasło"
          onChange={(event) => setPassword(event.target.value)}
        />

        {error && <div className="admin-error">{error}</div>}

        <button className="admin-button" disabled={loading}>
          {loading ? 'Logowanie...' : 'Zaloguj'}
        </button>
      </form>
    </main>
  );
}
