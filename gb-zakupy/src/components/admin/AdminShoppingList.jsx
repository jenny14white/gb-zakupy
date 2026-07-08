import EmptyState from '../shared/EmptyState';
import AdminOrderCard from './AdminOrderCard';

export default function AdminShoppingList({ orders }) {
  return (
    <>
      <h2>Lista zakupowa</h2>

      {orders.length === 0 ? (
        <EmptyState>Brak aktywnych produktów.</EmptyState>
      ) : (
        <div className="admin-orders">
          {orders.map((order) => (
            <AdminOrderCard key={order.id} order={order} canOrder />
          ))}
        </div>
      )}
    </>
  );
}
