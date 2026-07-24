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

    const [expanded,setExpanded] = useState(false);
    const [isEditing,setIsEditing] = useState(false);
    const [loading,setLoading] = useState(false);

    const [adminComment,setAdminComment] = useState(
        order.adminComment || ""
    );

    const [showDeleteDialog,setShowDeleteDialog] = useState(false);


    useEffect(() => {

        setAdminComment(
            order.adminComment || ""
        );

    },[order]);


    const isPending =
        order.status === ORDER_STATUS.PENDING;

    const isAccepted =
        order.status === ORDER_STATUS.ACCEPTED;

    const isCompleted =
        order.status === ORDER_STATUS.COMPLETED;



    async function handleAction(action){

        if(loading){
            return;
        }

        try{

            setLoading(true);

            await action();

        }catch(error){

            console.error(error);

            alert(
                "Nie udało się wykonać operacji."
            );

        }finally{

            setLoading(false);

        }

    }


    function handleAccept(){

        handleAction(() =>
            markOrderAsAccepted(
                order,
                adminComment
            )
        );

    }


    function handleCompleted(){

        handleAction(() =>
            markOrderAsCompleted(
                order,
                adminComment
            )
        );

    }


    function confirmDelete(){

        handleAction(async () => {

            await deleteOrder(order);

            setShowDeleteDialog(false);

        });

    }



    if(isEditing){

        return (

            <AdminOrderEditForm
                order={order}
                onCancel={() =>
                    setIsEditing(false)
                }
                onSaved={() =>
                    setIsEditing(false)
                }
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
                onCancel={() =>
                    setShowDeleteDialog(false)
                }
            />


            <article className="shopping-card">


                <div className="shopping-card-bar" />


                <div
                    className="shopping-card-content"
                    onClick={() =>
                        setExpanded(value => !value)
                    }
                >

                    <div className="shopping-card-top">

                        <div className="shopping-product">

                            <h3>
                                {order.product}
                            </h3>

                            <p>
                                {order.quantity} {order.unit}
                            </p>

                        </div>

                    </div>



                    {expanded && (

                        <div className="shopping-card-footer">


                            <div className="shopping-card-footer-left">


                                <div className="shopping-meta">

                                    <div className="shopping-chip">
                                        📅 Dodano: {formatDate(order.createdAt)}
                                    </div>

                                    <div className="shopping-chip">
                                        ✅ Przyjęto:{" "}
                                        {
                                            order.acceptedAt
                                                ? formatDate(order.acceptedAt)
                                                : "—"
                                        }
                                    </div>

                                    <div className="shopping-chip">
                                        📦 Zrealizowano:{" "}
                                        {
                                            order.completedAt
                                                ? formatDate(order.completedAt)
                                                : "—"
                                        }
                                    </div>

                                    <div className="shopping-chip">
                                        👤 {order.requestedBy}
                                    </div>

                                </div>



                                <textarea
                                    className="shopping-comment"
                                    rows={3}
                                    value={adminComment}
                                    placeholder="Komentarz administratora..."
                                    disabled={
                                        loading ||
                                        isCompleted
                                    }
                                    onChange={event =>
                                        setAdminComment(
                                            event.target.value
                                        )
                                    }
                                />



                                {order.adminComment && (

                                    <div className="shopping-request-info">

                                        <strong>
                                            Komentarz administratora
                                        </strong>

                                        <p>
                                            {order.adminComment}
                                        </p>

                                    </div>

                                )}


                            </div>



                            <div className="shopping-actions">


                                {isPending && (

                                    <button
                                        type="button"
                                        className="shopping-icon-btn success"
                                        data-tooltip="Przyjmij"
                                        onClick={event => {
                                            event.stopPropagation();
                                            handleAccept();
                                        }}
                                        disabled={loading}
                                    >
                                        ✔
                                    </button>

                                )}



                                {isAccepted && (

                                    <button
                                        type="button"
                                        className="shopping-icon-btn success"
                                        data-tooltip="Zrealizuj"
                                        onClick={event => {
                                            event.stopPropagation();
                                            handleCompleted();
                                        }}
                                        disabled={loading}
                                    >
                                        ✓
                                    </button>

                                )}



                                {!isCompleted && (

                                    <button
                                        type="button"
                                        className="shopping-icon-btn info"
                                        data-tooltip="Edytuj"
                                        onClick={event => {
                                            event.stopPropagation();
                                            setIsEditing(true);
                                        }}
                                        disabled={loading}
                                    >
                                        ✏️
                                    </button>

                                )}



                                <button
                                    type="button"
                                    className="shopping-icon-btn danger"
                                    data-tooltip="Usuń"
                                    onClick={event => {
                                        event.stopPropagation();
                                        setShowDeleteDialog(true);
                                    }}
                                    disabled={loading}
                                >
                                    🗑
                                </button>


                            </div>


                        </div>

                    )}


                </div>



                <div className="shopping-card-right">


                    <div
                        className={`shopping-status ${
                            isPending
                                ? "pending"
                                : isAccepted
                                ? "progress"
                                : "done"
                        }`}
                    >

                        {isPending && "🟡 Oczekujące"}

                        {isAccepted && "🟢 Przyjęte"}

                        {isCompleted && "🟣 Zrealizowane"}

                    </div>



                    <button
                        type="button"
                        className="shopping-icon-btn"
                        onClick={event => {
                            event.stopPropagation();
                            setExpanded(value => !value);
                        }}
                    >
                        {expanded ? "▲" : "▼"}
                    </button>


                </div>


            </article>

        </>

    );

}
