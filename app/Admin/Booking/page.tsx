"use client";
import { useEffect, useState } from "react";
import styles from "../admin.module.css";

interface Booking {
  id: string;
  userId: string;
  hallId: string;
  date: string;
  duration: number;
  status: string;
  guests?: number;
  amount?: string | number;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Hall {
  id: string;
  name: string;
}

export default function AdminBooking() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchData = async () => {
    try {
      const [bookRes, userRes, hallRes] = await Promise.all([
        fetch("http://127.0.0.1:5000/bookings"),
        fetch("http://127.0.0.1:5000/users"),
        fetch("http://127.0.0.1:5000/halls")
      ]);
      const [bookData, userData, hallData] = await Promise.all([
        bookRes.json(),
        userRes.json(),
        hallRes.json()
      ]);
      setBookings(bookData);
      setUsers(userData);
      setHalls(hallData);
    } catch (error) {
      console.error("Failed to fetch bookings data:", error);
    }
  };

  useEffect(() => {
    // Defer to avoid cascading render warning
    Promise.resolve().then(() => {
      fetchData();
    });
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    // Defer to avoid cascading render warning
    Promise.resolve().then(() => {
      setCurrentPage(1);
    });
  }, [searchQuery, statusFilter, bookings]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const user = users.find(u => u.id === b.userId);
    const hall = halls.find(h => h.id === b.hallId);
    const matchesSearch = 
      user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hall?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || b.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Bookings Management</h1>
          <p className={styles.subtitle}>
            Review and manage all reservation requests.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <select 
            className={styles.input} 
            style={{ width: "120px" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input 
            placeholder="Search bookings..." 
            className={styles.input}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableBox}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>ID</th>
              <th className={styles.th}>User</th>
              <th className={styles.th}>Hall</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentBookings.map((b) => {
              const user = users.find(u => u.id === b.userId);
              const hall = halls.find(h => h.id === b.hallId);
              return (
                <tr key={b.id}>
                  <td className={styles.td}>#{b.id}</td>
                  <td className={styles.td}>
                    <div style={{fontWeight: "600"}}>{user?.name || "Unknown"}</div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>{user?.email}</div>
                  </td>
                  <td className={styles.td}>
                    {hall?.name || "Deleted Hall"}
                    <div style={{ fontSize: "12px", color: "#64748b" }}>
                      {b.date} • {b.duration} hrs
                    </div>
                  </td>
                  <td className={styles.td}>
                    <span
                      className={`${styles.badge} ${
                        b.status.toLowerCase() === "confirmed"
                          ? styles.active
                          : b.status.toLowerCase() === "pending"
                          ? styles.pending
                          : styles.cancelled
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {b.status.toLowerCase() === "pending" && (
                        <>
                          <button 
                            className={styles.button} 
                            style={{ background: "#22c55e", color: "white", border: "none" }}
                            onClick={() => handleUpdateStatus(b.id, "confirmed")}
                          >
                            Approve
                          </button>
                          <button 
                            className={styles.deleteButton}
                            onClick={() => handleUpdateStatus(b.id, "cancelled")}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {b.status.toLowerCase() !== "pending" && (
                         <span style={{ fontSize: "12px", color: "#94a3b8" }}>Processed</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={{ padding: "15px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ color: "#64748b", fontSize: "14px" }}>
            Showing {filteredBookings.length > 0 ? startIndex + 1 : 0}–{Math.min(endIndex, filteredBookings.length)} of {filteredBookings.length}
          </p>

          <div style={{ display: "flex", gap: "10px" }}>
            <button className={styles.button} disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
            <button className={styles.button} disabled={currentPage >= totalPages || totalPages === 0} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}