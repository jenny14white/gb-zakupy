import { POLISH_FIXED_HOLIDAYS } from '../data/polishHolidays';
import { UNUSUAL_HOLIDAYS } from '../data/unusualHolidays';
import { getEasterDate, addDays } from './easter';

function toEvent(date, title, emoji, type = 'holiday', publicHoliday = false) {
  return {
    date,
    title,
    emoji,
    type,
    publicHoliday,
  };
}

function fixedHolidayToDate(year, holiday) {
  return toEvent(
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
    toEvent(
      easter,
      'Wielkanoc',
      '🐣',
      'holiday',
      true
    ),

    toEvent(
      addDays(easter, 1),
      'Poniedziałek Wielkanocny',
      '🐣',
      'holiday',
      true
    ),

    toEvent(
      addDays(easter, 49),
      'Zielone Świątki',
      '🌿',
      'holiday',
      true
    ),

    toEvent(
      addDays(easter, 60),
      'Boże Ciało',
      '✝️',
      'holiday',
      true
    );
  ];
}

export function getFixedHolidays(year) {
  return POLISH_FIXED_HOLIDAYS.map((holiday) =>
    fixedHolidayToDate(year, holiday)
  );
}

export function getUnusualHolidays(year) {
  return UNUSUAL_HOLIDAYS.map((holiday) =>
    toEvent(
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
    return (
      event.date.getFullYear() === date.getFullYear() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getDate() === date.getDate()
    );
  });
}

export function hasEvents(date, events) {
  return getEventsForDate(date, events).length > 0;
}
