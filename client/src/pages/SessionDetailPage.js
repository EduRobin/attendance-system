import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./SessionDetailPage.css";

function SessionDetailPage() {
    const { roomId, id } = useParams();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = async (showLoader = false) => {
        try {
            if (showLoader) {
                setLoading(true);
            }

            setError("");

            const response = await fetch(`http://localhost:5000/api/sessions/${id}/dashboard`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Nepodařilo se načíst detail session");
            }

            setDashboard(data);
        } catch (err) {
            setError(err.message || "Došlo k chybě");
        } finally {
            if (showLoader) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        loadDashboard(true);

        const interval = setInterval(() => {
            loadDashboard(false);
        }, 2000);

        return () => clearInterval(interval);
    }, [id]);

    const getStatusLabel = (status) => {
        if (status === "present") return "Přítomen";
        if (status === "was_present") return "Byl přítomen";
        if (status === "not_arrived") return "Nedostavil se";
        return "Nepřítomen";
    };

    const getStatusClass = (status) => {
        if (status === "present") return "student-status present";
        if (status === "was_present") return "student-status was-present";
        if (status === "not_arrived") return "student-status not-arrived";
        return "student-status absent";
    };

    const getEventLabel = (type) => {
        if (type === "arrival") return "Příchod";
        if (type === "departure") return "Odchod";
        return type;
    };

    const getEventClass = (type) => {
        if (type === "arrival") return "event-badge arrival";
        if (type === "departure") return "event-badge departure";
        return "event-badge";
    };

    const formatSeconds = (seconds) => {
        const safe = Number(seconds || 0);
        const mins = Math.floor(safe / 60);
        const secs = safe % 60;
        return `${mins} min ${secs} s`;
    };

    if (loading) {
        return <div className="session-detail-page"><p>Načítám detail session...</p></div>;
    }

    if (error) {
        return (
            <div className="session-detail-page">
                <Link to={`/rooms/${roomId}`} className="back-link">← Zpět na session</Link>
                <p className="session-detail-error">{error}</p>
            </div>
        );
    }

    if (!dashboard) {
        return null;
    }

    const { session, summary, records, recentEvents } = dashboard;

    return (
        <div className="session-detail-page">
            <Link to={`/rooms/${roomId}`} className="back-link">← Zpět na session</Link>

            <div className="session-detail-header">
                <div>
                    <h1>{session.title}</h1>
                    <p>
                        Čtečka: <strong>{session.readerId}</strong>
                    </p>
                    <p>
                        Termín: <strong>{new Date(session.scheduledAt).toLocaleString("cs-CZ")}</strong>
                    </p>
                </div>
                <div
                    className={`session-state ${session.status === "active"
                        ? "session-state--active"
                        : session.status === "closed"
                            ? "session-state--closed"
                            : "session-state--draft"
                        }`}
                >
                    {session.status === "active"
                        ? "Aktivní"
                        : session.status === "closed"
                            ? "Uzavřená"
                            : "Připravená"}
                </div>
            </div>

            <div className="summary-grid">
                <div className="summary-card">
                    <span>Registrovaní studenti</span>
                    <strong>{summary.totalStudents}</strong>
                </div>
                <div className="summary-card">
                    <span>Právě přítomní</span>
                    <strong>{summary.presentStudents}</strong>
                </div>
                <div className="summary-card">
                    <span>Nedostavili se</span>
                    <strong>{summary.absentStudents}</strong>
                </div>
                <div className="summary-card">
                    <span>Byli přítomni</span>
                    <strong>{summary.wasPresentStudents}</strong>
                </div>
            </div>

            <div className="session-layout">
                <div className="session-panel">
                    <h2>Poslední události</h2>
                    <div className="events-list">
                        {recentEvents.length === 0 && <p>Zatím žádné události.</p>}

                        {recentEvents.map((event) => (
                            <div key={event._id} className="event-item">
                                <div>
                                    <strong>{event.studentId?.name || "Neznámý student"}</strong>
                                    <div className={getEventClass(event.type)}>
                                        {getEventLabel(event.type)}
                                    </div>
                                </div>
                                <span>{new Date(event.timestamp).toLocaleString("cs-CZ")}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="session-panel">
                    <h2>Studenti v session</h2>
                    <div className="students-list">
                        {records.length === 0 && <p>V této session zatím nejsou žádní studenti.</p>}

                        {records.map((record) => (
                            <div key={record._id} className="student-item">
                                <div className="student-item__top">
                                    <div>
                                        <strong>{record.studentId?.name || "Neznámý student"}</strong>
                                        <p>Karta: {record.studentId?.cardUid || "-"}</p>
                                    </div>
                                    <div className={getStatusClass(record.status)}>
                                        {getStatusLabel(record.status)}
                                    </div>
                                </div>

                                <div className="student-item__meta">
                                    <span>Čas přítomnosti: <strong>{formatSeconds(record.totalPresentSeconds)}</strong></span>
                                </div>

                                <div className="student-item__meta">
                                    <span>Příchod: <strong>{record.entryAt ? new Date(record.entryAt).toLocaleString("cs-CZ") : "-"}</strong></span>
                                </div>

                                <div className="student-item__meta">
                                    <span>Odchod: <strong>{record.lastExitAt ? new Date(record.lastExitAt).toLocaleString("cs-CZ") : "-"}</strong></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SessionDetailPage;