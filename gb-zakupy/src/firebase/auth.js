import {
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from './firebase';
import { ADMIN_EMAIL } from '../utils/constants';

export async function loginAdmin(email, password) {
  if (email.trim().toLowerCase() !== ADMIN_EMAIL?.toLowerCase()) {
    throw new Error('Brak uprawnień administratora.');
  }

  return signInWithEmailAndPassword(auth, email, password);
}

export async function logoutAdmin() {
  return signOut(auth);
}
