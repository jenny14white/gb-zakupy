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
      <button onClick={onPrev}>
        ←
      </button>

      <h2>
        {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
      </h2>

      <button onClick={onNext}>
        →
      </button>

      <button
        className="today-button"
        onClick={onToday}
      >
        Dzisiaj
      </button>
    </header>
  );
}
