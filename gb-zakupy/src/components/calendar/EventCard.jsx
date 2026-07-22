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
  const type = safeText(event.type).toLowerCase();
  const emoji = safeText(event.emoji);
  const time = safeText(event.time);
  const location = safeText(event.location);
  const description = safeText(event.description);
  const formattedDate = safeText(event.date);

  function getBadgeText() {

    switch (type) {

      case "company":
      case "firma":
        return "FIRMA";

      case "holiday":
      case "święto":
        return "ŚWIĘTO";

      case "birthday":
      case "urodziny":
        return "URODZINY";

      case "meeting":
      case "spotkanie":
        return "SPOTKANIE";

      case "vacation":
      case "urlop":
        return "URLOP";

      default:
        return "INNE";

    }

  }

  return (

    <article className={`event-card ${type}`}>

      <div className="event-card-header">

        <h3 className="event-title">

          {emoji && <span className="event-emoji">{emoji}</span>}

          {title}

        </h3>

        <span className={`event-badge ${type}`}>

          {getBadgeText()}

        </span>

      </div>

      <div className="event-divider"></div>

      <div className="event-card-body">

        {formattedDate && (

          <div className="event-row">

            <span className="event-icon">📅</span>

            <span>{formattedDate}</span>

          </div>

        )}

        {time && (

          <div className="event-row">

            <span className="event-icon">🕒</span>

            <span>{time}</span>

          </div>

        )}

        {location && (

          <div className="event-row">

            <span className="event-icon">📍</span>

            <span>{location}</span>

          </div>

        )}

        {description && (

          <div className="event-description">

            {description}

          </div>

        )}

      </div>

    </article>

  );

}
