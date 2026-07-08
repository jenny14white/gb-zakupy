import { useState } from 'react';
import { createOrder } from '../../services/ordersService';
import { UNITS } from '../../utils/constants';

export default function ShoppingForm() {
  const [requestedBy, setRequestedBy] = useState('');
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('szt.');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!requestedBy.trim() || !product.trim() || !quantity.trim()) {
      setIsError(true);
      setMessage('Uzupełnij imię, produkt oraz ilość.');
      return;
    }

    try {
      setLoading(true);
      setIsError(false);

      await createOrder({
        requestedBy,
        product,
        quantity,
        unit,
      });

      setMessage(`Pomyślnie dodano: ${product}`);
      setProduct('');
      setQuantity('1');
      setUnit('szt.');

      setTimeout(() => setMessage(''), 3500);
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMessage('Nie udało się dodać produktu.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="shopping-form" onSubmit={handleSubmit}>
      {message && (
        <div className={isError ? 'error-message' : 'success-message'}>
          {message}
        </div>
      )}

      <label>
        Imię *
        <input
          value={requestedBy}
          onChange={(event) => setRequestedBy(event.target.value)}
          placeholder="Wpisz swoje imię"
        />
      </label>

      <label>
        Co potrzeba zamówić? *
        <textarea
          rows="4"
          value={product}
          onChange={(event) => setProduct(event.target.value)}
          placeholder="Np. mleko, kawa, długopisy..."
        />
      </label>

      <div className="form-row">
        <label>
          Ilość *
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
        </label>

        <label>
          Jednostka
          <select
            value={unit}
            onChange={(event) => setUnit(event.target.value)}
          >
            {UNITS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>

      <button className="submit-button" disabled={loading}>
        {loading ? 'Dodawanie...' : 'Dodaj do listy'}
      </button>
    </form>
  );
}
