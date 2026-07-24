import {
    doc,
    getDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";


export async function checkAccessCode(code){

    if(!code){
        return false;
    }


    const snapshot =
        await getDoc(
            doc(
                db,
                "settings",
                "access"
            )
        );


    if(!snapshot.exists()){
        return false;
    }


    const savedCode =
        snapshot.data().code;


    return (
        code.trim().toUpperCase()
        ===
        savedCode.trim().toUpperCase()
    );

}
