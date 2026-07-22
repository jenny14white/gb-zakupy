export default function AdminStats({
  allCount,
  pendingCount,
  acceptedCount,
  completedCount,
}) {
  return (
    <div className="stats">
      <div>
        <strong>{allCount}</strong>
        <span>📋 Wszystkie zgłoszenia</span>
      </div>

      <div>
        <strong>{pendingCount}</strong>
        <span>🟡 Oczekujące</span>
      </div>

      <div>
        <strong>{acceptedCount}</strong>
        <span>🟢 Przyjęte do realizacji</span>
      </div>

      <div>
        <strong>{completedCount}</strong>
        <span>🟣 Zrealizowane</span>
      </div>
    </div>
  );
}
