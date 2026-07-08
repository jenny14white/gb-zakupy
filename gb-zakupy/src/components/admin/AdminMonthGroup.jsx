import { useEffect, useState } from 'react';
import AdminOrderCard from './AdminOrderCard';

export default function AdminMonthGroup({
  month,
  orders,
  autoOpen = false,
}) {
  const [isOpen, setIsOpen] = useState(autoOpen);

  useEffect(() => {
    if (autoOpen) {
      setIsOpen(true);
    }
  }, [autoOpen]);

  return (
    <section className="month-section">
      <button
        className="month-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>
          {isOpen ? '▼' : '▶'} {month}
        </span>

        <span className="month-count">
          {orders.length} {orders.length === 1 ? 'produkt' : 'produktów'}
        </span>
      </button>

      {isOpen && (
        <div className="admin-orders">
          {orders.map((order) => (
            <AdminOrderCard
              key={order.id}
              order={order}
              canOrder={false}
            />
          ))}
        </div>
      )}
    </section>
  );
}
