export default function EventCard({ event }) {
  const {
    title,
    type,
    emoji,
    time,
    location,
    description,
  } = event;

  return (
    <article className={`event-card ${type || ''}`}>
      <div className="event-header">
        <div className="event-emoji">
          {emoji || '📅'}
        </div>

        <div className="event-header-content">
          <strong className="event-title">
            {title}
          </strong>

          {type && (
            <span className="event-type">
              {type}
            </span>
          )}
        </div>
      </div>

      {time && (
        <div className="event-row">
          <span>🕒</span>
          <span>{time}</span>
        </div>
      )}

      {location && (
        <div className="event-row">
          <span>📍</span>
          <span>{location}</span>
        </div>
      )}

      {description && (
        <div className="event-description">
          {description}
        </div>
      )}
    </article>
  );
}
