import { ORDER_STATUS } from './constants';
import { getMonthYear, sortByDateDesc } from './dateUtils';

export function getPendingOrders(orders) {
  return orders.filter(
    (order) =>
      order.status === ORDER_STATUS.PENDING ||
      order.status === ORDER_STATUS.ACCEPTED
  );
}

export function getOrderedOrders(orders) {
  return orders.filter(
    (order) => order.status === ORDER_STATUS.ORDERED
  );
}

export function groupOrdersByOrderedMonth(orders) {
  const groups = {};

  orders.forEach((order) => {
    const month = getMonthYear(order.orderedAt);

    if (!groups[month]) {
      groups[month] = [];
    }

    groups[month].push(order);
  });

  return Object.entries(groups).map(([month, items]) => ({
    month,
    items: sortByDateDesc(items, 'orderedAt'),
  }));
}
