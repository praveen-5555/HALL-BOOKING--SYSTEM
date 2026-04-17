"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage({ type: "error", text: result.error || "Registration failed" });
        setIsSubmitting(false);
        return;
      }

      if (result?.error) {
        setMessage({ type: "error", text: result.error });
        setIsSubmitting(false);
      } else {
        setMessage({ type: "success", text: "Account created successfully! Redirecting to login..." });

        setTimeout(() => {
          router.push("/Login");
        }, 1500);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage({ type: "error", text: "Something went wrong" });
      setIsSubmitting(false);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "var(--background)",
      position: "relative" as const,
      overflow: "hidden",
      padding: "20px",
      fontFamily: "'Inter', sans-serif",
    },

    bg1: {
      position: "absolute" as const,
      width: "600px",
      height: "600px",
      background: "var(--accent-glow)",
      borderRadius: "50%",
      filter: "blur(120px)",
      top: "-200px",
      left: "-200px",
      opacity: 0.5,
    },

    card: {
      width: "100%",
      maxWidth: "440px",
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "32px",
      padding: "50px",
      backdropFilter: "blur(20px)",
      color: "#111827",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      position: "relative" as const,
      zIndex: 1,
    },

    title: {
      textAlign: "center" as const,
      fontSize: "32px",
      fontWeight: "800",
      marginBottom: "8px",
      letterSpacing: "-1px",
    },

    subtitle: {
      textAlign: "center" as const,
      color: "#4b5563",
      marginBottom: "36px",
      fontSize: "15px",
    },

    inputBox: {
      marginBottom: "20px",
    },

    input: {
      width: "100%",
      padding: "16px",
      borderRadius: "14px",
      border: "1px solid #d1d5db",
      background: "#f9fafb",
      color: "#111827",
      outline: "none",
      fontSize: "15px",
      transition: "all 0.2s ease",
    },

    button: {
      width: "100%",
      padding: "16px",
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

    messageSuccess: {
      background: "rgba(16,185,129,0.1)",
      color: "#34d399",
      padding: "14px",
      borderRadius: "12px",
      marginBottom: "24px",
      textAlign: "center" as const,
      border: "1px solid rgba(16,185,129,0.2)",
    },

    messageError: {
      background: "rgba(239,68,68,0.1)",
      color: "#f87171",
      padding: "14px",
      borderRadius: "12px",
      marginBottom: "24px",
      textAlign: "center" as const,
      border: "1px solid rgba(239,68,68,0.2)",
    },

    bottom: {
      marginTop: "28px",
      textAlign: "center" as const,
      color: "#4b5563",
      fontSize: "14px",
    },

    link: {
      color: "#111827",
      marginLeft: "6px",
      fontWeight: "600",
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.bg1}></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={styles.card}
      >
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Unlock your premium booking experience</p>

        {message && (
          <div style={message.type === "success" ? styles.messageSuccess : styles.messageError}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div style={styles.inputBox}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              className="focus:border-primary-red/50 focus:bg-white font-medium"
              required
            />
          </div>

          <div style={styles.inputBox}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              className="focus:border-primary-red/50 focus:bg-white font-medium"
              required
            />
          </div>

          <div style={styles.inputBox}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              className="focus:border-primary-red/50 focus:bg-white font-medium"
              required
            />
          </div>

          <div style={styles.inputBox}>
            <label style={{ fontSize: "12px", fontWeight: "700", color: "#4b5563", marginBottom: "12px", display: "block", textTransform: "uppercase", letterSpacing: "1px" }}>Select Account Type</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setRole("user")}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "12px",
                  border: "2px solid",
                  borderColor: role === "user" ? "var(--primary-red)" : "#e5e7eb",
                  background: role === "user" ? "rgba(239, 68, 68, 0.05)" : "white",
                  color: role === "user" ? "var(--primary-red)" : "#4b5563",
                  fontWeight: "700",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "12px",
                  border: "2px solid",
                  borderColor: role === "admin" ? "var(--primary-red)" : "#e5e7eb",
                  background: role === "admin" ? "rgba(239, 68, 68, 0.05)" : "white",
                  color: role === "admin" ? "var(--primary-red)" : "#4b5563",
                  fontWeight: "700",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                Admin
              </button>
            </div>
          </div>

          <button style={styles.button} disabled={isSubmitting} className="hover:brightness-110 active:scale-[0.98]">
            {isSubmitting ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p style={styles.bottom}>
          Already have an account?
          <Link href="/Login" style={styles.link} className="hover:text-primary-red transition-colors">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}