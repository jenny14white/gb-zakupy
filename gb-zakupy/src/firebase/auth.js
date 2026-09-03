import {
    signInWithEmailAndPassword,
    signInAnonymously,
    signOut,
} from "firebase/auth";

import {
    doc,
    setDoc,
    serverTimestamp,
} from "firebase/firestore";

import {
    auth,
    db,
} from "./firebase";


const ADMIN_UID =
    "kRulgEcxNed8aYacTWq3j9GgP4J2";


const SECRETARIAT_UID =
    "474lDJntS0agRKyLcnHTXfEf58n1";


const ADMIN_UIDS = [
    ADMIN_UID,
    SECRETARIAT_UID,
];


async function saveLastLogin(user){

    if(!user){
        return;
    }


    let role =
        "user";


    let name =
        user.email || "Użytkownik";


    if(user.uid === ADMIN_UID){

        role =
            "admin";

        name =
            "Liliana Szymikowska";

    }


    if(user.uid === SECRETARIAT_UID){

        role =
            "secretariat";

        name =
            "Sekretariat";

    }


    try{

        await setDoc(
            doc(
                db,
                "users",
                user.uid
            ),
            {
                uid:user.uid,
                email:user.email || "",
                name,
                role,
                lastLoginAt:
                    serverTimestamp(),
            },
            {
                merge:true,
            }
        );

    }catch(error){

        console.error(
            "Nie udało się zapisać ostatniego logowania:",
            error
        );

    }

}


export async function loginAdmin(
    email,
    password
){

    const credential =
        await signInWithEmailAndPassword(
            auth,
            email.trim(),
            password
        );


    const user =
        credential.user;


    if(
        !ADMIN_UIDS.includes(
            user.uid
        )
    ){

        await signOut(auth);

        throw new Error(
            "Brak uprawnień administratora"
        );

    }


    await saveLastLogin(user);


    return user;

}


export async function loginPortal(){

    const credential =
        await signInAnonymously(
            auth
        );


    return credential.user;

}


export async function logoutAdmin(){

    await signOut(auth);

}


export async function logoutPortal(){

    await signOut(auth);

}
