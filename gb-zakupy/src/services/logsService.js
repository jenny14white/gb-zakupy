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

const ADMIN_UID = "kRulgEcxNed8aYacTWq3j9GgP4J2";

function checkAdmin() {
    const user = auth.currentUser;

    if (!user || user.uid !== ADMIN_UID) {
        throw new Error(
            "Brak uprawnień administratora"
        );
    }
}

export async function addLog(
    message,
    type = "info"
) {
    await addDoc(
        collection(db, "logs"),
        {
            message,
            type,
            createdAt: serverTimestamp(),
        }
    );
}

export function listenToLogs(callback) {

    checkAdmin();

    const q = query(
        collection(db, "logs"),
        orderBy(
            "createdAt",
            "desc"
        ),
        limit(200)
    );

    return onSnapshot(
        q,
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
