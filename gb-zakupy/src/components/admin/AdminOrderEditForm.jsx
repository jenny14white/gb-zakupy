import {useState} from "react";
import {updateOrder} from "../../services/ordersService";
import {UNITS} from "../../utils/constants";
import "../../styles/admin-shopping.css";
export default function AdminOrderEditForm({order,onCancel,onSaved}){
    const [product,setProduct]=useState(order.product||"");
    const [quantity,setQuantity]=useState(order.quantity||"");
    const [unit,setUnit]=useState(order.unit||UNITS[0]);
    const [requestedBy,setRequestedBy]=useState(order.requestedBy||"");
    const [adminComment,setAdminComment]=useState(order.adminComment||"");
    const [loading,setLoading]=useState(false);
    async function handleSave(){
        if(loading||!product.trim()||!requestedBy.trim()||!quantity)return;
        try{
            setLoading(true);
            await updateOrder(order.id,{
                product:product.trim(),
                quantity,
                unit,
                requestedBy:requestedBy.trim(),
                adminComment
            });
            onSaved();
        }catch(error){
            console.error("Order update error:",error);
            alert("Nie udało się zapisać zmian.");
        }finally{
            setLoading(false);
        }
    }
    return(
        <article className="shopping-card shopping-edit-card expanded">
            <div className="shopping-main shopping-edit-main">
                <div className="shopping-status-summary">
                    <span className="shopping-status-dot progress"/>
                    <strong>Edycja zamówienia</strong>
                </div>
                <div className="shopping-summary">
                    <div className="shopping-summary-product">
                        <span>{order.product||"Brak nazwy"}</span>
                    </div>
                    <div className="shopping-summary-meta">
                        <span>📦 {order.quantity||0} {order.unit||""}</span>
                        <span>👤 {order.requestedBy||"—"}</span>
                    </div>
                </div>
                <div className="shopping-expand">
                    <span>Edytowanie</span>
                    <span className="shopping-chevron open">↓</span>
                </div>
            </div>
            <div className="shopping-details shopping-edit-details">
                <div className="shopping-details-grid">
                    <label className="shopping-detail shopping-edit-detail">
                        <span className="shopping-detail-label">Produkt</span>
                        <input
                            value={product}
                            onChange={e=>setProduct(e.target.value)}
                            autoFocus
                        />
                    </label>
                    <label className="shopping-detail shopping-edit-detail">
                        <span className="shopping-detail-label">Osoba zgłaszająca</span>
                        <input
                            value={requestedBy}
                            onChange={e=>setRequestedBy(e.target.value)}
                        />
                    </label>
                    <label className="shopping-detail shopping-edit-detail">
                        <span className="shopping-detail-label">Ilość</span>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={e=>setQuantity(e.target.value)}
                        />
                    </label>
                    <label className="shopping-detail shopping-edit-detail">
                        <span className="shopping-detail-label">Jednostka</span>
                        <select
                            value={unit}
                            onChange={e=>setUnit(e.target.value)}
                        >
                            {UNITS.map(item=>(
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="shopping-detail shopping-edit-detail shopping-edit-comment">
                        <span className="shopping-detail-label">Komentarz administratora</span>
                        <textarea
                            rows={4}
                            value={adminComment}
                            onChange={e=>setAdminComment(e.target.value)}
                            placeholder="Komentarz administratora..."
                        />
                    </label>
                </div>
                <div className="shopping-details-actions">
                    <button
                        type="button"
                        className="admin-button"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading?"Zapisywanie...":"✓ Zapisz zmiany"}
                    </button>
                    <button
                        type="button"
                        className="admin-button secondary"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Anuluj
                    </button>
                </div>
            </div>
        </article>
    );
}
