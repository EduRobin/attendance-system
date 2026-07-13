import { useState } from "react";
import "./LoginPage.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function LoginPage({ onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Přihlášení se nezdařilo");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            onLoginSuccess(data.user);
        } catch (error) {
            alert(error.message || "Došlo k chybě při přihlášení.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1 className="login-title">Přihlášení</h1>
                <p className="login-subtitle">Docházkový systém</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <label className="login-label">
                        E-mail
                        <input
                            type="email"
                            className="login-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="robin@example.com"
                            required
                        />
                    </label>

                    <label className="login-label">
                        Heslo
                        <input
                            type="password"
                            className="login-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Zadej heslo"
                            required
                        />
                    </label>

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Přihlašuji..." : "Přihlásit se"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;