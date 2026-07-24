import { useEffect } from "react";
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

    useEffect(() => {

        const handleEscape = (e) => {

            if(e.key === "Escape"){
                onCancel();
            }

        };

        if(open){
            document.addEventListener(
                "keydown",
                handleEscape
            );
        }

        return () => {

            document.removeEventListener(
                "keydown",
                handleEscape
            );

        };

    }, [open,onCancel]);


    if(!open) return null;


    return (

        <div
            className="confirm-overlay"
            onMouseDown={onCancel}
        >

            <div
                className="confirm-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                onMouseDown={(e)=>e.stopPropagation()}
            >

                <div
                    className={
                        danger
                        ? "confirm-icon danger"
                        : "confirm-icon"
                    }
                >
                    {danger ? "!" : "?"}
                </div>


                <h2 id="confirm-title">
                    {title}
                </h2>


                <p>
                    {message}
                </p>


                <div className="confirm-buttons">


                    <button
                        className="confirm-cancel"
                        onClick={onCancel}
                    >
                        {
                            cancelText ??
                            t("common.cancel")
                        }
                    </button>


                    <button
                        className={
                            danger
                            ? "confirm-danger"
                            : "confirm-primary"
                        }
                        onClick={onConfirm}
                    >
                        {
                            confirmText ??
                            t("common.confirm")
                        }
                    </button>


                </div>

            </div>

        </div>

    );

}
