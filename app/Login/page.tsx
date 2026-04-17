"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Login failed");
        setIsSubmitting(false);
        return;
      }

      if (result?.error) {
        setError(result.error);
        setIsSubmitting(false);
      } else {
        localStorage.setItem("role", result.user?.role || "user");
        localStorage.setItem("userName", result.user?.name || "");
        localStorage.setItem("userId", result.user?.id || "1");

        if (result.user.role === "admin") {
          router.push("/Admin/Dashboard");
        } else {
          router.push("/User");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "var(--background)",
      padding: "20px",
      fontFamily: "'Inter', sans-serif",
      position: "relative" as const,
      overflow: "hidden",
    },

    bg1: {
      position: "absolute" as const,
      width: "500px",
      height: "500px",
      background: "var(--accent-glow)",
      borderRadius: "50%",
      filter: "blur(120px)",
      bottom: "-150px",
      right: "-150px",
      opacity: 0.4,
    },

    card: {
      width: "100%",
      maxWidth: "440px",
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "32px",
      padding: "50px",
      backdropFilter: "blur(20px)",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      position: "relative" as const,
      zIndex: 1,
    },

    title: {
      textAlign: "center" as const,
      color: "#111827",
      fontSize: "32px",
      fontWeight: "800",
      marginBottom: "8px",
      letterSpacing: "-1px",
    },

    subtitle: {
      textAlign: "center" as const,
      color: "#4b5563",
      fontSize: "15px",
      marginBottom: "36px",
    },

    label: {
      fontSize: "11px",
      color: "#374151",
      fontWeight: "700",
      marginBottom: "8px",
      display: "block",
      letterSpacing: "1px",
      textTransform: "uppercase" as const,
    },

    input: {
      width: "100%",
      padding: "16px",
      borderRadius: "14px",
      background: "#f9fafb",
      border: "1px solid #d1d5db",
      color: "#111827",
      outline: "none",
      fontSize: "15px",
      marginBottom: "24px",
      transition: "all 0.2s ease",
    },

    button: {
      width: "100%",
      padding: "18px",
      borderRadius: "14px",
      background: "var(--primary-red)",
      color: "white",
      fontWeight: "700",
      fontSize: "16px",
      border: "none",
      cursor: "pointer",
      marginTop: "12px",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: "0 10px 15px -3px rgba(239, 68, 68, 0.3)",
    },

    error: {
      background: "rgba(239, 68, 68, 0.1)",
      border: "1px solid rgba(239, 68, 68, 0.2)",
      color: "#f87171",
      padding: "14px",
      borderRadius: "12px",
      marginBottom: "24px",
      textAlign: "center" as const,
    },

    footer: {
      textAlign: "center" as const,
      marginTop: "28px",
      color: "var(--text-muted)",
      fontSize: "14px",
    },

    link: {
      color: "white",
      fontWeight: "600",
      textDecoration: "none",
      marginLeft: "6px",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.bg1}></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={styles.card}
      >
        <h2 style={styles.title}>Account Login</h2>
        <p style={styles.subtitle}>Unlock your premium booking experience</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleLogin}>
          <label style={styles.label}>EMAIL ADDRESS</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
            className="focus:border-primary-red/50 focus:bg-white font-medium"
          />

          <label style={styles.label}>PASSWORD</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
            className="focus:border-primary-red/50 focus:bg-white font-medium"
          />

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: isSubmitting ? 0.7 : 1,
            }}
            disabled={isSubmitting}
            className="hover:brightness-110 active:scale-[0.98]"
          >
            {isSubmitting ? "Authenticating..." : "Login"}
          </button>
        </form>

        <p style={styles.footer}>
          Not authorized?
          <Link href="/" style={styles.link} className="hover:text-primary-red transition-colors">
            Return Home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}