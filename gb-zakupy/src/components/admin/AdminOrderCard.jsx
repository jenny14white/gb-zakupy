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

import "../../styles/admin-notifications.css";


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

    /*
     * Własny stan rozwinięcia.
     * Jeżeli rodzic przekazuje onToggle + expanded,
     * używamy stanu kontrolowanego przez rodzica.
     *
     * Jeżeli nie — karta rozwija się samodzielnie.
     */
    const [internalExpanded,setInternalExpanded]=useState(false);


    useEffect(()=>{

        setAdminComment(
            order?.adminComment||""
        );

    },[order]);


    /*
     * Jeżeli zmieni się zamówienie, zamykamy jego lokalne rozwinięcie.
     */
    useEffect(()=>{

        setInternalExpanded(false);

    },[order?.id]);


    if(!order)
        return null;


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


    /*
     * Jeżeli rodzic obsługuje expanded/onToggle,
     * używamy jego wartości.
     *
     * W przeciwnym przypadku używamy local state.
     */
    const isExpanded =
        typeof onToggle==="function"
            ? expanded
            : internalExpanded;


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


    function handleToggle(e){

        if(e)
            e.stopPropagation();


        /*
         * Rodzic kontroluje rozwinięcie.
         */
        if(typeof onToggle==="function"){

            onToggle(order.id);

            return;

        }


        /*
         * Fallback — karta sama się rozwija.
         */
        setInternalExpanded(
            prev=>!prev
        );

    }


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


            <article

                className={`
                    notification-card
                    ${isCompleted
                        ? "read"
                        : "unread"
                    }
                    ${statusClass}
                    ${selected
                        ? "selected"
                        : ""
                    }
                    ${isExpanded
                        ? "expanded"
                        : ""
                    }
                `}

                onClick={handleToggle}

            >


                {/* =====================================================
                    GŁÓWNA CZĘŚĆ KARTY
                   ===================================================== */}

                <div className="notification-main">


                    {/* STATUS */}

                    <div className="notification-status">

                        <span

                            className={
                                `notification-status-dot ${
                                    isCompleted
                                        ? "read-dot"
                                        : "new-dot"
                                }`
                            }

                        />


                        <strong>
                            {statusLabel}
                        </strong>

                    </div>


                    {/* PODSUMOWANIE */}

                    <div className="notification-summary">


                        <div className="notification-summary-product">

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


                            <span>
                                {order.product||"Brak nazwy"}
                            </span>

                        </div>


                        <div className="notification-summary-meta">

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
                        PRZYCISK ROZWIJANIA
                       ================================================= */}

                    <div

                        className="notification-expand"

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

                            className={
                                `notification-chevron ${
                                    isExpanded
                                        ? "open"
                                        : ""
                                }`
                            }

                        >

                            ↓

                        </span>

                    </div>

                </div>


                {/* =====================================================
                    SZCZEGÓŁY
                   ===================================================== */}

                {isExpanded&&(


                    <div

                        className="notification-details"

                        onClick={e=>
                            e.stopPropagation()
                        }

                    >


                        <div className="notification-details-grid">


                            {/* PRODUKT */}

                            <div className="notification-detail">

                                <span className="notification-detail-label">
                                    Produkt
                                </span>


                                <strong>
                                    {order.product||"Brak nazwy"}
                                </strong>

                            </div>


                            {/* ILOŚĆ */}

                            <div className="notification-detail">

                                <span className="notification-detail-label">
                                    Ilość
                                </span>


                                <strong>
                                    {order.quantity||0} {order.unit||""}
                                </strong>

                            </div>


                            {/* DODANE PRZEZ */}

                            <div className="notification-detail">

                                <span className="notification-detail-label">
                                    Dodane przez
                                </span>


                                <strong>
                                    {order.requestedBy||"—"}
                                </strong>

                            </div>


                            {/* DATA */}

                            <div className="notification-detail">

                                <span className="notification-detail-label">
                                    Data zgłoszenia
                                </span>


                                <strong>
                                    {formatDate(order.createdAt)}
                                </strong>

                            </div>


                            {/* PRZYJĘTO */}

                            <div className="notification-detail">

                                <span className="notification-detail-label">
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

                            <div className="notification-detail">

                                <span className="notification-detail-label">
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

                            {order.adminComment&&(

                                <div className="notification-detail">

                                    <span className="notification-detail-label">
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

                        <div className="notification-details-actions">


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


                            <div className="shopping-actions">


                                {/* PRZYJMIJ */}

                                {isPending&&(

                                    <button

                                        type="button"

                                        className="admin-button"

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

                                {isAccepted&&(

                                    <button

                                        type="button"

                                        className="admin-button"

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

                                {!isCompleted&&(

                                    <button

                                        type="button"

                                        className="admin-button"

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

                                    className="admin-button"

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
