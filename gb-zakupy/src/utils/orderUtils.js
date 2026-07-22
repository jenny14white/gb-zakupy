import { ORDER_STATUS } from './constants';
import { getMonthYear, sortByDateDesc } from './dateUtils';

export function getPendingOrders(orders) {
  return orders.filter(
    (order) =>
      order.status === ORDER_STATUS.PENDING ||
      order.status === ORDER_STATUS.ACCEPTED ||
      order.status === ORDER_STATUS.ORDERED
  );
}

export function getCompletedOrders(orders) {
  return orders.filter(
    (order) => order.status === ORDER_STATUS.COMPLETED
  );
}

export function groupOrdersByCompletedMonth(orders) {
  const groups = {};

  orders.forEach((order) => {
    const month = getMonthYear(order.completedAt);

    if (!groups[month]) {
      groups[month] = [];
    }

    groups[month].push(order);
  });

  return Object.entries(groups).map(([month, items]) => ({
    month,
    items: sortByDateDesc(items, 'completedAt'),
  }));
}
