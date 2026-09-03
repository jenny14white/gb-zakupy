import { useMemo, useState } from "react";

import EmptyState from "../shared/EmptyState";

import { formatDate } from "../../utils/dateUtils";
import { markNotificationAsRead } from "../../services/ordersService";

import "../../styles/admin-notifications.css";


export default function AdminNotifications({
    orders = []
}){

    const [view, setView] = useState("unread");

    const [expandedId, setExpandedId] = useState(null);


    const {
        unreadOrders,
        readOrders,
    } = useMemo(()=>{

        return {

            unreadOrders:
                orders.filter(
                    order =>
                        !order.notificationRead
                ),

            readOrders:
                orders.filter(
                    order =>
                        order.notificationRead
                ),

        };

    },[orders]);


    const visibleOrders =
        view === "unread"
            ? unreadOrders
            : readOrders;


    function handleViewChange(nextView){

        setView(nextView);

        setExpandedId(null);

    }


    function toggleNotification(id){

        setExpandedId(
            current =>
                current === id
                    ? null
                    : id
        );

    }


    return (

        <section className="admin-notifications">


            <div className="section-header">


                <div>

                    <h2>
                        🔔 Powiadomienia
                    </h2>

                    <p>
                        Nowe zgłoszenia od pracowników.
                    </p>

                </div>


                <div className="notification-tabs">


                    <button

                        className={
                            view === "unread"
                                ? "active"
                                : ""
                        }

                        onClick={() =>
                            handleViewChange("unread")
                        }

                    >

                        Nowe ({unreadOrders.length})

                    </button>


                    <button

                        className={
                            view === "read"
                                ? "active"
                                : ""
                        }

                        onClick={() =>
                            handleViewChange("read")
                        }

                    >

                        Przeczytane ({readOrders.length})

                    </button>


                </div>


            </div>


            {!visibleOrders.length ? (

                <EmptyState>

                    {
                        view === "unread"
                            ? "Brak nowych nieprzeczytanych powiadomień."
                            : "Brak przeczytanych powiadomień."
                    }

                </EmptyState>

            ) : (

                <div className="notifications">


                    {visibleOrders.map(order => (

                        <NotificationCard

                            key={order.id}

                            order={order}

                            expanded={
                                expandedId === order.id
                            }

                            onToggle={() =>
                                toggleNotification(
                                    order.id
                                )
                            }

                            view={view}

                        />

                    ))}


                </div>

            )}


        </section>

    );

}


function NotificationCard({
    order,
    view,
    expanded,
    onToggle,
}){

    const [loading, setLoading] =
        useState(false);


    async function handleRead(event){

        event.stopPropagation();


        if(loading)
            return;


        try{

            setLoading(true);

            await markNotificationAsRead(
                order
            );

        }catch(error){

            console.error(
                "Notification update error:",
                error
            );

        }finally{

            setLoading(false);

        }

    }


    return (

        <article

            className={`
                notification-card
                ${order.notificationRead
                    ? "read"
                    : "unread"
                }
                ${expanded
                    ? "expanded"
                    : ""
                }
            `}

            onClick={onToggle}

        >


            <div className="notification-main">


                <div className="notification-status">


                    <span
                        className={
                            `notification-status-dot ${
                                order.notificationRead
                                    ? "read-dot"
                                    : "new-dot"
                            }`
                        }
                    />


                    <strong>

                        {
                            order.notificationRead
                                ? "Przeczytane"
                                : "Nowe zgłoszenie"
                        }

                    </strong>


                </div>


                <div className="notification-summary">


                    <div className="notification-summary-product">

                        {order.product}

                    </div>


                    <div className="notification-summary-meta">

                        <span>
                            📦 {order.quantity} {order.unit}
                        </span>

                        <span>
                            👤 {order.requestedBy}
                        </span>

                        <span>
                            🕐 {formatDate(order.createdAt)}
                        </span>

                    </div>


                </div>


                <div className="notification-expand">


                    <span>
                        {expanded
                            ? "Zwiń"
                            : "Szczegóły"
                        }
                    </span>


                    <span
                        className={
                            `notification-chevron ${
                                expanded
                                    ? "open"
                                    : ""
                            }`
                        }
                    >
                        ↓
                    </span>


                </div>


            </div>


            {expanded && (

                <div
                    className="notification-details"
                    onClick={event =>
                        event.stopPropagation()
                    }
                >


                    <div className="notification-details-grid">


                        <div className="notification-detail">


                            <span className="notification-detail-label">
                                Produkt
                            </span>


                            <strong>
                                {order.product}
                            </strong>


                        </div>


                        <div className="notification-detail">


                            <span className="notification-detail-label">
                                Ilość
                            </span>


                            <strong>
                                {order.quantity} {order.unit}
                            </strong>


                        </div>


                        <div className="notification-detail">


                            <span className="notification-detail-label">
                                Dodane przez
                            </span>


                            <strong>
                                {order.requestedBy}
                            </strong>


                        </div>


                        <div className="notification-detail">


                            <span className="notification-detail-label">
                                Data zgłoszenia
                            </span>


                            <strong>
                                {formatDate(order.createdAt)}
                            </strong>


                        </div>


                        {order.notificationReadAt && (

                            <div className="notification-detail">


                                <span className="notification-detail-label">
                                    Przeczytano
                                </span>


                                <strong>
                                    {formatDate(
                                        order.notificationReadAt
                                    )}
                                </strong>


                            </div>

                        )}


                    </div>


                    {view === "unread" &&
                    !order.notificationRead && (

                        <div className="notification-details-actions">


                            <button

                                className="admin-button"

                                onClick={handleRead}

                                disabled={loading}

                            >

                                {
                                    loading
                                        ? "Zapisywanie..."
                                        : "✓ Oznacz jako przeczytane"
                                }

                            </button>


                        </div>

                    )}


                </div>

            )}


        </article>

    );

}
