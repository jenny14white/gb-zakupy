export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

export const ORDER_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  ORDERED: 'ordered',
};

export const ORDER_STATUS_LABELS = {
  pending: '🟡 Oczekuje na realizację',
  accepted: '🟢 Przyjęto do realizacji',
  ordered: '✅ Zamówione',
};

export const UNITS = [
  'szt.',
  'op.',
  'kpl.',
  'karton',
  'l',
  'kg',
];
