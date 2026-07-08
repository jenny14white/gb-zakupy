import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase';

export function loginAdmin(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logoutAdmin() {
  return signOut(auth);
}
