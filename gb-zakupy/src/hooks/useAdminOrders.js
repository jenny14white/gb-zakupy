import { useEffect, useRef, useState } from 'react';
import { listenToOrders } from '../services/ordersService';

export function useAdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const initialized = useRef(false);
  const previousIds = useRef(new Set());

  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }

    const unsubscribe = listenToOrders((data) => {
      if (!initialized.current) {
        previousIds.current = new Set(data.map((order) => order.id));
        initialized.current = true;

        setOrders(data);
        setLoading(false);
        return;
      }

      data.forEach((order) => {
        if (!previousIds.current.has(order.id)) {
          if (Notification.permission === 'granted') {
            const notification = new Notification('📦 GB Zakupy', {
              body: `${order.requestedBy} dodał(a): ${order.product}`,
              icon: '/logo.png',
              badge: '/logo.png',
            });

            notification.onclick = () => {
              window.focus();
              notification.close();
            };
          }
        }
      });

      previousIds.current = new Set(data.map((order) => order.id));

      setOrders(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { orders, loading };
}
