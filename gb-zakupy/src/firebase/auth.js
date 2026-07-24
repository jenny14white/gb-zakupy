import {
    signInWithEmailAndPassword,
    signInAnonymously,
    signOut,
} from "firebase/auth";

import { auth } from "./firebase";


export async function loginAdmin(email, password) {

    const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
    );

    return credential.user;

}


export async function loginPortal() {

    const credential = await signInAnonymously(auth);

    return credential.user;

}


export async function logoutAdmin() {

    await signOut(auth);

}


export async function logoutPortal() {

    await signOut(auth);

}
