export default function AdminDashboard() {

  const styles = {
    container: {
      padding: "30px",
      background: "#050505",
      minHeight: "100vh",
      color: "white",
      fontFamily: "Segoe UI, sans-serif",
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
      flexWrap: "wrap" as const,
      gap: "20px",
    },

    title: {
      fontSize: "36px",
      fontWeight: "bold",
      background: "linear-gradient(to right,#60a5fa,#a855f7)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },

    subtitle: {
      color: "#9ca3af",
    },

    button: {
      background: "white",
      color: "black",
      padding: "10px 20px",
      borderRadius: "30px",
      fontWeight: "bold",
      border: "none",
      cursor: "pointer",
    },

    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
      gap: "20px",
      marginBottom: "40px",
    },

    card: {
      background: "#111",
      padding: "20px",
      borderRadius: "15px",
      border: "1px solid rgba(255,255,255,0.05)",
    },

    statNumber: {
      fontSize: "32px",
      fontWeight: "bold",
      margin: "10px 0",
    },

    greenText: {
      color: "#34d399",
      fontSize: "14px",
    },

    tableContainer: {
      background: "#111",
      borderRadius: "15px",
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.05)",
    },

    tableHeader: {
      padding: "15px",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },

    table: {
      width: "100%",
      borderCollapse: "collapse" as const,
    },

    th: {
      padding: "12px",
      textAlign: "left" as const,
      color: "#9ca3af",
      fontSize: "12px",
    },

    td: {
      padding: "12px",
      fontSize: "14px",
    },

    badge: {
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "12px",
    },

    confirmed: {
      background: "rgba(16,185,129,0.2)",
      color: "#34d399",
    },

    pending: {
      background: "rgba(234,179,8,0.2)",
      color: "#facc15",
    },
  };

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>
            Welcome to the Admin Portal. Here&apos;s what&apos;s happening today.
          </p>
        </div>

        <button style={styles.button}>Export Report</button>
      </div>

      {/* Stats */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <p>Total Bookings</p>
          <p style={styles.statNumber}>1248</p>
          <p style={styles.greenText}>from last month</p>
        </div>

        <div style={styles.card}>
          <p>Total Revenue</p>
          <p style={styles.statNumber}>84300</p>
          <p style={styles.greenText}>from last month</p>
        </div>

        <div style={styles.card}>
          <p>Active Users</p>
          <p style={styles.statNumber}>8590</p>
          <p style={styles.greenText}> from last month</p>
        </div>

        <div style={styles.card}>
          <p>Available Halls</p>
          <p style={styles.statNumber}>45</p>
          <p style={{ color: "gray" }}>Out of 60 total</p>
        </div>
      </div>

      {/* Table */}
      <div style={styles.tableContainer}>

        <div style={styles.tableHeader}>
          <h2>Recent Bookings</h2>
          <span style={{ color: "#60a5fa", cursor: "pointer" }}>
            View All →
          </span>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Booking ID</th>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Hall</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={styles.td}>#BK-9840</td>
              <td style={styles.td}>Sarah Jenkins</td>
              <td style={styles.td}>Grand Crystal Ballroom</td>
              <td style={styles.td}>1200</td>
              <td style={styles.td}>
                <span style={{ ...styles.badge, ...styles.confirmed }}>
                  Confirmed
                </span>
              </td>
            </tr>

            <tr>
              <td style={styles.td}>#BK-9839</td>
              <td style={styles.td}>Michael Chen</td>
              <td style={styles.td}>Oceanview Terrace</td>
              <td style={styles.td}>850</td>
              <td style={styles.td}>
                <span style={{ ...styles.badge, ...styles.pending }}>
                  Pending
                </span>
              </td>
            </tr>

            <tr>
              <td style={styles.td}>#BK-9838</td>
              <td style={styles.td}>Emma Thompson</td>
              <td style={styles.td}>The Royal Banquet</td>
              <td style={styles.td}>2000</td>
              <td style={styles.td}>
                <span style={{ ...styles.badge, ...styles.confirmed }}>
                  Confirmed
                </span>
              </td>
            </tr>
          </tbody>

        </table>
      </div>

    </div>
  );
}