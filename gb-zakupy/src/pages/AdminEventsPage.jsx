import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase/firebase";

import AdminCalendar from "../components/admin/AdminCalendar";

import {
    createEvent,
    deleteEvent,
    listenToEvents,
    updateEvent,
} from "../services/calendarService";

import "../styles/admin-events.css";


const ADMIN_UIDS = [
    "kRulgEcxNed8aYacTWq3j9GgP4J2",
    "474lDJntS0agRKyLcnHTXfEf58n1",
];


const TYPES = [
    "meeting",
    "birthday",
    "company",
    "vacation",
    "holiday",
    "other",
];


const EMOJIS = [
    "📅",
    "🤝",
    "🎂",
    "🎉",
    "🏖️",
    "📢",
    "🚚",
    "🎄",
    "🇵🇱",
    "❤️",
    "⭐",
];


const createEmptyForm = () => ({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    type: "meeting",
    emoji: "📅",
    recurring: false,
});


export default function AdminEventsPage({ goBack }) {

    const { t } = useTranslation();

    const [authorized, setAuthorized] = useState(false);
    const [checking, setChecking] = useState(true);

    const [events, setEvents] = useState([]);

    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState(
        createEmptyForm()
    );


    /* =====================================================
       AUTHORIZATION
       ===================================================== */

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(
            auth,
            user => {

                setAuthorized(
                    Boolean(
                        user &&
                        ADMIN_UIDS.includes(user.uid)
                    )
                );

                setChecking(false);
            }
        );

        return unsubscribe;

    }, []);


    /* =====================================================
       EVENTS LISTENER
       ===================================================== */

    useEffect(() => {

        if (!authorized) {
            return;
        }

        return listenToEvents(setEvents);

    }, [authorized]);


    /* =====================================================
       STATISTICS
       ===================================================== */

    const stats = useMemo(() => {

        const now = new Date();

        return {

            all: events.length,

            recurring: events.filter(
                event => event.recurring
            ).length,

            upcoming: events.filter(event => {

                const date =
                    event.date?.toDate?.() ??
                    new Date(event.date);

                return date >= now;

            }).length,

        };

    }, [events]);


    /* =====================================================
       FORM CHANGE
       ===================================================== */

    function handleChange(e) {

        const {
            name,
            value,
            checked,
            type,
        } = e.target;

        setForm(prev => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));

    }


    /* =====================================================
       SUBMIT
       ===================================================== */

    async function handleSubmit(e) {

        e.preventDefault();


        if (!form.title.trim()) {

            alert(
                t("admin.events.errors.titleRequired")
            );

            return;
        }


        if (!form.date) {

            alert(
                t("admin.events.errors.dateRequired")
            );

            return;
        }


        try {

            const payload = {
                ...form,
                title: form.title.trim(),
                description: form.description.trim(),
                location: form.location.trim(),
                date: new Date(form.date),
            };


            if (editingId) {

                await updateEvent(
                    editingId,
                    payload
                );

            } else {

                await createEvent(payload);

            }


            setEditingId(null);

            setForm(
                createEmptyForm()
            );

        } catch (error) {

            console.error(
                "Błąd zapisywania wydarzenia:",
                error
            );

            alert(
                t("admin.events.errors.saveFailed")
            );

        }

    }


    /* =====================================================
       EDIT EVENT
       ===================================================== */

    function editEvent(event) {

        const date =
            event.date?.toDate?.() ??
            new Date(event.date);


        setEditingId(event.id);


        setForm({

            title: event.title || "",

            description: event.description || "",

            location: event.location || "",

            date:
                date
                    .toISOString()
                    .split("T")[0],

            time: event.time || "",

            type: event.type || "meeting",

            emoji: event.emoji || "📅",

            recurring: Boolean(
                event.recurring
            ),

        });


        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    }


    /* =====================================================
       DELETE EVENT
       ===================================================== */

    async function removeEvent(id) {

        const confirmed =
            window.confirm(
                t("admin.events.confirmDelete")
            );


        if (!confirmed) {
            return;
        }


        try {

            await deleteEvent(id);

        } catch (error) {

            console.error(
                "Błąd usuwania wydarzenia:",
                error
            );

            alert(
                t("admin.events.errors.deleteFailed")
            );

        }

    }


    /* =====================================================
       LOADING
       ===================================================== */

    if (checking) {

        return (

            <main className="admin-events-page">

                <section className="admin-events-card loading-card">

                    <h2>
                        🔐 {t("admin.events.checkingAccess")}
                    </h2>

                </section>

            </main>

        );

    }


    /* =====================================================
       NO ACCESS
       ===================================================== */

    if (!authorized) {

        return (

            <main className="admin-events-page">

                <section className="admin-events-card">

                    <div className="card-title">

                        <div>

                            <span className="admin-events-eyebrow">
                                GB PORTAL
                            </span>

                            <h2>
                                🔒 {t("admin.events.noAccess.title")}
                            </h2>

                        </div>

                    </div>


                    <p>
                        {t("admin.events.noAccess.description")}
                    </p>


                    <button
                        type="button"
                        className="back-button"
                        onClick={goBack}
                    >
                        ← {t("common.back")}
                    </button>

                </section>

            </main>

        );

    }


    /* =====================================================
       MAIN PAGE
       ===================================================== */

    return (

        <main className="admin-events-page">


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <header className="admin-events-header">

                <div>

                    <span className="admin-events-eyebrow">
                        GB PORTAL · ADMINISTRACJA
                    </span>


                    <h1>
                        📅 {t("admin.events.title")}
                    </h1>


                    <p className="admin-events-description">
                        {t("admin.events.description")}
                    </p>

                </div>


                <button
                    type="button"
                    className="back-button"
                    onClick={goBack}
                >
                    ← {t("common.back")}
                </button>

            </header>


            {/* =================================================
                FORM + STATISTICS
            ================================================= */}

            <section className="events-top">


                {/* =============================================
                    EVENT FORM
                ============================================= */}

                <section className="admin-events-card form-card">


                    <div className="card-title">

                        <div>

                            <h2>
                                {editingId
                                    ? `✏️ ${t("admin.events.editEvent")}`
                                    : `➕ ${t("admin.events.newEvent")}`}
                            </h2>

                            <p>
                                {editingId
                                    ? "Edytuj dane istniejącego wydarzenia."
                                    : "Dodaj nowe wydarzenie do kalendarza."}
                            </p>

                        </div>

                    </div>


                    <form
                        className="event-form"
                        onSubmit={handleSubmit}
                    >


                        <div className="event-form-grid">


                            {/* TITLE */}

                            <div className="form-group full">

                                <label htmlFor="event-title">
                                    Tytuł wydarzenia
                                </label>

                                <input
                                    id="event-title"
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    placeholder={t(
                                        "admin.events.placeholders.title"
                                    )}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />

                            </div>


                            {/* LOCATION */}

                            <div className="form-group full">

                                <label htmlFor="event-location">
                                    Lokalizacja
                                </label>

                                <input
                                    id="event-location"
                                    type="text"
                                    name="location"
                                    value={form.location}
                                    placeholder={t(
                                        "admin.events.placeholders.location"
                                    )}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />

                            </div>


                            {/* DATE */}

                            <div className="form-group">

                                <label htmlFor="event-date">
                                    Data
                                </label>

                                <input
                                    id="event-date"
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    onChange={handleChange}
                                />

                            </div>


                            {/* TIME */}

                            <div className="form-group">

                                <label htmlFor="event-time">
                                    Godzina
                                </label>

                                <input
                                    id="event-time"
                                    type="time"
                                    name="time"
                                    value={form.time}
                                    onChange={handleChange}
                                />

                            </div>


                            {/* TYPE */}

                            <div className="form-group">

                                <label htmlFor="event-type">
                                    Typ wydarzenia
                                </label>

                                <select
                                    id="event-type"
                                    name="type"
                                    value={form.type}
                                    onChange={handleChange}
                                >

                                    {TYPES.map(type => (

                                        <option
                                            key={type}
                                            value={type}
                                        >
                                            {t(
                                                `calendar.eventTypes.${type}`
                                            )}
                                        </option>

                                    ))}

                                </select>

                            </div>


                            {/* EMOJI */}

                            <div className="form-group">

                                <label htmlFor="event-emoji">
                                    Ikona wydarzenia
                                </label>

                                <select
                                    id="event-emoji"
                                    name="emoji"
                                    value={form.emoji}
                                    onChange={handleChange}
                                >

                                    {EMOJIS.map(icon => (

                                        <option
                                            key={icon}
                                            value={icon}
                                        >
                                            {icon}
                                        </option>

                                    ))}

                                </select>

                            </div>


                            {/* DESCRIPTION */}

                            <div className="form-group full">

                                <label htmlFor="event-description">
                                    Opis
                                </label>

                                <textarea
                                    id="event-description"
                                    name="description"
                                    value={form.description}
                                    placeholder={t(
                                        "admin.events.placeholders.description"
                                    )}
                                    onChange={handleChange}
                                />

                            </div>


                            {/* RECURRING */}

                            <div className="form-group full">

                                <label className="checkbox-row">

                                    <input
                                        type="checkbox"
                                        name="recurring"
                                        checked={form.recurring}
                                        onChange={handleChange}
                                    />

                                    <span>
                                        {t(
                                            "admin.events.fields.recurring"
                                        )}
                                    </span>

                                </label>

                            </div>


                        </div>


                        {/* SUBMIT */}

                        <button
                            className="save-event-button"
                            type="submit"
                        >

                            {editingId
                                ? `💾 ${t("admin.events.saveChanges")}`
                                : `➕ ${t("admin.events.addEvent")}`}

                        </button>


                    </form>

                </section>


                {/* =============================================
                    STATISTICS
                ============================================= */}

                <aside className="events-stats">


                    <div className="event-stat-card">

                        <span className="stat-number">
                            {stats.all}
                        </span>

                        <span className="stat-label">
                            {t("admin.events.stats.all")}
                        </span>

                    </div>


                    <div className="event-stat-card">

                        <span className="stat-number">
                            {stats.recurring}
                        </span>

                        <span className="stat-label">
                            {t("admin.events.stats.recurring")}
                        </span>

                    </div>


                    <div className="event-stat-card">

                        <span className="stat-number">
                            {stats.upcoming}
                        </span>

                        <span className="stat-label">
                            {t("admin.events.stats.upcoming")}
                        </span>

                    </div>


                </aside>


            </section>


            {/* =================================================
                CALENDAR
            ================================================= */}

            <section className="calendar-wrapper">

                <AdminCalendar
                    events={events}
                    onEdit={editEvent}
                    onDelete={removeEvent}
                />

            </section>


        </main>

    );

}
