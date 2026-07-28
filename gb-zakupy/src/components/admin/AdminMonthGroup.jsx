import {useEffect,useState} from "react";

import AdminOrderCard from "./AdminOrderCard";

import "../../styles/admin-shopping.css";


export default function AdminMonthGroup({
month,
orders=[],
autoOpen=false,
selectedOrders=[],
onToggleOrder,
onToggleMonth
}){


const [isOpen,setIsOpen]=useState(
autoOpen
);



useEffect(()=>{

if(autoOpen){
setIsOpen(true);
}

},[
autoOpen
]);



const orderIds=orders.map(
order=>order.id
);



const selectedCount=
orderIds.filter(
id=>selectedOrders.includes(id)
).length;



const monthSelected=
orders.length>0 &&
selectedCount===orders.length;



function handleCheckbox(e){

e.stopPropagation();

onToggleMonth(
orders
);

}



return(

<section
className={
`shopping-category ${
isOpen
?"open"
:"closed"
}`
}
>



<button

type="button"

className="shopping-category-header"

onClick={()=>
setIsOpen(
value=>!value
)
}

>



<div className="shopping-category-left">



<div className="shopping-chevron">

{
isOpen
?"▼"
:"▶"
}

</div>




<input

type="checkbox"

checked={
monthSelected
}

onChange={handleCheckbox}

onClick={e=>
e.stopPropagation()
}

/>




<div className="shopping-category-title">


<h2>
{month}
</h2>


<span>

{
orders.length
}
 zamówień

{
selectedCount>0 &&
` • wybrane ${selectedCount}`
}

</span>


</div>



</div>





<div className="shopping-count">

{
orders.length
}

</div>



</button>





{
isOpen && (

<div className="shopping-category-body">


{
orders.map(order=>(

<AdminOrderCard

key={order.id}

order={order}

canOrder={false}

selected={
selectedOrders.includes(
order.id
)
}

onSelect={()=> 
onToggleOrder(
order.id
)
}

/>

))
}



</div>

)

}



</section>

);

}
