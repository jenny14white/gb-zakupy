import { useState } from "react";

import { updateOrder } from "../../services/ordersService";
import { UNITS } from "../../utils/constants";

export default function AdminOrderEditForm({
    order,
    onCancel,
    onSaved,
}) {

    const [product, setProduct] = useState(order.product);
    const [quantity, setQuantity] = useState(order.quantity);
    const [unit, setUnit] = useState(order.unit);
    const [requestedBy, setRequestedBy] = useState(order.requestedBy);
    const [adminComment, setAdminComment] = useState(
        order.adminComment || ""
    );

    const [loading, setLoading] = useState(false);

    async function handleSave() {

        try {

            setLoading(true);

            await updateOrder(order.id, {
                product,
                quantity,
                unit,
                requestedBy,
                adminComment,
            });

            onSaved();

        } catch (error) {

            console.error(error);

            alert("Nie udało się zapisać zmian.");

        } finally {

            setLoading(false);

        }

    }

    return (

        <article className="admin-order editing">

            <div className="edit-grid">

                <label>

                    <span>Produkt</span>

                    <input
                        value={product}
                        onChange={event =>
                            setProduct(event.target.value)
                        }
                    />

                </label>

                <label>

                    <span>Osoba zgłaszająca</span>

                    <input
                        value={requestedBy}
                        onChange={event =>
                            setRequestedBy(event.target.value)
                        }
                    />

                </label>

                <label>

                    <span>Ilość</span>

                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={event =>
                            setQuantity(event.target.value)
                        }
                    />

                </label>

                <label>

                    <span>Jednostka</span>

                    <select
                        value={unit}
                        onChange={event =>
                            setUnit(event.target.value)
                        }
                    >

                        {UNITS.map(item => (

                            <option
                                key={item}
                                value={item}
                            >

                                {item}

                            </option>

                        ))}

                    </select>

                </label>

                <label className="full-width">

                    <span>Komentarz administratora</span>

                    <textarea
                        rows={3}
                        value={adminComment}
                        onChange={event =>
                            setAdminComment(event.target.value)
                        }
                    />

                </label>

            </div>

            <div className="admin-actions">

                <button
                    className="admin-button success"
                    onClick={handleSave}
                    disabled={loading}
                >

                    {loading
                        ? "Zapisywanie..."
                        : "💾 Zapisz zmiany"}

                </button>

                <button
                    className="admin-button secondary"
                    onClick={onCancel}
                    disabled={loading}
                >

                    Anuluj

                </button>

            </div>

        </article>

    );

}
