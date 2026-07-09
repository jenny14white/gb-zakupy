import { formatDate } from '../../utils/dateUtils';

export default function ShoppingListItem({ item }) {
  return (
    <article className="shopping-item">
      <div className="shopping-item-header">
        <h3>{item.product}</h3>

        <span className="shopping-badge">
          {item.quantity} {item.unit}
        </span>
      </div>

      <div className="shopping-meta">
        <span>👤 {item.requestedBy}</span>

        <span>🕒 {formatDate(item.createdAt)}</span>
      </div>
    </article>
  );
}
