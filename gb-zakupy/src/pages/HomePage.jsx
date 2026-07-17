export default function HomePage({
  goToShopping,
  goToCalendar,
  goToAdmin,
}) {


  return (

    <main className="home-page">


      <section className="home-container">



        <div className="home-header">


          <div className="home-logo">
            📦
          </div>



          <h1>
            GB sP. z o.o.
          </h1>



          <p>
            Wybierz, z którego modułu chcesz skorzystać
          </p>


        </div>








        <div className="home-options">





          <button

            type="button"

            className="home-card"

            onClick={goToShopping}

          >

            <div className="home-card-icon">
              📋
            </div>



            <div>

              <h2>
                Lista zakupowa
              </h2>



              <p>
                Sprawdź aktualne potrzeby zakupowe firmy
              </p>


            </div>


          </button>









          <button

            type="button"

            className="home-card"

            onClick={goToCalendar}

          >

            <div className="home-card-icon">
              📅
            </div>



            <div>

              <h2>
                Kalendarz GB
              </h2>



              <p>
                Święta, wydarzenia i spotkania firmowe
              </p>


            </div>


          </button>









          <button

            type="button"

            className="home-card home-card-admin"

            onClick={goToAdmin}

          >

            <div className="home-card-icon">
              👤
            </div>



            <div>

              <h2>
                Panel admina
              </h2>



              <p>
                Zarządzanie zamówieniami i wydarzeniami
              </p>


            </div>


          </button>







        </div>





      </section>



    </main>

  );

}
