import { useState } from "react";

import EmptyState from "../shared/EmptyState";
import ShoppingListItem from "./ShoppingListItem";





export default function CurrentShoppingList({
  items = [],
  loading
}) {



  const [expanded,setExpanded] = useState(false);







  return (


    <section className="current-list-wrapper">







      <div className="current-list-header">



        <h2>
          Aktualna lista zakupowa
        </h2>







        {
          items.length > 1 && (


            <button

              className="expand-list-button"

              onClick={()=>
                setExpanded(prev => !prev)
              }

            >


              {
                expanded
                ?
                "Zwiń listę ↑"
                :
                "Rozwiń całą listę ↓"
              }


            </button>


          )
        }



      </div>









      {
        loading && (

          <EmptyState>
            Ładowanie listy...
          </EmptyState>

        )
      }









      {
        !loading &&
        items.length === 0 && (

          <EmptyState>
            Aktualna lista zakupowa jest pusta.
          </EmptyState>

        )
      }









      {
        !loading &&
        items.length > 0 && (


          <div

            className={
              expanded
              ?
              "shopping-list expanded"
              :
              "shopping-list collapsed"
            }

          >




            {
              items.map((item,index)=>(


                <div

                  key={item.id}

                  className="shopping-wave-item"

                  style={{
                    "--delay":
                    `${index * 50}ms`
                  }}

                >


                  <ShoppingListItem

                    item={item}

                  />


                </div>


              ))
            }





          </div>


        )
      }






    </section>


  );

}
