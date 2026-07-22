import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase/firebase";

import AdminCalendar from "../components/admin/AdminCalendar";

import {
  createEvent,
  deleteEvent,
  listenToEvents,
  updateEvent,
} from "../services/calendarService";

const TYPES = [
  "spotkanie",
  "urodziny",
  "firma",
  "urlop",
  "holiday",
  "inne",
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

const emptyForm = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  type: "spotkanie",
  emoji: "📅",
  recurring: false,
};

export default function AdminEventsPage({
  goBack,
}) {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  const [events, setEvents] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  // ==========================================
  // FIREBASE AUTH
  // ==========================================

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

  // ==========================================
  // EVENT LISTENER
  // ==========================================

  useEffect(() => {
    if (!authorized) return;

    const unsubscribe =
      listenToEvents(setEvents);

    return unsubscribe;
  }, [authorized]);
    // ==========================================
  // FORM HANDLERS
  // ==========================================

  function handleChange(e) {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Podaj tytuł wydarzenia.");
      return;
    }

    if (!form.date) {
      alert("Wybierz datę wydarzenia.");
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
        await createEvent(payload);
      }

      setEditingId(null);
      setForm(emptyForm);
    } catch (error) {
      console.error(error);

      alert(
        "Nie udało się zapisać wydarzenia."
      );
    }
  }

  // ==========================================
  // EDIT EVENT
  // ==========================================

  function editEvent(event) {
    const date =
      event.date?.toDate?.() ??
      new Date(event.date);

    setEditingId(event.id);

    setForm({
      title: event.title || "",
      description:
        event.description || "",
      location:
        event.location || "",
      time: event.time || "",
      type:
        event.type || "spotkanie",
      emoji:
        event.emoji || "📅",
      recurring:
        event.recurring || false,
      date: date
        .toISOString()
        .split("T")[0],
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ==========================================
  // DELETE EVENT
  // ==========================================

  async function removeEvent(id) {
    const confirmed =
      window.confirm(
        "Czy na pewno usunąć wydarzenie?"
      );

    if (!confirmed) return;

    try {
      await deleteEvent(id);
    } catch (error) {
      console.error(error);

      alert(
        "Nie udało się usunąć wydarzenia."
      );
    }
  }
    // ==========================================
  // LOADING
  // ==========================================

  if (checking) {
    return (
      <main className="admin-events-page">

        <section className="admin-events-card loading-card">

          <h2>
            🔐 Sprawdzanie dostępu...
          </h2>

        </section>

      </main>
    );
  }

  // ==========================================
  // NO ACCESS
  // ==========================================

  if (!authorized) {
    return (
      <main className="admin-events-page">

        <section className="admin-events-card">

          <h1>
            🔒 Brak dostępu
          </h1>

          <p>
            Panel wydarzeń jest dostępny wyłącznie
            dla administratora.
          </p>

          <button
            className="back-button"
            onClick={goBack}
          >
            ← Powrót
          </button>

        </section>

      </main>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (

    <main className="admin-events-page">

      <header className="admin-events-header">

        <div>

          <p className="admin-events-eyebrow">
            GB Portal
          </p>

          <h1>
            📅 Zarządzanie wydarzeniami
          </h1>

          <p className="admin-events-description">
            Dodawaj, edytuj oraz zarządzaj
            wydarzeniami firmowymi.
          </p>

        </div>

        <button
          className="back-button"
          onClick={goBack}
        >
          ← Powrót
        </button>

      </header>

      <section className="events-top">

        <section className="admin-events-card form-card">

          <div className="card-title">

            <h2>

              {editingId
                ? "✏️ Edycja wydarzenia"
                : "➕ Nowe wydarzenie"}

            </h2>

            <p>

              Wypełnij formularz
              i zapisz wydarzenie.

            </p>

          </div>

          <form
            className="event-form"
            onSubmit={handleSubmit}
          >

            <div className="event-form-grid">

              <div className="form-group">

                <label>
                  Tytuł
                </label>

                <input
                  name="title"
                  placeholder="Np. Spotkanie Zarządu"
                  value={form.title}
                  onChange={handleChange}
                />

              </div>

              <div className="form-group">

                <label>
                  Lokalizacja
                </label>

                <input
                  name="location"
                  placeholder="Sala konferencyjna"
                  value={form.location}
                  onChange={handleChange}
                />

              </div>

              <div className="form-group full">

                <label>
                  Opis
                </label>

                <textarea
                  rows="5"
                  name="description"
                  value={form.description}
                  placeholder="Opis wydarzenia..."
                  onChange={handleChange}
                />

              </div>

              <div className="form-group">

                <label>
                  Data
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
                  Godzina
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
                  Typ wydarzenia
                </label>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                >

                  {TYPES.map((type) => (

                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>

                  ))}

                </select>

              </div>

              <div className="form-group">

                <label>
                  Ikona
                </label>

                <select
                  name="emoji"
                  value={form.emoji}
                  onChange={handleChange}
                >

                  {EMOJIS.map((icon) => (

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
                    Wydarzenie cykliczne
                  </span>

                </label>

              </div>

            </div>

            <button
              type="submit"
              className="save-event-button"
            >

              {editingId
                ? "💾 Zapisz zmiany"
                : "➕ Dodaj wydarzenie"}

            </button>

          </form>

        </section>

        <aside className="events-stats">

          <div className="event-stat-card">

            <span className="stat-number">
              {events.length}
            </span>

            <span className="stat-label">
              Wszystkie
            </span>

          </div>

          <div className="event-stat-card">

            <span className="stat-number">
              {
                events.filter(
                  (event) => event.recurring
                ).length
              }
            </span>

            <span className="stat-label">
              Cykliczne
            </span>

          </div>

          <div className="event-stat-card">

            <span className="stat-number">
              {
                events.filter((event) => {

                  const date =
                    event.date?.toDate?.() ??
                    new Date(event.date);

                  return date >= new Date();

                }).length
              }
            </span>

            <span className="stat-label">
              Nadchodzące
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
