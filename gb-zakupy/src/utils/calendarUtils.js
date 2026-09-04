import { POLISH_FIXED_HOLIDAYS } from "../data/polishHolidays";
import { UNUSUAL_HOLIDAYS } from "../data/unusualHolidays";
import { addDays, getEasterDate } from "./easter";



function createEvent(
    date,
    title,
    emoji,
    type = "holiday",
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
        new Date(
            year,
            holiday.month - 1,
            holiday.day
        ),
        holiday.title,
        holiday.emoji,
        holiday.type,
        holiday.publicHoliday
    );
}



export function getMovableHolidays(year) {

    const easter =
        getEasterDate(year);

    return [
        createEvent(
            easter,
            "Wielkanoc",
            "🐣",
            "holiday",
            true
        ),

        createEvent(
            addDays(easter, 1),
            "Poniedziałek Wielkanocny",
            "🐣",
            "holiday",
            true
        ),

        createEvent(
            addDays(easter, 49),
            "Zielone Świątki",
            "🌿",
            "holiday",
            true
        ),

        createEvent(
            addDays(easter, 60),
            "Boże Ciało",
            "✝️",
            "holiday",
            true
        ),
    ];

}



export function getFixedHolidays(year) {

    return POLISH_FIXED_HOLIDAYS.map(
        holiday =>
            fixedHolidayToEvent(
                year,
                holiday
            )
    );

}



export function getUnusualHolidays(year) {

    return UNUSUAL_HOLIDAYS.map(
        holiday =>
            createEvent(
                new Date(
                    year,
                    holiday.month - 1,
                    holiday.day
                ),
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
    ].sort(
        (a, b) => a.date - b.date
    );

}



function normalizeDate(date) {

    if (!date)
        return null;

    if (
        typeof date.toDate === "function"
    ) {
        return date.toDate();
    }

    if (date instanceof Date)
        return date;

    const normalized =
        new Date(date);

    if (Number.isNaN(normalized.getTime()))
        return null;

    return normalized;

}



function normalizeDay(date) {

    const value =
        normalizeDate(date);

    if (!value)
        return null;

    return new Date(
        value.getFullYear(),
        value.getMonth(),
        value.getDate()
    );

}



function isDateInEventRange(
    date,
    event
) {

    const currentDate =
        normalizeDay(date);

    const startDate =
        normalizeDay(event.date);

    const endDate =
        normalizeDay(
            event.endDate || event.date
        );

    if (
        !currentDate ||
        !startDate ||
        !endDate
    ) {
        return false;
    }

    return (
        currentDate.getTime() >=
            startDate.getTime() &&

        currentDate.getTime() <=
            endDate.getTime()
    );

}



export function getEventsForDate(
    date,
    events = []
) {

    return events.filter(
        event =>
            isDateInEventRange(
                date,
                event
            )
    );

}



export function hasEvents(
    date,
    events
) {

    return getEventsForDate(
        date,
        events
    ).length > 0;

}



export function isSameDay(
    first,
    second
) {

    const firstDate =
        normalizeDate(first);

    const secondDate =
        normalizeDate(second);

    if (
        !firstDate ||
        !secondDate
    ) {
        return false;
    }

    return (
        firstDate.getFullYear() ===
            secondDate.getFullYear() &&

        firstDate.getMonth() ===
            secondDate.getMonth() &&

        firstDate.getDate() ===
            secondDate.getDate()
    );

}



export function isToday(date) {

    return isSameDay(
        date,
        new Date()
    );

}



export function isCurrentMonth(
    date,
    currentDate
) {

    const value =
        normalizeDate(date);

    const current =
        normalizeDate(currentDate);

    if (
        !value ||
        !current
    ) {
        return false;
    }

    return (
        value.getMonth() ===
            current.getMonth() &&

        value.getFullYear() ===
            current.getFullYear()
    );

}



export function generateCalendarDays(
    currentDate
) {

    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();



    const firstDay =
        new Date(
            year,
            month,
            1
        );



    const offset =
        (firstDay.getDay() + 6) % 7;



    const start =
        new Date(firstDay);



    start.setDate(
        firstDay.getDate() - offset
    );



    return Array.from(
        {
            length: 42
        },
        (_, index) => {

            const day =
                new Date(start);

            day.setDate(
                start.getDate() + index
            );

            return day;

        }
    );

}



export function formatDate(date) {

    const value =
        normalizeDate(date);



    if (!value)
        return "";



    return value.toLocaleDateString(
        "pl-PL",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        }
    );

}
