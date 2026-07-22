export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

export const ORDER_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  COMPLETED: 'completed',
};

export const ORDER_STATUS_LABELS = {
  pending: '🟡 Oczekujące',
  accepted: '🟢 Przyjęte do realizacji',
  completed: '🟣 Zrealizowane',
};

export const UNITS = [
  'szt.',
  'op.',
  'kpl.',
  'karton',
  'l',
  'kg',
];
