export function formatDate(value) {
  if (!value) return '';

  if (value?.toDate) {
    return value.toDate().toLocaleString('pl-PL');
  }

  if (value instanceof Date) {
    return value.toLocaleString('pl-PL');
  }

  return String(value);
}

export function getDateObject(value) {
  if (!value) return null;
  if (value?.toDate) return value.toDate();
  if (value instanceof Date) return value;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getMonthYear(value) {
  const date = getDateObject(value);

  if (!date) return 'Bez daty';

  return date.toLocaleDateString('pl-PL', {
    month: 'long',
    year: 'numeric',
  });
}

export function sortByDateDesc(items, fieldName) {
  return [...items].sort((a, b) => {
    const dateA = getDateObject(a[fieldName]);
    const dateB = getDateObject(b[fieldName]);

    return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
  });
}
