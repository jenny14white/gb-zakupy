import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase/firebase";

import { ORDER_STATUS } from "../utils/constants";
import { sortByDateDesc } from "../utils/dateUtils";
import { addLog } from "./logsService";

const ADMIN_UID = "kRulgEcxNed8aYacTWq3j9GgP4J2";

function checkAdmin() {
    const user = auth.currentUser;

    if (!user || user.uid !== ADMIN_UID) {
        throw new Error("Brak uprawnień administratora");
    }
}

export async function createOrder(data) {
    const order = {
        requestedBy: data.requestedBy.trim(),
        product: data.product.trim(),
        quantity: Number(data.quantity),
        unit: data.unit,

        status: ORDER_STATUS.PENDING,

        adminComment: "",

        notificationRead: false,
        notificationReadAt: null,

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),

        acceptedAt: null,
        completedAt: null,

        orderedAt: null,
    };

    await addDoc(
        collection(db, "orders"),
        order
    );

    await addLog(
        `${order.requestedBy} dodał/a produkt: ${order.product}, ${order.quantity} ${order.unit}`,
        "created"
    );
}

export function listenToOrders(callback) {
    return onSnapshot(
        collection(db, "orders"),
        snapshot => {
            const orders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            callback(
                sortByDateDesc(
                    orders,
                    "createdAt"
                )
            );
        }
    );
}

export async function updateOrder(orderId, data) {
    checkAdmin();

    const updatedOrder = {
        requestedBy: data.requestedBy.trim(),
        product: data.product.trim(),
        quantity: Number(data.quantity),
        unit: data.unit,
        adminComment: data.adminComment.trim(),
        updatedAt: serverTimestamp(),
    };

    await updateDoc(
        doc(db, "orders", orderId),
        updatedOrder
    );

    await addLog(
        `Admin edytował zamówienie: ${updatedOrder.product}`,
        "edited"
    );
}

export async function markNotificationAsRead(order) {
    if (order.notificationRead) return;

    checkAdmin();

    await updateDoc(
        doc(db, "orders", order.id),
        {
            notificationRead: true,
            notificationReadAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }
    );

    await addLog(
        `Admin oznaczył powiadomienie jako przeczytane: ${order.product}`,
        "read"
    );
}

export async function markOrderAsAccepted(
    order,
    adminComment = ""
) {
    if (order.status === ORDER_STATUS.ACCEPTED) {
        return;
    }

    checkAdmin();

    await updateDoc(
        doc(db, "orders", order.id),
        {
            status: ORDER_STATUS.ACCEPTED,

            adminComment: adminComment.trim(),

            acceptedAt: serverTimestamp(),

            notificationRead: true,
            notificationReadAt: serverTimestamp(),

            updatedAt: serverTimestamp(),
        }
    );

    await addLog(
        `Admin przyjął do realizacji: ${order.product}`,
        "accepted"
    );
}

export async function markOrderAsCompleted(
    order,
    adminComment = ""
) {
    if (order.status === ORDER_STATUS.COMPLETED) {
        return;
    }

    checkAdmin();

    await updateDoc(
        doc(db, "orders", order.id),
        {
            status: ORDER_STATUS.COMPLETED,

            adminComment: adminComment.trim(),

            completedAt: serverTimestamp(),

            updatedAt: serverTimestamp(),
        }
    );

    await addLog(
        `Admin oznaczył jako zrealizowane: ${order.product}`,
        "completed"
    );
}

export async function deleteOrder(order) {
    checkAdmin();

    await deleteDoc(
        doc(db, "orders", order.id)
    );

    await addLog(
        `Admin usunął zamówienie: ${order.product}`,
        "deleted"
    );
}
