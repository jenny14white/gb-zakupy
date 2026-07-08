import { useMemo, useState } from 'react';
import EmptyState from '../shared/EmptyState';
import { groupOrdersByOrderedMonth } from '../../utils/orderUtils';
import AdminMonthGroup from './AdminMonthGroup';

function normalize(text = '') {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l');
}

export default function AdminCompletedList({ orders }) {
  const [search, setSearch] = useState('');

  const groups = useMemo(() => {
    const grouped = groupOrdersByOrderedMonth(orders);

    if (!search.trim()) {
      return grouped;
    }

    const phrase = normalize(search);

    return grouped
      .map((group) => ({
        ...group,
        items: group.items.filter((order) => {
          return (
            normalize(order.product).includes(phrase) ||
            normalize(order.requestedBy).includes(phrase) ||
            normalize(order.adminComment || '').includes(phrase)
          );
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [orders, search]);

  return (
    <>
      <h2>Zrealizowane / zamówione</h2>

      <input
        type="text"
        placeholder="🔍 Szukaj produktu, osoby lub komentarza..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          marginBottom: '22px',
          padding: '14px 16px',
          borderRadius: '14px',
          border: '1px solid #cbd5e1',
          fontSize: '16px',
        }}
      />

      {groups.length === 0 ? (
        <EmptyState>
          {search
            ? 'Nie znaleziono żadnych zamówień.'
            : 'Nie ma jeszcze zamówionych produktów.'}
        </EmptyState>
      ) : (
        <div className="completed-months">
          {groups.map((group) => (
            <AdminMonthGroup
              key={group.month}
              month={group.month}
              orders={group.items}
              autoOpen={!!search}
            />
          ))}
        </div>
      )}
    </>
  );
}
