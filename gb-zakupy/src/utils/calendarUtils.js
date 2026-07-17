import { POLISH_FIXED_HOLIDAYS } from '../data/polishHolidays';
import { UNUSUAL_HOLIDAYS } from '../data/unusualHolidays';
import { addDays, getEasterDate } from './easter';

function createEvent(
  date,
  title,
  emoji,
  type = 'holiday',
  publicHoliday = false
) {
  return {
    date,
    title,
    emoji,
    type,
    publicHoliday,
  };
}

function fixedHolidayToEvent(year, holiday) {
  return createEvent(
    new Date(year, holiday.month - 1, holiday.day),
    holiday.title,
    holiday.emoji,
    holiday.type,
    holiday.publicHoliday
  );
}

export function getMovableHolidays(year) {
  const easter = getEasterDate(year);

  return [
    createEvent(
      easter,
      'Wielkanoc',
      '🐣',
      'holiday',
      true
    ),

    createEvent(
      addDays(easter, 1),
      'Poniedziałek Wielkanocny',
      '🐣',
      'holiday',
      true
    ),

    createEvent(
      addDays(easter, 49),
      'Zielone Świątki',
      '🌿',
      'holiday',
      true
    ),

    createEvent(
      addDays(easter, 60),
      'Boże Ciało',
      '✝️',
      'holiday',
      true
    ),
  ];
}

export function getFixedHolidays(year) {
  return POLISH_FIXED_HOLIDAYS.map((holiday) =>
    fixedHolidayToEvent(year, holiday)
  );
}

export function getUnusualHolidays(year) {
  return UNUSUAL_HOLIDAYS.map((holiday) =>
    createEvent(
      new Date(year, holiday.month - 1, holiday.day),
      holiday.title,
      holiday.emoji,
      holiday.type,
      false
    )
  );
}

export function getAllCalendarEvents(year) {
  return [
    ...getFixedHolidays(year),
    ...getMovableHolidays(year),
    ...getUnusualHolidays(year),
  ].sort((a, b) => a.date - b.date);
}

export function getEventsForDate(date, events) {
  return events.filter((event) => {
    const eventDate =
      event.date?.toDate?.() ??
      (event.date instanceof Date
        ? event.date
        : new Date(event.date));

    return isSameDay(eventDate, date);
  });
}

export function hasEvents(date, events) {
  return getEventsForDate(date, events).length > 0;
}

export function isSameDay(first, second) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

export function isToday(date) {
  return isSameDay(date, new Date());
}

export function isCurrentMonth(date, currentDate) {
  return (
    date.getMonth() === currentDate.getMonth() &&
    date.getFullYear() === currentDate.getFullYear()
  );
}

export function generateCalendarDays(currentDate) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);

  const mondayOffset =
    (firstDay.getDay() + 6) % 7;

  const startDate = new Date(firstDay);

  startDate.setDate(
    firstDay.getDate() - mondayOffset
  );

  const days = [];

  for (let i = 0; i < 42; i++) {
    const day = new Date(startDate);

    day.setDate(startDate.getDate() + i);

    days.push(day);
  }

  return days;
}

export function formatDate(date) {
  return date.toLocaleDateString('pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
