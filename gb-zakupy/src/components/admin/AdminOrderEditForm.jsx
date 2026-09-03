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
        <article className="shopping-card shopping-edit-card">
            <div className="shopping-card-bar"/>
            <div className="shopping-edit">
                <div className="shopping-edit-header">
                    <div>
                        <span className="shopping-edit-eyebrow">EDYCJA ZAMÓWIENIA</span>
                        <h3>{order.product||"Brak nazwy"}</h3>
                        <p>Zmień dane zgłoszenia i zapisz aktualizację.</p>
                    </div>
                </div>
                <div className="shopping-edit-grid">
                    <label className="shopping-edit-field">
                        <span>Produkt</span>
                        <input value={product} onChange={e=>setProduct(e.target.value)} autoFocus/>
                    </label>
                    <label className="shopping-edit-field">
                        <span>Osoba zgłaszająca</span>
                        <input value={requestedBy} onChange={e=>setRequestedBy(e.target.value)}/>
                    </label>
                    <label className="shopping-edit-field">
                        <span>Ilość</span>
                        <input type="number" min="1" value={quantity} onChange={e=>setQuantity(e.target.value)}/>
                    </label>
                    <label className="shopping-edit-field">
                        <span>Jednostka</span>
                        <select value={unit} onChange={e=>setUnit(e.target.value)}>
                            {UNITS.map(item=><option key={item} value={item}>{item}</option>)}
                        </select>
                    </label>
                    <label className="shopping-edit-field shopping-edit-full">
                        <span>Komentarz administratora</span>
                        <textarea rows={4} value={adminComment} onChange={e=>setAdminComment(e.target.value)} placeholder="Komentarz administratora..."/>
                    </label>
                </div>
                <div className="shopping-edit-actions">
                    <button type="button" className="shopping-icon-btn success shopping-edit-save" data-tooltip="Zapisz zmiany" onClick={handleSave} disabled={loading}>
                        {loading?"…":"✓"}
                    </button>
                    <button type="button" className="shopping-icon-btn danger" data-tooltip="Anuluj" onClick={onCancel} disabled={loading}>
                        ✕
                    </button>
                </div>
            </div>
        </article>
    );
}
