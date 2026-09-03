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
    canOrder=true,
    expanded=false,
    onToggle
}){
    const [isEditing,setIsEditing]=useState(false);
    const [loading,setLoading]=useState(false);
    const [adminComment,setAdminComment]=useState(order?.adminComment||"");
    const [showDeleteDialog,setShowDeleteDialog]=useState(false);
    useEffect(()=>{
        setAdminComment(order?.adminComment||"");
    },[order]);
    if(!order){
        return null;
    }
    const isPending=order.status===ORDER_STATUS.PENDING;
    const isAccepted=order.status===ORDER_STATUS.ACCEPTED;
    const isCompleted=order.status===ORDER_STATUS.COMPLETED;
    async function handleAction(action){
        if(loading)return;
        try{
            setLoading(true);
            await action();
        }catch(error){
            console.error(error);
            alert("Nie udało się wykonać operacji.");
        }finally{
            setLoading(false);
        }
    }
    function handleAccept(){
        handleAction(()=>markOrderAsAccepted(order,adminComment));
    }
    function handleCompleted(){
        handleAction(()=>markOrderAsCompleted(order,adminComment));
    }
    function confirmDelete(){
        handleAction(async()=>{
            await deleteOrder(order);
            setShowDeleteDialog(false);
        });
    }
    function handleToggle(){
        if(onToggle){
            onToggle();
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
                onConfirm={confirmDelete}
                onCancel={()=>setShowDeleteDialog(false)}
            />
            <article
                className={`shopping-card ${selected?"selected":""} ${expanded?"expanded":""}`}
                onClick={handleToggle}
            >
                <div className="shopping-card-bar"/>
                <div className="shopping-card-content">
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
                                    onClick={e=>e.stopPropagation()}
                                />
                            )}
                            <h3>{order.product||"Brak nazwy"}</h3>
                            <p>{order.quantity||0} {order.unit||""}</p>
                        </div>
                    </div>
                    {expanded&&(
                        <div
                            className="shopping-card-footer"
                            onClick={e=>e.stopPropagation()}
                        >
                            <div className="shopping-card-footer-left">
                                <div className="shopping-meta">
                                    <div className="shopping-chip">📅 Dodano: {formatDate(order.createdAt)}</div>
                                    <div className="shopping-chip">✅ Przyjęto: {order.acceptedAt?formatDate(order.acceptedAt):"—"}</div>
                                    <div className="shopping-chip">📦 Zrealizowano: {order.completedAt?formatDate(order.completedAt):"—"}</div>
                                    <div className="shopping-chip">👤 {order.requestedBy||"—"}</div>
                                </div>
                                <textarea
                                    className="shopping-comment"
                                    rows={3}
                                    value={adminComment}
                                    placeholder="Komentarz administratora..."
                                    disabled={loading||isCompleted}
                                    onChange={e=>setAdminComment(e.target.value)}
                                    onClick={e=>e.stopPropagation()}
                                />
                                {order.adminComment&&(
                                    <div className="shopping-request-info">
                                        <strong>Komentarz administratora</strong>
                                        <p>{order.adminComment}</p>
                                    </div>
                                )}
                            </div>
                            <div className="shopping-actions">
                                {isPending&&(
                                    <button
                                        type="button"
                                        className="shopping-icon-btn success"
                                        data-tooltip="Przyjmij"
                                        disabled={loading}
                                        onClick={e=>{
                                            e.stopPropagation();
                                            handleAccept();
                                        }}
                                    >
                                        ✔
                                    </button>
                                )}
                                {isAccepted&&(
                                    <button
                                        type="button"
                                        className="shopping-icon-btn success"
                                        data-tooltip="Zrealizuj"
                                        disabled={loading}
                                        onClick={e=>{
                                            e.stopPropagation();
                                            handleCompleted();
                                        }}
                                    >
                                        ✓
                                    </button>
                                )}
                                {!isCompleted&&(
                                    <button
                                        type="button"
                                        className="shopping-icon-btn info"
                                        data-tooltip="Edytuj"
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
                                    data-tooltip="Usuń"
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
                    <button
                        type="button"
                        aria-expanded={expanded}
                        aria-label={expanded?"Zwiń szczegóły":"Rozwiń szczegóły"}
                        onClick={e=>{
                            e.stopPropagation();
                            handleToggle();
                        }}
                    >
                        {expanded?"▲":"▼"}
                    </button>
                </div>
            </article>
        </>
    );
}
