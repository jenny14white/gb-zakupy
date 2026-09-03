import {
    signInWithEmailAndPassword,
    signInAnonymously,
    signOut,
} from "firebase/auth";

import { auth } from "./firebase";

const ADMIN_UIDS = [
    "kRulgEcxNed8aYacTWq3j9GgP4J2",
    "474lDJntS0agRKyLcnHTXfEf58n1",
];

export async function loginAdmin(
    email,
    password
) {

    const credential =
        await signInWithEmailAndPassword(
            auth,
            email.trim(),
            password
        );

    const user =
        credential.user;

    if (!ADMIN_UIDS.includes(user.uid)) {

        await signOut(auth);

        throw new Error(
            "Brak uprawnień administratora"
        );

    }

    return user;
}

export async function loginPortal() {

    const credential =
        await signInAnonymously(
            auth
        );

    return credential.user;
}

export async function logoutAdmin() {

    await signOut(auth);

}

export async function logoutPortal() {

    await signOut(auth);

}
