import { useMemo, useState } from 'react';

import '../../styles/admin-calendar.css';

const WEEK_DAYS = [
  'Pn',
  'Wt',
  'Śr',
  'Cz',
  'Pt',
  'So',
  'Nd',
];

const MONTHS = [
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień',
];

export default function AdminCalendar({
  events,
  onEdit,
  onDelete,
}) {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState(today);

  const month = currentMonth.getMonth();
  const year = currentMonth.getFullYear();

  const firstDay = new Date(year, month, 1);

  let startWeekDay = firstDay.getDay();

  startWeekDay = startWeekDay === 0 ? 6 : startWeekDay - 1;

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const calendarDays = [];

  for (let i = 0; i < startWeekDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(
      new Date(year, month, day)
    );
  }

  const previousMonth = () =>
    setCurrentMonth(
      new Date(year, month - 1, 1)
    );

  const nextMonth = () =>
    setCurrentMonth(
      new Date(year, month + 1, 1)
    );

  const selectedEvents = useMemo(() => {
    return events.filter((event) => {
      const date =
        event.date?.toDate?.() ??
        new Date(event.date);

      return (
        date.getFullYear() ===
          selectedDate.getFullYear() &&
        date.getMonth() ===
          selectedDate.getMonth() &&
        date.getDate() ===
          selectedDate.getDate()
      );
    });
  }, [events, selectedDate]);

  const getEventsForDay = (date) => {
    return events.filter((event) => {
      const eventDate =
        event.date?.toDate?.() ??
        new Date(event.date);

      return (
        eventDate.getFullYear() ===
          date.getFullYear() &&
        eventDate.getMonth() ===
          date.getMonth() &&
        eventDate.getDate() ===
          date.getDate()
      );
    });
  };

  return (
    <section className="admin-calendar">

      <div className="calendar-header">

        <button
          className="calendar-nav"
          onClick={previousMonth}
        >
          ←
        </button>

        <h2>
          {MONTHS[month]} {year}
        </h2>

        <button
          className="calendar-nav"
          onClick={nextMonth}
        >
          →
        </button>

      </div>

      <div className="calendar-layout">

        <div className="calendar-grid">

          {WEEK_DAYS.map((day) => (
            <div
              key={day}
              className="calendar-weekday"
            >
              {day}
            </div>
          ))}

          {calendarDays.map((date, index) => {
            if (!date) {
              return (
                <div
                  key={index}
                  className="calendar-empty"
                />
              );
            }

            const dayEvents =
              getEventsForDay(date);

            const isToday =
              date.toDateString() ===
              today.toDateString();

            const isSelected =
              date.toDateString() ===
              selectedDate.toDateString();

            return (
              <button
                key={date.toISOString()}
                className={`calendar-day
                  ${isToday ? 'today' : ''}
                  ${isSelected ? 'selected' : ''}`}
                onClick={() =>
                  setSelectedDate(date)
                }
              >
                <span className="calendar-number">
                  {date.getDate()}
                </span>

                <div className="calendar-icons">
                  {dayEvents
                    .slice(0, 3)
                    .map((event) => (
                      <span key={event.id}>
                        {event.emoji || '📅'}
                      </span>
                    ))}
                </div>
              </button>
            );
          })}
        </div>

        <div className="calendar-events">
                    <div className="calendar-events-header">
            <h3>
              📋 Wydarzenia
            </h3>

            <span>
              {selectedDate.toLocaleDateString("pl-PL")}
            </span>
          </div>

          {selectedEvents.length === 0 && (
            <div className="calendar-empty-state">
              <h4>Brak wydarzeń</h4>

              <p>
                Na wybrany dzień nie dodano jeszcze
                żadnych wydarzeń.
              </p>
            </div>
          )}

          {selectedEvents.map((event) => {
            const date =
              event.date?.toDate?.() ??
              new Date(event.date);

            return (
              <article
                key={event.id}
                className="calendar-event-card"
              >
                <div className="calendar-event-top">

                  <div className="calendar-event-icon">
                    {event.emoji || "📅"}
                  </div>

                  <div className="calendar-event-info">
                    <h4>{event.title}</h4>

                    <span>
                      {event.type}
                    </span>
                  </div>

                </div>

                <div className="calendar-event-meta">

                  <p>
                    📅{" "}
                    {date.toLocaleDateString(
                      "pl-PL"
                    )}
                  </p>

                  {event.time && (
                    <p>
                      🕒 {event.time}
                    </p>
                  )}

                  {event.location && (
                    <p>
                      📍 {event.location}
                    </p>
                  )}

                  {event.recurring && (
                    <p>
                      🔁 Wydarzenie cykliczne
                    </p>
                  )}

                </div>

                {event.description && (
                  <div className="calendar-event-description">
                    {event.description}
                  </div>
                )}

                <div className="calendar-event-actions">

                  <button
                    className="edit-event-button"
                    onClick={() =>
                      onEdit(event)
                    }
                  >
                    ✏️ Edytuj
                  </button>

                  <button
                    className="delete-event-button"
                    onClick={() =>
                      onDelete(event.id)
                    }
                  >
                    🗑 Usuń
                  </button>

                </div>

              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
