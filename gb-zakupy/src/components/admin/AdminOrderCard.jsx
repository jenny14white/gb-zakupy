import { useEffect, useState } from 'react';
import { markOrderAsOrdered, updateOrder } from '../../services/ordersService';
import { formatDate } from '../../utils/dateUtils';
import AdminOrderEditForm from './AdminOrderEditForm';

export default function AdminOrderCard({ order, canOrder }) {
  const [isEditing, setIsEditing] = useState(false);
  const [adminComment, setAdminComment] = useState(order.adminComment || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAdminComment(order.adminComment || '');
  }, [order]);

  async function handleMarkAsOrdered() {
    if (!canOrder || loading) return;

    try {
      setLoading(true);
      await markOrderAsOrdered(order, adminComment);
    } finally {
      setLoading(false);
    }
  }

  if (isEditing) {
    return (
      <AdminOrderEditForm
        order={order}
        onCancel={() => setIsEditing(false)}
        onSaved={() => setIsEditing(false)}
      />
    );
  }

  return (
    <article className={`admin-order ${!canOrder ? 'done' : ''}`}>
      <div>
        <strong>{order.product}</strong>

        <span>
          Ilość: {order.quantity} {order.unit}
        </span>

        <span>Dodane przez: {order.requestedBy}</span>

        <small>Data dodania: {formatDate(order.createdAt)}</small>

        {order.orderedAt && (
          <small>Zamówiono: {formatDate(order.orderedAt)}</small>
        )}

        {order.adminComment && <small>Komentarz: {order.adminComment}</small>}
      </div>

      <div className="status-badge">{canOrder ? 'Oczekuje' : 'Zamówione'}</div>

      <textarea
        rows="2"
        value={adminComment}
        onChange={(event) => setAdminComment(event.target.value)}
        placeholder="Komentarz, np. zamówione w Action..."
        disabled={!canOrder}
      />

      <div className="admin-actions">
        {canOrder && (
          <button onClick={handleMarkAsOrdered} disabled={loading}>
            {loading ? 'Zapisywanie...' : 'Oznacz jako zamówione'}
          </button>
        )}

        <button className="gray-button" onClick={() => setIsEditing(true)}>
          Edytuj
        </button>
      </div>
    </article>
  );
}
