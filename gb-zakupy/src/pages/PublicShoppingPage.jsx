import PublicHeader from "../components/public/PublicHeader";
import ShoppingForm from "../components/public/ShoppingForm";
import CurrentShoppingList from "../components/public/CurrentShoppingList";

import { usePublicOrders } from "../hooks/usePublicOrders";



export default function PublicShoppingPage({
  goBack,
}) {


  const {
    orders,
    loading
  } = usePublicOrders();





  return (

    <main className="public-page">



      <button

        className="back-home-button"

        onClick={goBack}

      >

        ← Menu główne

      </button>







      <section className="paper">



        <div className="holes">

          {Array.from(
            { length: 12 }
          ).map((_, index) => (

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
