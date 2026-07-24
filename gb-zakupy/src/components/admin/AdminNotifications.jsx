import { useMemo, useState } from "react";

import EmptyState from "../shared/EmptyState";

import { formatDate } from "../../utils/dateUtils";
import { markNotificationAsRead } from "../../services/ordersService";


export default function AdminNotifications({ orders }) {

    const [view,setView] = useState("unread");


    const unreadOrders = useMemo(
        () =>
            orders.filter(
                order =>
                    !order.notificationRead
            ),
        [orders]
    );


    const readOrders = useMemo(
        () =>
            orders.filter(
                order =>
                    order.notificationRead
            ),
        [orders]
    );


    const visibleOrders =
        view === "unread"
            ? unreadOrders
            : readOrders;



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
                            setView("unread")
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
                            setView("read")
                        }
                    >
                        Przeczytane ({readOrders.length})
                    </button>


                </div>


            </div>



            {visibleOrders.length === 0 ? (

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
}) {

    const [loading,setLoading] = useState(false);


    async function handleRead(){

        if(loading){
            return;
        }


        try{

            setLoading(true);

            await markNotificationAsRead(order);

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
            className={
                `notification-card ${
                    order.notificationRead
                        ? "read"
                        : "unread"
                }`
            }
        >

            <div className="notification-top">

                <strong>

                    {
                        order.notificationRead
                            ? "Przeczytane"
                            : "🟢 Nowe zgłoszenie"
                    }

                </strong>


                {!order.notificationRead && (
                    <span className="dot" />
                )}

            </div>


            <p className="notification-product">
                {order.product}
            </p>


            <p className="notification-quantity">
                {order.quantity} {order.unit}
            </p>


            <small>
                Dodane przez <strong>{order.requestedBy}</strong>
            </small>


            <small>
                {formatDate(order.createdAt)}
            </small>


            {order.notificationReadAt && (

                <small>
                    Przeczytano: {formatDate(order.notificationReadAt)}
                </small>

            )}


            {view === "unread" &&
            !order.notificationRead && (

                <button
                    className="admin-button"
                    onClick={handleRead}
                    disabled={loading}
                >

                    {
                        loading
                            ? "Zapisywanie..."
                            : "Oznacz jako przeczytane"
                    }

                </button>

            )}


        </article>

    );

}
