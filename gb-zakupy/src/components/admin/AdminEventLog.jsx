import {formatDate} from "../../utils/dateUtils";

import "../../styles/admin-event-log.css";


export default function AdminEventLog({
    logs=[],
    onRefresh
}){

    return(

        <section className="event-log-page">


            {/* =====================================================
                HEADER
               ===================================================== */}

            <div className="event-log-header">


                <div className="event-log-header-left">

                    <small>
                        EVENT LOG
                    </small>


                    <h1>
                        Dziennik zdarzeń
                    </h1>


                    <p>
                        Historia aktywności systemu i wykonanych operacji.
                    </p>

                </div>


                <div className="event-log-toolbar">

                    <div className="event-log-count">
                        <span>
                            Łącznie wpisów
                        </span>

                        <strong>
                            {logs.length}
                        </strong>
                    </div>


                    <button
                        type="button"
                        className="event-log-button-secondary"
                        onClick={onRefresh}
                        disabled={!onRefresh}
                    >
                        ↻ Odśwież
                    </button>

                </div>

            </div>


            {/* =====================================================
                EMPTY STATE
               ===================================================== */}

            {!logs.length ? (

                <div className="event-empty">

                    <div className="event-empty-icon">
                        📜
                    </div>


                    <h3>
                        Brak zdarzeń
                    </h3>


                    <p>
                        Nie znaleziono żadnych wpisów w dzienniku zdarzeń.
                    </p>

                </div>

            ) : (


                /* =================================================
                   TIMELINE
                   ================================================= */

                <div className="event-timeline">


                    {logs.map((log,index)=>{

                        const eventType =
                            log.type || "system";


                        return(

                            <article

                                key={
                                    log.id ||
                                    `${eventType}-${index}`
                                }

                                className={
                                    `event-item ${eventType}`
                                }

                            >


                                {/* =================================================
                                    NODE
                                   ================================================= */}

                                <div className="event-node">

                                    <span>
                                        {eventType==="error"
                                            ? "!"
                                            : eventType==="warning"
                                                ? "!"
                                                : eventType==="success"
                                                    ? "✓"
                                                    : "•"
                                        }
                                    </span>

                                </div>


                                {/* =================================================
                                    CARD
                                   ================================================= */}

                                <div className="event-card">


                                    {/* =================================================
                                        CARD HEADER
                                       ================================================= */}

                                    <div className="event-header">


                                        <div className="event-title">


                                            <div className="event-icon">

                                                {eventType==="error"
                                                    ? "⚠️"
                                                    : eventType==="warning"
                                                        ? "⚠️"
                                                        : eventType==="success"
                                                            ? "✓"
                                                            : "📜"
                                                }

                                            </div>


                                            <div className="event-title-content">

                                                <div className="event-title-top">

                                                    <span className="event-type">
                                                        {eventType}
                                                    </span>

                                                </div>


                                                <h3>
                                                    Zdarzenie systemowe
                                                </h3>


                                                <p>
                                                    {log.message || "Brak opisu zdarzenia."}
                                                </p>

                                            </div>

                                        </div>


                                        {/* =================================================
                                            TIME
                                           ================================================= */}

                                        <div className="event-time">

                                            <span>
                                                CZAS
                                            </span>


                                            <strong>
                                                {formatDate(
                                                    log.createdAt?.toDate?.() ??
                                                    log.createdAt
                                                )}
                                            </strong>

                                        </div>


                                    </div>


                                    {/* =================================================
                                        META
                                       ================================================= */}

                                    <div className="event-meta">


                                        <div className="event-meta-item">

                                            <span>
                                                ID
                                            </span>

                                            <strong>
                                                {log.id || "—"}
                                            </strong>

                                        </div>


                                        <div className="event-meta-item">

                                            <span>
                                                TYP
                                            </span>

                                            <strong>
                                                {eventType}
                                            </strong>

                                        </div>


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
