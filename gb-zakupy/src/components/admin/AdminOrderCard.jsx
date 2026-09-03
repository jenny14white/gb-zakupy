import {useEffect,useState} from "react";

import {
    deleteOrder,
    markOrderAsAccepted,
    markOrderAsCompleted
} from "../../services/ordersService";

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

    const [adminComment,setAdminComment]=useState(
        order?.adminComment||""
    );

    const [showDeleteDialog,setShowDeleteDialog]=useState(false);

    const [internalExpanded,setInternalExpanded]=useState(false);


    /* =========================================================
       AKTUALIZACJA KOMENTARZA
       ========================================================= */

    useEffect(()=>{

        setAdminComment(
            order?.adminComment||""
        );

    },[order]);


    /* =========================================================
       RESET ROZWINIĘCIA PO ZMIANIE ZAMÓWIENIA
       ========================================================= */

    useEffect(()=>{

        setInternalExpanded(false);

    },[order?.id]);


    if(!order)
        return null;


    /* =========================================================
       STATUS
       ========================================================= */

    const isPending =
        order.status===ORDER_STATUS.PENDING;

    const isAccepted =
        order.status===ORDER_STATUS.ACCEPTED;

    const isCompleted =
        order.status===ORDER_STATUS.COMPLETED;


    const statusClass =
        isPending
            ? "pending"
            : isAccepted
                ? "progress"
                : isCompleted
                    ? "done"
                    : "cancelled";


    const statusLabel =
        isPending
            ? "Oczekujące"
            : isAccepted
                ? "Przyjęte"
                : isCompleted
                    ? "Zrealizowane"
                    : "Anulowane";


    /* =========================================================
       ROZWINIĘCIE
       ========================================================= */

    const isExpanded =
        typeof onToggle==="function"
            ? expanded
            : internalExpanded;


    /* =========================================================
       AKCJE
       ========================================================= */

    async function handleAction(action){

        if(loading)
            return;


        try{

            setLoading(true);

            await action();

        }catch(error){

            console.error(error);

            alert(
                "Nie udało się wykonać operacji."
            );

        }finally{

            setLoading(false);

        }

    }


    function handleAccept(){

        handleAction(
            ()=>markOrderAsAccepted(
                order,
                adminComment
            )
        );

    }


    function handleCompleted(){

        handleAction(
            ()=>markOrderAsCompleted(
                order,
                adminComment
            )
        );

    }


    function confirmDelete(){

        handleAction(async()=>{

            await deleteOrder(order);

            setShowDeleteDialog(false);

        });

    }


    /* =========================================================
       ROZWIJANIE KARTY
       ========================================================= */

    function handleToggle(e){

        if(e)
            e.stopPropagation();


        /* Rodzic kontroluje rozwinięcie */

        if(typeof onToggle==="function"){

            onToggle(order.id);

            return;

        }


        /* Fallback — lokalny stan */

        setInternalExpanded(
            prev=>!prev
        );

    }


    /* =========================================================
       EDYCJA
       ========================================================= */

    if(isEditing){

        return(

            <AdminOrderEditForm

                order={order}

                onCancel={()=>
                    setIsEditing(false)
                }

                onSaved={()=>
                    setIsEditing(false)
                }

            />

        );

    }


    return(

        <>

            {/* =====================================================
                DELETE DIALOG
               ===================================================== */}

            <ConfirmDialog

                open={showDeleteDialog}

                danger

                title="Usunąć zamówienie?"

                message={
                    `Czy na pewno chcesz usunąć "${order.product||""}"?\n\n`+
                    `Tej operacji nie można cofnąć.`
                }

                confirmText="Usuń"

                cancelText="Anuluj"

                onConfirm={confirmDelete}

                onCancel={()=>
                    setShowDeleteDialog(false)
                }

            />


            {/* =====================================================
                SHOPPING CARD
               ===================================================== */}

            <article

                className={`
                    shopping-card
                    ${statusClass}
                    ${selected ? "selected" : ""}
                    ${isExpanded ? "expanded" : ""}
                `}

                onClick={handleToggle}

            >


                {/* =================================================
                    GŁÓWNY WIERSZ
                   ================================================= */}

                <div className="shopping-main">


                    {/* =================================================
                        STATUS
                       ================================================= */}

                    <div className="shopping-status-summary">

                        <span className="shopping-status-dot"/>

                        <strong>
                            {statusLabel}
                        </strong>

                    </div>


                    {/* =================================================
                        PODSUMOWANIE
                       ================================================= */}

                    <div className="shopping-summary">


                        <div className="shopping-summary-product">

                            {onSelect && (

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


                            <span>
                                {order.product||"Brak nazwy"}
                            </span>

                        </div>


                        <div className="shopping-summary-meta">

                            <span>
                                📦 {order.quantity||0} {order.unit||""}
                            </span>


                            <span>
                                👤 {order.requestedBy||"—"}
                            </span>


                            <span>
                                🕐 {formatDate(order.createdAt)}
                            </span>

                        </div>

                    </div>


                    {/* =================================================
                        ROZWIJANIE
                       ================================================= */}

                    <div

                        className="shopping-expand"

                        onClick={handleToggle}

                        role="button"

                        tabIndex={0}

                        onKeyDown={e=>{

                            if(
                                e.key==="Enter" ||
                                e.key===" "
                            ){

                                e.preventDefault();

                                handleToggle(e);

                            }

                        }}

                    >

                        <span>
                            {isExpanded
                                ? "Zwiń"
                                : "Szczegóły"
                            }
                        </span>


                        <span

                            className={`
                                shopping-chevron
                                ${isExpanded ? "open" : ""}
                            `}

                        >
                            ↓
                        </span>

                    </div>

                </div>


                {/* =================================================
                    SZCZEGÓŁY
                   ================================================= */}

                {isExpanded && (

                    <div

                        className="shopping-details"

                        onClick={e=>
                            e.stopPropagation()
                        }

                    >


                        <div className="shopping-details-grid">


                            {/* PRODUKT */}

                            <div className="shopping-detail">

                                <span className="shopping-detail-label">
                                    Produkt
                                </span>

                                <strong>
                                    {order.product||"Brak nazwy"}
                                </strong>

                            </div>


                            {/* ILOŚĆ */}

                            <div className="shopping-detail">

                                <span className="shopping-detail-label">
                                    Ilość
                                </span>

                                <strong>
                                    {order.quantity||0} {order.unit||""}
                                </strong>

                            </div>


                            {/* DODANE PRZEZ */}

                            <div className="shopping-detail">

                                <span className="shopping-detail-label">
                                    Dodane przez
                                </span>

                                <strong>
                                    {order.requestedBy||"—"}
                                </strong>

                            </div>


                            {/* DATA */}

                            <div className="shopping-detail">

                                <span className="shopping-detail-label">
                                    Data zgłoszenia
                                </span>

                                <strong>
                                    {formatDate(order.createdAt)}
                                </strong>

                            </div>


                            {/* PRZYJĘTO */}

                            <div className="shopping-detail">

                                <span className="shopping-detail-label">
                                    Przyjęto
                                </span>

                                <strong>
                                    {order.acceptedAt
                                        ? formatDate(order.acceptedAt)
                                        : "—"
                                    }
                                </strong>

                            </div>


                            {/* ZREALIZOWANO */}

                            <div className="shopping-detail">

                                <span className="shopping-detail-label">
                                    Zrealizowano
                                </span>

                                <strong>
                                    {order.completedAt
                                        ? formatDate(order.completedAt)
                                        : "—"
                                    }
                                </strong>

                            </div>


                            {/* KOMENTARZ */}

                            {order.adminComment && (

                                <div className="shopping-detail">

                                    <span className="shopping-detail-label">
                                        Komentarz administratora
                                    </span>

                                    <strong>
                                        {order.adminComment}
                                    </strong>

                                </div>

                            )}

                        </div>


                        {/* =================================================
                            AKCJE
                           ================================================= */}

                        <div className="shopping-details-bottom">


                            {/* KOMENTARZ */}

                            <div className="shopping-card-footer-left">

                                <textarea

                                    className="shopping-comment"

                                    rows={3}

                                    value={adminComment}

                                    placeholder="Komentarz administratora..."

                                    disabled={
                                        loading ||
                                        isCompleted
                                    }

                                    onChange={e=>
                                        setAdminComment(
                                            e.target.value
                                        )
                                    }

                                    onClick={e=>
                                        e.stopPropagation()
                                    }

                                />

                            </div>


                            {/* PRZYCISKI */}

                            <div className="shopping-actions">


                                {/* PRZYJMIJ */}

                                {isPending && (

                                    <button

                                        type="button"

                                        className="admin-button success"

                                        disabled={loading}

                                        onClick={e=>{

                                            e.stopPropagation();

                                            handleAccept();

                                        }}

                                    >

                                        ✔ Przyjmij

                                    </button>

                                )}


                                {/* ZREALIZUJ */}

                                {isAccepted && (

                                    <button

                                        type="button"

                                        className="admin-button success"

                                        disabled={loading}

                                        onClick={e=>{

                                            e.stopPropagation();

                                            handleCompleted();

                                        }}

                                    >

                                        ✓ Zrealizuj

                                    </button>

                                )}


                                {/* EDYTUJ */}

                                {!isCompleted && (

                                    <button

                                        type="button"

                                        className="admin-button info"

                                        disabled={loading}

                                        onClick={e=>{

                                            e.stopPropagation();

                                            setIsEditing(true);

                                        }}

                                    >

                                        ✏️ Edytuj

                                    </button>

                                )}


                                {/* USUŃ */}

                                <button

                                    type="button"

                                    className="admin-button danger"

                                    disabled={loading}

                                    onClick={e=>{

                                        e.stopPropagation();

                                        setShowDeleteDialog(true);

                                    }}

                                >

                                    🗑 Usuń

                                </button>


                            </div>

                        </div>

                    </div>

                )}

            </article>

        </>

    );

}
