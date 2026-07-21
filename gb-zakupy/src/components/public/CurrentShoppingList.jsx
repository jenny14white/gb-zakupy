import EmptyState from '../shared/EmptyState';
import ShoppingListItem from './ShoppingListItem';

import ScrollStack, {
  ScrollStackItem
} from '../shared/effects/ScrollStack';





export default function CurrentShoppingList({
  items,
  loading
}) {


  return (


    <section className="current-list-wrapper">


      <h2>
        Aktualna lista zakupowa
      </h2>





      {loading && (

        <EmptyState>
          Ładowanie listy...
        </EmptyState>

      )}







      {!loading && items.length === 0 && (

        <EmptyState>
          Aktualna lista zakupowa jest pusta.
        </EmptyState>

      )}







      {!loading && items.length > 0 && (


        <ScrollStack


          itemDistance={60}


          itemStackDistance={35}


          stackPosition="20%"


          baseScale={0.92}


          itemScale={0.02}


          rotationAmount={0}


          blurAmount={0}


          useWindowScroll={true}


        >



          {
            items.map((item)=>(


              <ScrollStackItem

                key={item.id}

              >



                <ShoppingListItem

                  item={item}

                />



              </ScrollStackItem>



            ))
          }




        </ScrollStack>


      )}



    </section>


  );

}
