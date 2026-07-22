export default function AdminCalendar({
  events,
  onEdit,
  onDelete,
}) {
  if (!events.length) {
    return (
      <section className="admin-events-list">
        <div className="section-title">
          <h2>📋 Lista wydarzeń</h2>
          <span className="events-count">0 wydarzeń</span>
        </div>

        <div className="empty-events">
          <h3>Brak wydarzeń</h3>
          <p>Dodaj pierwsze wydarzenie korzystając z formularza powyżej.</p>
        </div>
      </section>
    );
  }

  const sortedEvents = [...events].sort((a, b) => {
    const dateA = a.date?.toDate?.() ?? new Date(a.date);
    const dateB = b.date?.toDate?.() ?? new Date(b.date);

    return dateA - dateB;
  });

  return (
    <section className="admin-events-list">
      <div className="section-title">
        <h2>📋 Lista wydarzeń</h2>

        <span className="events-count">
          {sortedEvents.length} wydarzeń
        </span>
      </div>

      <div className="events-grid">
        {sortedEvents.map((event) => {
          const date =
            event.date?.toDate?.() ??
            new Date(event.date);

          return (
            <article
              key={event.id}
              className="admin-event-card"
            >
              <div className="admin-event-top">
                <div className="admin-event-icon">
                  {event.emoji || "📅"}
                </div>

                <div className="admin-event-info">
                  <h3>{event.title}</h3>

                  <span className="admin-event-type">
                    {event.type}
                  </span>
                </div>
              </div>

              <div className="admin-event-details">
                <p>
                  📅{" "}
                  {date.toLocaleDateString("pl-PL")}
                </p>

                {event.time && (
                  <p>🕒 {event.time}</p>
                )}

                {event.location && (
                  <p>📍 {event.location}</p>
                )}

                {event.recurring && (
                  <p>🔁 Wydarzenie cykliczne</p>
                )}
              </div>

              {event.description && (
                <div className="admin-event-description">
                  {event.description}
                </div>
              )}

              <div className="admin-event-actions">
                <button
                  className="edit-event-button"
                  onClick={() => onEdit(event)}
                >
                  ✏️ Edytuj
                </button>

                <button
                  className="delete-event-button"
                  onClick={() => onDelete(event.id)}
                >
                  🗑 Usuń
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
