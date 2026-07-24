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


const ADMIN_UID =
    "kRulgEcxNed8aYacTWq3j9GgP4J2";


function checkAdmin() {

    const user =
        auth.currentUser;


    if (
        !user ||
        user.uid !== ADMIN_UID
    ) {
        throw new Error(
            "Brak uprawnień administratora"
        );
    }

}



function cleanText(value = "") {

    return String(value).trim();

}



function validateOrder(data) {

    const quantity =
        Number(data.quantity);


    if (
        !cleanText(data.requestedBy) ||
        !cleanText(data.product)
    ) {
        throw new Error(
            "Brak wymaganych danych"
        );
    }


    if (
        !quantity ||
        quantity <= 0
    ) {
        throw new Error(
            "Nieprawidłowa ilość"
        );
    }


    return quantity;

}



async function safeLog(
    message,
    type
) {

    try {

        await addLog(
            message,
            type
        );

    } catch(error) {

        console.error(
            "Log error:",
            error
        );

    }

}



export async function createOrder(data) {

    const quantity =
        validateOrder(data);


    const order = {

        requestedBy:
            cleanText(data.requestedBy),

        product:
            cleanText(data.product),

        quantity,

        unit:
            data.unit || "szt.",


        status:
            ORDER_STATUS.PENDING,


        adminComment: "",


        notificationRead: false,

        notificationReadAt: null,


        createdAt:
            serverTimestamp(),

        updatedAt:
            serverTimestamp(),


        acceptedAt: null,

        completedAt: null,

        orderedAt: null,

    };


    await addDoc(
        collection(db, "orders"),
        order
    );


    await safeLog(
        `${order.requestedBy} dodał/a produkt: ${order.product}, ${order.quantity} ${order.unit}`,
        "created"
    );

}



export function listenToOrders(callback) {

    return onSnapshot(
        collection(db, "orders"),
        snapshot => {

            const orders =
                snapshot.docs.map(document => ({
                    id: document.id,
                    ...document.data(),
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



export async function updateOrder(
    orderId,
    data
) {

    checkAdmin();


    const quantity =
        validateOrder(data);


    const updatedOrder = {

        requestedBy:
            cleanText(data.requestedBy),

        product:
            cleanText(data.product),

        quantity,

        unit:
            data.unit || "szt.",


        adminComment:
            cleanText(data.adminComment),


        updatedAt:
            serverTimestamp(),

    };


    await updateDoc(
        doc(db, "orders", orderId),
        updatedOrder
    );


    await safeLog(
        `Admin edytował zamówienie: ${updatedOrder.product}`,
        "edited"
    );

}



export async function markNotificationAsRead(order) {

    if(order.notificationRead) {
        return;
    }


    checkAdmin();


    await updateDoc(
        doc(db, "orders", order.id),
        {
            notificationRead: true,

            notificationReadAt:
                serverTimestamp(),

            updatedAt:
                serverTimestamp(),
        }
    );


    await safeLog(
        `Admin oznaczył powiadomienie jako przeczytane: ${order.product}`,
        "read"
    );

}



export async function markOrderAsAccepted(
    order,
    adminComment = ""
) {

    if(
        order.status === ORDER_STATUS.ACCEPTED
    ) {
        return;
    }


    checkAdmin();


    await updateDoc(
        doc(db, "orders", order.id),
        {

            status:
                ORDER_STATUS.ACCEPTED,


            adminComment:
                cleanText(adminComment),


            acceptedAt:
                serverTimestamp(),


            notificationRead: true,


            notificationReadAt:
                serverTimestamp(),


            updatedAt:
                serverTimestamp(),

        }
    );


    await safeLog(
        `Admin przyjął do realizacji: ${order.product}`,
        "accepted"
    );

}



export async function markOrderAsCompleted(
    order,
    adminComment = ""
) {

    if(
        order.status === ORDER_STATUS.COMPLETED
    ) {
        return;
    }


    checkAdmin();


    await updateDoc(
        doc(db, "orders", order.id),
        {

            status:
                ORDER_STATUS.COMPLETED,


            adminComment:
                cleanText(adminComment),


            completedAt:
                serverTimestamp(),


            updatedAt:
                serverTimestamp(),

        }
    );


    await safeLog(
        `Admin oznaczył jako zrealizowane: ${order.product}`,
        "completed"
    );

}



export async function deleteOrder(order) {

    checkAdmin();


    await deleteDoc(
        doc(db, "orders", order.id)
    );


    await safeLog(
        `Admin usunął zamówienie: ${order.product}`,
        "deleted"
    );

}
