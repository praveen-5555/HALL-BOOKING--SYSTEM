export default function UserDashboard() {
  const styles = {
    container: {
      padding: "32px",
      background: "#050505",
      minHeight: "100vh",
      color: "white",
      fontFamily: "Segoe UI, sans-serif",
    },

    card: {
      background: "#111",
      borderRadius: "24px",
      padding: "24px",
      border: "1px solid rgba(255,255,255,0.05)",
      boxShadow: "0 0 20px rgba(0,0,0,0.5)",
    },

    flex: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },

    profileCircle: {
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      background: "linear-gradient(135deg,#3b82f6,#14b8a6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "32px",
      fontWeight: "bold",
    },

    button: {
      padding: "8px 16px",
      borderRadius: "20px",
      border: "none",
      cursor: "pointer",
      background: "rgba(255,255,255,0.1)",
      color: "white",
    },

    redButton: {
      padding: "8px 16px",
      borderRadius: "20px",
      border: "none",
      cursor: "pointer",
      background: "rgba(239,68,68,0.2)",
      color: "#f87171",
    },

    bookingCard: {
      background: "#111",
      borderRadius: "16px",
      padding: "20px",
      border: "1px solid rgba(255,255,255,0.05)",
      marginTop: "20px",
    },

    grid: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gap: "20px",
      marginTop: "30px",
    },

    sidebarItem: {
      padding: "15px",
      borderRadius: "10px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>

      {/* Profile */}
      <div style={{ ...styles.card, marginBottom: "20px" }}>

        <div style={{ ...styles.flex, flexWrap: "wrap", gap: "20px" }}>

          <div style={styles.profileCircle}>JD</div>

          <div>
            <h1>John Doe</h1>
            <p style={{ color: "gray" }}>john.doe@example.com</p>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button style={styles.button}>Edit Profile</button>
              <button style={styles.redButton}>Sign Out</button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
            <div>
              <h2>4</h2>
              <p style={{ fontSize: "12px", color: "gray" }}>Bookings</p>
            </div>
            <div>
              <h2>2</h2>
              <p style={{ fontSize: "12px", color: "gray" }}>Reviews</p>
            </div>
          </div>

        </div>
      </div>

      {/* Grid */}
      <div style={styles.grid}>

        {/* Bookings */}
        <div>
          <h2>My Bookings</h2>

          <div style={styles.bookingCard}>
            <h3>Grand Crystal Ballroom</h3>
            <p style={{ color: "gray" }}>Oct 24, 2026 • 200 Guests</p>
            <p style={{ marginTop: "10px" }}>₹1,200</p>

            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button style={styles.button}>View Details</button>
              <button style={styles.button}>Contact Host</button>
            </div>
          </div>

          <div style={{ ...styles.bookingCard, opacity: 0.7 }}>
            <h3>Oceanview Terrace</h3>
            <p style={{ color: "gray" }}>May 12, 2025 • 50 Guests</p>
            <p>₹850</p>

            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button style={{ ...styles.button, background: "white", color: "black" }}>
                Book Again
              </button>
              <button style={styles.button}>Leave Review</button>
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div>
          <h2>Settings</h2>

          <div style={styles.card}>

            <div style={styles.sidebarItem}>
              <p>Personal Info</p>
            </div>

            <div style={styles.sidebarItem}>
              <p>Payment Methods</p>
            </div>

            <div style={styles.sidebarItem}>
              <p>Notifications</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}