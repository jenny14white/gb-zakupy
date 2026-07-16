import { useMemo, useState } from 'react';
import CalendarHeader from './CalendarHeader';

export default function Calendar() {

  const [currentDate, setCurrentDate] = useState(
    new Date()
  );

  function previousMonth() {

    setCurrentDate((date) =>
      new Date(
        date.getFullYear(),
        date.getMonth() - 1,
        1
      )
    );

  }

  function nextMonth() {

    setCurrentDate((date) =>
      new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        1
      )
    );

  }

  function today() {

    setCurrentDate(new Date());

  }

  return (
    <>

      <CalendarHeader
        currentDate={currentDate}
        onPrev={previousMonth}
        onNext={nextMonth}
        onToday={today}
      />

      <div className="calendar-coming">

        🚧

        Widok kalendarza powstaje...

      </div>

    </>
  );

}
