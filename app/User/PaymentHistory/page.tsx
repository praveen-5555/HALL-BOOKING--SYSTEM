"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: string;
  date?: string;
  method?: string;
}

interface Booking {
  id: string;
  hallId: string;
  date: string;
  time: string;
  duration: number;
  guests: number;
  status: string;
  hall?: { name: string; location?: string };
}

type FilterStatus = "all" | "completed" | "pending" | "refunded" | "failed";

const STATUS_STYLES: Record<string, { bg: string; color: string; dot: string }> = {
  completed: { bg: "#ecfdf5", color: "#059669", dot: "#10b981" },
  pending:   { bg: "#fffbeb", color: "#d97706", dot: "#f59e0b" },
  refunded:  { bg: "#eff6ff", color: "#2563eb", dot: "#3b82f6" },
  failed:    { bg: "#fef2f2", color: "#dc2626", dot: "#ef4444" },
};

export default function PaymentHistory() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<(Payment & { booking?: Booking }) | null>(null);

  async function fetchData(userId: string) {
    try {
      const [bookRes, payRes] = await Promise.all([
        fetch(`http://127.0.0.1:5000/bookings?userId=${userId}&_expand=hall`),
        fetch(`http://127.0.0.1:5000/payments`),
      ]);
      const [bookData, payData] = await Promise.all([bookRes.json(), payRes.json()]);

      // enrich bookings with hall info if missing
      const enriched: Booking[] = await Promise.all(
        bookData.map(async (b: Booking) => {
          if (!b.hall && b.hallId) {
            try {
              const h = await fetch(`http://127.0.0.1:5000/halls/${b.hallId}`);
              return { ...b, hall: await h.json() };
            } catch { return b; }
          }
          return b;
        })
      );

      setBookings(enriched);
      const ids = enriched.map((b) => b.id);
      const userPayments: Payment[] = payData.filter((p: Payment) => ids.includes(p.bookingId));
      setPayments(userPayments.reverse());
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) { router.push("/Login"); return; }
    const timer = setTimeout(() => fetchData(userId), 0);
    return () => clearTimeout(timer);
  }, [router]);

  const getBooking = (bookingId: string) => bookings.find((b) => b.id === bookingId);

  const filtered = payments.filter((p) => {
    const matchStatus = filter === "all" || p.status === filter;
    const matchSearch =
      search === "" ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.bookingId.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = {
    total: payments.reduce((s, p) => s + (p.amount || 0), 0),
    completed: payments.filter((p) => p.status === "completed").length,
    pending: payments.filter((p) => p.status === "pending").length,
    refunded: payments.filter((p) => p.status === "refunded").length,
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--background)", color: "white", fontFamily: "'Inter', sans-serif" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{ width: 40, height: 40, border: "3px solid rgba(255,255,255,0.1)", borderTop: "3px solid #ef4444", borderRadius: "50%", marginRight: 16 }} />
        Loading payment history...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", paddingTop: "120px", paddingBottom: "80px", paddingLeft: "20px", paddingRight: "20px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <Link href="/User" style={{ color: "#9ca3af", fontSize: "14px", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
              ← Back to Dashboard
            </Link>
            <h1 style={{ fontSize: "36px", fontWeight: "800", color: "white", letterSpacing: "-1px", margin: 0 }}>Payment History</h1>
            <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>Track all your transactions and receipts.</p>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "32px" }}>
          {[
            { label: "Total Spent", value: `₹${stats.total.toLocaleString()}`, icon: "💳", color: "#6366f1" },
            { label: "Completed", value: stats.completed, icon: "✅", color: "#10b981" },
            { label: "Pending", value: stats.pending, icon: "⏳", color: "#f59e0b" },
            { label: "Refunded", value: stats.refunded, icon: "↩️", color: "#3b82f6" },
          ].map((s, i) => (
            <motion.div key={i} whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
              style={{ background: "#ffffff", borderRadius: "24px", padding: "24px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px rgba(0,0,0,0.04)", transition: "all 0.3s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "28px" }}>{s.icon}</span>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.color }} />
              </div>
              <div style={{ fontSize: "28px", fontWeight: "800", color: "#111827", marginBottom: "4px" }}>{s.value}</div>
              <div style={{ fontSize: "13px", color: "#6b7280", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters & Search */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ background: "#ffffff", borderRadius: "20px", padding: "20px 24px", border: "1px solid #e5e7eb", marginBottom: "24px", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>

          {/* Search */}
          <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
            <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🔍</span>
            <input
              placeholder="Search by Transaction ID or Booking Ref..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "10px 14px 10px 40px", borderRadius: "12px", border: "1px solid #e5e7eb", background: "#f9fafb", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {/* Status Filter Pills */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {(["all", "completed", "pending", "refunded", "failed"] as FilterStatus[]).map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                style={{
                  padding: "8px 16px", borderRadius: "100px", fontSize: "13px", fontWeight: "600", border: "none", cursor: "pointer", textTransform: "capitalize", transition: "all 0.2s ease",
                  background: filter === s ? "var(--primary-red)" : "#f3f4f6",
                  color: filter === s ? "white" : "#4b5563",
                  boxShadow: filter === s ? "0 4px 12px rgba(239,68,68,0.3)" : "none",
                }}>
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Payments Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ background: "#ffffff", borderRadius: "24px", border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.04)" }}>

          {filtered.length === 0 ? (
            <div style={{ padding: "80px 40px", textAlign: "center", color: "#6b7280" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧾</div>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>No payments found</div>
              <div style={{ fontSize: "14px" }}>Try changing your filter or search term.</div>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                  {["Transaction", "Hall / Booking", "Date", "Amount", "Status", ""].map((h) => (
                    <th key={h} style={{ padding: "16px 20px", fontSize: "11px", color: "#9ca3af", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.8px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((payment, i) => {
                    const booking = getBooking(payment.bookingId);
                    const st = STATUS_STYLES[payment.status] || STATUS_STYLES.pending;
                    return (
                      <motion.tr key={payment.id}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.04 }}
                        style={{ borderBottom: "1px solid #f3f4f6", transition: "background 0.15s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>

                        {/* Transaction ID */}
                        <td style={{ padding: "18px 20px" }}>
                          <div style={{ fontWeight: "700", color: "#111827", fontSize: "14px" }}>#{payment.id}</div>
                          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>Ref: #{payment.bookingId}</div>
                        </td>

                        {/* Hall */}
                        <td style={{ padding: "18px 20px" }}>
                          <div style={{ fontWeight: "600", color: "#374151", fontSize: "14px" }}>
                            {booking?.hall?.name || `Hall #${payment.bookingId}`}
                          </div>
                          {booking && (
                            <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
                              {booking.guests} guests · {booking.duration}h
                            </div>
                          )}
                        </td>

                        {/* Date */}
                        <td style={{ padding: "18px 20px", fontSize: "14px", color: "#4b5563" }}>
                          {booking?.date
                            ? new Date(booking.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                            : payment.date
                            ? new Date(payment.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                            : "—"}
                        </td>

                        {/* Amount */}
                        <td style={{ padding: "18px 20px", fontWeight: "800", fontSize: "16px", color: "#111827" }}>
                          ₹{payment.amount.toLocaleString()}
                        </td>

                        {/* Status */}
                        <td style={{ padding: "18px 20px" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: "700", background: st.bg, color: st.color }}>
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: st.dot, display: "inline-block" }} />
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>

                        {/* Action */}
                        <td style={{ padding: "18px 20px" }}>
                          <button
                            onClick={() => setSelectedPayment({ ...payment, booking })}
                            style={{ padding: "8px 16px", borderRadius: "10px", border: "1px solid #e5e7eb", background: "white", color: "#374151", fontSize: "13px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.borderColor = "#d1d5db"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
                          >
                            View Receipt
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </motion.div>

        {/* Footer count */}
        {filtered.length > 0 && (
          <div style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: "#9ca3af" }}>
            Showing {filtered.length} of {payments.length} transactions
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      <AnimatePresence>
        {selectedPayment && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedPayment(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "white", borderRadius: "28px", padding: "40px", maxWidth: "460px", width: "100%", boxShadow: "0 40px 80px rgba(0,0,0,0.2)" }}>

              {/* Receipt Header */}
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "20px", background: STATUS_STYLES[selectedPayment.status]?.bg || "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", margin: "0 auto 16px" }}>
                  {selectedPayment.status === "completed" ? "✅" : selectedPayment.status === "refunded" ? "↩️" : selectedPayment.status === "failed" ? "❌" : "⏳"}
                </div>
                <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#111827", margin: 0 }}>Transaction Receipt</h2>
                <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>#{selectedPayment.id}</p>
              </div>

              {/* Amount */}
              <div style={{ textAlign: "center", marginBottom: "32px", padding: "24px", background: "#f9fafb", borderRadius: "20px" }}>
                <div style={{ fontSize: "40px", fontWeight: "800", color: "#111827" }}>₹{selectedPayment.amount.toLocaleString()}</div>
                <span style={{ ...( STATUS_STYLES[selectedPayment.status] ? { background: STATUS_STYLES[selectedPayment.status].bg, color: STATUS_STYLES[selectedPayment.status].color } : {}), padding: "4px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: "700", display: "inline-block", marginTop: "10px", textTransform: "capitalize" }}>
                  {selectedPayment.status}
                </span>
              </div>

              {/* Details Grid */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
                {[
                  { label: "Booking Reference", value: `#${selectedPayment.bookingId}` },
                  { label: "Hall", value: selectedPayment.booking?.hall?.name || `Hall #${selectedPayment.bookingId}` },
                  { label: "Event Date", value: selectedPayment.booking?.date ? new Date(selectedPayment.booking.date).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "—" },
                  { label: "Duration", value: selectedPayment.booking ? `${selectedPayment.booking.duration} Hours` : "—" },
                  { label: "Guests", value: selectedPayment.booking ? `${selectedPayment.booking.guests} Guests` : "—" },
                  { label: "Payment Method", value: selectedPayment.method || "Online Payment" },
                ].map((row) => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ color: "#9ca3af", fontWeight: "600" }}>{row.label}</span>
                    <span style={{ color: "#111827", fontWeight: "700", textAlign: "right", maxWidth: "60%" }}>{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Close */}
              <button
                onClick={() => setSelectedPayment(null)}
                style={{ width: "100%", padding: "14px", borderRadius: "14px", background: "var(--primary-red)", color: "white", border: "none", fontWeight: "700", fontSize: "15px", cursor: "pointer", boxShadow: "0 8px 20px rgba(239,68,68,0.3)", transition: "all 0.2s" }}>
                Close Receipt
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
