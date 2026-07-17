import { useEffect, useMemo, useState } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarDay from './CalendarDay';
import EventCard from './EventCard';

import { listenToEvents } from '../../services/calendarService';
import {
  getAllCalendarEvents,
  getEventsForDate,
} from '../../utils/calendarUtils';

const WEEK_DAYS = [
  'Pon',
  'Wt',
  'Śr',
  'Czw',
  'Pt',
  'Sob',
  'Ndz',
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [companyEvents, setCompanyEvents] = useState([]);

  useEffect(() => {
    const unsubscribe = listenToEvents(setCompanyEvents);
    return unsubscribe;
  }, []);

  const holidays = useMemo(() => {
    return getAllCalendarEvents(currentDate.getFullYear());
  }, [currentDate]);

  const events = useMemo(() => {
    return [...holidays, ...companyEvents];
  }, [holidays, companyEvents]);

  function previousMonth() {
    setCurrentDate(
      (date) =>
        new Date(
          date.getFullYear(),
          date.getMonth() - 1,
          1
        )
    );
  }

  function nextMonth() {
    setCurrentDate(
      (date) =>
        new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          1
        )
    );
  }

  function today() {
    const now = new Date();

    setCurrentDate(now);
    setSelectedDate(now);
  }

  function handleDayClick(day) {
    setSelectedDate(day);
  }

  const selectedEvents = getEventsForDate(
    selectedDate,
    events
  );

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);

    const startOffset =
      (firstDay.getDay() + 6) % 7;

    const startDate = new Date(
      year,
      month,
      1 - startOffset
    );

    return Array.from(
      { length: 42 },
      (_, index) => {
        const day = new Date(startDate);

        day.setDate(
          startDate.getDate() + index
        );

        return {
          date: day,
          events: getEventsForDate(
            day,
            events
          ),
          isCurrentMonth:
            day.getMonth() === month,
          isToday:
            day.toDateString() ===
            new Date().toDateString(),
          isSelected:
            day.toDateString() ===
            selectedDate.toDateString(),
        };
      }
    );
  }, [currentDate, selectedDate, events]);

  return (
    <div className="calendar-page">

      <div className="calendar-page-header">

        <div>

          <p className="calendar-eyebrow">
            GB Zakupy
          </p>

          <h1>
            📅 Kalendarz firmowy
          </h1>

          <p className="calendar-description">
            Tutaj znajdziesz święta państwowe,
            nietypowe święta, wydarzenia
            firmowe oraz spotkania.
          </p>

        </div>

      </div>

      <div className="calendar-wrapper">

        <CalendarHeader
          currentDate={currentDate}
          onPrev={previousMonth}
          onNext={nextMonth}
          onToday={today}
        />

        <div className="calendar-weekdays">
          {WEEK_DAYS.map((day) => (
            <div
              key={day}
              className="calendar-weekday"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {calendarDays.map(
            ({
              date,
              events,
              isToday,
              isCurrentMonth,
              isSelected,
            }) => (
              <CalendarDay
                key={date.toISOString()}
                day={date}
                events={events}
                isToday={isToday}
                isCurrentMonth={isCurrentMonth}
                isSelected={isSelected}
                onClick={handleDayClick}
              />
            )
          )}
        </div>

        <aside className="calendar-sidebar">

          <h3 className="selected-day">
            📅{' '}
            {selectedDate.toLocaleDateString(
              'pl-PL',
              {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }
            )}
          </h3>

          {selectedEvents.length === 0 ? (
            <p>Brak wydarzeń.</p>
          ) : (
            selectedEvents.map((event) => (
              <EventCard
                key={
                  event.id ??
                  `${event.title}-${event.date}`
                }
                event={event}
              />
            ))
          )}

        </aside>

      </div>

    </div>
  );
}
