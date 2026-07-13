import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./RoomsPage.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function RoomsPage() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    const token = localStorage.getItem("token");

    const loadRooms = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`${API_URL}/api/rooms`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Nepodařilo se načíst učebny");
            }

            setRooms(data);
        } catch (err) {
            setError(err.message || "Došlo k chybě");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRooms();
    }, []);

    return (
        <div className="rooms-page">
            <div className="rooms-page__header">
                <div>
                    <h1>Docházkový systém</h1>
                    <p>Výběr učebny / místnosti</p>
                </div>
            </div>

            {loading && <p>Načítám učebny...</p>}
            {error && <p className="rooms-page__error">{error}</p>}

            {!loading && !error && rooms.length === 0 && (
                <div className="rooms-empty">
                    <p>Zatím tu nejsou žádné učebny.</p>
                </div>
            )}

            {!loading && !error && rooms.length > 0 && (
                <div className="rooms-grid">
                    {rooms.map((room) => (
                        <div key={room._id} className="room-card">
                            <div className="room-card__top">
                                <h2>{room.name}</h2>
                            </div>

                            <p className="room-card__meta">
                                {room.description || "Bez popisu"}
                            </p>

                            <div className="room-card__actions">
                                <Link to={`/rooms/${room._id}`} className="room-card__button">
                                    Otevřít učebnu
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default RoomsPage;