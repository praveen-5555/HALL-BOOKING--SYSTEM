"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const stats = [
  { value: "50", label: "Premium Halls" },
  { value: "12", label: "Events Hosted" },
  { value: "8",  label: "Happy Clients" },
  { value: "24",   label: "Cities Covered" },
];

const values = [
  { icon: "✦", title: "Excellence",  desc: "Every hall is handpicked to meet our rigorous quality standards." },
  { icon: "⚡", title: "Speed",       desc: "Book your perfect venue in minutes, not days." },
  { icon: "🛡", title: "Trust",       desc: "Verified venues, secure payments, and transparent pricing." },
  { icon: "🌟", title: "Experience", desc: "A concierge-grade booking experience from start to finish." },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "white", fontFamily: "'Inter', sans-serif" }}>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "160px 24px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "800px", height: "500px", background: "radial-gradient(ellipse, rgba(239,68,68,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 70px)", fontWeight: "900", letterSpacing: "-2px", lineHeight: 1.1, marginBottom: "24px", background: "linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.4) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            A New Era of<br />Event Excellence
          </h1>
          <p style={{ fontSize: "17px", color: "#a1a1aa", lineHeight: 1.8, maxWidth: "500px", margin: "0 auto 40px" }}>
            SDHalls is the premier destination for discovering and booking the most exquisite event spaces — from corporate galas to intimate celebrations.
          </p>
          <Link href="/Home">
            <button style={{ padding: "14px 36px", borderRadius: "100px", background: "var(--primary-red)", color: "white", fontWeight: "700", fontSize: "15px", border: "none", cursor: "pointer", boxShadow: "0 0 40px rgba(239,68,68,0.3)" }}>
              Explore Halls →
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Stats */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "60px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "40px", textAlign: "center" }}>
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
              <div style={{ fontSize: "44px", fontWeight: "900", background: "linear-gradient(135deg, #fff, #ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "8px" }}>{s.value}</div>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#71717a", textTransform: "uppercase", letterSpacing: "1.5px" }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section style={{ maxWidth: "700px", margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <span style={{ color: "#ef4444", fontWeight: "700", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase" }}>Our Mission</span>
          <h2 style={{ fontSize: "34px", fontWeight: "800", margin: "16px 0 20px", letterSpacing: "-1px", lineHeight: 1.3 }}>
            Elevating venues into extraordinary experiences
          </h2>
          <p style={{ color: "#a1a1aa", lineHeight: 1.9, fontSize: "15px" }}>
            We believe every event tells a story. Our platform is meticulously curated to ensure that every hall offers more than just a space — it offers an atmosphere for memories to thrive. By combining technology with hospitality expertise, we make venue booking simple, transparent, and delightful.
          </p>
        </motion.div>
      </section>

      {/* Values */}
      <section style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "80px 24px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            style={{ textAlign: "center", fontSize: "32px", fontWeight: "800", marginBottom: "48px", letterSpacing: "-1px" }}>
            Why SDHalls
          </motion.h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
            {values.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }}
                style={{ padding: "28px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
                <div style={{ fontSize: "24px", marginBottom: "16px" }}>{v.icon}</div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>{v.title}</h3>
                <p style={{ color: "#a1a1aa", fontSize: "14px", lineHeight: 1.7 }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: "center", padding: "100px 24px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <p style={{ color: "#a1a1aa", fontSize: "18px", fontStyle: "italic", marginBottom: "32px", maxWidth: "500px", margin: "0 auto 32px" }}>
            &quot;The right venue transforms a good event into an unforgettable one.&quot;
          </p>
          <Link href="/Home">
            <button style={{ padding: "14px 40px", borderRadius: "100px", background: "var(--primary-red)", color: "white", fontWeight: "700", fontSize: "15px", border: "none", cursor: "pointer", boxShadow: "0 0 30px rgba(239,68,68,0.25)" }}>
              Find Your Hall
            </button>
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
