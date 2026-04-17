"use client";
import { useEffect, useState } from "react";
import styles from "../admin.module.css";

interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: string;
}

interface Booking {
  id: string;
  userId: string;
  hallId: string;
  date: string;
  duration: number;
  status: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function AdminPayment() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<(Payment & { booking?: Booking | null, user?: User | null }) | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [payRes, bookRes, userRes] = await Promise.all([
          fetch("http://localhost:5000/payments"),
          fetch("http://localhost:5000/bookings"),
          fetch("http://localhost:5000/users")
        ]);
        
        const [payData, bookData, userData] = await Promise.all([
          payRes.json(),
          bookRes.json(),
          userRes.json()
        ]);

        setPayments(payData);
        setBookings(bookData);
        setUsers(userData);
      } catch (error) {
        console.error("Failed to fetch payment data:", error);
      }
    };
    fetchData();
  }, []);

  const getPaymentDetails = (payment: Payment) => {
    const booking = bookings.find(b => b.id === payment.bookingId);
    const user = booking ? users.find(u => u.id === booking.userId) : null;
    return { ...payment, booking, user };
  };

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(getPaymentDetails(payment));
    setIsModalOpen(true);
  };

  const stats = {
    totalRevenue: payments.reduce((acc, p) => acc + (p.amount || 0), 0),
    completed: payments.filter(p => p.status === "completed").length,
    pending: payments.filter(p => p.status === "pending").length,
    failed: payments.filter(p => p.status === "failed").length,
  };

  const handleRefund = async (paymentId: string) => {
    if (!window.confirm("Are you sure you want to process a refund for this transaction?")) return;
    try {
      const res = await fetch(`http://localhost:5000/payments/${paymentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "refunded" })
      });
      if (res.ok) {
        setPayments(payments.map(p => p.id === paymentId ? { ...p, status: "refunded" } : p));
      }
    } catch (error) {
      console.error("Refund failed:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Payments & Transactions</h1>
          <p className={styles.subtitle}>
            Monitor revenue and process refunds for cancelled reservations.
          </p>
        </div>
      </div>

      <div className={styles.grid} style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div className={styles.card}>
          <p className={styles.cardTitle}>Total Revenue</p>
          <h2 className={styles.cardValue}>₹{stats.totalRevenue.toLocaleString()}</h2>
        </div>
        <div className={styles.card}>
          <p className={styles.cardTitle}>Completed</p>
          <h2 className={styles.cardValue}>{stats.completed}</h2>
        </div>
        <div className={styles.card}>
          <p className={styles.cardTitle}>Pending</p>
          <h2 className={styles.cardValue}>{stats.pending}</h2>
        </div>
        <div className={styles.card}>
          <p className={styles.cardTitle}>Refunded/Failed</p>
          <h2 className={styles.cardValue}>{stats.failed}</h2>
        </div>
      </div>

      <div className={styles.tableBox}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>ID</th>
              <th className={styles.th}>Customer</th>
              <th className={styles.th}>Amount</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p) => {
              const details = getPaymentDetails(p);
              const isRefundable = p.status === "completed" && details.booking?.status === "cancelled";
              return (
                <tr key={p.id}>
                  <td className={styles.td} style={{ color: "#3b82f6", fontWeight: "600" }}>#{p.id}</td>
                  <td className={styles.td}>
                    {details.user?.name || "Unknown"}
                    <div style={{ fontSize: "12px", color: "gray" }}>{details.user?.email}</div>
                  </td>
                  <td className={styles.td} style={{ fontWeight: "bold" }}>₹{p.amount}</td>
                  <td className={styles.td}>
                    <span
                      className={`${styles.badge} ${
                        p.status === "completed"
                          ? styles.active
                          : p.status === "pending"
                          ? styles.inactive
                          : p.status === "refunded"
                          ? styles.refunded
                          : styles.banned
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className={styles.button} onClick={() => handleViewDetails(p)}>View</button>
                      {isRefundable && (
                        <button 
                          className={styles.deleteButton} 
                          style={{ borderColor: "#f97316", background: "#fff7ed", color: "#ea580c" }}
                          onClick={() => handleRefund(p.id)}
                        >
                          Refund
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* View Details Modal */}
      {isModalOpen && selectedPayment && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ maxWidth: "500px" }}>
            <h2 style={{ marginBottom: "20px" }}>Transaction Receipt</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div style={{ padding: "15px", background: "#f8fafc", borderRadius: "8px" }}>
                <p style={{ color: "gray", fontSize: "12px", marginBottom: "5px" }}>CUSTOMER DETAILS</p>
                <p><strong>{selectedPayment.user?.name}</strong></p>
                <p style={{ fontSize: "14px", color: "#64748b" }}>{selectedPayment.user?.email}</p>
              </div>

              <div style={{ padding: "15px", background: "#f8fafc", borderRadius: "8px" }}>
                <p style={{ color: "gray", fontSize: "12px", marginBottom: "5px" }}>BOOKING INFORMATION</p>
                <p>Booking ID: <strong>#{selectedPayment.booking?.id}</strong></p>
                <p>Date: <strong>{selectedPayment.booking?.date}</strong></p>
                <p>Duration: <strong>{selectedPayment.booking?.duration} Hours</strong></p>
              </div>

              <div style={{ padding: "15px", borderTop: "2px dashed #e2e8f0", marginTop: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span>Transaction ID</span>
                  <span style={{ fontWeight: "bold" }}>#{selectedPayment.id}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "bold" }}>
                  <span>Total Amount</span>
                  <span style={{ color: "#10b981" }}>₹{selectedPayment.amount}</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "30px", display: "flex", justifyContent: "flex-end" }}>
              <button className={styles.addButton} onClick={() => setIsModalOpen(false)}>Close Window</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
