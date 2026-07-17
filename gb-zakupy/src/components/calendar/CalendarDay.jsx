export default function CalendarDay({
  day,
  isCurrentMonth,
  isToday,
  isSelected,
  isWeekend,
  events,
  onClick,
}) {
  const className = [
    "calendar-day",
    !isCurrentMonth && "other-month",
    isToday && "today",
    isSelected && "selected",
    isWeekend && "weekend",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={className}
      role="button"
      tabIndex={0}
      onClick={() => onClick(day)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(day);
        }
      }}
    >
      <div className="calendar-day-header">
        <span className="calendar-day-number">
          {day.getDate()}
        </span>

        {events.length > 0 && (
          <span className="calendar-events-count">
            {events.length}
          </span>
        )}
      </div>

      {events.length > 0 && (
        <div className="calendar-day-dot" />
      )}

      <div className="calendar-icons">
        {events.slice(0, 4).map((event, index) => (
          <span
            key={event.id ?? `${event.title}-${index}`}
            className={`calendar-icon ${
              event.type
                ? event.type.toLowerCase()
                : ""
            }`}
            title={event.title}
          >
            {event.emoji || "📅"}
          </span>
        ))}

        {events.length > 4 && (
          <span className="calendar-more-events">
            +{events.length - 4}
          </span>
        )}
      </div>
    </div>
  );
}
