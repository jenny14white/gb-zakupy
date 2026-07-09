export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Potwierdź',
  cancelText = 'Anuluj',
  danger = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <div className="confirm-icon">
          {danger ? '🗑️' : '❓'}
        </div>

        <h2>{title}</h2>

        <p>{message}</p>

        <div className="confirm-buttons">
          <button
            className="gray-button"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            className={danger ? 'delete-button' : 'admin-button'}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
