"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

function BookForm() {
  const searchParams = useSearchParams();
  const hallId = searchParams.get("hallId");

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    duration: "4",
    guests: "50",
    name: "",
    email: "",
    requests: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const selectedDate = new Date(`${formData.date}T${formData.time}`);
    const now = new Date();

    if (selectedDate < now) {
      setError("Bookings cannot be made for a past date or time.");
      return;
    }

    setIsSubmitting(true);
    
    const bookingData = {
      id: `BK-${Math.floor(Math.random() * 9000) + 1000}`,
      userId: localStorage.getItem("userId") || "1",
      hallId: hallId || "1",
      date: formData.date,
      time: formData.time,
      duration: parseInt(formData.duration),
      guests: parseInt(formData.guests),
      status: "pending",
      amount: parseInt(formData.duration) * 50,
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
      });

      if (res.ok) {
        const savedBooking = await res.json();
        const actualBookingId = savedBooking.id;

        // Also create a mockup payment record linked to this booking
        const paymentData = {
          id: `PAY-${Math.floor(Math.random() * 90000) + 10000}`,
          bookingId: actualBookingId,
          amount: bookingData.amount,
          status: "pending"
        };
        await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData)
        });

        setIsSuccess(true);
      }
    } catch {
      setError("Failed to process booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "var(--background)",
      padding: "120px 20px 80px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "'Inter', sans-serif",
    },
    card: {
      width: "100%",
      maxWidth: "720px",
      background: "#ffffff",
      borderRadius: "32px",
      padding: "60px",
      border: "1px solid #e5e7eb",
      backdropFilter: "blur(20px)",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    },
    title: {
      fontSize: "36px",
      fontWeight: "800",
      marginBottom: "12px",
      textAlign: "center" as const,
      color: "#111827",
      letterSpacing: "-1px",
    },
    subtitle: {
      color: "#4b5563",
      textAlign: "center" as const,
      marginBottom: "48px",
      fontSize: "16px",
    },
    formGroup: {
      marginBottom: "24px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      color: "#374151",
      fontSize: "13px",
      fontWeight: "600",
      textTransform: "uppercase" as const,
      letterSpacing: "0.5px",
    },
    input: {
      width: "100%",
      padding: "14px 18px",
      borderRadius: "14px",
      background: "#f9fafb",
      border: "1px solid #d1d5db",
      color: "#111827",
      fontSize: "16px",
      outline: "none",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "24px",
    },
    button: {
      width: "100%",
      padding: "18px",
      borderRadius: "14px",
      background: "var(--primary-red)",
      color: "white",
      fontSize: "16px",
      fontWeight: "700",
      border: "none",
      cursor: "pointer",
      marginTop: "16px",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: "0 10px 15px -3px rgba(239, 68, 68, 0.3)",
    },
    error: {
      background: "rgba(239, 68, 68, 0.1)",
      color: "#f87171",
      padding: "16px",
      borderRadius: "12px",
      marginBottom: "32px",
      fontSize: "14px",
      textAlign: "center" as const,
      border: "1px solid rgba(239, 68, 68, 0.2)",
    },
    policyNote: {
      fontSize: "13px",
      color: "var(--text-muted)",
      textAlign: "center" as const,
      marginTop: "24px",
      lineHeight: "1.6",
    }
  };

  if (isSuccess) {
    return (
      <div style={styles.container}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={styles.card}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "72px", marginBottom: "32px" }}>🎉</div>
            <h2 style={styles.title}>Booking Requested!</h2>
            <p style={styles.subtitle}>
              Your request for Hall #{hallId} has been sent for review.<br/>
              We&apos;ll notify you shortly via email.
            </p>
            <Link href="/Home">
              <button style={styles.button} className="hover:brightness-110 active:scale-95">
                Return Home
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={styles.card}
      >
        <h1 style={styles.title}>Reserve Your Hall</h1>
        <p style={styles.subtitle}>
          Configure your event details to secure your request.
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="name"
                required
                style={styles.input}
                className="focus:border-red-500/50 focus:bg-white font-medium"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                required
                style={styles.input}
                className="focus:border-red-500/50 focus:bg-white font-medium"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Event Date</label>
              <input
                type="date"
                name="date"
                required
                min={new Date().toISOString().split("T")[0]}
                style={styles.input}
                className="focus:border-red-500/50 focus:bg-white font-medium"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Start Time</label>
              <input
                type="time"
                name="time"
                required
                style={styles.input}
                className="focus:border-red-500/50 focus:bg-white font-medium"
                value={formData.time}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Duration (Hours)</label>
              <select
                name="duration"
                style={styles.input}
                className="focus:border-red-500/50 focus:bg-white font-medium"
                value={formData.duration}
                onChange={handleChange}
              >
                <option value="6">6 Hours (Minimum)</option>
                <option value="12">Half Day (12 Hours)</option>
                <option value="24">Full Day (24 Hours)</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Estimated Guests</label>
              <input
                type="number"
                name="guests"
                required
                min="1"
                style={styles.input}
                className="focus:border-red-500/50 focus:bg-white font-medium"
                value={formData.guests}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Special Requirements</label>
            <textarea
              name="requests"
              rows={3}
              style={{ ...styles.input, resize: "none" }}
              className="focus:border-red-500/50 focus:bg-white font-medium"
              placeholder="Catering, seating arrangements, etc."
              value={formData.requests}
              onChange={handleChange}
            />
          </div>

          <button 
            type="submit" 
            style={{ 
              ...styles.button,
              opacity: isSubmitting ? 0.7 : 1,
              pointerEvents: isSubmitting ? "none" : "auto"
            }} 
            className="hover:brightness-110 active:scale-[0.98]"
          >
            {isSubmitting ? "Sending Request..." : "Request Booking"}
          </button>

         
        </form>
      </motion.div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div style={{ padding: "100px", color: "white", textAlign: "center" }}>Loading booking form...</div>}>
      <BookForm />
    </Suspense>
  );
}
