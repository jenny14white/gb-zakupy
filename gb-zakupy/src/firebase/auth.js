import {
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
} from "firebase/auth";

import { auth } from "./firebase";





// ==========================
// ADMIN LOGIN
// ==========================

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


  return credential.user;


}






// ==========================
// PORTAL ACCESS LOGIN
// ==========================

export async function loginPortal(){

  const credential =
    await signInAnonymously(auth);


  return credential.user;


}






// ==========================
// ADMIN LOGOUT
// ==========================

export async function logoutAdmin(){

  await signOut(auth);

}






// ==========================
// PORTAL LOGOUT
// ==========================

export async function logoutPortal(){

  await signOut(auth);

}
