import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import CalendarHeader from "./CalendarHeader";
import CalendarDay from "./CalendarDay";
import EventCard from "./EventCard";

import { listenToEvents } from "../../services/calendarService";

import {
    getAllCalendarEvents,
    getEventsForDate,
} from "../../utils/calendarUtils";

export default function Calendar() {

    const { t, i18n } = useTranslation();

    const WEEK_DAYS = [
        t("calendar.weekdays.mon"),
        t("calendar.weekdays.tue"),
        t("calendar.weekdays.wed"),
        t("calendar.weekdays.thu"),
        t("calendar.weekdays.fri"),
        t("calendar.weekdays.sat"),
        t("calendar.weekdays.sun"),
    ];

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [companyEvents, setCompanyEvents] = useState([]);

    useEffect(() => {
        const unsubscribe = listenToEvents(setCompanyEvents);
        return unsubscribe;
    }, []);

    const holidays = useMemo(() => {
        return getAllCalendarEvents(
            currentDate.getFullYear()
        );
    }, [currentDate]);

    const events = useMemo(() => {
        return [
            ...holidays,
            ...companyEvents,
        ];
    }, [
        holidays,
        companyEvents,
    ]);

    function previousMonth() {
        setCurrentDate((date) =>
            new Date(
                date.getFullYear(),
                date.getMonth() - 1,
                1
            )
        );
    }

    function nextMonth() {
        setCurrentDate((date) =>
            new Date(
                date.getFullYear(),
                date.getMonth() + 1,
                1
            )
        );
    }

    function today() {
        const now = new Date();

        setCurrentDate(now);
        setSelectedDate(now);
    }

    function handleDayClick(day) {
        setSelectedDate(day);
    }

    const selectedEvents = useMemo(() => {
        return getEventsForDate(
            selectedDate,
            events
        );
    }, [
        selectedDate,
        events,
    ]);

    const calendarDays = useMemo(() => {

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(
            year,
            month,
            1
        );

        const startOffset =
            (firstDay.getDay() + 6) % 7;

        const startDate = new Date(
            year,
            month,
            1 - startOffset
        );

        return Array.from(
            { length: 42 },
            (_, index) => {

                const day = new Date(startDate);

                day.setDate(
                    startDate.getDate() + index
                );

                const jsDay = day.getDay();

                return {
                    date: day,

                    events: getEventsForDate(
                        day,
                        events
                    ),

                    isCurrentMonth:
                        day.getMonth() === month &&
                        day.getFullYear() === year,

                    isToday:
                        day.toDateString() ===
                        new Date().toDateString(),

                    isSelected:
                        day.toDateString() ===
                        selectedDate.toDateString(),

                    isWeekend:
                        jsDay === 0 ||
                        jsDay === 6,

                };

            }
        );

    }, [
        currentDate,
        selectedDate,
        events,
    ]);

    return (

        <div className="calendar-wrapper">

            <main className="calendar-layout">

                <section className="calendar-main">

                    <CalendarHeader
                        currentDate={currentDate}
                        onPrev={previousMonth}
                        onNext={nextMonth}
                        onToday={today}
                    />

                    <div className="calendar-weekdays">

                        {WEEK_DAYS.map((day) => (

                            <div
                                key={day}
                                className="calendar-weekday"
                            >
                                {day}
                            </div>

                        ))}

                    </div>

                    <div className="calendar-grid">

                        {calendarDays.map(({
                            date,
                            events,
                            isToday,
                            isCurrentMonth,
                            isSelected,
                            isWeekend,
                        }) => (

                            <CalendarDay
                                key={date.toISOString()}
                                day={date}
                                events={events}
                                isToday={isToday}
                                isCurrentMonth={isCurrentMonth}
                                isSelected={isSelected}
                                isWeekend={isWeekend}
                                onClick={handleDayClick}
                            />

                        ))}

                    </div>

                </section>

                <aside className="calendar-sidebar">

                    <h3 className="selected-day">

                        {selectedDate.toLocaleDateString(
                            i18n.language,
                            {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            }
                        )}

                    </h3>

                    {selectedEvents.length === 0 ? (

                        <div className="calendar-empty">

                            <div className="calendar-empty-icon">
                                📅
                            </div>

                            <h4>
                                {t("calendar.empty.title")}
                            </h4>

                            <p>
                                {t("calendar.empty.description")}
                            </p>

                        </div>

                    ) : (

                        selectedEvents.map((event, index) => (

                            <EventCard
                                key={
                                    event.id ??
                                    `${event.title}-${index}`
                                }
                                event={event}
                            />

                        ))

                    )}

                </aside>

            </main>

        </div>

    );

}
