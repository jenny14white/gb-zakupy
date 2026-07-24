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

            <div className="calendar-layout">

                <div className="calendar-grid">

                    {WEEK_DAYS.map(day => (

                        <div
                            key={day}
                            className="calendar-weekday"
                        >

                            {day}

                        </div>

                    ))}
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

                                        <div className="calendar-event-category">

                                            {event.type || "Wydarzenie"}

                                        </div>

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

                                            <div className="calendar-recurring">

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
                                            className="calendar-event-action danger"
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

            </div>

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
            <div className="calendar-empty-tile" />
        );

    }

    const isToday =
        date.toDateString() === today.toDateString();

    const isSelected =
        date.toDateString() === selectedDate.toDateString();

    return (

        <button
            type="button"
            className={`calendar-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
            onClick={() => onSelect(date)}
        >

            <div className="calendar-day-top">

                <span className="calendar-number">

                    {date.getDate()}

                </span>

                {events.length > 0 && (

                    <span className="calendar-day-badge">

                        {events.length}

                    </span>

                )}

            </div>

            <div className="calendar-day-body">

                {events.slice(0, 2).map(event => (

                    <div
                        key={event.id}
                        className="calendar-day-item"
                    >

                        <span>

                            {event.emoji || "📅"}

                        </span>

                        <span>

                            {event.title}

                        </span>

                    </div>

                ))}

                {events.length === 0 && (

                    <div className="calendar-day-placeholder">

                        Brak wydarzeń

                    </div>

                )}

                {events.length > 2 && (

                    <div className="calendar-day-more">

                        +{events.length - 2} więcej

                    </div>

                )}

            </div>

        </button>

    );

}
