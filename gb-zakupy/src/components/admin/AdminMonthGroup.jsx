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

        <section
            className={`shopping-category ${isOpen ? "open" : "closed"}`}
        >

            <button
                type="button"
                className="shopping-category-header"
                onClick={() => setIsOpen(open => !open)}
            >

                <div className="shopping-category-left">

                    <div className="shopping-chevron">

                        {isOpen ? "▼" : "▶"}

                    </div>

                    <div className="shopping-category-title">

                        <h2>

                            {month}

                        </h2>

                        <span>

                            {orders.length} zamówień

                        </span>

                    </div>

                </div>

                <div className="shopping-count">

                    {orders.length}

                </div>

            </button>

            {isOpen && (

                <div className="shopping-category-body">

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
