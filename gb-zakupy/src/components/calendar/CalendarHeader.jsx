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
        className="calendar-nav-button"
        onClick={onPrev}
        aria-label="Poprzedni miesiąc"
      >
        ←
      </button>

      <div className="calendar-title">

        <span className="calendar-title-icon">
          📅
        </span>

        <div>

          <h2>
            {MONTHS[currentDate.getMonth()]}
          </h2>

          <small>
            {currentDate.getFullYear()}
          </small>

        </div>

      </div>

      <div className="calendar-actions">

        <button
          className="today-button"
          onClick={onToday}
        >
          Dzisiaj
        </button>

        <button
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
