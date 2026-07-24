import EmptyState from "../shared/EmptyState";
import { formatDate } from "../../utils/dateUtils";

export default function AdminEventLog({ logs }) {

    
    return (

        <section className="admin-event-log">

            <div className="admin-list-header">

                <div>

                    <h2>📜 Dziennik zdarzeń</h2>

                    <p>
                        Łącznie wpisów: {logs.length}
                    </p>

                </div>

            </div>

            {logs.length === 0 ? (

                <EmptyState>

                    Brak zdarzeń.

                </EmptyState>

            ) : (

                <div className="event-log">

                    {logs.map(log => (

                        <article
                            key={log.id}
                            className="event-log-item"
                        >

                            <div className="event-log-date">

                                {formatDate(log.createdAt)}

                            </div>

                            <div className="event-log-message">

                                {log.message}

                            </div>

                        </article>

                    ))}

                </div>

            )}

        </section>

    );

}
