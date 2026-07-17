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

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const unsubscribe = listenToEvents(setEvents);
    return unsubscribe;
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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
        await updateEvent(editingId, payload);
      } else {
        await createEvent(payload);
      }

      setEditingId(null);
      setForm(emptyForm);
    } catch (err) {
      console.error(err);
      alert('Nie udało się zapisać wydarzenia.');
    }
  }

  function editEvent(event) {
    const date =
      event.date?.toDate?.() ?? new Date(event.date);

    setEditingId(event.id);

    setForm({
      title: event.title || '',
      description: event.description || '',
      location: event.location || '',
      time: event.time || '',
      type: event.type || 'spotkanie',
      emoji: event.emoji || '📅',
      recurring: event.recurring || false,
      date: date.toISOString().split('T')[0],
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  async function removeEvent(id) {
    if (!window.confirm('Usunąć wydarzenie?')) return;

    try {
      await deleteEvent(id);
    } catch (err) {
      console.error(err);
      alert('Nie udało się usunąć wydarzenia.');
    }
  }

  return (
    <div className="admin-events-page">

      <h1>Kalendarz firmowy</h1>

      <form
        className="event-form"
        onSubmit={handleSubmit}
      >

        <input
          name="title"
          placeholder="Tytuł"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Opis"
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

        <input
          name="location"
          placeholder="Miejsce"
          value={form.location}
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

        <label>
          <input
            type="checkbox"
            name="recurring"
            checked={form.recurring}
            onChange={handleChange}
          />

          Wydarzenie cykliczne
        </label>

        <button type="submit">
          {editingId
            ? 'Zapisz zmiany'
            : 'Dodaj wydarzenie'}
        </button>

      </form>

      <hr />

      <h2>Lista wydarzeń</h2>

      {events.length === 0 && (
        <p>Brak wydarzeń.</p>
      )}

      {events.map((event) => {
        const date =
          event.date?.toDate?.() ??
          new Date(event.date);

        return (
          <div
            key={event.id}
            className="admin-event-card"
          >
            <h3>
              {event.emoji} {event.title}
            </h3>

            <p>
              📅 {date.toLocaleDateString('pl-PL')}
            </p>

            {event.time && (
              <p>🕒 {event.time}</p>
            )}

            {event.location && (
              <p>📍 {event.location}</p>
            )}

            <p>
              Typ: {event.type}
            </p>

            {event.description && (
              <p>{event.description}</p>
            )}

            <div className="admin-event-actions">

              <button
                onClick={() =>
                  editEvent(event)
                }
              >
                Edytuj
              </button>

              <button
                onClick={() =>
                  removeEvent(event.id)
                }
              >
                Usuń
              </button>

            </div>
          </div>
        );
      })}
    </div>
  );
}
