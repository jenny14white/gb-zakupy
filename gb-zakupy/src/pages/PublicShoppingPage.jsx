import PublicHeader from "../components/public/PublicHeader";
import ShoppingForm from "../components/public/ShoppingForm";
import CurrentShoppingList from "../components/public/CurrentShoppingList";

import { usePublicOrders } from "../hooks/usePublicOrders";


export default function PublicShoppingPage({
  goToAdmin,
  goToCalendar,
  goBack,
}) {


  const {
    orders,
    loading
  } = usePublicOrders();




  return (

    <main className="public-page">



      <div className="top-actions">


        <button

          className="calendar-button"

          onClick={goToCalendar}

        >

          <span className="action-icon">
            📅
          </span>


          <div className="action-content">

            <strong>
              Kalendarz firmowy
            </strong>


            <span>
              Sprawdź wydarzenia,
              urlopy i urodziny
            </span>


          </div>


        </button>






        <button

          className="admin-button-top"

          onClick={goToAdmin}

        >


          <span className="action-icon">
            👤
          </span>



          <div className="action-content">


            <strong>
              Panel admina
            </strong>


            <span>
              Zarządzaj zamówieniami
            </span>


          </div>


        </button>



      </div>








      <button

        className="back-home-button"

        onClick={goBack}

      >

        ← Menu główne

      </button>








      <section className="paper">



        <div className="holes">

          {Array.from(
            { length:12 }
          ).map((_,index)=>(

            <span
              key={index}
            />

          ))}


        </div>





        <PublicHeader />



        <ShoppingForm />



        <CurrentShoppingList

          items={orders}

          loading={loading}

        />





        <p className="thanks">

          Dziękujemy! ♡

        </p>





      </section>



    </main>

  );

}
