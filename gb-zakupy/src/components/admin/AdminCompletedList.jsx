import EmptyState from '../shared/EmptyState';
import { groupOrdersByOrderedMonth } from '../../utils/orderUtils';
import AdminMonthGroup from './AdminMonthGroup';

export default function AdminCompletedList({ orders }) {
  const groups = groupOrdersByOrderedMonth(orders);

  return (
    <>
      <h2>Zrealizowane / zamówione</h2>

      {orders.length === 0 ? (
        <EmptyState>Nie ma jeszcze zamówionych produktów.</EmptyState>
      ) : (
        <div className="completed-months">
          {groups.map((group) => (
            <AdminMonthGroup
              key={group.month}
              month={group.month}
              orders={group.items}
            />
          ))}
        </div>
      )}
    </>
  );
}
