import { useEffect, useState } from 'react';
import { listenToOrders } from '../services/ordersService';

export function useAdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToOrders((data) => {
      setOrders(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { orders, loading };
}
