import {useEffect,useState} from "react";
import {deleteOrder,markOrderAsAccepted,markOrderAsCompleted} from "../../services/ordersService";
import {ORDER_STATUS} from "../../utils/constants";
import {formatDate} from "../../utils/dateUtils";
import AdminOrderEditForm from "./AdminOrderEditForm";
import ConfirmDialog from "../shared/ConfirmDialog";
import "../../styles/admin-shopping.css";
export default function AdminOrderCard({order,selected=false,onSelect,canOrder=true,expanded=false,onToggle}){
    const [isEditing,setIsEditing]=useState(false);
    const [loading,setLoading]=useState(false);
    const [adminComment,setAdminComment]=useState(order?.adminComment||"");
    const [showDeleteDialog,setShowDeleteDialog]=useState(false);
    useEffect(()=>{
        setAdminComment(order?.adminComment||"");
    },[order]);
    if(!order)return null;
    const isPending=order.status===ORDER_STATUS.PENDING;
    const isAccepted=order.status===ORDER_STATUS.ACCEPTED;
    const isCompleted=order.status===ORDER_STATUS.COMPLETED;
    const statusClass=isPending?"pending":isAccepted?"progress":isCompleted?"done":"cancelled";
    const statusLabel=isPending?"Oczekujące":isAccepted?"Przyjęte":isCompleted?"Zrealizowane":"Anulowane";
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
        if(onToggle)onToggle();
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
                className={`shopping-card ${statusClass} ${selected?"selected":""} ${expanded?"expanded":""}`}
                onClick={handleToggle}
            >
                <div className="shopping-main">
                    <div className="shopping-status-summary">
                        <span className={`shopping-status-dot ${statusClass}`}/>
                        <strong>{statusLabel}</strong>
                    </div>
                    <div className="shopping-summary">
                        <div className="shopping-summary-product">
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
                            <span>{order.product||"Brak nazwy"}</span>
                        </div>
                        <div className="shopping-summary-meta">
                            <span>📦 {order.quantity||0} {order.unit||""}</span>
                            <span>👤 {order.requestedBy||"—"}</span>
                            <span>🕐 {formatDate(order.createdAt)}</span>
                        </div>
                    </div>
                    <div className="shopping-expand">
                        <span>{expanded?"Zwiń":"Szczegóły"}</span>
                        <span className={`shopping-chevron ${expanded?"open":""}`}>↓</span>
                    </div>
                </div>
                {expanded&&(
                    <div
                        className="shopping-details"
                        onClick={e=>e.stopPropagation()}
                    >
                        <div className="shopping-details-grid">
                            <div className="shopping-detail">
                                <span className="shopping-detail-label">Produkt</span>
                                <strong>{order.product||"Brak nazwy"}</strong>
                            </div>
                            <div className="shopping-detail">
                                <span className="shopping-detail-label">Ilość</span>
                                <strong>{order.quantity||0} {order.unit||""}</strong>
                            </div>
                            <div className="shopping-detail">
                                <span className="shopping-detail-label">Dodane przez</span>
                                <strong>{order.requestedBy||"—"}</strong>
                            </div>
                            <div className="shopping-detail">
                                <span className="shopping-detail-label">Data zgłoszenia</span>
                                <strong>{formatDate(order.createdAt)}</strong>
                            </div>
                            <div className="shopping-detail">
                                <span className="shopping-detail-label">Przyjęto</span>
                                <strong>{order.acceptedAt?formatDate(order.acceptedAt):"—"}</strong>
                            </div>
                            <div className="shopping-detail">
                                <span className="shopping-detail-label">Zrealizowano</span>
                                <strong>{order.completedAt?formatDate(order.completedAt):"—"}</strong>
                            </div>
                            {order.adminComment&&(
                                <div className="shopping-detail">
                                    <span className="shopping-detail-label">Komentarz administratora</span>
                                    <strong>{order.adminComment}</strong>
                                </div>
                            )}
                        </div>
                        <div className="shopping-details-bottom">
                            <div className="shopping-card-footer-left">
                                <textarea
                                    className="shopping-comment"
                                    rows={3}
                                    value={adminComment}
                                    placeholder="Komentarz administratora..."
                                    disabled={loading||isCompleted}
                                    onChange={e=>setAdminComment(e.target.value)}
                                    onClick={e=>e.stopPropagation()}
                                />
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
                    </div>
                )}
            </article>
        </>
    );
}
