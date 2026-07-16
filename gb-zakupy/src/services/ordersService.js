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
import { ORDER_STATUS } from '../utils/constants';
import { sortByDateDesc } from '../utils/dateUtils';
import { addLog } from './logsService';

export async function createOrder(data) {
  const order = {
    requestedBy: data.requestedBy.trim(),
    product: data.product.trim(),
    quantity: Number(data.quantity),
    unit: data.unit,
    status: ORDER_STATUS.PENDING,
    adminComment: '',
    notificationRead: false,
    notificationReadAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    orderedAt: null,
  };

  await addDoc(collection(db, 'orders'), order);

  await addLog(
    `${order.requestedBy} dodał/a produkt: ${order.product}, ${order.quantity} ${order.unit}`,
    'created'
  );
}

export function listenToOrders(callback) {
  return onSnapshot(collection(db, 'orders'), (snapshot) => {
    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(sortByDateDesc(orders, 'createdAt'));
  });
}

export async function updateOrder(orderId, data) {
  const updatedOrder = {
    requestedBy: data.requestedBy.trim(),
    product: data.product.trim(),
    quantity: Number(data.quantity),
    unit: data.unit,
    adminComment: data.adminComment.trim(),
    updatedAt: serverTimestamp(),
  };

  try {
    await updateDoc(doc(db, 'orders', orderId), updatedOrder);

    await addLog(
      `Admin edytował zamówienie: ${updatedOrder.product}`,
      'edited'
    );
  } catch (error) {
    console.error('Błąd podczas edycji:', error);
    alert(error.message);
  }
}

export async function markNotificationAsRead(order) {
  if (order.notificationRead) return;

  try {
    await updateDoc(doc(db, 'orders', order.id), {
      notificationRead: true,
      notificationReadAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await addLog(
      `Admin oznaczył powiadomienie jako przeczytane: ${order.product}`,
      'read'
    );
  } catch (error) {
    console.error('Błąd podczas oznaczania powiadomienia:', error);
    alert(error.message);
  }
}

/* ================= NOWE ================= */

export async function markOrderAsAccepted(order, adminComment = '') {
  if (order.status === ORDER_STATUS.ACCEPTED) return;

  try {
    await updateDoc(doc(db, 'orders', order.id), {
      status: ORDER_STATUS.ACCEPTED,
      adminComment: adminComment.trim(),
      updatedAt: serverTimestamp(),
    });

    await addLog(
      `Admin przyjął do realizacji: ${order.product}`,
      'accepted'
    );
  } catch (error) {
    console.error('Błąd podczas przyjmowania zamówienia:', error);
    alert(error.message);
  }
}

/* ======================================== */

export async function markOrderAsOrdered(order, adminComment) {
  if (order.status === ORDER_STATUS.ORDERED) return;

  try {
    await updateDoc(doc(db, 'orders', order.id), {
      status: ORDER_STATUS.ORDERED,
      adminComment: adminComment.trim(),
      notificationRead: true,
      notificationReadAt: serverTimestamp(),
      orderedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await addLog(
      `Admin oznaczył jako zamówione: ${order.product}`,
      'ordered'
    );
  } catch (error) {
    console.error('Błąd podczas oznaczania jako zamówione:', error);
    alert(error.message);
  }
}

export async function deleteOrder(order) {
  try {
    await deleteDoc(doc(db, 'orders', order.id));

    await addLog(
      `Admin usunął zamówienie: ${order.product}`,
      'deleted'
    );
  } catch (error) {
    console.error('Błąd podczas usuwania zamówienia:', error);
    alert(error.message);
  }
}
