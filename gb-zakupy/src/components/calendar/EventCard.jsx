export default function EventCard({ event }) {
  function safeText(value) {
    if (value == null) return "";

    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);

    if (value instanceof Date) {
      return value.toLocaleDateString("pl-PL");
    }

    if (typeof value?.toDate === "function") {
      return value.toDate().toLocaleDateString("pl-PL");
    }

    return "";
  }

  const title = safeText(event.title);
  const type = safeText(event.type);
  const emoji = safeText(event.emoji);
  const time = safeText(event.time);
  const location = safeText(event.location);
  const description = safeText(event.description);
  const formattedDate = safeText(event.date);

  function getBadgeText() {
    switch (type.toLowerCase()) {
      case "company":
      case "firma":
        return "🏭 Firma";

      case "holiday":
      case "święto":
        return "🎉 Święto";

      case "birthday":
      case "urodziny":
        return "🎂 Urodziny";

      case "meeting":
      case "spotkanie":
        return "👥 Spotkanie";

      case "vacation":
      case "urlop":
        return "🌴 Urlop";

      default:
        return type || "Wydarzenie";
    }
  }

  return (
    <article className="event-card">
      <h3 className="event-title">
        {emoji && `${emoji} `}
        {title}
      </h3>

      {(formattedDate || time) && (
        <div className="event-date">
          {formattedDate && <span>{formattedDate}</span>}
          {formattedDate && time && <span> • </span>}
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
