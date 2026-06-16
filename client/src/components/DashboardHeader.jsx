import React from "react";

function DashboardHeader({ className, readerId }) {
    return (
        <section className="card header-card">
            <div>
                <p className="eyebrow">Docházkový systém</p>
                <h1>{className || "Třída"}</h1>
                <p className="muted">Přehled docházky v reálném čase</p>
            </div>

            <div className="header-meta">
                <div className="reader-badge online">Čtečka připojena</div>
                <div className="reader-id">Reader ID: {readerId || "N/A"}</div>
            </div>
        </section>
    );
}

export default DashboardHeader;