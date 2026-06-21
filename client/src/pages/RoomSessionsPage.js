import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./RoomSessionsPage.css";

function RoomSessionsPage() {
    const { id } = useParams();

    const [room, setRoom] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        startAt: "",
        endAt: "",
    });

    const loadRoomSessions = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`http://localhost:5000/api/rooms/${id}/sessions`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Nepodařilo se načíst session učebny");
            }

            setRoom(data.room);
            setSessions(data.sessions);
        } catch (err) {
            setError(err.message || "Došlo k chybě");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRoomSessions();
    }, [id]);

    const getStatusLabel = (status) => {
        if (status === "active") return "Aktivní";
        if (status === "closed") return "Uzavřená";
        return "Připravená";
    };

    const getStatusClass = (status) => {
        if (status === "active") return "status-badge active";
        if (status === "closed") return "status-badge closed";
        return "status-badge draft";
    };

    const formatDate = (value) => {
        return new Date(value).toLocaleDateString("cs-CZ");
    };

    const formatTime = (value) => {
        return new Date(value).toLocaleTimeString("cs-CZ", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const openModal = () => {
        setFormError("");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (isSubmitting) return;
        setIsModalOpen(false);
        setFormError("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreateSession = async (e) => {
        e.preventDefault();

        setFormError("");

        if (!formData.title || !formData.startAt || !formData.endAt) {
            setFormError("Vyplň prosím všechna pole.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("http://localhost:5000/api/sessions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: formData.title,
                    roomId: id,
                    startAt: new Date(formData.startAt).toISOString(),
                    endAt: new Date(formData.endAt).toISOString(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Nepodařilo se vytvořit session");
            }

            setFormData({
                title: "",
                startAt: "",
                endAt: "",
            });

            setIsModalOpen(false);
            await loadRoomSessions();
        } catch (err) {
            setFormError(err.message || "Došlo k chybě při vytváření session.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteSession = async (sessionId, sessionTitle) => {
        const confirmed = window.confirm(
            `Opravdu chceš smazat session "${sessionTitle}"?`
        );

        if (!confirmed) return;

        try {
            const response = await fetch(`http://localhost:5000/api/sessions/${sessionId}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Nepodařilo se smazat session");
            }

            await loadRoomSessions();
        } catch (err) {
            alert(err.message || "Došlo k chybě při mazání session.");
        }
    };

    if (loading) {
        return (
            <div className="room-sessions-page">
                <p>Načítám session učebny...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="room-sessions-page">
                <Link to="/" className="back-link">← Zpět na učebny</Link>
                <p className="room-sessions-error">{error}</p>
            </div>
        );
    }

    return (
        <div className="room-sessions-page">
            <Link to="/" className="back-link">← Zpět na učebny</Link>

            <div className="room-sessions-header">
                <div>
                    <h1>Učebna {room?.name}</h1>
                    <p>{room?.description || "Bez popisu"}</p>
                </div>

                <button className="create-session-button" onClick={openModal}>
                    Vytvořit session
                </button>
            </div>

            {sessions.length === 0 ? (
                <div className="room-sessions-empty">
                    <p>V této učebně zatím nejsou žádné session.</p>
                </div>
            ) : (
                <div className="room-sessions-grid">
                    {sessions.map((session) => (
                        <div key={session._id} className="session-card">
                            <div className="session-card__layout">
                                <div className="session-card__left">
                                    <div className="session-card__top">
                                        <h2>{session.title}</h2>
                                    </div>

                                    <p className="session-card__meta">
                                        Termín: <strong>{formatDate(session.startAt || session.scheduledAt)}</strong>
                                    </p>

                                    <p className="session-card__meta">
                                        Čas:{" "}
                                        <strong>
                                            {formatTime(session.startAt || session.scheduledAt)} – {formatTime(session.endAt || session.startAt || session.scheduledAt)}
                                        </strong>
                                    </p>

                                    <div className="session-card__actions">
                                        <Link to={`/rooms/${id}/sessions/${session._id}`} className="session-card__button">
                                            Otevřít detail
                                        </Link>
                                    </div>
                                </div>

                                <div className="session-card__right">
                                    <span className={getStatusClass(session.status)}>
                                        {getStatusLabel(session.status)}
                                    </span>

                                    <button
                                        type="button"
                                        className="session-card__delete"
                                        onClick={() => handleDeleteSession(session._id, session.title)}
                                    >
                                        Smazat
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Vytvořit session v učebně {room?.name}</h2>
                            <button className="modal-close" onClick={closeModal}>
                                ×
                            </button>
                        </div>

                        <form className="session-form" onSubmit={handleCreateSession}>
                            <label>
                                Název session
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Např. Matika – Test 3"
                                />
                            </label>

                            <label>
                                Začátek
                                <input
                                    type="datetime-local"
                                    name="startAt"
                                    value={formData.startAt}
                                    onChange={handleChange}
                                />
                            </label>

                            <label>
                                Konec
                                <input
                                    type="datetime-local"
                                    name="endAt"
                                    value={formData.endAt}
                                    onChange={handleChange}
                                />
                            </label>

                            {formError && <p className="form-error">{formError}</p>}

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={closeModal}
                                    disabled={isSubmitting}
                                >
                                    Zrušit
                                </button>

                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Vytvářím..." : "Vytvořit"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RoomSessionsPage;