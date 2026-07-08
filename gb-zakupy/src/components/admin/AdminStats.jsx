export default function AdminStats({ allCount, pendingCount, orderedCount }) {
  return (
    <div className="stats">
      <div>
        <strong>{allCount}</strong>
        <span>Wszystkie zgłoszenia</span>
      </div>

      <div>
        <strong>{pendingCount}</strong>
        <span>Na liście zakupowej</span>
      </div>

      <div>
        <strong>{orderedCount}</strong>
        <span>Zamówione</span>
      </div>
    </div>
  );
}
