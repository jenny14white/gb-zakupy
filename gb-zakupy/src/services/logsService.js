import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

export async function addLog(message, type = 'info') {
  await addDoc(collection(db, 'logs'), {
    message,
    type,
    createdAt: serverTimestamp(),
  });
}

export function listenToLogs(callback) {
  const q = query(
    collection(db, 'logs'),
    orderBy('createdAt', 'desc'),
    limit(200)
  );

  return onSnapshot(q, (snapshot) => {
    const logs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(logs);
  });
}
