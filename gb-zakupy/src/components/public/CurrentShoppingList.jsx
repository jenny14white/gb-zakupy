import EmptyState from '../shared/EmptyState';
import ShoppingListItem from './ShoppingListItem';

export default function CurrentShoppingList({ items, loading }) {
  return (
    <section className="current-list-wrapper">
      <h2>Aktualna lista zakupowa</h2>

      {loading && <EmptyState>Ładowanie listy...</EmptyState>}

      {!loading && items.length === 0 && (
        <EmptyState>Aktualna lista zakupowa jest pusta.</EmptyState>
      )}

      {!loading && items.length > 0 && (
        <div className="current-list">
          {items.map((item) => (
            <ShoppingListItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
