import { useMemo, useState } from 'react';
import CalendarHeader from './CalendarHeader';
import { getAllCalendarEvents } from '../../utils/calendarUtils';

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

  const events = useMemo(
    () => getAllCalendarEvents(currentDate.getFullYear()),
    [currentDate]
  );

  function previousMonth() {
    setCurrentDate((date) =>
      new Date(date.getFullYear(), date.getMonth() - 1, 1)
    );
  }

  function nextMonth() {
    setCurrentDate((date) =>
      new Date(date.getFullYear(), date.getMonth() + 1, 1)
    );
  }

  function today() {
    setCurrentDate(new Date());
  }

  return (
    <div className="calendar-wrapper">

      <CalendarHeader
        currentDate={currentDate}
        onPrev={previousMonth}
        onNext={nextMonth}
        onToday={today}
      />

      <div className="calendar-month-title">
        {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
      </div>

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

        <div className="calendar-placeholder">

          🚧

          <h3>Kalendarz w budowie</h3>

          <p>
            W następnym kroku pojawi się pełny widok miesięczny,
            święta, wydarzenia oraz spotkania firmowe.
          </p>

          <p>

            Aktualnie znaleziono

            <strong>
              {' '}
              {events.length}
            </strong>

            {' '}wydarzeń dla roku{' '}

            <strong>
              {currentDate.getFullYear()}
            </strong>

          </p>

        </div>

      </div>

    </div>
  );
}
