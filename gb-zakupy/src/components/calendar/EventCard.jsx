export default function EventCard({ event }) {
  return (
    <article className="event-card">

      <div className="event-title">

        <span>
          {event.emoji}
        </span>

        <strong>
          {event.title}
        </strong>

      </div>

      {event.time && (
        <div className="event-time">

          🕒 {event.time}

        </div>
      )}

      {event.description && (
        <p>

          {event.description}

        </p>
      )}

    </article>
  );
}
