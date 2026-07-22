import { useMemo } from 'react';

import EmptyState from '../shared/EmptyState';
import AdminOrderCard from './AdminOrderCard';

import { ORDER_STATUS } from '../../utils/constants';

export default function AdminShoppingList({ orders }) {
  const pendingOrders = useMemo(
    () =>
      orders.filter(
        (order) => order.status === ORDER_STATUS.PENDING
      ),
    [orders]
  );

  const acceptedOrders = useMemo(
    () =>
      orders.filter(
        (order) => order.status === ORDER_STATUS.ACCEPTED
      ),
    [orders]
  );

  return (
    <>
      <h2>Zakupy</h2>

      {/* ---------------- Oczekujące ---------------- */}

      <section className="admin-section">
        <h3>
          🟡 Oczekujące
          {' '}
          <span>({pendingOrders.length})</span>
        </h3>

        {pendingOrders.length === 0 ? (
          <EmptyState>
            Brak oczekujących zgłoszeń.
          </EmptyState>
        ) : (
          <div className="admin-orders">
            {pendingOrders.map((order) => (
              <AdminOrderCard
                key={order.id}
                order={order}
              />
            ))}
          </div>
        )}
      </section>

      {/* ---------------- Przyjęte ---------------- */}

      <section
        className="admin-section"
        style={{ marginTop: 40 }}
      >
        <h3>
          🟢 Przyjęte do realizacji
          {' '}
          <span>({acceptedOrders.length})</span>
        </h3>

        {acceptedOrders.length === 0 ? (
          <EmptyState>
            Brak produktów przyjętych do realizacji.
          </EmptyState>
        ) : (
          <div className="admin-orders">
            {acceptedOrders.map((order) => (
              <AdminOrderCard
                key={order.id}
                order={order}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
