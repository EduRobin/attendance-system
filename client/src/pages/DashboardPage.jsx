import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import DashboardHeader from "../components/DashboardHeader";
import StatsCards from "../components/StatsCards";
import RecentEvents from "../components/RecentEvents";
import StudentTable from "../components/StudentTable";

const CLASS_ID = "6a159d5a74bfd6b3490ca500";

function DashboardPage() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showStudents, setShowStudents] = useState(false);

    const fetchDashboard = async () => {
        try {
            setError("");
            const response = await api.get(`/classes/${CLASS_ID}/dashboard`);
            setDashboard(response.data);
        } catch (err) {
            console.error(err);
            setError("Nepodařilo se načíst dashboard.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();

        const interval = setInterval(() => {
            fetchDashboard();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const stats = useMemo(() => {
        const students = dashboard?.students || [];
        const totalStudents = students.length;
        const presentCount = students.filter((student) => student.isPresent).length;
        const absentCount = totalStudents - presentCount;

        return {
            totalStudents,
            presentCount,
            absentCount,
        };
    }, [dashboard]);

    if (loading) {
        return <div className="page-state">Načítám dashboard...</div>;
    }

    if (error) {
        return <div className="page-state error-state">{error}</div>;
    }

    return (
        <main className="page-shell">
            <DashboardHeader
                className={dashboard?.class?.name}
                readerId={dashboard?.class?.readerId}
            />

            <StatsCards
                totalStudents={stats.totalStudents}
                presentCount={stats.presentCount}
                absentCount={stats.absentCount}
            />

            <div className="content-grid">
                <RecentEvents events={dashboard?.recentEvents || []} />
            </div>

            <StudentTable
                students={dashboard?.students || []}
                isOpen={showStudents}
                onToggle={() => setShowStudents((prev) => !prev)}
            />
        </main>
    );
}

export default DashboardPage;