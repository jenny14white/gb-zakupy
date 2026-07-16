import PublicHeader from '../components/public/PublicHeader';
import ShoppingForm from '../components/public/ShoppingForm';
import CurrentShoppingList from '../components/public/CurrentShoppingList';
import { usePublicOrders } from '../hooks/usePublicOrders';

export default function PublicShoppingPage({
  goToAdmin,
  goToCalendar,
}) {
  const { orders, loading } = usePublicOrders();

  return (
    <main className="public-page">

      <button
        className="admin-link"
        onClick={goToAdmin}
      >
        Panel admina
      </button>

      {/* ===== CHMURKA ===== */}

      <button
        className="calendar-bubble"
        onClick={goToCalendar}
      >
        <span className="bubble-icon">
          📅
        </span>

        <strong>
          Hej!
        </strong>

        <span>
          Sprawdź
          <br />
          kalendarz
          <br />
          firmowy!
        </span>

        <small>
          Kliknij →
        </small>
      </button>

      {/* =================== */}

      <section className="paper">

        <div className="holes">
          {Array.from({ length: 12 }).map((_, index) => (
            <span key={index}></span>
          ))}
        </div>

        <PublicHeader />

        <ShoppingForm />

        <CurrentShoppingList
          items={orders}
          loading={loading}
        />

        <p className="thanks">
          Dziękujemy! ♡
        </p>

      </section>

    </main>
  );
}
