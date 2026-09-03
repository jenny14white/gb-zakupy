import { useMemo, useState } from "react";

import EmptyState from "../shared/EmptyState";

import { formatDate } from "../../utils/dateUtils";
import { markNotificationAsRead } from "../../services/ordersService";

import "../../styles/admin-notifications.css";


export default function AdminNotifications({
    orders = []
}){

    const [view, setView] =
        useState("unread");

    const [expandedId, setExpandedId] =
        useState(null);


    /*
     * =====================================================
     * POWIADOMIENIA
     * =====================================================
     */

    const {
        unreadOrders,
        readOrders,
    } = useMemo(() => {

        const unread =
            orders.filter(
                order =>
                    !order.notificationRead
            );

        const read =
            orders.filter(
                order =>
                    order.notificationRead
            );

        return {
            unreadOrders: unread,
            readOrders: read,
        };

    }, [orders]);


    const visibleOrders =
        view === "unread"
            ? unreadOrders
            : readOrders;


    /*
     * =====================================================
     * ZMIANA WIDOKU
     * =====================================================
     */

    function handleViewChange(nextView){

        setView(nextView);

        setExpandedId(null);

    }


    /*
     * =====================================================
     * ROZWIJANIE KARTY
     * =====================================================
     */

    function toggleNotification(id){

        setExpandedId(
            current =>
                current === id
                    ? null
                    : id
        );

    }


    /*
     * =====================================================
     * RENDER
     * =====================================================
     */

    return (

        <section className="admin-notifications">


            {/* =================================================
                BANER
               ================================================= */}

            <header className="dashboard-header">

                <div>

                    <span className="dashboard-eyebrow">
                        SEKRETARIAT
                    </span>


                    <h1>
                        Powiadomienia
                    </h1>


                    <p className="dashboard-description">
                        Centrum zarządzania powiadomieniami
                        i nowymi zgłoszeniami od pracowników.
                    </p>

                </div>

            </header>


            {/* =================================================
                STATYSTYKI
               ================================================= */}

            <section className="dashboard-stats notification-stats">

                <div className="stats notification-stats-grid">


                    {/* NIEPRZECZYTANE */}

                    <article
                        className={`
                            stat-card
                            notification-stat-card
                            ${view === "unread"
                                ? "selected"
                                : ""
                            }
                        `}
                        onClick={() =>
                            handleViewChange("unread")
                        }
                    >

                        <div className="stat-icon">
                            🔔
                        </div>


                        <strong>
                            {unreadOrders.length}
                        </strong>


                        <span>
                            Nieprzeczytane
                        </span>


                        <small>
                            Nowe zgłoszenia
                        </small>

                    </article>


                    {/* PRZECZYTANE */}

                    <article
                        className={`
                            stat-card
                            notification-stat-card
                            ${view === "read"
                                ? "selected"
                                : ""
                            }
                        `}
                        onClick={() =>
                            handleViewChange("read")
                        }
                    >

                        <div className="stat-icon">
                            ✓
                        </div>


                        <strong>
                            {readOrders.length}
                        </strong>


                        <span>
                            Przeczytane
                        </span>


                        <small>
                            Obsłużone powiadomienia
                        </small>

                    </article>


                </div>

            </section>


            {/* =================================================
                LISTA
               ================================================= */}

            <section className="dashboard-content">


                <div className="admin-notifications-list">


                    {/* NAGŁÓWEK LISTY */}

                    <div className="section-header">

                        <div>

                            <h2>
                                {view === "unread"
                                    ? "🔔 Nieprzeczytane"
                                    : "✓ Przeczytane"
                                }
                            </h2>


                            <p>
                                {view === "unread"
                                    ? "Nowe zgłoszenia wymagające uwagi."
                                    : "Historia przeczytanych powiadomień."
                                }
                            </p>

                        </div>


                        <div className="section-count">
                            {visibleOrders.length}
                        </div>

                    </div>


                    {/* LISTA */}

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

                </div>

            </section>

        </section>

    );

}


/*
 * =========================================================
 * NOTIFICATION CARD
 * =========================================================
 */

function NotificationCard({
    order,
    view,
    expanded,
    onToggle,
}){

    const [loading, setLoading] =
        useState(false);


    /*
     * =====================================================
     * OZNACZENIE JAKO PRZECZYTANE
     * =====================================================
     */

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


            {/* =================================================
                GŁÓWNA CZĘŚĆ KARTY
               ================================================= */}

            <div className="notification-main">


                {/* STATUS */}

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


                {/* INFORMACJE */}

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


                {/* ROZWIJANIE */}

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


            {/* =================================================
                SZCZEGÓŁY
               ================================================= */}

            {expanded && (

                <div
                    className="notification-details"

                    onClick={event =>
                        event.stopPropagation()
                    }
                >


                    <div className="notification-details-grid">


                        {/* PRODUKT */}

                        <div className="notification-detail">

                            <span className="notification-detail-label">
                                Produkt
                            </span>


                            <strong>
                                {order.product}
                            </strong>

                        </div>


                        {/* ILOŚĆ */}

                        <div className="notification-detail">

                            <span className="notification-detail-label">
                                Ilość
                            </span>


                            <strong>
                                {order.quantity} {order.unit}
                            </strong>

                        </div>


                        {/* DODANE PRZEZ */}

                        <div className="notification-detail">

                            <span className="notification-detail-label">
                                Dodane przez
                            </span>


                            <strong>
                                {order.requestedBy}
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


                        {/* PRZECZYTANO */}

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


                    {/* =================================================
                        AKCJE
                       ================================================= */}

                    {view === "unread" &&
                    !order.notificationRead && (

                        <div className="notification-details-actions">


                            <button

                                type="button"

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
