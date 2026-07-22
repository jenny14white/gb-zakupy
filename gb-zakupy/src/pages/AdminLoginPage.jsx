import { useState } from "react";
import { loginAdmin } from "../firebase/auth";
import Logo from "../components/shared/Logo";
import LiquidEther from "../components/shared/effects/LiquidEther";

const LIQUID_COLORS = [
  "#0353a4",
  "#023e7d",
  "#002855"
];
const ADMIN_EMAIL = "belacount4@gmail.com";

export default function AdminLoginPage({
  goBack,
  onLogin,
}) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {

    event.preventDefault();

    setError("");

    try {

      setLoading(true);

      const user = await loginAdmin(
        email,
        password
      );

      if (user.email !== ADMIN_EMAIL) {

        throw new Error(
          "Brak uprawnień"
        );

      }

      onLogin(user);

      setEmail("");
      setPassword("");

    } catch (error) {

      console.error(error);

      setError(
        "Nieprawidłowe dane lub brak uprawnień administratora."
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <main className="admin-page login-view">

      <div className="admin-background">

        <LiquidEther
    colors={LIQUID_COLORS}
    mouseForce={20}
    cursorSize={60}
    isViscous
    viscous={18}
    iterationsViscous={16}
    iterationsPoisson={16}
    resolution={0.35}
    isBounce={false}
    autoDemo
    autoSpeed={0.35}
    autoIntensity={1.4}
    takeoverDuration={0.25}
    autoResumeDelay={3000}
    autoRampDuration={0.6}
/>

      </div>

      <form
        className="login-card"
        onSubmit={handleLogin}
      >

        <button
          type="button"
          onClick={goBack}
          className="back-button"
        >
          Wróć do listy
        </button>

        <Logo
          className="admin-logo"
        />

        <h1>
          Panel admina
        </h1>

        <p>
          Zaloguj się jako administrator.
        </p>

        <input
          type="email"
          placeholder="Adres e-mail"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          autoFocus
          required
        />

        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          required
        />

        {error && (

          <div className="admin-error">
            {error}
          </div>

        )}

        <button
          className="admin-button"
          disabled={loading}
        >

          {loading
            ? "Logowanie..."
            : "Zaloguj"}

        </button>

      </form>

    </main>

  );

}
