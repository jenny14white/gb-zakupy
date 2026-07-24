import {
    signInWithEmailAndPassword,
    signInAnonymously,
    signOut,
} from "firebase/auth";

import { auth } from "./firebase";


const ADMIN_EMAIL =
    "belacount4@gmail.com";


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


    if (
        credential.user.email !== ADMIN_EMAIL
    ) {
        await signOut(auth);

        throw new Error(
            "Brak uprawnień administratora"
        );
    }


    return credential.user;

}



export async function loginPortal() {

    const credential =
        await signInAnonymously(auth);


    return credential.user;

}



export async function logoutAdmin() {

    await signOut(auth);

}



export async function logoutPortal() {

    await signOut(auth);

}
