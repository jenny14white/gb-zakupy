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

const EMPTY_FORM = {
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    type: "meeting",
    emoji: "📅",
    recurring: false,
};

export default function AdminEventsPage({
    goBack,
}) {

    const { t } = useTranslation();

    const [authorized, setAuthorized] = useState(false);

    const [checking, setChecking] = useState(true);

    const [events, setEvents] = useState([]);

    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState(EMPTY_FORM);

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {

                if (
                    user &&
                    user.email === "belacount4@gmail.com"
                ) {

                    setAuthorized(true);

                } else {

                    setAuthorized(false);

                }

                setChecking(false);

            }
        );

        return () => unsubscribe();

    }, []);

    useEffect(() => {

        if (!authorized)
            return;

        const unsubscribe =
            listenToEvents(setEvents);

        return unsubscribe;

    }, [authorized]);

    const stats = useMemo(() => {

        const now = new Date();

const upcoming = events.filter(event => {

    const date =
        event.date?.toDate?.() ??
        new Date(event.date);

    return date >= now;

}).length;
        const recurring = events.filter(

            event => event.recurring

        ).length;

        return {

            all: events.length,

            recurring,

            upcoming,

        };

    }, [events]);

    function handleChange(event) {

        const {
            name,
            value,
            checked,
            type,
        } = event.target;

        setForm(previous => ({

            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,

        }));

    }

    async function handleSubmit(event) {

        event.preventDefault();

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

        const payload = {

            ...form,

            date: new Date(form.date),

        };
                try {

            if (editingId) {

                await updateEvent(
                    editingId,
                    payload
                );

            } else {

                await createEvent(
                    payload
                );

            }

            setEditingId(null);

            setForm(EMPTY_FORM);

        } catch (error) {

            console.error(error);

            alert(
                t("admin.events.errors.saveFailed")
            );

        }

    }

    function editEvent(event) {

        const date =
            event.date?.toDate?.() ??
            new Date(event.date);

        setEditingId(event.id);

        setForm({

            title:
                event.title || "",

            description:
                event.description || "",

            location:
                event.location || "",

            date:
                date
                    .toISOString()
                    .split("T")[0],

            time:
                event.time || "",

            type:
                event.type || "meeting",

            emoji:
                event.emoji || "📅",

            recurring:
                event.recurring || false,

        });

        window.scrollTo({

            top: 0,

            behavior: "smooth",

        });

    }

    async function removeEvent(id) {

        const confirmed = window.confirm(

            t("admin.events.confirmDelete")

        );

        if (!confirmed)
            return;

        try {

            await deleteEvent(id);

        } catch (error) {

            console.error(error);

            alert(

                t("admin.events.errors.deleteFailed")

            );

        }

    }

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

    if (!authorized) {

        return (

            <main className="admin-events-page">

                <section className="admin-events-card">

                    <h1>

                        🔒 {t("admin.events.noAccess.title")}

                    </h1>

                    <p>

                        {t("admin.events.noAccess.description")}

                    </p>

                    <button

                        className="back-button"

                        onClick={goBack}

                    >

                        ← {t("common.back")}

                    </button>

                </section>

            </main>

        );

    }

    return (

        <main className="admin-events-page">

            <header className="admin-events-header">

                <div>

                    <p className="admin-events-eyebrow">

                        GB Portal

                    </p>

                    <h1>

                        📅 {t("admin.events.title")}

                    </h1>

                    <p className="admin-events-description">

                        {t("admin.events.description")}

                    </p>

                </div>

                <button

                    className="back-button"

                    onClick={goBack}

                >

                    ← {t("common.back")}

                </button>

            </header>

            <section className="events-top">
                                <section className="admin-events-card form-card">

                    <div className="card-title">

                        <div>

                            <h2>

                                {editingId
                                    ? `✏️ ${t("admin.events.editEvent")}`
                                    : `➕ ${t("admin.events.newEvent")}`}

                            </h2>

                            <p>

                                {t("admin.events.formDescription")}

                            </p>

                        </div>

                    </div>

                    <form
                        className="event-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="event-form-grid">

                            <div className="form-group">

                                <label>

                                    {t("admin.events.fields.title")}

                                </label>

                                <input
                                    name="title"
                                    value={form.title}
                                    placeholder={t("admin.events.placeholders.title")}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="form-group">

                                <label>

                                    {t("admin.events.fields.location")}

                                </label>

                                <input
                                    name="location"
                                    value={form.location}
                                    placeholder={t("admin.events.placeholders.location")}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="form-group full">

                                <label>

                                    {t("admin.events.fields.description")}

                                </label>

                                <textarea
                                    rows="5"
                                    name="description"
                                    value={form.description}
                                    placeholder={t("admin.events.placeholders.description")}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="form-group">

                                <label>

                                    {t("admin.events.fields.date")}

                                </label>

                                <input
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="form-group">

                                <label>

                                    {t("admin.events.fields.time")}

                                </label>

                                <input
                                    type="time"
                                    name="time"
                                    value={form.time}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="form-group">

                                <label>

                                    {t("admin.events.fields.type")}

                                </label>

                                <select
                                    name="type"
                                    value={form.type}
                                    onChange={handleChange}
                                >

                                    {TYPES.map(type => (

                                        <option
                                            key={type}
                                            value={type}
                                        >

                                            {t(`calendar.eventTypes.${type}`)}

                                        </option>

                                    ))}

                                </select>

                            </div>

                            <div className="form-group">

                                <label>

                                    {t("admin.events.fields.icon")}

                                </label>

                                <select
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

                            <div className="form-group full">

                                <label className="checkbox-row">

                                    <input
                                        type="checkbox"
                                        name="recurring"
                                        checked={form.recurring}
                                        onChange={handleChange}
                                    />

                                    <span>

                                        {t("admin.events.fields.recurring")}

                                    </span>

                                </label>

                            </div>

                        </div>

                        <button
                            type="submit"
                            className="save-event-button"
                        >

                            {editingId
                                ? `💾 ${t("admin.events.saveChanges")}`
                                : `➕ ${t("admin.events.addEvent")}`}

                        </button>

                    </form>

                </section>

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
