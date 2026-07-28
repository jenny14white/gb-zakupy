import {useMemo,useState} from "react";
import * as XLSX from "xlsx";

import EmptyState from "../shared/EmptyState";
import AdminMonthGroup from "./AdminMonthGroup";

import {groupOrdersByOrderedMonth} from "../../utils/orderUtils";
import {formatDate} from "../../utils/dateUtils";
import {ORDER_STATUS} from "../../utils/constants";


function normalize(text=""){
return text
.toLowerCase()
.normalize("NFD")
.replace(/[\u0300-\u036f]/g,"")
.replace(/ł/g,"l");
}


export default function AdminCompletedList({
orders=[]
}){

const [search,setSearch]=useState("");
const [selectedOrders,setSelectedOrders]=useState([]);



const completedOrders=useMemo(
()=>orders.filter(
order=>order.status===ORDER_STATUS.COMPLETED
),
[orders]
);



const filteredGroups=useMemo(()=>{

const groups=groupOrdersByOrderedMonth(
completedOrders
);

const phrase=normalize(
search.trim()
);


if(!phrase){
return groups;
}


return groups
.map(group=>({

...group,

items:group.items.filter(order=>

normalize(order.product).includes(phrase)

||

normalize(order.requestedBy).includes(phrase)

||

normalize(
order.adminComment||""
).includes(phrase)

)

}))

.filter(
group=>group.items.length
);


},[
completedOrders,
search
]);



function toggleOrder(id){

setSelectedOrders(prev=>

prev.includes(id)

?

prev.filter(
item=>item!==id
)

:

[
...prev,
id
]

);

}



function toggleMonth(items){

const ids=items.map(
item=>item.id
);


const allSelected=
ids.every(
id=>selectedOrders.includes(id)
);



if(allSelected){

setSelectedOrders(prev=>
prev.filter(
id=>!ids.includes(id)
)
);

}else{

setSelectedOrders(prev=>[
...new Set([
...prev,
...ids
])
]);

}

}



function exportToExcel(){


const selected=completedOrders.filter(
order=>
selectedOrders.includes(order.id)
);


if(!selected.length){

alert(
"Zaznacz dane do eksportu."
);

return;

}



const rows=selected.map(order=>({

Produkt:
order.product,

Ilość:
order.quantity,

Jednostka:
order.unit,

Zgłaszający:
order.requestedBy,

Status:
"Zrealizowane",

"Data dodania":
formatDate(
order.createdAt
),

"Data zamówienia":
formatDate(
order.orderedAt
),

"Data realizacji":
formatDate(
order.completedAt
),

"Miesiąc":
new Date(
order.orderedAt
).toLocaleDateString(
"pl-PL",
{
month:"long",
year:"numeric"
}
),

"Komentarz admina":
order.adminComment||""

}));



const workbook=
XLSX.utils.book_new();


XLSX.utils.book_append_sheet(
workbook,
XLSX.utils.json_to_sheet(rows),
"Zrealizowane"
);



const date=
new Date()
.toISOString()
.split("T")[0];



XLSX.writeFile(
workbook,
`GB_Zrealizowane_${date}.xlsx`
);

}



return(

<section className="admin-completed-list">


<div className="admin-list-header">

<div>

<h2>
✅ Zrealizowane
</h2>

<p>
Łącznie:
{completedOrders.length}
&nbsp;|&nbsp;
Wybrane:
{selectedOrders.length}
</p>

</div>


<button
className="admin-button"
disabled={!selectedOrders.length}
onClick={exportToExcel}
>

📊 Eksport Excel
{selectedOrders.length>0 &&
` (${selectedOrders.length})`
}

</button>


</div>



<input

className="search-input"

type="text"

placeholder="🔍 Szukaj produktu, osoby lub komentarza..."

value={search}

onChange={e=>
setSearch(
e.target.value
)
}

/>



{
!filteredGroups.length

?

<EmptyState>

{
search
?
"Nie znaleziono żadnych zrealizowanych zamówień."

:

"Nie ma jeszcze zrealizowanych zamówień."
}

</EmptyState>


:

<div className="completed-months">

{
filteredGroups.map(group=>(

<AdminMonthGroup

key={group.month}

month={group.month}

orders={group.items}

selectedOrders={selectedOrders}

onToggleOrder={toggleOrder}

onToggleMonth={toggleMonth}

autoOpen={
Boolean(search)
}

/>

))
}

</div>

}


</section>

);

}
