import {
    addDoc,
    collection,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from "firebase/firestore";

import {
    auth,
    db,
} from "../firebase/firebase";


const ADMIN_UID =
    "kRulgEcxNed8aYacTWq3j9GgP4J2";


const LOG_LIMIT = 200;



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



export async function addLog(
    message,
    type = "info"
) {

    const cleanMessage =
        cleanText(message);


    if (!cleanMessage) {
        return;
    }


    await addDoc(
        collection(db, "logs"),
        {
            message: cleanMessage,

            type:
                cleanText(type) || "info",

            createdAt:
                serverTimestamp(),
        }
    );

}



export function listenToLogs(callback) {

    checkAdmin();


    const logsQuery =
        query(
            collection(db, "logs"),
            orderBy(
                "createdAt",
                "desc"
            ),
            limit(LOG_LIMIT)
        );


    return onSnapshot(
        logsQuery,
        snapshot => {

            const logs =
                snapshot.docs.map(
                    document => ({
                        id: document.id,
                        ...document.data(),
                    })
                );


            callback(logs);

        }
    );

}
