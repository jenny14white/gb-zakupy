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
        return type;
    }
  }

  function formatDate(value) {
    if (!value) return "";

    // Firestore Timestamp
    if (typeof value?.toDate === "function") {
      return value.toDate().toLocaleDateString("pl-PL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    // JS Date
    if (value instanceof Date) {
      return value.toLocaleDateString("pl-PL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    // String
    if (typeof value === "string") {
      return value;
    }

    return "";
  }

  const formattedDate = formatDate(date);

  return (
    <article className="event-card">
      <h3 className="event-title">
        {emoji ? `${emoji} ` : ""}
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
