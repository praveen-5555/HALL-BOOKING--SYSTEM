"use client";
import { useEffect, useState } from "react";
import styles from "./admin.module.css";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    halls: 0,
    bookings: 0,
    revenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [hallsRes, bookingsRes, paymentsRes] = await Promise.all([
          fetch("/api/halls"),
          fetch("/api/bookings"),
          fetch("/api/payments")
        ]);

        const halls = await hallsRes.json();
        const bookings = await bookingsRes.json();
        const payments = await paymentsRes.json();

        const totalRevenue = payments.reduce((acc: number, curr: { amount?: number }) => acc + (curr.amount || 0), 0);

        setStats({
          halls: halls.length,
          bookings: bookings.length,
          revenue: totalRevenue
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Welcome, Admin 👋</h1>
          <p className={styles.subtitle}>
            Control your hall booking system here.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.grid} style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className={styles.card}>
          <p className={styles.cardTitle}>Total Halls</p>
          <p className={styles.cardValue}>{stats.halls}</p>
        </div>

        <div className={styles.card}>
          <p className={styles.cardTitle}>Total Bookings</p>
          <p className={styles.cardValue}>{stats.bookings}</p>
        </div>

        <div className={styles.card} style={{ borderLeft: "4px solid #f8f9f8ff" }}>
          <p className={styles.cardTitle}>Total Revenue</p>
          <p className={styles.cardValue}>₹{stats.revenue.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}