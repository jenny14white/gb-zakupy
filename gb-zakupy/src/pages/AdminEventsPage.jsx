import { useEffect, useState } from 'react';
import {
  createEvent,
  deleteEvent,
  listenToEvents,
  updateEvent,
} from '../services/calendarService';

const TYPES = [
  'spotkanie',
  'urodziny',
  'firma',
  'urlop',
  'holiday',
  'inne',
];

const EMOJIS = [
  '📅',
  '🤝',
  '🎂',
  '🎉',
  '🏖️',
  '📢',
  '🚚',
  '🎄',
  '🇵🇱',
  '❤️',
  '⭐',
];

const emptyForm = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  type: 'spotkanie',
  emoji: '📅',
  recurring: false,
};

export default function AdminEventsPage({
  goBack,
}) {
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const unsubscribe = listenToEvents(setEvents);
    return unsubscribe;
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } =
      e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim()) {
      alert('Podaj tytuł wydarzenia');
      return;
    }

    if (!form.date) {
      alert('Wybierz datę');
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
    } catch (err) {
      console.error(err);
      alert(
        'Nie udało się zapisać wydarzenia.'
      );
    }
  }

  function editEvent(event) {
    const date =
      event.date?.toDate?.() ??
      new Date(event.date);

    setEditingId(event.id);

    setForm({
      title: event.title || '',
      description:
        event.description || '',
      location:
        event.location || '',
      time: event.time || '',
      type:
        event.type || 'spotkanie',
      emoji:
        event.emoji || '📅',
      recurring:
        event.recurring || false,
      date:
        date
          .toISOString()
          .split('T')[0],
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  async function removeEvent(id) {
    if (
      !window.confirm(
        'Usunąć wydarzenie?'
      )
    )
      return;

    try {
      await deleteEvent(id);
    } catch (err) {
      console.error(err);
      alert(
        'Nie udało się usunąć wydarzenia.'
      );
    }
  }

  return (
    <main className="admin-events-page">

      <header className="admin-events-header">

        <div>

          <p className="admin-events-eyebrow">
            GB Zakupy
          </p>

          <h1>
            📅 Zarządzanie wydarzeniami
          </h1>

          <p className="admin-events-description">
            Dodawaj i edytuj wydarzenia,
            które będą widoczne
            w kalendarzu firmowym.
          </p>

        </div>

        {goBack && (
          <button
            className="back-button"
            onClick={goBack}
          >
            ← Powrót
          </button>
        )}

      </header>

      <section className="admin-events-card">

        <h2>
          {editingId
            ? '✏️ Edycja wydarzenia'
            : '➕ Nowe wydarzenie'}
        </h2>

        <form
          className="event-form"
          onSubmit={handleSubmit}
        >

          <div className="event-form-grid">

            <input
              name="title"
              placeholder="Tytuł wydarzenia"
              value={form.title}
              onChange={handleChange}
              required
            />

            <input
              name="location"
              placeholder="Miejsce"
              value={form.location}
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Opis wydarzenia"
              value={form.description}
              onChange={handleChange}
            />

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />

            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
            />

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

            <select
              name="emoji"
              value={form.emoji}
              onChange={handleChange}
            >
              {EMOJIS.map((emoji) => (
                <option
                  key={emoji}
                  value={emoji}
                >
                  {emoji}
                </option>
              ))}
            </select>
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

          <button
            type="submit"
            className="save-event-button"
          >
            {editingId
              ? '💾 Zapisz zmiany'
              : '➕ Dodaj wydarzenie'}
          </button>

        </form>

      </section>

      <section className="admin-events-list">

        <div className="section-title">

          <h2>
            📋 Lista wydarzeń
          </h2>

          <span className="events-count">
            {events.length} wydarzeń
          </span>

        </div>

        {events.length === 0 && (

          <div className="empty-events">

            <div className="empty-events-icon">
              📅
            </div>

            <h3>
              Brak wydarzeń
            </h3>

            <p>
              Dodaj pierwsze wydarzenie,
              aby pojawiło się
              w kalendarzu firmowym.
            </p>

          </div>

        )}

        {events.map((event) => {

          const date =
            event.date?.toDate?.() ??
            new Date(event.date);

          return (

            <article
              key={event.id}
              className="admin-event-card"
            >

              <div className="admin-event-top">

                <div className="admin-event-icon">

                  {event.emoji || '📅'}

                </div>

                <div className="admin-event-info">

                  <h3>

                    {event.title}

                  </h3>

                  <span className="admin-event-type">

                    {event.type}

                  </span>

                </div>

              </div>

              <div className="admin-event-details">

                <p>

                  📅{' '}

                  {date.toLocaleDateString(
                    'pl-PL'
                  )}

                </p>

                {event.time && (

                  <p>

                    🕒 {event.time}

                  </p>

                )}

                {event.location && (

                  <p>

                    📍 {event.location}

                  </p>

                )}

              </div>

              {event.description && (

                <div className="admin-event-description">

                  {event.description}

                </div>

              )}

              <div className="admin-event-actions">
                                <button
                  type="button"
                  className="edit-event-button"
                  onClick={() =>
                    editEvent(event)
                  }
                >
                  ✏️ Edytuj
                </button>

                <button
                  type="button"
                  className="delete-event-button"
                  onClick={() =>
                    removeEvent(event.id)
                  }
                >
                  🗑 Usuń
                </button>

              </div>

            </article>

          );

        })}

      </section>

    </main>

  );
}
