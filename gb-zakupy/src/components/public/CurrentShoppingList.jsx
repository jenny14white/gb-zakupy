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


    const element =
      listRef.current;


    if(!element) return;



    function handleScroll(){


      const cards =
        element.querySelectorAll(
          ".shopping-wave-item"
        );



      cards.forEach((card,index)=>{


        const rect =
          card.getBoundingClientRect();


        const center =
          window.innerHeight / 2;


        const distance =
          rect.top - center;



        const wave =
          Math.max(
            -8,
            Math.min(
              8,
              distance / 80
            )
          );



        card.style.transform =
          `
          translateY(
            ${wave}px
          )
          `;


      });


    }



    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive:true
      }
    );


    handleScroll();



    return ()=>{

      window.removeEventListener(
        "scroll",
        handleScroll
      );

    };


  },[items,expanded]);









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

              onClick={()=>
                setExpanded(!expanded)
              }

            >

              {
                expanded
                ?
                "Zwiń listę ↑"
                :
                "Rozwiń listę ↓"
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
            "shopping-list"
          }

        >


          {
            items.map((item,index)=>(


              <div

                key={item.id}

                className="shopping-wave-item"

                style={{
                  transitionDelay:
                  `${index*30}ms`
                }}

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
