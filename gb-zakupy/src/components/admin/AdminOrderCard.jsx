import { useEffect, useState } from 'react';
import {
  markOrderAsAccepted,
  markOrderAsOrdered,
  deleteOrder,
} from '../../services/ordersService';
import { ORDER_STATUS } from '../../utils/constants';
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

  async function handleAccept() {
    if (loading) return;

    try {
      setLoading(true);
      await markOrderAsAccepted(order, adminComment);
    } catch (error) {
      console.error(error);
      alert('Nie udało się przyjąć zamówienia.');
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsOrdered() {
    if (loading) return;

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

  const isPending = order.status === ORDER_STATUS.PENDING;
  const isAccepted = order.status === ORDER_STATUS.ACCEPTED;
  const isOrdered = order.status === ORDER_STATUS.ORDERED;

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

      <article className={`admin-order ${isOrdered ? 'done' : ''}`}>
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
          {isPending && '🟡 Oczekuje'}
          {isAccepted && '🟢 Przyjęto do realizacji'}
          {isOrdered && '✅ Zamówione'}
        </div>

        <textarea
          rows="2"
          value={adminComment}
          onChange={(event) => setAdminComment(event.target.value)}
          placeholder="Komentarz..."
          disabled={isOrdered || loading}
        />

        <div className="admin-actions">
          {isPending && (
            <button
              onClick={handleAccept}
              disabled={loading}
            >
              {loading ? 'Zapisywanie...' : 'Przyjmij do realizacji'}
            </button>
          )}

          {isAccepted && (
            <button
              onClick={handleMarkAsOrdered}
              disabled={loading}
            >
              {loading ? 'Zapisywanie...' : 'Oznacz jako zamówione'}
            </button>
          )}

          {!isOrdered && (
            <button
              className="gray-button"
              onClick={() => setIsEditing(true)}
              disabled={loading}
            >
              Edytuj
            </button>
          )}

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
