import { useEffect, useState } from 'react';
import {
  markOrderAsOrdered,
  updateOrder,
  deleteOrder,
} from '../../services/ordersService';
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
    } catch (error) {
      console.error(error);
      alert('Nie udało się oznaczyć zamówienia.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (loading) return;

    const confirmed = window.confirm(
      `Czy na pewno chcesz usunąć zamówienie?\n\n${order.product}`
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      await deleteOrder(order);
    } catch (error) {
      console.error(error);
      alert('Nie udało się usunąć zamówienia.');
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

        {order.adminComment && (
          <small>Komentarz: {order.adminComment}</small>
        )}
      </div>

      <div className="status-badge">
        {canOrder ? 'Oczekuje' : 'Zamówione'}
      </div>

      <textarea
        rows="2"
        value={adminComment}
        onChange={(event) => setAdminComment(event.target.value)}
        placeholder="Komentarz, np. zamówione w Action..."
        disabled={!canOrder || loading}
      />

      <div className="admin-actions">
        {canOrder && (
          <button
            onClick={handleMarkAsOrdered}
            disabled={loading}
          >
            {loading ? 'Zapisywanie...' : 'Oznacz jako zamówione'}
          </button>
        )}

        <button
          className="gray-button"
          onClick={() => setIsEditing(true)}
          disabled={loading}
        >
          Edytuj
        </button>

        <button
          className="delete-button"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? 'Usuwanie...' : 'Usuń'}
        </button>
      </div>
    </article>
  );
}
