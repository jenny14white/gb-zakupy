import AdminOrderCard from "./AdminOrderCard";
import EmptyState from "../shared/EmptyState";

import "../../styles/admin-shopping.css";

export default function AdminCompletedList({
    orders = [],
}) {

    if (!orders.length) {
        return (
            <section className="dashboard-content">
                <EmptyState>
                    Brak zrealizowanych zamówień.
                </EmptyState>
            </section>
        );
    }

    return (
        <section className="admin-completed-list">

            <div className="section-header">
                <div>
                    <h2>
                        🟣 Zrealizowane
                    </h2>

                    <p>
                        Lista wszystkich zrealizowanych zamówień.
                    </p>
                </div>

                <div className="section-count">
                    {orders.length}
                </div>
            </div>

            <div className="shopping-list">

                {orders.map(order => (

                    <AdminOrderCard
                        key={order.id}
                        order={order}
                        canOrder={false}
                    />

                ))}

            </div>

        </section>
    );
}
