import { useTranslation } from "react-i18next";

export default function ConfirmDialog({
    open,
    title,
    message,
    confirmText,
    cancelText,
    danger = false,
    onConfirm,
    onCancel,
}) {

    const { t } = useTranslation();

    if (!open) return null;

    return (
        <div className="confirm-overlay">

            <div className="confirm-dialog">

                <div className="confirm-icon">
                    {danger ? "🗑️" : "❓"}
                </div>

                <h2>
                    {title}
                </h2>

                <p>
                    {message}
                </p>

                <div className="confirm-buttons">

                    <button
                        className="gray-button"
                        onClick={onCancel}
                    >
                        {cancelText ?? t("common.cancel")}
                    </button>

                    <button
                        className={
                            danger
                                ? "delete-button"
                                : "admin-button"
                        }
                        onClick={onConfirm}
                    >
                        {confirmText ?? t("common.confirm")}
                    </button>

                </div>

            </div>

        </div>
    );

}
