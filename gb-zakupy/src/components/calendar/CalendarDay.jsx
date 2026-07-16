export default function CalendarDay({
  day,
  isCurrentMonth,
  isToday,
  isSelected,
  events,
  onClick,
}) {
  return (
    <div
      className={`calendar-day
        ${isCurrentMonth ? '' : 'other-month'}
        ${isToday ? 'today' : ''}
        ${isSelected ? 'selected' : ''}
      `}
      onClick={() => onClick(day)}
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

      <div className="calendar-icons">
        {events.slice(0, 3).map((event, index) => (
          <span
            key={event.id ?? `${event.title}-${index}`}
            title={event.title}
            className="calendar-icon"
          >
            {event.emoji}
          </span>
        ))}

        {events.length > 3 && (
          <small className="calendar-more-events">
            +{events.length - 3}
          </small>
        )}
      </div>
    </div>
  );
}
