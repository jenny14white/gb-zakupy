import EmptyState from '../shared/EmptyState';
import { formatDate } from '../../utils/dateUtils';

export default function AdminEventLog({ logs }) {
  return (
    <>
      <h2>Dziennik zdarzeń</h2>

      <div className="event-log">
        {logs.length === 0 ? (
          <EmptyState>Brak zdarzeń.</EmptyState>
        ) : (
          logs.map((log) => (
            <div key={log.id}>
              <strong>{formatDate(log.createdAt)}</strong>
              <br />
              {log.message}
            </div>
          ))
        )}
      </div>
    </>
  );
}
