import React from "react";

function StatsCards({ totalStudents, presentCount, absentCount }) {
    return (
        <section className="stats-grid">
            <div className="card stat-card">
                <span className="stat-label">Registrovaní studenti</span>
                <strong className="stat-value">{totalStudents}</strong>
            </div>

            <div className="card stat-card">
                <span className="stat-label">Přítomno</span>
                <strong className="stat-value success">{presentCount}</strong>
            </div>

            <div className="card stat-card">
                <span className="stat-label">Nepřítomno</span>
                <strong className="stat-value danger">{absentCount}</strong>
            </div>
        </section>
    );
}

export default StatsCards;