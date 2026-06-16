import React from "react";

function RecentEvents({ events }) {
    return (
        <section className="card section-card">
            <div className="section-head">
                <h2>Poslední události</h2>
            </div>

            {!events || events.length === 0 ? (
                <p className="muted">Zatím nejsou k dispozici žádné události.</p>
            ) : (
                <div className="event-list">
                    {events.map((event) => (
                        <div className="event-item" key={event._id}>
                            <div className="event-left">
                                <strong>{event.studentId?.name || "Neznámý student"}</strong>
                                <span
                                    className={`event-type-badge ${event.type === "arrival" ? "arrival" : "departure"
                                        }`}
                                >
                                    {event.type === "arrival" ? "Příchod" : "Odchod"}
                                </span>
                            </div>

                            <div className="event-right">
                                {new Date(event.timestamp).toLocaleString("cs-CZ")}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default RecentEvents;