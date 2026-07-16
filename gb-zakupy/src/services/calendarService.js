import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

import { db } from '../firebase/firebase';

const EVENTS_COLLECTION = 'events';

export function listenToEvents(callback) {
  return onSnapshot(collection(db, EVENTS_COLLECTION), (snapshot) => {
    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    events.sort((a, b) => {
      const dateA = a.date?.toDate?.() || new Date(a.date);
      const dateB = b.date?.toDate?.() || new Date(b.date);
      return dateA - dateB;
    });

    callback(events);
  });
}

export async function createEvent(data) {
  await addDoc(collection(db, EVENTS_COLLECTION), {
    title: data.title.trim(),
    description: data.description?.trim() || '',
    type: data.type,
    date: data.date,
    time: data.time || '',
    recurring: data.recurring || false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateEvent(id, data) {
  await updateDoc(doc(db, EVENTS_COLLECTION, id), {
    title: data.title.trim(),
    description: data.description?.trim() || '',
    type: data.type,
    date: data.date,
    time: data.time || '',
    recurring: data.recurring || false,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteEvent(id) {
  await deleteDoc(doc(db, EVENTS_COLLECTION, id));
}
