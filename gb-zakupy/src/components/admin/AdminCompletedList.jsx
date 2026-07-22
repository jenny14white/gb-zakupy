import { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import EmptyState from '../shared/EmptyState';
import { groupOrdersByOrderedMonth } from '../../utils/orderUtils';
import { formatDate } from '../../utils/dateUtils';
import { ORDER_STATUS } from '../../utils/constants';
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

  const completedOrders = useMemo(
    () => orders.filter((order) => order.status === ORDER_STATUS.COMPLETED),
    [orders]
  );

  const groups = useMemo(() => {
    const grouped = groupOrdersByOrderedMonth(completedOrders);

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
  }, [completedOrders, search]);

  function exportToExcel() {
    const rows = groups.flatMap((group) =>
      group.items.map((order) => ({
        Miesiąc: group.month,
        Produkt: order.product,
        Ilość: order.quantity,
        Jednostka: order.unit,
        Zgłaszający: order.requestedBy,
        Status: 'Zrealizowane',
        'Data dodania': formatDate(order.createdAt),
        'Data zamówienia': formatDate(order.orderedAt),
        'Data realizacji': formatDate(order.completedAt),
        'Komentarz admina': order.adminComment || '',
      }))
    );

    if (rows.length === 0) {
      alert('Brak danych do eksportu.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Zrealizowane'
    );

    const today = new Date().toISOString().split('T')[0];

    XLSX.writeFile(
      workbook,
      `GB_Zrealizowane_${today}.xlsx`
    );
  }

  return (
    <>
      <h2>Zrealizowane</h2>

      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '22px',
          flexWrap: 'wrap',
        }}
      >
        <input
          className="search-input"
          type="text"
          placeholder="🔍 Szukaj produktu, osoby lub komentarza..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />

        <button
          className="admin-button"
          onClick={exportToExcel}
        >
          📊 Eksportuj Excel
        </button>
      </div>

      {groups.length === 0 ? (
        <EmptyState>
          {search
            ? 'Nie znaleziono żadnych zrealizowanych zamówień.'
            : 'Nie ma jeszcze zrealizowanych zamówień.'}
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
