import { formatDate } from "../../utils/dateUtils";

export default function AdminEventLog({ logs }) {

    return (

        <section className="event-log-page">

            <div className="event-log-header">

                <div className="event-log-header-left">

                    <small>
                        EVENT LOG
                    </small>

                    <h1>
                        Dziennik zdarzeń
                    </h1>

                    <p>
                        Łącznie wpisów: {logs.length}
                    </p>

                </div>

                <div className="event-log-toolbar">

                    <button
                        type="button"
                        className="event-log-button-secondary"
                    >

                        Odśwież

                    </button>

                </div>

            </div>

            {logs.length === 0 ? (

                <div className="event-empty">

                    <div className="event-empty-icon">

                        📜

                    </div>

                    <h3>

                        Brak zdarzeń

                    </h3>

                    <p>

                        Nie znaleziono żadnych wpisów.

                    </p>

                </div>

            ) : (

                <div className="event-timeline">

                    {logs.map(log => (

                        <article
                            key={log.id}
                            className={`event-item ${log.type || "system"}`}
                        >

                            <div className="event-node" />

                            <div className="event-card">

                                <div className="event-header">

                                    <div className="event-title">

                                        <div className="event-icon">

                                            📜

                                        </div>

                                        <div>

                                            <h3>

                                                Zdarzenie

                                            </h3>

                                            <p>

                                                {log.message}

                                            </p>

                                        </div>

                                    </div>

                                    <div className="event-time">

                                        <strong>

                                            {formatDate(
                                                log.createdAt?.toDate?.() ??
                                                log.createdAt
                                            )}

                                        </strong>

                                    </div>

                                </div>

                                <div className="event-meta">

                                    <div className="event-meta-item">

                                        ID: {log.id}

                                    </div>

                                </div>

                            </div>

                        </article>

                    ))}

                </div>

            )}

        </section>

    );

}
