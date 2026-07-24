import { useMemo, useState } from "react";

import "../../styles/admin-calendar.css";

const WEEK_DAYS = [
    "Pn",
    "Wt",
    "Śr",
    "Cz",
    "Pt",
    "So",
    "Nd",
];

const MONTHS = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
];

export default function AdminCalendar({
    events = [],
    onEdit,
    onDelete,
}) {
    const today = new Date();

    const [currentMonth, setCurrentMonth] = useState(
        new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        )
    );

    const [selectedDate, setSelectedDate] =
        useState(today);

    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();

    const firstDay = new Date(year, month, 1);

    const offset =
        firstDay.getDay() === 0
            ? 6
            : firstDay.getDay() - 1;

    const daysInMonth = new Date(
        year,
        month + 1,
        0
    ).getDate();

    const calendarDays = [
        ...Array(offset).fill(null),
        ...Array.from(
            { length: daysInMonth },
            (_, index) =>
                new Date(
                    year,
                    month,
                    index + 1
                )
        ),
    ];

    function changeMonth(step) {
        setCurrentMonth(
            new Date(
                year,
                month + step,
                1
            )
        );
    }

    function goToToday() {
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

    function getEventsForDay(date) {
        return events.filter(event => {
            const eventDate =
                event.date?.toDate?.() ??
                new Date(event.date);

            return (
                eventDate.getFullYear() === date.getFullYear() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getDate() === date.getDate()
            );
        });
    }

    const selectedEvents = useMemo(
        () => getEventsForDay(selectedDate),
        [events, selectedDate]
    );

    return (
        <section className="calendar-wrapper">

            <div className="calendar-header">

                <div className="calendar-navigation">

                    <button
                        className="calendar-nav"
                        onClick={() => changeMonth(-1)}
                    >
                        ←
                    </button>

                    <button
                        className="calendar-nav"
                        onClick={() => changeMonth(1)}
                    >
                        →
                    </button>

                </div>

                <h2>
                    {MONTHS[month]} {year}
                </h2>

                <button
                    className="calendar-today"
                    onClick={goToToday}
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

                        {calendarDays.map((date, index) => (

                            <CalendarDay
                                key={
                                    date
                                        ? date.toISOString()
                                        : `empty-${index}`
                                }
                                date={date}
                                today={today}
                                selectedDate={selectedDate}
                                onSelect={setSelectedDate}
                                events={date ? getEventsForDay(date) : []}
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

                        <p>

                            Wybrane wydarzenia

                        </p>

                    </div>

                    <span className="calendar-events-count">

                        {selectedEvents.length}

                    </span>

                </div>
                                {selectedEvents.length === 0 ? (

                    <div className="calendar-empty">

                        <div className="calendar-empty-icon">
                            📅
                        </div>

                        <h3>
                            Brak wydarzeń
                        </h3>

                        <p>
                            Na wybrany dzień nie dodano jeszcze żadnych wydarzeń.
                        </p>

                    </div>

                ) : (

                    selectedEvents.map(event => {

                        const eventDate =
                            event.date?.toDate?.() ??
                            new Date(event.date);

                        return (

                            <article
                                key={event.id}
                                className="calendar-event-card"
                            >

                                <div className="calendar-event-bar" />

                                <div className="calendar-event-time">

                                    <strong>
                                        {event.time || "--:--"}
                                    </strong>

                                    <span>

                                        {eventDate.toLocaleDateString(
                                            "pl-PL",
                                            {
                                                day: "numeric",
                                                month: "short",
                                            }
                                        )}

                                    </span>

                                </div>

                                <div className="calendar-event-content">

    {event.type && (

        <div className="calendar-event-category">

            {event.type}

        </div>

    )}

                                    <h4>

                                        {event.emoji || "📅"} {event.title}

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

                                    {event.recurring && (

                                        <div>

                                            🔁 Powtarzające się wydarzenie

                                        </div>

                                    )}

                                </div>

                                <div className="calendar-event-actions">

                                    <button
                                        type="button"
                                        className="calendar-event-action"
                                        onClick={() => onEdit(event)}
                                    >
                                        ✏️
                                    </button>

                                    <button
    type="button"
    className="calendar-event-action"
    onClick={() => onDelete(event.id)}
>
    🗑️
</button>

                                </div>

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
    today,
    selectedDate,
    onSelect,
    events,
}) {

    if (!date) {
    return (
        <div
            className="react-calendar__tile"
            style={{ visibility: "hidden" }}
        />
    );
}

    const isToday =
        date.toDateString() === today.toDateString();

    const isSelected =
        date.toDateString() === selectedDate.toDateString();

    return (

        <button
            type="button"
            className={`
                react-calendar__tile
                ${isToday ? "react-calendar__tile--now" : ""}
                ${isSelected ? "react-calendar__tile--active" : ""}
            `}
            onClick={() => onSelect(date)}
        >

            <abbr>
                {date.getDate()}
            </abbr>

            {events.length === 1 && (
                <div className="calendar-event-dot" />
            )}

            {events.length === 2 && (
                <div className="calendar-event-dots">
                    <span />
                    <span />
                </div>
            )}

            {events.length === 3 && (
                <div className="calendar-event-dots">
                    <span />
                    <span />
                    <span />
                </div>
            )}

            {events.length > 3 && (
                <div className="calendar-more-events">
                    +{events.length}
                </div>
            )}

            {events[0]?.type && (
                <div className="calendar-day-chip">
                    {events[0].type}
                </div>
            )}

        </button>

    );

}
