import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../utils/dateUtils";

import "../../styles/admin-event-log.css";

export default function AdminEventLog({
    logs = [],
    onRefresh
}) {
    const { t } = useTranslation();

    const [userFilter, setUserFilter] = useState("");
    const [orderFilter, setOrderFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    const filteredLogs = useMemo(() => {
        const normalizedUser =
            userFilter.trim().toLowerCase();

        const normalizedOrder =
            orderFilter.trim().toLowerCase();

        return logs.filter(log => {
            const userName =
                String(
                    log.userName ||
                    log.user ||
                    log.userDisplayName ||
                    ""
                ).toLowerCase();

            const orderName =
                String(
                    log.orderName ||
                    log.order?.name ||
                    ""
                ).toLowerCase();

            const createdAt =
                log.createdAt?.toDate?.() ??
                log.createdAt;

            if (
                normalizedUser &&
                !userName.includes(normalizedUser)
            ) {
                return false;
            }

            if (
                normalizedOrder &&
                !orderName.includes(normalizedOrder)
            ) {
                return false;
            }

            if (dateFilter && createdAt) {
                const date =
                    createdAt instanceof Date
                        ? createdAt
                        : new Date(createdAt);

                if (Number.isNaN(date.getTime())) {
                    return false;
                }

                const year =
                    date.getFullYear();

                const month =
                    String(
                        date.getMonth() + 1
                    ).padStart(2, "0");

                const day =
                    String(
                        date.getDate()
                    ).padStart(2, "0");

                const formattedDate =
                    `${year}-${month}-${day}`;

                if (
                    formattedDate !== dateFilter
                ) {
                    return false;
                }
            }

            return true;
        });
    }, [
        logs,
        userFilter,
        orderFilter,
        dateFilter
    ]);

    const clearFilters = () => {
        setUserFilter("");
        setOrderFilter("");
        setDateFilter("");
    };

    const hasFilters =
        userFilter ||
        orderFilter ||
        dateFilter;

    const getActionLabel = log => {
        switch (log.action) {
            case "create":
                return "dodał zamówienie";

            case "edit":
            case "update":
                return "edytował zamówienie";

            case "delete":
                return "usunął zamówienie";

            case "accept":
                return "przyjął zamówienie do realizacji";

            case "complete":
                return "oznaczył zamówienie jako zrealizowane";

            default:
                return null;
        }
    };

    const getUserName = log =>
        log.userName ||
        log.user ||
        log.userDisplayName ||
        log.email ||
        "Nieznany użytkownik";

    const getOrderName = log =>
        log.orderName ||
        log.order?.name ||
        "";

    const getOrderDate = log => {
        if (!log.orderDate) {
            return null;
        }

        return (
            log.orderDate?.toDate?.() ??
            log.orderDate
        );
    };

    return (
        <section className="event-log-page">
            <div className="event-log-header">
                <div className="event-log-header-left">
                    <span className="event-log-eyebrow">
                        EVENT LOG
                    </span>

                    <h1>
                        {t(
                            "admin.eventLog.title",
                            "Dziennik zdarzeń"
                        )}
                    </h1>

                    <p>
                        Historia aktywności systemu i wykonanych operacji.
                    </p>
                </div>

                <div className="event-log-toolbar">
                    {onRefresh && (
                        <button
                            type="button"
                            className="event-log-button-secondary"
                            onClick={onRefresh}
                        >
                            ↻ Odśwież
                        </button>
                    )}
                </div>
            </div>

            <div className="event-log-filters">
                <div className="event-log-filter">
                    <label htmlFor="event-user-filter">
                        Użytkownik
                    </label>

                    <input
                        id="event-user-filter"
                        type="text"
                        value={userFilter}
                        onChange={e =>
                            setUserFilter(
                                e.target.value
                            )
                        }
                        placeholder="np. Natalia"
                    />
                </div>

                <div className="event-log-filter">
                    <label htmlFor="event-order-filter">
                        Nazwa zamówienia
                    </label>

                    <input
                        id="event-order-filter"
                        type="text"
                        value={orderFilter}
                        onChange={e =>
                            setOrderFilter(
                                e.target.value
                            )
                        }
                        placeholder="np. TEST"
                    />
                </div>

                <div className="event-log-filter">
                    <label htmlFor="event-date-filter">
                        Data wykonania
                    </label>

                    <input
                        id="event-date-filter"
                        type="date"
                        value={dateFilter}
                        onChange={e =>
                            setDateFilter(
                                e.target.value
                            )
                        }
                    />
                </div>

                {hasFilters && (
                    <button
                        type="button"
                        className="event-log-clear"
                        onClick={clearFilters}
                    >
                        Wyczyść
                    </button>
                )}
            </div>

            {!logs.length ? (
                <div className="event-empty">
                    <h3>
                        Brak zdarzeń
                    </h3>

                    <p>
                        Nie znaleziono żadnych wpisów w dzienniku zdarzeń.
                    </p>
                </div>
            ) : !filteredLogs.length ? (
                <div className="event-empty">
                    <h3>
                        Brak wyników
                    </h3>

                    <p>
                        Nie znaleziono zdarzeń pasujących do wybranych filtrów.
                    </p>

                    <button
                        type="button"
                        className="event-log-clear"
                        onClick={clearFilters}
                    >
                        Wyczyść filtry
                    </button>
                </div>
            ) : (
                <div className="event-list">
                    {filteredLogs.map(
                        (log, index) => {
                            const createdAt =
                                log.createdAt?.toDate?.() ??
                                log.createdAt;

                            const userName =
                                getUserName(log);

                            const orderName =
                                getOrderName(log);

                            const orderDate =
                                getOrderDate(log);

                            const action =
                                getActionLabel(log);

                            return (
                                <article
                                    key={
                                        log.id ||
                                        `event-${index}`
                                    }
                                    className="event-card"
                                >
                                    <div className="event-card-main">
                                        <div className="event-message">
                                            {action ? (
                                                <>
                                                    <strong>
                                                        {userName}
                                                    </strong>

                                                    <span>
                                                        {" "}
                                                        {action}
                                                        {orderName
                                                            ? ":"
                                                            : "."}
                                                        {" "}
                                                    </span>

                                                    {orderName && (
                                                        <strong>
                                                            {orderName}
                                                        </strong>
                                                    )}

                                                    {orderDate && (
                                                        <>
                                                            <span>
                                                                {" "}
                                                                z dnia{" "}
                                                            </span>

                                                            <strong>
                                                                {formatDate(
                                                                    orderDate
                                                                )}
                                                            </strong>
                                                        </>
                                                    )}
                                                </>
                                            ) : (
                                                <span>
                                                    {log.message ||
                                                        "Wykonano operację systemową."}
                                                </span>
                                            )}
                                        </div>

                                        <div className="event-executed">
                                            <span>
                                                Wykonano
                                            </span>

                                            <strong>
                                                {createdAt
                                                    ? formatDate(
                                                        createdAt
                                                    )
                                                    : "—"}
                                            </strong>
                                        </div>
                                    </div>
                                </article>
                            );
                        }
                    )}
                </div>
            )}
        </section>
    );
}
