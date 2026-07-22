import { useState } from "react";

import Calendar from "../components/calendar/Calendar";


export default function CalendarPage({
  goBack,
}) {


  const [year] = useState(
    new Date().getFullYear()
  );



  return (


    <main className="calendar-page">





      <header className="calendar-page-header">





        <button

          type="button"

          className="back-button"

          onClick={goBack}

        >

          ← Menu główne

        </button>








        <div className="calendar-title-box">



          <p className="calendar-eyebrow">

            GB Portal

          </p>





          <h1>

            Kalendarz firmowy

          </h1>





          <p className="calendar-description">

            Święta, wydarzenia oraz spotkania firmowe.

          </p>





        </div>






      </header>








      <section className="calendar-layout">


        <Calendar

          year={year}

        />


      </section>







    </main>


  );

}
