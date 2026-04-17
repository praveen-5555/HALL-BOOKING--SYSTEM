"use client";
import { useEffect, useState } from "react";
import styles from "../admin.module.css";

interface Stats {
  halls: number;
  bookings: number;
  users: number;
  revenue: number;
}

interface RecentBooking {
  id: string;
  userName: string;
  hallName: string;
  status: string;
}

interface Hall {
  id: string;
  name: string;
}

interface Booking {
  id: string;
  userId: string;
  hallId: string;
  status: string;
}

interface User {
  id: string;
  name: string;
}

interface Payment {
  amount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    halls: 0,
    bookings: 0,
    users: 0,
    revenue: 0
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [utilization, setUtilization] = useState<{name: string, count: number}[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [hallsRes, bookRes, userRes, payRes] = await Promise.all([
          fetch("http://127.0.0.1:5000/halls"),
          fetch("http://127.0.0.1:5000/bookings"),
          fetch("http://127.0.0.1:5000/users"),
          fetch("http://127.0.0.1:5000/payments")
        ]);

        const halls: Hall[] = await hallsRes.json();
        const bookings: Booking[] = await bookRes.json();
        const users: User[] = await userRes.json();
        const payments: Payment[] = await payRes.json();

        // Stats
        const totalRevenue = payments.reduce((acc: number, p: Payment) => acc + (p.amount || 0), 0);
        setStats({
          halls: halls.length,
          bookings: bookings.length,
          users: users.length,
          revenue: totalRevenue
        });

        // Recent Bookings (Last 5)
        const recent = bookings.slice(-5).reverse().map((b: Booking) => ({
          id: b.id,
          userName: users.find((u: User) => u.id === b.userId)?.name || "Unknown",
          hallName: halls.find((h: Hall) => h.id === b.hallId)?.name || "Deleted Hall",
          status: b.status
        }));
        setRecentBookings(recent);

        // Utilization (Count by hallId)
        const hallCounts: Record<string, number> = {};
        bookings.forEach((b: Booking) => {
          hallCounts[b.hallId] = (hallCounts[b.hallId] || 0) + 1;
        });
        const utilData = Object.entries(hallCounts)
          .map(([id, count]) => ({
            name: halls.find((h: Hall) => h.id === id)?.name || "Unknown",
            count
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);
        setUtilization(utilData);

      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Welcome, Admin 👋</h1>
          <p className={styles.subtitle}>System overview and performance metrics.</p>
        </div>
      </div>

      <div className={styles.grid} style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className={styles.card}>
          <p className={styles.cardTitle}>Total Revenue</p>
          <h2 className={styles.cardValue}>₹{stats.revenue.toLocaleString()}</h2>
        </div>
        <div className={styles.card}>
          <p className={styles.cardTitle}>Active Bookings</p>
          <h2 className={styles.cardValue}>{stats.bookings}</h2>
        </div>
        <div className={styles.card}>
          <p className={styles.cardTitle}>Total Halls</p>
          <h2 className={styles.cardValue}>{stats.halls}</h2>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "25px", marginTop: "40px" }}>
        {/* Recent Activity */}
        <div className={styles.tableBox}>
          <div style={{ padding: "20px", borderBottom: "1px solid #e2e8f0" }}>
            <h3 style={{ margin: 0 }}>Recent Booking Activity</h3>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Customer</th>
                <th className={styles.th}>Hall</th>
                <th className={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id}>
                  <td className={styles.td}>{b.userName}</td>
                  <td className={styles.td}>{b.hallName}</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${b.status === "confirmed" ? styles.active : styles.pending}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Halls */}
        <div className={styles.tableBox} style={{ padding: "20px" }}>
          <h3 style={{ marginTop: 0, marginBottom: "20px" }}>Hall Utilization</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {utilization.map((item, i) => (
              <div key={i} style={{ padding: "12px", background: "#f8fafc", borderRadius: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <span style={{ fontWeight: "600", fontSize: "14px" }}>{item.name}</span>
                  <span style={{ color: "#3b82f6", fontWeight: "bold" }}>{item.count}</span>
                </div>
                <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "3px" }}>
                  <div style={{ 
                    height: "100%", 
                    width: `${Math.min((item.count / (stats.bookings || 1)) * 100, 100)}%`, 
                    background: "#3b82f6", 
                    borderRadius: "3px" 
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
