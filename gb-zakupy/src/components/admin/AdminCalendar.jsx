import { useMemo, useState } from "react";
import { POLISH_FIXED_HOLIDAYS } from "../../data/polishHolidays";
import { UNUSUAL_HOLIDAYS } from "../../data/unusualHolidays";

const WEEK_DAYS = ["Pn","Wt","Śr","Cz","Pt","So","Nd"];
const MONTHS = ["Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"];
const EVENT_TYPE_LABELS = {
    meeting: "Spotkanie",
    birthday: "Urodziny",
    vacation: "Urlop",
    holiday: "Święto",
    other: "Inne",
    special: "Nietypowe",
};
const ALL_HOLIDAYS = [
    ...POLISH_FIXED_HOLIDAYS,
    ...UNUSUAL_HOLIDAYS,
];

function getDateKey(date) {
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2,"0"),
        String(date.getDate()).padStart(2,"0"),
    ].join("-");
}

function normalizeDate(value) {
    if (!value) {
        return null;
    }
    const date = value?.toDate?.() ?? new Date(value);
    if (Number.isNaN(date.getTime())) {
        return null;
    }
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );
}

function getEventEndDate(event,startDate) {
    if (!event?.endDate) {
        return startDate;
    }
    const endDate = event.endDate?.toDate?.() ?? new Date(event.endDate);
    if (Number.isNaN(endDate.getTime())) {
        return startDate;
    }
    return new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
    );
}

function createHolidayEvents(year) {
    return ALL_HOLIDAYS.map((holiday,index) => {
        const date = new Date(
            year,
            holiday.month - 1,
            holiday.day
        );
        return {
            id: `holiday-${year}-${holiday.month}-${holiday.day}-${index}`,
            title: holiday.title,
            description: "",
            location: "",
            date,
            endDate: date,
            time: "",
            endTime: "",
            type: holiday.type,
            emoji: holiday.emoji,
            recurring: true,
            systemHoliday: true,
            publicHoliday: holiday.publicHoliday ?? false,
        };
    });
}

export default function AdminCalendar({
    events = [],
    onEdit,
    onDelete,
}) {
    const today = new Date();
    const [currentMonth,setCurrentMonth] = useState(
        new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        )
    );
    const [selectedDate,setSelectedDate] = useState(today);
    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();

    const holidayEvents = useMemo(
        () => createHolidayEvents(year),
        [year]
    );

    const eventMap = useMemo(() => {
        const map = {};

        function addEventToDate(date,event) {
            const key = getDateKey(date);
            if (!map[key]) {
                map[key] = [];
            }
            map[key].push(event);
        }

        events.forEach(event => {
            const startDate = normalizeDate(event.date);
            if (!startDate) {
                return;
            }

            const endDate = getEventEndDate(
                event,
                startDate
            );

            let currentDate = new Date(startDate);

            while (
                currentDate.getTime() <=
                endDate.getTime()
            ) {
                addEventToDate(
                    currentDate,
                    event
                );
                currentDate.setDate(
                    currentDate.getDate() + 1
                );
            }
        });

        holidayEvents.forEach(holiday => {
            addEventToDate(
                holiday.date,
                holiday
            );
        });

        Object.keys(map).forEach(key => {
            const uniqueEvents = [];
            const seen = new Set();

            map[key].forEach(event => {
                const uniqueKey = event.systemHoliday
                    ? `holiday-${event.title}`
                    : `event-${event.id}`;

                if (seen.has(uniqueKey)) {
                    return;
                }

                seen.add(uniqueKey);
                uniqueEvents.push(event);
            });

            map[key] = uniqueEvents;
        });

        return map;
    },[events,holidayEvents]);

    const calendarDays = useMemo(() => {
        const firstDay = new Date(
            year,
            month,
            1
        );
        const offset =
            firstDay.getDay() === 0
                ? 6
                : firstDay.getDay() - 1;
        const startDate = new Date(
            year,
            month,
            1 - offset
        );

        return Array.from(
            { length: 42 },
            (_,index) => {
                const date = new Date(startDate);
                date.setDate(
                    startDate.getDate() + index
                );
                return date;
            }
        );
    },[year,month]);

    function changeMonth(step) {
        setCurrentMonth(
            new Date(
                year,
                month + step,
                1
            )
        );
    }

    function goToday() {
        const now = new Date();

        setCurrentMonth(
            new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            )
        );

        setSelectedDate(now);
    }

    function getEvents(date) {
        return eventMap[getDateKey(date)] || [];
    }

    const selectedEvents = getEvents(selectedDate);

    return (
        <section className="calendar-wrapper">
            <div className="calendar-header">
                <div className="calendar-navigation">
                    <button
                        type="button"
                        className="calendar-nav"
                        onClick={() => changeMonth(-1)}
                        aria-label="Poprzedni miesiąc"
                    >
                        ←
                    </button>
                    <button
                        type="button"
                        className="calendar-nav"
                        onClick={() => changeMonth(1)}
                        aria-label="Następny miesiąc"
                    >
                        →
                    </button>
                </div>
                <h2>
                    {MONTHS[month]} {year}
                </h2>
                <button
                    type="button"
                    className="calendar-today"
                    onClick={goToday}
                >
                    📅 Dzisiaj
                </button>
            </div>

            <div className="react-calendar">
                <div className="react-calendar__month-view">
                    <div className="react-calendar__month-view__weekdays">
                        {WEEK_DAYS.map(day => (
                            <div
                                key={day}
                                className="react-calendar__month-view__weekdays__weekday"
                            >
                                <abbr>{day}</abbr>
                            </div>
                        ))}
                    </div>

                    <div className="react-calendar__month-view__days">
                        {calendarDays.map(date => (
                            <CalendarDay
                                key={date.toISOString()}
                                date={date}
                                currentMonth={currentMonth}
                                today={today}
                                selectedDate={selectedDate}
                                onSelect={setSelectedDate}
                                events={getEvents(date)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <aside className="calendar-events">
                <div className="calendar-events-header">
                    <div>
                        <h3>
                            {selectedDate.toLocaleDateString(
                                "pl-PL",
                                {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                }
                            )}
                        </h3>
                        <p>Wybrane wydarzenia</p>
                    </div>
                    <span className="calendar-events-count">
                        {selectedEvents.length}
                    </span>
                </div>

                {!selectedEvents.length ? (
                    <div className="calendar-empty">
                        <div className="calendar-empty-icon">
                            📅
                        </div>
                        <h3>Brak wydarzeń</h3>
                        <p>
                            Na wybrany dzień nie dodano jeszcze żadnych wydarzeń.
                        </p>
                    </div>
                ) : (
                    selectedEvents.map(event => {
                        const date = normalizeDate(event.date);
                        const endDate = getEventEndDate(
                            event,
                            date
                        );
                        const isMultiDay =
                            !event.systemHoliday &&
                            getDateKey(date) !==
                            getDateKey(endDate);
                        const typeLabel =
                            EVENT_TYPE_LABELS[event.type] ||
                            event.type ||
                            "Wydarzenie";

                        return (
                            <article
                                key={event.id}
                                className={`calendar-event-card ${
                                    event.systemHoliday
                                        ? "calendar-event-card--system"
                                        : ""
                                }`}
                            >
                                <div className="calendar-event-bar" />

                                <div className="calendar-event-time">
                                    <strong>
                                        {event.time || "--:--"}
                                    </strong>

                                    {event.endTime && (
                                        <span>
                                            {event.endTime}
                                        </span>
                                    )}

                                    <span>
                                        {date?.toLocaleDateString(
                                            "pl-PL",
                                            {
                                                day: "numeric",
                                                month: "short",
                                            }
                                        )}
                                    </span>

                                    {isMultiDay && (
                                        <>
                                            <span>→</span>
                                            <span>
                                                {endDate.toLocaleDateString(
                                                    "pl-PL",
                                                    {
                                                        day: "numeric",
                                                        month: "short",
                                                    }
                                                )}
                                            </span>
                                        </>
                                    )}
                                </div>

                                <div className="calendar-event-content">
                                    <div className="calendar-event-category">
                                        {typeLabel}
                                        {event.systemHoliday && (
                                            <span>
                                                {event.publicHoliday
                                                    ? " · dzień wolny"
                                                    : " · kalendarz"}
                                            </span>
                                        )}
                                    </div>

                                    <h4>
                                        {event.emoji || "📅"}{" "}
                                        {event.title}
                                    </h4>

                                    {event.location && (
                                        <p>
                                            📍 {event.location}
                                        </p>
                                    )}

                                    {event.description && (
                                        <p>
                                            {event.description}
                                        </p>
                                    )}

                                    {event.recurring &&
                                    !event.systemHoliday && (
                                        <div>
                                            🔁 Powtarzające się wydarzenie
                                        </div>
                                    )}
                                </div>

                                {!event.systemHoliday && (
                                    <div className="calendar-event-actions">
                                        <button
                                            type="button"
                                            className="calendar-event-action"
                                            onClick={() => onEdit?.(event)}
                                            aria-label="Edytuj wydarzenie"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            type="button"
                                            className="calendar-event-action"
                                            onClick={() => onDelete?.(event.id)}
                                            aria-label="Usuń wydarzenie"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                )}
                            </article>
                        );
                    })
                )}
            </aside>
        </section>
    );
}

function CalendarDay({
    date,
    currentMonth,
    today,
    selectedDate,
    onSelect,
    events,
}) {
    const isToday =
        date.toDateString() ===
        today.toDateString();

    const isSelected =
        date.toDateString() ===
        selectedDate.toDateString();

    const isCurrentMonth =
        date.getMonth() === currentMonth.getMonth() &&
        date.getFullYear() === currentMonth.getFullYear();

    const isOutsideMonth = !isCurrentMonth;
    const dayOfWeek = date.getDay();
    const isWeekend =
        dayOfWeek === 0 ||
        dayOfWeek === 6;

    const holidayEvents = events.filter(
        event => event.systemHoliday
    );

    const userEvents = events.filter(
        event => !event.systemHoliday
    );

    const classes = [
        "react-calendar__tile",
        isToday ? "react-calendar__tile--now" : "",
        isSelected ? "react-calendar__tile--active" : "",
        isOutsideMonth
            ? "react-calendar__tile--neighboringMonth"
            : "",
        isWeekend
            ? "react-calendar__tile--weekend"
            : "",
        holidayEvents.length
            ? "calendar-tile-holiday"
            : "",
    ].filter(Boolean).join(" ");

    return (
        <button
            type="button"
            className={classes}
            onClick={() => onSelect(date)}
        >
            <abbr>
                {date.getDate()}
            </abbr>

            {holidayEvents.length > 0 && (
                <div className="calendar-holiday-markers">
                    {holidayEvents.slice(0,2).map(event => (
                        <span
                            key={event.id}
                            className="calendar-holiday-emoji"
                            title={event.title}
                        >
                            {event.emoji}
                        </span>
                    ))}
                </div>
            )}

            {userEvents.length === 1 && (
                <div className="calendar-event-dot" />
            )}

            {userEvents.length >= 2 &&
            userEvents.length <= 3 && (
                <div className="calendar-event-dots">
                    {userEvents.map((_,index) => (
                        <span key={index} />
                    ))}
                </div>
            )}

            {userEvents.length > 3 && (
                <div className="calendar-more-events">
                    +{userEvents.length}
                </div>
            )}

            {userEvents[0]?.type && (
                <div className="calendar-day-chip">
                    {EVENT_TYPE_LABELS[userEvents[0].type] ||
                        userEvents[0].type}
                </div>
            )}
        </button>
    );
}
