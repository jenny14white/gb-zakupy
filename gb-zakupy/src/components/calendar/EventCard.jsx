export default function EventCard({ event }) {
  return (
    <article className={`event-card ${event.type || ''}`}>
      <div className="event-header">
        <span className="event-emoji">
          {event.emoji || '📅'}
        </span>

        <div className="event-header-content">
          <strong className="event-title">
            {event.title}
          </strong>

          {event.type && (
            <span className="event-type">
              {event.type}
            </span>
          )}
        </div>
      </div>

      {event.time && (
        <div className="event-row">
          🕒 <span>{event.time}</span>
        </div>
      )}

      {event.location && (
        <div className="event-row">
          📍 <span>{event.location}</span>
        </div>
      )}

      {event.description && (
        <div className="event-description">
          {event.description}
        </div>
      )}
    </article>
  );
}
