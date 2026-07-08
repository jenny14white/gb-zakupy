import { useMemo, useState } from 'react';
import EmptyState from '../shared/EmptyState';
import { formatDate } from '../../utils/dateUtils';
import { markNotificationAsRead } from '../../services/ordersService';

export default function AdminNotifications({ orders }) {
  const [view, setView] = useState('unread');

  const unreadOrders = useMemo(() => {
    return orders.filter((order) => !order.notificationRead);
  }, [orders]);

  const readOrders = useMemo(() => {
    return orders.filter((order) => order.notificationRead);
  }, [orders]);

  const visibleOrders = view === 'unread' ? unreadOrders : readOrders;

  return (
    <>
      <div className="section-header">
        <div>
          <h2>Powiadomienia</h2>
          <p>Nowe zgłoszenia od pracowników.</p>
        </div>

        <div className="notification-tabs">
          <button
            className={view === 'unread' ? 'active' : ''}
            onClick={() => setView('unread')}
          >
            Nowe ({unreadOrders.length})
          </button>

          <button
            className={view === 'read' ? 'active' : ''}
            onClick={() => setView('read')}
          >
            Przeczytane ({readOrders.length})
          </button>
        </div>
      </div>

      {visibleOrders.length === 0 ? (
        <EmptyState>
          {view === 'unread'
            ? 'Brak nowych nieprzeczytanych powiadomień.'
            : 'Brak przeczytanych powiadomień.'}
        </EmptyState>
      ) : (
        <div className="notifications">
          {visibleOrders.map((item) => (
            <NotificationCard key={item.id} item={item} view={view} />
          ))}
        </div>
      )}
    </>
  );
}

function NotificationCard({ item, view }) {
  const [loading, setLoading] = useState(false);

  async function handleRead() {
    try {
      setLoading(true);
      await markNotificationAsRead(item);
    } finally {
      setLoading(false);
    }
  }

  return (
    <article
      className={`notification-card ${
        item.notificationRead ? 'read' : 'unread'
      }`}
    >
      <div className="notification-top">
        <strong>
          {item.notificationRead ? 'Przeczytane' : 'Nowe zgłoszenie'}
        </strong>
        {!item.notificationRead && <span className="dot"></span>}
      </div>

      <p>
        {item.product} — {item.quantity} {item.unit}
      </p>

      <small>
        Dodane przez: {item.requestedBy} · {formatDate(item.createdAt)}
      </small>

      {item.notificationReadAt && (
        <small>Przeczytano: {formatDate(item.notificationReadAt)}</small>
      )}

      {view === 'unread' && !item.notificationRead && (
        <button onClick={handleRead} disabled={loading}>
          {loading ? 'Zapisywanie...' : 'Oznacz jako przeczytane'}
        </button>
      )}
    </article>
  );
}
