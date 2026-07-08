import { formatDate } from '../../utils/dateUtils';

export default function ShoppingListItem({ item }) {
  return (
    <article className="shopping-item">
      <strong>{item.product}</strong>

      <span>
        Ilość: {item.quantity} {item.unit}
      </span>

      <span>Dodane przez: {item.requestedBy}</span>

      <small>{formatDate(item.createdAt)}</small>
    </article>
  );
}
