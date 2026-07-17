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

export default function CalendarHeader({
  currentDate,
  onPrev,
  onNext,
  onToday,
}) {
  return (
    <header className="calendar-header">
      <button
        type="button"
        className="calendar-nav-button"
        onClick={onPrev}
        aria-label="Poprzedni miesiąc"
      >
        ←
      </button>

      <div className="calendar-title">
        <span className="calendar-title-icon" aria-hidden="true">
          📅
        </span>

        <div>
          <h2>
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>

          <small>Wybierz dzień, aby zobaczyć wydarzenia</small>
        </div>
      </div>

      <div className="calendar-actions">
        <button
          type="button"
          className="today-button"
          onClick={onToday}
        >
          Dzisiaj
        </button>

        <button
          type="button"
          className="calendar-nav-button"
          onClick={onNext}
          aria-label="Następny miesiąc"
        >
          →
        </button>
      </div>
    </header>
  );
}
