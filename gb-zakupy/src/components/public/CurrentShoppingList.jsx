import { useState, useEffect, useRef } from "react";

import EmptyState from "../shared/EmptyState";
import ShoppingListItem from "./ShoppingListItem";



export default function CurrentShoppingList({
  items,
  loading
}) {


  const [expanded,setExpanded] = useState(false);

  const listRef = useRef(null);





  useEffect(()=>{


    if(!expanded) return;


    const cards =
      listRef.current?.querySelectorAll(
        ".shopping-wave-item"
      );


    if(!cards) return;



    cards.forEach((card,index)=>{


      card.style.animationDelay =
        `${index * 40}ms`;


    });


  },[expanded]);








  return (


    <section className="current-list-wrapper">





      <div className="current-list-header">


        <h2>
          Aktualna lista zakupowa
        </h2>




        {
          items.length > 3 && (

            <button

              className="expand-list-button"

              onClick={()=>setExpanded(!expanded)}

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








      {loading && (

        <EmptyState>
          Ładowanie listy...
        </EmptyState>

      )}









      {!loading && items.length===0 && (

        <EmptyState>
          Aktualna lista zakupowa jest pusta.
        </EmptyState>

      )}









      {!loading && items.length>0 && (


        <div

          ref={listRef}

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

              >


                <ShoppingListItem

                  item={item}

                />


              </div>


            ))
          }





        </div>


      )}




    </section>


  );

}
