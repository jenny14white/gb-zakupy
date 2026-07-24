import { doc, getDoc } from "firebase/firestore";

import { db } from "../firebase/firebase";


const SETTINGS_COLLECTION = "settings";
const ACCESS_DOCUMENT = "access";


export async function checkAccessCode(code) {

    if (!code?.trim()) {
        return false;
    }


    const snapshot = await getDoc(
        doc(
            db,
            SETTINGS_COLLECTION,
            ACCESS_DOCUMENT
        )
    );


    if (!snapshot.exists()) {
        return false;
    }


    const savedCode =
        snapshot.data()?.code;


    if (!savedCode) {
        return false;
    }


    return (
        code.trim().toUpperCase() ===
        savedCode.trim().toUpperCase()
    );

}
