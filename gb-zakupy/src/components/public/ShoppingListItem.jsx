import { formatDate } from '../../utils/dateUtils';
import {
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
} from '../../utils/constants';

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

      <div
        className={`shopping-status ${
          item.status === ORDER_STATUS.ACCEPTED
            ? 'accepted'
            : 'pending'
        }`}
      >
        {ORDER_STATUS_LABELS[item.status]}
      </div>

      {item.adminComment && (
        <div className="shopping-comment">
          💬 {item.adminComment}
        </div>
      )}
    </article>
  );
}
