import { useEffect, useState } from 'react';
import {
  markOrderAsOrdered,
  deleteOrder,
} from '../../services/ordersService';
import { formatDate } from '../../utils/dateUtils';
import AdminOrderEditForm from './AdminOrderEditForm';
import ConfirmDialog from '../shared/ConfirmDialog';

export default function AdminOrderCard({ order, canOrder }) {
  const [isEditing, setIsEditing] = useState(false);
  const [adminComment, setAdminComment] = useState(order.adminComment || '');
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  async function confirmDelete() {
    try {
      setLoading(true);
      await deleteOrder(order);
    } catch (error) {
      console.error(error);
      alert('Nie udało się usunąć zamówienia.');
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
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
    <>
      <ConfirmDialog
        open={showDeleteDialog}
        danger
        title="Usunąć zamówienie?"
        message={`Czy na pewno chcesz usunąć "${order.product}"?\n\nTej operacji nie można cofnąć.`}
        confirmText="Usuń"
        cancelText="Anuluj"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />

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
            onClick={() => setShowDeleteDialog(true)}
            disabled={loading}
          >
            {loading ? 'Usuwanie...' : 'Usuń'}
          </button>
        </div>
      </article>
    </>
  );
}
