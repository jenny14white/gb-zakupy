export default function EventCard({ event }) {
  const {
    title,
    type,
    emoji,
    time,
    location,
    description,
    date,
  } = event;

  function getBadgeText() {
    if (!type) return "Wydarzenie";

    switch (type.toLowerCase()) {
      case "company":
        return "🏭 Firma";

      case "firma":
        return "🏭 Firma";

      case "holiday":
        return "🎉 Święto";

      case "święto":
        return "🎉 Święto";

      case "birthday":
        return "🎂 Urodziny";

      case "urodziny":
        return "🎂 Urodziny";

      case "meeting":
        return "👥 Spotkanie";

      case "spotkanie":
        return "👥 Spotkanie";

      case "vacation":
        return "🌴 Urlop";

      case "urlop":
        return "🌴 Urlop";

      default:
        return type;
    }
  }

  return (
    <article className="event-card">
      <h3 className="event-title">
        {emoji ? `${emoji} ` : ""}
        {title}
      </h3>

      {(date || time) && (
        <div className="event-date">
          {date && <span>{date}</span>}
          {date && time && <span> • </span>}
          {time && <span>{time}</span>}
        </div>
      )}

      {location && (
        <div className="event-description">
          📍 {location}
        </div>
      )}

      {description && (
        <div className="event-description">
          {description}
        </div>
      )}

      <div className="event-badge">
        {getBadgeText()}
      </div>
    </article>
  );
}
