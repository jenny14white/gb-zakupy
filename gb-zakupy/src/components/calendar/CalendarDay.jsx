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

    !isCurrentMonth && "outside",

    isToday && "today",

    isSelected && "selected",

    isWeekend && "weekend",

  ]
    .filter(Boolean)
    .join(" ");

  function getEventClass(type = "") {

    switch (type.toLowerCase()) {

      case "firma":
      case "company":
        return "company";

      case "święto":
      case "holiday":
        return "holiday";

      case "urodziny":
      case "birthday":
        return "birthday";

      case "spotkanie":
      case "meeting":
        return "meeting";

      case "urlop":
      case "vacation":
        return "vacation";

      default:
        return "other";

    }

  }

  return (

    <div

      className={className}

      role="button"

      tabIndex={0}

      onClick={() => onClick(day)}

      onKeyDown={(e) => {

        if (
          e.key === "Enter" ||
          e.key === " "
        ) {

          e.preventDefault();

          onClick(day);

        }

      }}

    >

      <div className="calendar-day-number">

        {day.getDate()}

      </div>

      {events.length > 0 && (

        <>

          {/* DESKTOP */}

          <div className="calendar-day-events">

            {events.slice(0, 1).map((event, index) => (

              <div

                key={
                  event.id ??
                  `${event.title}-${index}`
                }

                className={
                  `calendar-event-bubble ${getEventClass(event.type)}`
                }

                title={event.title}

              >

                <span className="event-emoji">

                  {event.emoji || "📅"}

                </span>

                <span className="event-name">

                  {event.title}

                </span>

              </div>

            ))}

            {events.length > 1 && (

              <div className="calendar-event-more">

                +{events.length - 1}

              </div>

            )}

          </div>

          {/* MOBILE */}

          <div className="calendar-mobile-dots">

            {events.slice(0, 5).map((event, index) => (

              <span

                key={
                  event.id ??
                  `${event.title}-dot-${index}`
                }

                className={
                  `calendar-event-dot ${getEventClass(event.type)}`
                }

                title={event.title}

              />

            ))}

          </div>

        </>

      )}

    </div>

  );

}
