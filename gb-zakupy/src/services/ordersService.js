import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

import {
  auth,
  db,
} from '../firebase/firebase';

import { ORDER_STATUS } from '../utils/constants';
import { sortByDateDesc } from '../utils/dateUtils';
import { addLog } from './logsService';

const ADMIN_EMAIL = 'belacount4@gmail.com';

function checkAdmin() {
  const user = auth.currentUser;

  if (!user || user.email !== ADMIN_EMAIL) {
    throw new Error('Brak uprawnień administratora');
  }
}

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

    acceptedAt: null,
    completedAt: null,

    // zostawiamy dla zgodności ze starszymi rekordami
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
    const orders = snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));

    callback(sortByDateDesc(orders, 'createdAt'));
  });
}

export async function updateOrder(orderId, data) {
  try {
    checkAdmin();

    const updatedOrder = {
      requestedBy: data.requestedBy.trim(),
      product: data.product.trim(),
      quantity: Number(data.quantity),
      unit: data.unit,
      adminComment: data.adminComment.trim(),
      updatedAt: serverTimestamp(),
    };

    await updateDoc(doc(db, 'orders', orderId), updatedOrder);

    await addLog(
      `Admin edytował zamówienie: ${updatedOrder.product}`,
      'edited'
    );
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

export async function markNotificationAsRead(order) {
  if (order.notificationRead) return;

  try {
    checkAdmin();

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
    console.error(error);
    alert(error.message);
  }
}

export async function markOrderAsAccepted(
  order,
  adminComment = ''
) {
  if (order.status === ORDER_STATUS.ACCEPTED) return;

  try {
    checkAdmin();

    await updateDoc(doc(db, 'orders', order.id), {
      status: ORDER_STATUS.ACCEPTED,

      adminComment: adminComment.trim(),

      acceptedAt: serverTimestamp(),

      notificationRead: true,
      notificationReadAt: serverTimestamp(),

      updatedAt: serverTimestamp(),
    });

    await addLog(
      `Admin przyjął do realizacji: ${order.product}`,
      'accepted'
    );
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

export async function markOrderAsCompleted(
  order,
  adminComment = ''
) {
  if (order.status === ORDER_STATUS.COMPLETED) return;

  try {
    checkAdmin();

    await updateDoc(doc(db, 'orders', order.id), {
      status: ORDER_STATUS.COMPLETED,

      adminComment: adminComment.trim(),

      completedAt: serverTimestamp(),

      updatedAt: serverTimestamp(),
    });

    await addLog(
      `Admin oznaczył jako zrealizowane: ${order.product}`,
      'completed'
    );
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

export async function deleteOrder(order) {
  try {
    checkAdmin();

    await deleteDoc(doc(db, 'orders', order.id));

    await addLog(
      `Admin usunął zamówienie: ${order.product}`,
      'deleted'
    );
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}
