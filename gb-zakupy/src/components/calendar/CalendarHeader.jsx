const MONTHS = [
  "STYCZEŃ",
  "LUTY",
  "MARZEC",
  "KWIECIEŃ",
  "MAJ",
  "CZERWIEC",
  "LIPIEC",
  "SIERPIEŃ",
  "WRZESIEŃ",
  "PAŹDZIERNIK",
  "LISTOPAD",
  "GRUDZIEŃ",
];


export default function CalendarHeader({
  currentDate,
  onPrev,
  onNext,
  onToday,
}) {

  return (
    <header className="calendar-header">

      <div className="calendar-header-top">


        <div className="calendar-year">

          {currentDate.getFullYear()}

        </div>



        <h1 className="calendar-month">

          {MONTHS[currentDate.getMonth()]}

        </h1>



        <div className="calendar-divider">

          <span></span>

          <div className="calendar-divider-icon">
            ⚙
          </div>

          <span></span>

        </div>


      </div>



      <div className="calendar-navigation">


        <button
          type="button"
          className="calendar-nav-button"
          onClick={onPrev}
          aria-label="Poprzedni miesiąc"
        >

          ←

        </button>



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
