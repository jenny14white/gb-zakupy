import { useEffect, useMemo, useState } from 'react';
import { listenToOrders } from '../services/ordersService';
import { getPendingOrders } from '../utils/orderUtils';

export function usePublicOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToOrders((data) => {
      setOrders(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const publicOrders = useMemo(() => getPendingOrders(orders), [orders]);

  return { orders: publicOrders, loading };
}
