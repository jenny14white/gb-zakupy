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
    "🎁",
    "🏆",
    "💼",
    "📌",
    "🔔",
    "🌟",
    "🥳",
    "🍾",
    "☀️",
];

const createEmptyForm = () => ({
    title: "",
    description: "",
    date: "",
    endDate: "",
    time: "",
    endTime: "",
    location: "",
    type: "meeting",
    emoji: "📅",
    recurring: false,
});

function formatDateForInput(value) {
    if (!value) {
        return "";
    }
    const date = value?.toDate?.() ?? new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "";
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export default function AdminEventsPage({ goBack }) {
    const { t } = useTranslation();
    const [authorized, setAuthorized] = useState(false);
    const [checking, setChecking] = useState(true);
    const [events, setEvents] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(createEmptyForm());

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setAuthorized(Boolean(user && ADMIN_UIDS.includes(user.uid)));
            setChecking(false);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!authorized) {
            return;
        }
        return listenToEvents(setEvents);
    }, [authorized]);

    const stats = useMemo(() => {
        const now = new Date();
        return {
            all: events.length,
            recurring: events.filter(event => event.recurring).length,
            upcoming: events.filter(event => {
                const date = event.date?.toDate?.() ?? new Date(event.date);
                return date >= now;
            }).length,
        };
    }, [events]);

    function handleChange(e) {
        const { name, value, checked, type } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    function handleEmojiChange(emoji) {
        setForm(prev => ({
            ...prev,
            emoji,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!form.title.trim()) {
            alert(t("admin.events.errors.titleRequired"));
            return;
        }

        if (!form.date) {
            alert(t("admin.events.errors.dateRequired"));
            return;
        }

        if (form.endDate && form.endDate < form.date) {
            alert("Data zakończenia nie może być wcześniejsza niż data rozpoczęcia.");
            return;
        }

        if (
            form.date === form.endDate &&
            form.time &&
            form.endTime &&
            form.endTime < form.time
        ) {
            alert("Godzina zakończenia nie może być wcześniejsza niż godzina rozpoczęcia.");
            return;
        }

        try {
            const payload = {
                ...form,
                title: form.title.trim(),
                description: form.description.trim(),
                location: form.location.trim(),
                date: new Date(form.date),
                endDate: new Date(form.endDate || form.date),
                time: form.time || "",
                endTime: form.endTime || "",
            };

            if (editingId) {
                await updateEvent(editingId, payload);
            } else {
                await createEvent(payload);
            }

            setEditingId(null);
            setForm(createEmptyForm());
        } catch (error) {
            console.error("Błąd zapisywania wydarzenia:", error);
            alert(t("admin.events.errors.saveFailed"));
        }
    }

    function editEvent(event) {
        const date = event.date?.toDate?.() ?? new Date(event.date);
        const endDate = event.endDate?.toDate?.() ?? (
            event.endDate ? new Date(event.endDate) : date
        );

        setEditingId(event.id);
        setForm({
            title: event.title || "",
            description: event.description || "",
            location: event.location || "",
            date: formatDateForInput(date),
            endDate: formatDateForInput(endDate),
            time: event.time || "",
            endTime: event.endTime || event.time || "",
            type: event.type || "meeting",
            emoji: event.emoji || "📅",
            recurring: Boolean(event.recurring),
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

        if (!confirmed) {
            return;
        }

        try {
            await deleteEvent(id);
        } catch (error) {
            console.error("Błąd usuwania wydarzenia:", error);
            alert(t("admin.events.errors.deleteFailed"));
        }
    }

    if (checking) {
        return (
            <main className="admin-events-page">
                <section className="admin-events-card loading-card">
                    <h2>🔐 {t("admin.events.checkingAccess")}</h2>
                </section>
            </main>
        );
    }

    if (!authorized) {
        return (
            <main className="admin-events-page">
                <section className="admin-events-card">
                    <div className="card-title">
                        <div>
                            <span className="admin-events-eyebrow">
                                SEKRETARIAT
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

    return (
        <main className="admin-events-page">
            <header className="admin-events-header">
                <div>
                    <span className="admin-events-eyebrow">
                        SEKRETARIAT
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
                            <div className="form-group full">
                                <label htmlFor="event-title">
                                    Tytuł wydarzenia
                                </label>
                                <input
                                    id="event-title"
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    placeholder={t("admin.events.placeholders.title")}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                            </div>

                            <div className="form-group full">
                                <label htmlFor="event-location">
                                    Lokalizacja
                                </label>
                                <input
                                    id="event-location"
                                    type="text"
                                    name="location"
                                    value={form.location}
                                    placeholder={t("admin.events.placeholders.location")}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="event-date">
                                    Data od
                                </label>
                                <input
                                    id="event-date"
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="event-end-date">
                                    Data do
                                </label>
                                <input
                                    id="event-end-date"
                                    type="date"
                                    name="endDate"
                                    value={form.endDate}
                                    min={form.date || undefined}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="event-time">
                                    Godzina od
                                </label>
                                <input
                                    id="event-time"
                                    type="time"
                                    name="time"
                                    value={form.time}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="event-end-time">
                                    Godzina do
                                </label>
                                <input
                                    id="event-end-time"
                                    type="time"
                                    name="endTime"
                                    value={form.endTime}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group full">
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
                                            {t(`calendar.eventTypes.${type}`)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group full">
                                <label>
                                    Ikona wydarzenia
                                </label>
                                <div
                                    className="event-emoji-grid"
                                    role="radiogroup"
                                    aria-label="Ikona wydarzenia"
                                >
                                    {EMOJIS.map(icon => (
                                        <button
                                            key={icon}
                                            type="button"
                                            className={`event-emoji-option ${
                                                form.emoji === icon
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() => handleEmojiChange(icon)}
                                            aria-label={`Wybierz ikonę ${icon}`}
                                            aria-pressed={form.emoji === icon}
                                        >
                                            <span>{icon}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group full">
                                <label htmlFor="event-description">
                                    Opis
                                </label>
                                <textarea
                                    id="event-description"
                                    name="description"
                                    value={form.description}
                                    placeholder={t("admin.events.placeholders.description")}
                                    onChange={handleChange}
                                />
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
                            className="save-event-button"
                            type="submit"
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
