"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

interface Booking {
  id: string;
  hallId: string;
  date: string;
  time: string;
  duration: number;
  guests: number;
  status: string;
  amount: number;
  hall?: { name: string; image?: string };
}

interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: string;
  date?: string;
  method?: string;
}

const STATUS_COLORS: Record<string, { bg: string; color: string; dot: string }> = {
  confirmed: { bg: "#ecfdf5", color: "#059669", dot: "#10b981" },
  pending:   { bg: "#fffbeb", color: "#d97706", dot: "#f59e0b" },
  cancelled: { bg: "#fef2f2", color: "#dc2626", dot: "#ef4444" },
  completed: { bg: "#ecfdf5", color: "#059669", dot: "#10b981" },
  refunded:  { bg: "#eff6ff", color: "#2563eb", dot: "#3b82f6" },
  failed:    { bg: "#fef2f2", color: "#dc2626", dot: "#ef4444" },
};

export default function UserProfile() {
  const [user, setUser] = useState<{ name: string; email: string; id: string } | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"bookings" | "payments">("bookings");
  const router = useRouter();

  async function fetchData(userId: string) {
    try {
      const res = await fetch(`/api/bookings?userId=${userId}`);
      const bookData: Booking[] = await res.json();

      // Enrich with hall info
      const enriched = await Promise.all(
        bookData.map(async (b) => {
          if (b.hallId) {
            try {
              const hRes = await fetch(`/api/halls/${b.hallId}`);
              if (hRes.ok) return { ...b, hall: await hRes.json() };
            } catch { /* ignore */ }
          }
          return b;
        })
      );
      const sorted = enriched.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setBookings(sorted);

      // Payments
      const payRes = await fetch("/api/payments");
      const allPayments: Payment[] = await payRes.json();
      const bookingIds = sorted.map((b) => b.id);
      const userPayments = allPayments.filter((p) => bookingIds.includes(p.bookingId)).reverse();
      setPayments(userPayments);
    } catch (e) {
      console.error("Failed to fetch user data:", e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");

    if (!userId) { router.push("/Login"); return; }

    const timer = setTimeout(() => {
      setUser({ id: userId, name: userName || "Guest", email: userEmail || "user@example.com" });
      fetchData(userId);
    }, 0);
    return () => clearTimeout(timer);
  }, [router]);

  const cancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (res.ok) setBookings(bookings.filter((b) => b.id !== id));
    } catch { alert("Failed to cancel booking."); }
  };

  const handleSignOut = () => {
    localStorage.clear();
    router.push("/");
    window.location.reload();
  };

  const totalSpent = payments.filter(p => p.status === "completed").reduce((s, p) => s + (p.amount || 0), 0);
  const completedPayments = payments.filter(p => p.status === "completed").length;
  const pendingPayments = payments.filter(p => p.status === "pending").length;
  const refundedPayments = payments.filter(p => p.status === "refunded").length;

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--background)", color: "white", fontFamily: "'Inter', sans-serif", gap: "16px" }}>
        <div style={{ width: 36, height: 36, border: "3px solid rgba(255,255,255,0.1)", borderTop: "3px solid #ef4444", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        Loading your dashboard...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", paddingTop: "120px", paddingBottom: "80px", paddingLeft: "20px", paddingRight: "20px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "36px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "36px", fontWeight: "800", color: "white", letterSpacing: "-1px", margin: 0 }}>
              Member Dashboard
            </h1>
            <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>
              Welcome back, <strong style={{ color: "white" }}>{user?.name}</strong> 👋
            </p>
          </div>
          <button onClick={handleSignOut}
            style={{ padding: "12px 24px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontWeight: "600", cursor: "pointer" }}>
            Sign Out
          </button>
        </motion.div>

        {/* Profile + Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "24px", marginBottom: "32px", flexWrap: "wrap" }}>
          
          {/* Profile Card */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            style={{ background: "#ffffff", borderRadius: "28px", padding: "28px", border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "18px", background: "linear-gradient(135deg, #ef4444, #b91c1c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "800", color: "white", boxShadow: "0 8px 16px rgba(239,68,68,0.25)", flexShrink: 0 }}>
                {user?.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: "800", color: "#111827", fontSize: "16px" }}>{user?.name}</div>
                <div style={{ fontSize: "12px", color: "#9ca3af" }}>Premium Member</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                <span style={{ color: "#9ca3af", fontWeight: 600 }}>Email</span>
                <span style={{ color: "#111827", fontWeight: 700, maxWidth: "60%", textAlign: "right", wordBreak: "break-word" }}>{user?.email}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                <span style={{ color: "#9ca3af", fontWeight: 600 }}>Bookings</span>
                <span style={{ color: "#111827", fontWeight: 800 }}>{bookings.length}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                <span style={{ color: "#9ca3af", fontWeight: 600 }}>Total Spent</span>
                <span style={{ color: "#059669", fontWeight: 800 }}>₹{totalSpent.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                <span style={{ color: "#9ca3af", fontWeight: 600 }}>Member Since</span>
                <span style={{ color: "#111827", fontWeight: 700 }}>2026</span>
              </div>
            </div>

            <Link href="/Home" style={{ display: "block", marginTop: "20px", padding: "12px", borderRadius: "12px", background: "var(--primary-red)", color: "white", fontWeight: "700", textAlign: "center", textDecoration: "none", fontSize: "14px" }}>
              Browse Halls
            </Link>
          </motion.div>

          {/* Quick Stats */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
            {[
              { label: "Total Spent", value: `₹${totalSpent.toLocaleString()}`, icon: "💰", color: "#6366f1", bg: "rgba(99,102,241,0.08)" },
              { label: "Completed", value: completedPayments, icon: "✅", color: "#10b981", bg: "rgba(16,185,129,0.08)" },
              { label: "Pending", value: pendingPayments, icon: "⏳", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
              { label: "Refunded", value: refundedPayments, icon: "↩️", color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
            ].map((s, i) => (
              <motion.div key={i} whileHover={{ y: -3 }}
                style={{ background: "#ffffff", borderRadius: "20px", padding: "22px", border: "1px solid #e5e7eb", boxShadow: "0 4px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", marginBottom: "12px" }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: "26px", fontWeight: "800", color: "#111827", marginBottom: "4px" }}>{s.value}</div>
                <div style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "16px", padding: "6px", marginBottom: "24px", border: "1px solid rgba(255,255,255,0.08)", width: "fit-content" }}>
          {(["bookings", "payments"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 24px", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "14px", textTransform: "capitalize", transition: "all 0.2s",
                background: activeTab === tab ? "white" : "transparent",
                color: activeTab === tab ? "#111827" : "rgba(255,255,255,0.6)",
                boxShadow: activeTab === tab ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
              }}>
              {tab === "bookings" ? `📅 My Bookings (${bookings.length})` : `💳 Payment History (${payments.length})`}
            </button>
          ))}
        </div>

        {/* ── BOOKINGS TAB ───────────────────────────────── */}
        {activeTab === "bookings" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {bookings.length === 0 ? (
              <div style={{ background: "#ffffff", borderRadius: "24px", padding: "80px 40px", textAlign: "center", border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏛️</div>
                <div style={{ fontSize: "18px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>No bookings yet</div>
                <div style={{ color: "#9ca3af", marginBottom: "24px" }}>Start exploring halls to make your first reservation!</div>
                <Link href="/Home" style={{ padding: "12px 28px", background: "var(--primary-red)", color: "white", borderRadius: "12px", fontWeight: "700", textDecoration: "none", fontSize: "14px" }}>
                  Browse All Halls
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {bookings.map((booking, i) => {
                  const st = STATUS_COLORS[booking.status] || STATUS_COLORS.pending;
                  return (
                    <motion.div key={booking.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      style={{ background: "#ffffff", borderRadius: "20px", padding: "24px", border: "1px solid #e5e7eb", boxShadow: "0 4px 8px rgba(0,0,0,0.03)", display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
                      {/* Hall image */}
                      {booking.hall?.image && (
                        <img src={booking.hall.image} alt={booking.hall.name} style={{ width: "80px", height: "64px", objectFit: "cover", borderRadius: "12px", flexShrink: 0 }}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      )}
                      <div style={{ flex: 1, minWidth: "200px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: "700", background: st.bg, color: st.color }}>
                            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: st.dot, display: "inline-block" }} />
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <h3 style={{ fontWeight: "700", color: "#111827", fontSize: "17px", margin: "0 0 4px" }}>
                          {booking.hall?.name || `Hall #${booking.hallId}`}
                        </h3>
                        <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>
                          {new Date(booking.date).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} at {booking.time}
                        </p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                        <div style={{ fontSize: "20px", fontWeight: "800", color: "#111827" }}>₹{booking.amount?.toLocaleString()}</div>
                        <div style={{ fontSize: "12px", color: "#9ca3af" }}>{booking.guests} Guests · {booking.duration} Hrs</div>
                        <button onClick={() => cancelBooking(booking.id)}
                          style={{ fontSize: "12px", color: "#ef4444", background: "#fef2f2", border: "1px solid #fee2e2", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}>
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ── PAYMENTS TAB ───────────────────────────────── */}
        {activeTab === "payments" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ background: "#ffffff", borderRadius: "24px", border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 4px 8px rgba(0,0,0,0.03)" }}>
              
              {/* Table Header */}
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#111827" }}>
                  💳 Payment History
                </h3>
                <Link href="/User/PaymentHistory"
                  style={{ padding: "8px 18px", borderRadius: "10px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "var(--primary-red)", fontSize: "13px", fontWeight: "700", textDecoration: "none", transition: "all 0.2s" }}>
                  View All Receipts →
                </Link>
              </div>

              {payments.length === 0 ? (
                <div style={{ padding: "60px 40px", textAlign: "center", color: "#9ca3af" }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>🧾</div>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>No payment records</div>
                  <div style={{ fontSize: "13px" }}>Your transactions will appear here once you make a booking.</div>
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                      {["Transaction ID", "Booking Ref", "Method", "Amount", "Status"].map(h => (
                        <th key={h} style={{ padding: "14px 20px", fontSize: "11px", color: "#9ca3af", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.7px" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.slice(0, 8).map((p, i) => {
                      const st = STATUS_COLORS[p.status] || STATUS_COLORS.pending;
                      const booking = bookings.find(b => b.id === p.bookingId);
                      return (
                        <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                          style={{ borderBottom: "1px solid #f3f4f6" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#fafafa")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                          <td style={{ padding: "16px 20px" }}>
                            <div style={{ fontWeight: "700", color: "#111827", fontSize: "13px" }}>#{p.id}</div>
                          </td>
                          <td style={{ padding: "16px 20px" }}>
                            <div style={{ fontWeight: "600", color: "#374151", fontSize: "13px" }}>{booking?.hall?.name || `Booking #${p.bookingId}`}</div>
                            <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>#{p.bookingId}</div>
                          </td>
                          <td style={{ padding: "16px 20px", fontSize: "13px", color: "#4b5563" }}>
                            {p.method || "Online"}
                          </td>
                          <td style={{ padding: "16px 20px", fontWeight: "800", fontSize: "15px", color: "#111827" }}>
                            ₹{p.amount.toLocaleString()}
                          </td>
                          <td style={{ padding: "16px 20px" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: "700", background: st.bg, color: st.color }}>
                              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: st.dot }} />
                              {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {payments.length > 8 && (
                <div style={{ padding: "16px 24px", borderTop: "1px solid #f3f4f6", textAlign: "center" }}>
                  <Link href="/User/PaymentHistory" style={{ fontSize: "14px", color: "var(--primary-red)", fontWeight: "700", textDecoration: "none" }}>
                    View all {payments.length} transactions →
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Need Help Card */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ marginTop: "28px", background: "linear-gradient(135deg, #ef4444, #b91c1c)", borderRadius: "24px", padding: "28px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h4 style={{ color: "white", fontWeight: "800", fontSize: "18px", margin: "0 0 6px" }}>Need Assistance?</h4>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", margin: 0 }}>Our concierge is available 24/7 for your event needs.</p>
          </div>
          <button style={{ padding: "12px 24px", borderRadius: "12px", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", color: "white", fontWeight: "700", cursor: "pointer", fontSize: "14px" }}>
            Contact Support
          </button>
        </motion.div>

      </div>
    </div>
  );
}