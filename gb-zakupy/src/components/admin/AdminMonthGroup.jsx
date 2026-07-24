import { useEffect, useState } from "react";

import AdminOrderCard from "./AdminOrderCard";


export default function AdminMonthGroup({
    month,
    orders,
    autoOpen = false,
}) {

    const [isOpen, setIsOpen] = useState(autoOpen);

    useEffect(() => {

        if (autoOpen) {

            setIsOpen(true);

        }

    }, [autoOpen]);

    return (

        <section className="month-section">

            <button
                className="month-toggle"
                onClick={() => setIsOpen(open => !open)}
            >

                <div className="month-info">

                    <span className="month-arrow">

                        {isOpen ? "▼" : "▶"}

                    </span>

                    <span className="month-name">

                        {month}

                    </span>

                </div>

                <span className="month-count">

                    {orders.length}{" "}
                    {orders.length === 1
                        ? "produkt"
                        : "produktów"}

                </span>

            </button>

            {isOpen && (

                <div className="admin-orders">

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

    );

}
