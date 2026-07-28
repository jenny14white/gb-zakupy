import {useEffect,useMemo,useState} from "react";
import AdminOrderCard from "./AdminOrderCard";

export default function AdminMonthGroup({
month,
orders=[],
autoOpen=false,
selectedOrders=[],
onToggleOrder,
onToggleMonth
}){

const [isOpen,setIsOpen]=useState(autoOpen);


const safeOrders=useMemo(
()=>orders.filter(Boolean),
[orders]
);


useEffect(()=>{

if(autoOpen){
setIsOpen(true);
}

},[autoOpen]);



const orderIds=safeOrders.map(
order=>order.id
);


const selectedCount=orderIds.filter(
id=>selectedOrders.includes(id)
).length;


const monthSelected=
safeOrders.length>0 &&
selectedCount===safeOrders.length;


const monthPartial=
selectedCount>0 &&
selectedCount<safeOrders.length;



function handleCheckbox(e){

e.stopPropagation();

if(onToggleMonth){
onToggleMonth(
safeOrders
);
}

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
v=>!v
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
className={
`month-select ${
monthSelected
?"checked"
:""
} ${
monthPartial
?"partial"
:""
}`
}
checked={monthSelected}
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

{safeOrders.length} zamówień

{
selectedCount>0 &&
` • wybrane ${selectedCount}/${safeOrders.length}`
}

</span>


</div>


</div>



<div className="shopping-count">

{safeOrders.length}

</div>


</button>



{
isOpen&&(

<div className="shopping-category-body">


{
safeOrders.map(order=>(

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
onToggleOrder &&
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
