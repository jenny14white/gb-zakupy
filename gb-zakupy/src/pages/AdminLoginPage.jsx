import { useState } from 'react';
import Logo from '../components/shared/Logo';

const ADMIN_PASSWORD = 'ui8Loongunah';

export default function AdminLoginPage({ goBack, onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleLogin(event) {
    event.preventDefault();

    setError('');

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin', 'true');
      onLogin();
    } else {
      setError('Nieprawidłowe hasło.');
      setPassword('');
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
        <p>Wprowadź hasło administratora.</p>

        <input
          type="password"
          value={password}
          placeholder="Hasło administratora"
          onChange={(event) => setPassword(event.target.value)}
          autoFocus
        />

        {error && <div className="admin-error">{error}</div>}

        <button className="admin-button">
          Zaloguj
        </button>
      </form>
    </main>
  );
}
