import {
    doc,
    getDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";


const SETTINGS_COLLECTION = "settings";
const ACCESS_DOCUMENT = "access";


let cachedCode = null;


function normalizeCode(value){

    return String(value || "")
        .trim()
        .toUpperCase();

}



export async function checkAccessCode(code){

    const inputCode =
        normalizeCode(code);


    if(!inputCode){
        return false;
    }


    try{

        if(!cachedCode){

            const snapshot =
                await getDoc(
                    doc(
                        db,
                        SETTINGS_COLLECTION,
                        ACCESS_DOCUMENT
                    )
                );


            if(!snapshot.exists()){
                return false;
            }


            cachedCode =
                normalizeCode(
                    snapshot.data()?.code
                );


            if(!cachedCode){
                return false;
            }

        }


        return inputCode === cachedCode;


    }catch(error){

        console.error(
            "Access code error:",
            error
        );

        return false;

    }

}
