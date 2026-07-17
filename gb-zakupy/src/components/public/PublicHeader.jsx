import { useEffect, useState } from 'react';
import Logo from '../shared/Logo';

export default function PublicHeader() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreen();

    window.addEventListener('resize', checkScreen);

    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  return (
    <>
      <Logo />

      <h1>Lista zakupowa</h1>

      {isMobile ? (
        <details className="intro-box intro-mobile">
          <summary>🛒 Informacje o liście zakupowej</summary>

          <p>
            <strong>🛒 Brakuje czegoś w biurze?</strong> A może obawiasz się, że
            później o tym zapomnisz? Wpisz poniżej swoje imię oraz to, czego
            aktualnie potrzebujesz.
          </p>

          <p>
            ☕ Kończy się Twoja ulubiona herbata? 🥛 Brakuje mleka do kawy?
            🖊️ Przydałyby się nowe długopisy lub przy ostatnim zamówieniu coś
            zostało przeoczone? A może osoba odpowiedzialna za zamówienia jest
            akurat nieobecna? To idealne miejsce, aby zostawić taką informację.
          </p>

          <p>
            Zajmie Ci to dosłownie chwilę, a dzięki temu nic nie umknie. Twoje
            zgłoszenie trafi tam, gdzie trzeba i będzie czekało na realizację.
          </p>

          <p>
            <strong>📋 Aktualna lista zakupowa</strong> poniżej pokazuje wszystkie
            produkty oczekujące na zamówienie. Jeżeli produktu nie ma już na
            liście, oznacza to, że został zamówiony.
          </p>

          <p className="intro-footer">
            💙 Dziękujemy za pomoc w utrzymaniu naszego biura!
          </p>
        </details>
      ) : (
        <div className="intro-box">
          <p>
            <strong>🛒 Brakuje czegoś w biurze?</strong> A może obawiasz się, że
            później o tym zapomnisz? Wpisz poniżej swoje imię oraz to, czego
            aktualnie potrzebujesz.
          </p>

          <p>
            ☕ Kończy się Twoja ulubiona herbata? 🥛 Brakuje mleka do kawy?
            🖊️ Przydałyby się nowe długopisy lub przy ostatnim zamówieniu coś
            zostało przeoczone? A może osoba odpowiedzialna za zamówienia jest
            akurat nieobecna? To idealne miejsce, aby zostawić taką informację.
          </p>

          <p>
            Zajmie Ci to dosłownie chwilę, a dzięki temu nic nie umknie. Twoje
            zgłoszenie trafi tam, gdzie trzeba i będzie czekało na realizację.
          </p>

          <p>
            <strong>📋 Aktualna lista zakupowa</strong> poniżej pokazuje wszystkie
            produkty oczekekujące na zamówienie. Jeżeli produktu nie ma już na
            liście, oznacza to, że został zamówiony.
          </p>

          <p className="intro-footer">
            💙 Dziękujemy za pomoc w utrzymaniu naszego biura!
          </p>
        </div>
      )}
    </>
  );
}
