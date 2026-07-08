import { useState } from 'react';
import { updateOrder } from '../../services/ordersService';
import { UNITS } from '../../utils/constants';

export default function AdminOrderEditForm({ order, onCancel, onSaved }) {
  const [product, setProduct] = useState(order.product);
  const [quantity, setQuantity] = useState(order.quantity);
  const [unit, setUnit] = useState(order.unit);
  const [requestedBy, setRequestedBy] = useState(order.requestedBy);
  const [adminComment, setAdminComment] = useState(order.adminComment || '');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    try {
      setLoading(true);

      await updateOrder(order.id, {
        product,
        quantity,
        unit,
        requestedBy,
        adminComment,
      });

      onSaved();
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="admin-order editing">
      <label>
        Produkt
        <input value={product} onChange={(e) => setProduct(e.target.value)} />
      </label>

      <label>
        Osoba zgłaszająca
        <input
          value={requestedBy}
          onChange={(e) => setRequestedBy(e.target.value)}
        />
      </label>

      <div className="edit-row">
        <label>
          Ilość
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </label>

        <label>
          Jednostka
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            {UNITS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>

      <label>
        Komentarz admina
        <textarea
          rows="2"
          value={adminComment}
          onChange={(e) => setAdminComment(e.target.value)}
        />
      </label>

      <div className="admin-actions">
        <button onClick={handleSave} disabled={loading}>
          {loading ? 'Zapisywanie...' : 'Zapisz edycję'}
        </button>

        <button className="gray-button" onClick={onCancel}>
          Anuluj
        </button>
      </div>
    </article>
  );
}
