
export default function CalendarDay({
  day,
  isCurrentMonth,
  isToday,
  events,
  onClick,
}) {
  return (
    <div
      className={`calendar-day
        ${isCurrentMonth ? '' : 'other-month'}
        ${isToday ? 'today' : ''}
      `}
      onClick={() => onClick(day)}
    >
      <div className="calendar-day-number">
        {day.getDate()}
      </div>

      <div className="calendar-icons">
        {events.slice(0, 3).map((event, index) => (
          <span key={index}>
            {event.emoji}
          </span>
        ))}

        {events.length > 3 && (
          <small>
            +{events.length - 3}
          </small>
        )}
      </div>
    </div>
  );
}
