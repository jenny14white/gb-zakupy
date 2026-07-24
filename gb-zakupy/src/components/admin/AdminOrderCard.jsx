import { useEffect, useState } from "react";

import {
    deleteOrder,
    markOrderAsAccepted,
    markOrderAsCompleted,
} from "../../services/ordersService";

import { ORDER_STATUS } from "../../utils/constants";
import { formatDate } from "../../utils/dateUtils";

import AdminOrderEditForm from "./AdminOrderEditForm";
import ConfirmDialog from "../shared/ConfirmDialog";

export default function AdminOrderCard({ order }) {

    const [expanded, setExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [loading, setLoading] = useState(false);

    const [adminComment, setAdminComment] = useState(
        order.adminComment || ""
    );

    const [showDeleteDialog, setShowDeleteDialog] =
        useState(false);

    useEffect(() => {

        setAdminComment(order.adminComment || "");

    }, [order]);

    const isPending =
        order.status === ORDER_STATUS.PENDING;

    const isAccepted =
        order.status === ORDER_STATUS.ACCEPTED;

    const isCompleted =
        order.status === ORDER_STATUS.COMPLETED;

    async function handleAccept() {

        if (loading)
            return;

        try {

            setLoading(true);

            await markOrderAsAccepted(
                order,
                adminComment
            );

        } catch (error) {

            console.error(error);

            alert("Nie udało się przyjąć zamówienia.");

        } finally {

            setLoading(false);

        }

    }

    async function handleCompleted() {

        if (loading)
            return;

        try {

            setLoading(true);

            await markOrderAsCompleted(
                order,
                adminComment
            );

        } catch (error) {

            console.error(error);

            alert(
                "Nie udało się oznaczyć zamówienia jako zrealizowane."
            );

        } finally {

            setLoading(false);

        }

    }

    async function confirmDelete() {

        try {

            setLoading(true);

            await deleteOrder(order);

        } catch (error) {

            console.error(error);

            alert("Nie udało się usunąć zamówienia.");

        } finally {

            setLoading(false);
            setShowDeleteDialog(false);

        }

    }

    if (isEditing) {

        return (

            <AdminOrderEditForm
                order={order}
                onCancel={() => setIsEditing(false)}
                onSaved={() => setIsEditing(false)}
            />

        );

    }

    return (

        <>

            <ConfirmDialog
                open={showDeleteDialog}
                danger
                title="Usunąć zamówienie?"
                message={`Czy na pewno chcesz usunąć "${order.product}"?\n\nTej operacji nie można cofnąć.`}
                confirmText="Usuń"
                cancelText="Anuluj"
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteDialog(false)}
            />

            <article
                className={`admin-order ${isCompleted ? "done" : ""}`}
            >

                <header
                    className="admin-order-header"
                    onClick={() => setExpanded(open => !open)}
                >

                    <div className="order-main">

                        <strong>

                            {order.product}

                        </strong>

                        <span>

                            {order.quantity} {order.unit}

                        </span>

                        <small>

                            {order.requestedBy}

                        </small>

                    </div>

                    <div
                        className={`status-badge ${
                            isPending
                                ? "pending"
                                : isAccepted
                                ? "accepted"
                                : "completed"
                        }`}
                    >

                        {isPending && "🟡 Oczekujące"}

                        {isAccepted &&
                            "🟢 Przyjęte"}

                        {isCompleted &&
                            "🟣 Zrealizowane"}

                    </div>

                    <button
                        type="button"
                        className="expand-button"
                    >

                        {expanded ? "▲" : "▼"}

                    </button>

                </header>

                {expanded && (

                    <div className="admin-order-body">

                        <div className="order-history">

                            <small>

                                📝 Dodano:{" "}
                                {formatDate(order.createdAt)}

                            </small>

                            <small>

                                ✅ Przyjęto:{" "}
                                {order.acceptedAt
                                    ? formatDate(order.acceptedAt)
                                    : "—"}

                            </small>

                            <small>

                                📦 Zrealizowano:{" "}
                                {order.completedAt
                                    ? formatDate(order.completedAt)
                                    : "—"}

                            </small>

                        </div>

                        <textarea
                            rows={3}
                            value={adminComment}
                            placeholder="Komentarz administratora..."
                            disabled={loading || isCompleted}
                            onChange={event =>
                                setAdminComment(
                                    event.target.value
                                )
                            }
                        />

                        <div className="admin-actions">

                            {isPending && (

                                <button
                                    className="admin-button success"
                                    onClick={handleAccept}
                                    disabled={loading}
                                >

                                    {loading
                                        ? "Zapisywanie..."
                                        : "✔ Przyjmij do realizacji"}

                                </button>

                            )}

                            {isAccepted && (

                                <button
                                    className="admin-button success"
                                    onClick={handleCompleted}
                                    disabled={loading}
                                >

                                    {loading
                                        ? "Zapisywanie..."
                                        : "✔ Oznacz jako zrealizowane"}

                                </button>

                            )}

                            {!isCompleted && (

                                <button
                                    className="admin-button"
                                    onClick={() => setIsEditing(true)}
                                    disabled={loading}
                                >

                                    ✏️ Edytuj

                                </button>

                            )}

                            <button
                                className="admin-button danger"
                                onClick={() => setShowDeleteDialog(true)}
                                disabled={loading}
                            >

                                {loading
                                    ? "Usuwanie..."
                                    : "🗑 Usuń"}

                            </button>

                        </div>

                        {order.adminComment && (

                            <div className="admin-comment">

                                <strong>

                                    Komentarz administratora

                                </strong>

                                <p>

                                    {order.adminComment}

                                </p>

                            </div>

                        )}

                    </div>

                )}

            </article>

        </>

    );

}
