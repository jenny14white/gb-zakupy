import { useMemo } from "react";

import EmptyState from "../shared/EmptyState";
import AdminOrderCard from "./AdminOrderCard";

import { ORDER_STATUS } from "../../utils/constants";

import "../../styles/admin-shopping.css";


export default function AdminShoppingList({
    orders = [],
}){

    const pendingOrders = useMemo(
        () =>
            orders.filter(
                order =>
                    order.status === ORDER_STATUS.PENDING
            ),
        [orders]
    );


    const acceptedOrders = useMemo(
        () =>
            orders.filter(
                order =>
                    order.status === ORDER_STATUS.ACCEPTED
            ),
        [orders]
    );


    function renderSection(
        title,
        icon,
        items,
        emptyMessage
    ){

        return (

            <section className="admin-section">

                <div className="section-header">

                    <h3>
                        {icon} {title}
                        <span>
                            {" "}({items.length})
                        </span>
                    </h3>

                </div>


                {
                    items.length === 0 ? (

                        <EmptyState>
                            {emptyMessage}
                        </EmptyState>

                    ) : (

                        <div className="admin-orders">

                            {
                                items.map(order => (

                                    <AdminOrderCard
                                        key={order.id}
                                        order={order}
                                    />

                                ))
                            }

                        </div>

                    )
                }

            </section>

        );

    }


    const totalActive =
        pendingOrders.length +
        acceptedOrders.length;


    return (

        <section className="admin-shopping-list">

            <div className="admin-list-header">

                <div>

                    <h2>
                        🛒 Zakupy
                    </h2>

                    <p>
                        Łącznie aktywnych zgłoszeń:{" "}
                        {totalActive}
                    </p>

                </div>

            </div>


            {
                renderSection(
                    "Oczekujące",
                    "🟡",
                    pendingOrders,
                    "Brak oczekujących zgłoszeń."
                )
            }


            {
                renderSection(
                    "Przyjęte do realizacji",
                    "🟢",
                    acceptedOrders,
                    "Brak produktów przyjętych do realizacji."
                )
            }

        </section>

    );

}
