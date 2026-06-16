import React from "react";

function StudentTable({ students, isOpen, onToggle }) {
    return (
        <section className="card section-card">
            <div className="section-head">
                <h2>Registrovaní studenti</h2>
                <button className="toggle-btn" onClick={onToggle}>
                    {isOpen ? "Skrýt seznam" : "Zobrazit seznam"}
                </button>
            </div>

            {!isOpen ? (
                <p className="muted">
                    Seznam studentů je sbalený. Pro detail klikni na „Zobrazit seznam“.
                </p>
            ) : (
                <div className="table-wrap">
                    <table className="students-table">
                        <thead>
                            <tr>
                                <th>Jméno</th>
                                <th>UID karty</th>
                                <th>Stav</th>
                                <th>Poslední scan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students?.map((student) => (
                                <tr key={student._id}>
                                    <td>{student.name}</td>
                                    <td>{student.cardUid}</td>
                                    <td>
                                        <span
                                            className={`status-badge ${student.isPresent ? "present" : "absent"
                                                }`}
                                        >
                                            {student.isPresent ? "Přítomen" : "Nepřítomen"}
                                        </span>
                                    </td>
                                    <td>
                                        {student.lastScanAt
                                            ? new Date(student.lastScanAt).toLocaleString("cs-CZ")
                                            : "Žádný scan"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default StudentTable;