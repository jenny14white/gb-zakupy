import { useMemo, useState } from "react";
import { formatDate } from "../../utils/dateUtils";

import "../../styles/admin-event-log.css";


export default function AdminEventLog({
    logs = [],
    onRefresh
}) {

    const [userFilter, setUserFilter] = useState("");
    const [orderFilter, setOrderFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");


    /* =====================================================
       FILTROWANIE
       ===================================================== */

    const filteredLogs = useMemo(() => {

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
                    log.name ||
                    ""
                ).toLowerCase();


            const createdAt =
                log.createdAt?.toDate?.() ??
                log.createdAt;


            const normalizedUser =
                userFilter
                    .trim()
                    .toLowerCase();


            const normalizedOrder =
                orderFilter
                    .trim()
                    .toLowerCase();


            /* -------------------------------------------------
               UŻYTKOWNIK
               ------------------------------------------------- */

            if (
                normalizedUser &&
                !userName.includes(normalizedUser)
            ) {
                return false;
            }


            /* -------------------------------------------------
               NAZWA ZAMÓWIENIA
               ------------------------------------------------- */

            if (
                normalizedOrder &&
                !orderName.includes(normalizedOrder)
            ) {
                return false;
            }


            /* -------------------------------------------------
               DATA WYKONANIA OPERACJI
               ------------------------------------------------- */

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


    /* =====================================================
       WYCZYŚĆ FILTRY
       ===================================================== */

    const clearFilters = () => {

        setUserFilter("");
        setOrderFilter("");
        setDateFilter("");

    };


    const hasFilters =
        userFilter ||
        orderFilter ||
        dateFilter;


    return (

        <section className="event-log-page">


            {/* =====================================================
                HEADER
               ===================================================== */}

            <div className="event-log-header">

                <div className="event-log-header-left">

                    <span className="event-log-eyebrow">
                        EVENT LOG
                    </span>


                    <h1>
                        Dziennik zdarzeń
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


            {/* =====================================================
                FILTRY
               ===================================================== */}

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
                            setUserFilter(e.target.value)
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
                            setOrderFilter(e.target.value)
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
                            setDateFilter(e.target.value)
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


            {/* =====================================================
                LISTA
               ===================================================== */}

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

                    {filteredLogs.map((log, index) => {

                        const createdAt =
                            log.createdAt?.toDate?.() ??
                            log.createdAt;


                        return (

                            <article
                                key={
                                    log.id ||
                                    `event-${index}`
                                }
                                className="event-card"
                            >

                                <div className="event-card-main">


                                    {/* =================================================
                                        OPIS
                                       ================================================= */}

                                    <div className="event-message">

                                        <strong>
                                            {log.userName ||
                                                log.user ||
                                                log.userDisplayName ||
                                                "Użytkownik"}
                                        </strong>

                                        <span>
                                            {" "}edytował zamówienie:{" "}
                                        </span>

                                        <strong>
                                            {log.orderName ||
                                                log.order?.name ||
                                                log.name ||
                                                "Nieznane zamówienie"}
                                        </strong>

                                        {log.orderDate && (

                                            <>

                                                <span>
                                                    {" "}z dnia{" "}
                                                </span>

                                                <strong>
                                                    {formatDate(
                                                        log.orderDate?.toDate?.() ??
                                                        log.orderDate
                                                    )}
                                                </strong>

                                            </>

                                        )}

                                    </div>


                                    {/* =================================================
                                        CZAS WYKONANIA
                                       ================================================= */}

                                    <div className="event-executed">

                                        <span>
                                            Wykonano
                                        </span>

                                        <strong>
                                            {formatDate(createdAt)}
                                        </strong>

                                    </div>


                                </div>

                            </article>

                        );

                    })}

                </div>

            )}

        </section>

    );

}
