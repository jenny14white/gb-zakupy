import Logo from '../shared/Logo';

export default function PublicHeader() {
  return (
    <>
      <Logo />

      <h1>Lista zakupowa</h1>

      <div className="intro-box">
        <p>
          Poniżej znajduje się formularz, w którym możesz zgłosić rzeczy
          potrzebne do biura.
        </p>

        <p>
          Mogą to być długopisy, flamastry, mleko do kuchni, cukier, kawa,
          herbata albo inne produkty, które lubicie najbardziej lub zauważycie,
          że się kończą a mnie nie będzie lub przeoczę.
        </p>

        <p>
          W sekcji <strong>„Aktualna lista zakupowa”</strong> znajdziesz
          produkty już dodane. Jeżeli produktu nie ma już na liście, oznacza to,
          że został zamówiony.
        </p>
      </div>
    </>
  );
}
