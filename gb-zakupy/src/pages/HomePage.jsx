import Ferrofluid from "../components/shared/effects/Ferrofluid";


export default function HomePage({
  goToShopping,
  goToCalendar,
  goToAdmin,
}) {


  return (


    <main className="home-page">



      {/* ANIMOWANE TŁO */}

      <div className="home-background">


        <Ferrofluid

          colors={[
            "#012A4A",
            "#013A63",
            "#01497C",
            "#014F86",
            "#2A6F97",
            "#2C7DA0",
            "#468FAF"
          ]}


          speed={0.22}


          scale={1.7}


          turbulence={0.9}


          fluidity={0.12}


          rimWidth={0.25}


          sharpness={2.2}


          shimmer={1.8}


          glow={2.5}


          flowDirection="down"


          opacity={0.75}


          mouseInteraction={true}


          mouseStrength={1}


          mouseRadius={0.35}


        />


      </div>







      <section className="home-container">





        <div className="home-header">



          <div className="home-logo">

            📦

          </div>





          <h1>

            GB Sp. z o.o.

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

                Obsługa zamówień na artykuły biurowe i wyposażenie

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

                Kalendarz GB — Święta, wydarzenia i spotkania firmowe

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
