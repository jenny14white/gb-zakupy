import { useState } from 'react';
import Calendar from '../components/calendar/Calendar';

export default function CalendarPage({ goBack }) {
  const [year] = useState(new Date().getFullYear());

  return (
    <main className="calendar-page">

      <header className="calendar-page-header">

        <button
          className="back-button"
          onClick={goBack}
        >
          ← Powrót do zakupów
        </button>

        <div>

          <p className="calendar-eyebrow">
            GB Zakupy
          </p>

          <h1>
            📅 Kalendarz firmowy
          </h1>

          <p className="calendar-description">
            Tutaj znajdziesz święta państwowe, nietypowe święta,
            wydarzenia firmowe oraz spotkania.
          </p>

        </div>

      </header>

      <Calendar year={year} />

    </main>
  );
}
