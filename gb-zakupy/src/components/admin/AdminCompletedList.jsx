import {useEffect,useState} from "react";
import {deleteOrder,markOrderAsAccepted,markOrderAsCompleted} from "../../services/ordersService";
import {ORDER_STATUS} from "../../utils/constants";
import {formatDate} from "../../utils/dateUtils";
import AdminOrderEditForm from "./AdminOrderEditForm";
import ConfirmDialog from "../shared/ConfirmDialog";
import "../../styles/admin-shopping.css";

export default function AdminOrderCard({
order,
selected=false,
onSelect,
canOrder=true
}){

if(!order){
return null;
}

const [expanded,setExpanded]=useState(false);
const [isEditing,setIsEditing]=useState(false);
const [loading,setLoading]=useState(false);
const [adminComment,setAdminComment]=useState(order.adminComment||"");
const [showDeleteDialog,setShowDeleteDialog]=useState(false);


useEffect(()=>{
setAdminComment(order.adminComment||"");
},[order]);


const isPending=order.status===ORDER_STATUS.PENDING;
const isAccepted=order.status===ORDER_STATUS.ACCEPTED;
const isCompleted=order.status===ORDER_STATUS.COMPLETED;


const statusClass=
isPending
?"pending"
:isAccepted
?"progress"
:"done";


const statusText=
isPending
?"🟡 Oczekujące"
:isAccepted
?"🟢 Przyjęte"
:"🟣 Zrealizowane";


async function action(fn){

if(loading)
return;

try{

setLoading(true);
await fn();

}catch(e){

console.error(e);

alert(
"Nie udało się wykonać operacji."
);

}finally{

setLoading(false);

}

}



if(isEditing){

return(
<AdminOrderEditForm
order={order}
onCancel={()=>setIsEditing(false)}
onSaved={()=>setIsEditing(false)}
/>
);

}



return(
<>

<ConfirmDialog
open={showDeleteDialog}
danger
title="Usunąć zamówienie?"
message={`Czy na pewno chcesz usunąć "${order.product||""}"?\n\nTej operacji nie można cofnąć.`}
confirmText="Usuń"
cancelText="Anuluj"
onConfirm={()=>action(async()=>{

await deleteOrder(order);

setShowDeleteDialog(false);

})}
onCancel={()=>setShowDeleteDialog(false)}
/>


<article className={`shopping-card ${selected?"selected":""}`}>

<div className="shopping-card-bar"/>


<div
className="shopping-card-content"
onClick={()=>setExpanded(v=>!v)}
>


<div className="shopping-card-top">


<div className="shopping-product">


{onSelect&&(

<input
type="checkbox"
className="shopping-select"
checked={selected}
onChange={e=>{

e.stopPropagation();

onSelect(order.id);

}}
onClick={e=>
e.stopPropagation()
}
/>

)}


<h3>
{order.product||"Brak nazwy"}
</h3>


<p>
{order.quantity||0} {order.unit||""}
</p>


</div>


</div>



{expanded&&(

<div className="shopping-card-footer">


<div className="shopping-card-footer-left">


<div className="shopping-meta">


<div className="shopping-chip">
📅 Dodano: {formatDate(order.createdAt)}
</div>


<div className="shopping-chip">
✅ Przyjęto: {order.acceptedAt?formatDate(order.acceptedAt):"—"}
</div>


<div className="shopping-chip">
📦 Zrealizowano: {order.completedAt?formatDate(order.completedAt):"—"}
</div>


<div className="shopping-chip">
👤 {order.requestedBy||"—"}
</div>


</div>



<textarea
className="shopping-comment"
rows={3}
value={adminComment}
placeholder="Komentarz administratora..."
disabled={loading||isCompleted}
onChange={e=>
setAdminComment(
e.target.value
)
}
/>



{order.adminComment&&(

<div className="shopping-request-info">

<strong>
Komentarz administratora
</strong>

<p>
{order.adminComment}
</p>

</div>

)}


</div>




<div className="shopping-actions">



{isPending&&(

<button
type="button"
className="shopping-icon-btn success"
disabled={loading}
onClick={e=>{

e.stopPropagation();

action(()=>
markOrderAsAccepted(
order,
adminComment
)
);

}}
>
✔
</button>

)}



{isAccepted&&(

<button
type="button"
className="shopping-icon-btn success"
disabled={loading}
onClick={e=>{

e.stopPropagation();

action(()=>
markOrderAsCompleted(
order,
adminComment
)
);

}}
>
✓
</button>

)}



{!isCompleted&&(

<button
type="button"
className="shopping-icon-btn info"
disabled={loading}
onClick={e=>{

e.stopPropagation();

setIsEditing(true);

}}
>
✏️
</button>

)}



<button
type="button"
className="shopping-icon-btn danger"
disabled={loading}
onClick={e=>{

e.stopPropagation();

setShowDeleteDialog(true);

}}
>
🗑
</button>



</div>


</div>

)}


</div>




<div className="shopping-card-right">


<div className={`shopping-status ${statusClass}`}>
{statusText}
</div>



<button
type="button"
className="shopping-icon-btn"
onClick={e=>{

e.stopPropagation();

setExpanded(v=>!v);

}}
>
{expanded?"▲":"▼"}
</button>


</div>



</article>


</>

);

}
