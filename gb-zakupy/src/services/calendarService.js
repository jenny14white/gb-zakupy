import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

import { db } from '../firebase/firebase';

const EVENTS_COLLECTION = 'events';

function normalizeEvent(event) {
  return {
    id: event.id,
    title: event.title || '',
    description: event.description || '',
    type: event.type || 'inne',
    date: event.date,
    time: event.time || '',
    location: event.location || '',
    emoji: event.emoji || '📅',
    recurring: event.recurring || false,
    createdAt: event.createdAt || null,
    updatedAt: event.updatedAt || null,
  };
}

export function listenToEvents(callback) {
  return onSnapshot(collection(db, EVENTS_COLLECTION), (snapshot) => {
    const events = snapshot.docs
      .map((document) =>
        normalizeEvent({
          id: document.id,
          ...document.data(),
        })
      )
      .sort((a, b) => {
        const dateA = a.date?.toDate?.() ?? new Date(a.date);
        const dateB = b.date?.toDate?.() ?? new Date(b.date);

        return dateA - dateB;
      });

    callback(events);
  });
}

export async function getAllCalendarEvents() {
  const snapshot = await getDocs(collection(db, EVENTS_COLLECTION));

  return snapshot.docs
    .map((document) =>
      normalizeEvent({
        id: document.id,
        ...document.data(),
      })
    )
    .sort((a, b) => {
      const dateA = a.date?.toDate?.() ?? new Date(a.date);
      const dateB = b.date?.toDate?.() ?? new Date(b.date);

      return dateA - dateB;
    });
}

export function getEventsForDate(events, date) {
  return events.filter((event) => {
    const eventDate = event.date?.toDate?.() ?? new Date(event.date);

    return (
      eventDate.getFullYear() === date.getFullYear() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getDate() === date.getDate()
    );
  });
}

export async function createEvent(data) {
  await addDoc(collection(db, EVENTS_COLLECTION), {
    title: data.title.trim(),
    description: data.description?.trim() || '',
    type: data.type || 'inne',
    date: data.date,
    time: data.time || '',
    location: data.location || '',
    emoji: data.emoji || '📅',
    recurring: data.recurring || false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateEvent(id, data) {
  await updateDoc(doc(db, EVENTS_COLLECTION, id), {
    title: data.title.trim(),
    description: data.description?.trim() || '',
    type: data.type || 'inne',
    date: data.date,
    time: data.time || '',
    location: data.location || '',
    emoji: data.emoji || '📅',
    recurring: data.recurring || false,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteEvent(id) {
  await deleteDoc(doc(db, EVENTS_COLLECTION, id));
}
