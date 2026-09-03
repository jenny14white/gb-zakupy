import AdminOrderCard from "./AdminOrderCard";
import EmptyState from "../shared/EmptyState";

import "../../styles/admin-shopping.css";
import "../../styles/admin-completed.css";


export default function AdminCompletedList({
    orders = [],
}) {

    return (
        <section className="admin-completed-list">

            {/* =================================================
                BANER
               ================================================= */}

            <header className="dashboard-header">

                <div>

                    <span className="dashboard-eyebrow">
                        SEKRETARIAT
                    </span>

                    <h1>
                        Zrealizowane
                    </h1>

                    <p className="dashboard-description">
                        Historia wszystkich zrealizowanych
                        zamówień.
                    </p>

                </div>

            </header>


            {/* =================================================
                LISTA
               ================================================= */}

            <section className="completed-list-panel">

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


                {!orders.length ? (

                    <EmptyState>
                        Brak zrealizowanych zamówień.
                    </EmptyState>

                ) : (

                    <div className="shopping-list completed-orders">

                        {orders.map(order => (

                            <AdminOrderCard
                                key={order.id}
                                order={order}
                                canOrder={false}
                            />

                        ))}

                    </div>

                )}

            </section>

        </section>
    );
}
