"use client";
import Link from "next/link";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./admin.module.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    router.push("/");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h1 className={styles.sidebarTitle}>Admin Panel</h1>
        
        <nav style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
          <Link 
            href="/Admin/Dashboard" 
            className={`${styles.sidebarLink} ${pathname === "/Admin/Dashboard" ? styles.activeLink : ""}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/Admin/Halls" 
            className={`${styles.sidebarLink} ${pathname === "/Admin/Halls" ? styles.activeLink : ""}`}
          >
            Manage Halls
          </Link>
          <Link 
            href="/Admin/Booking" 
            className={`${styles.sidebarLink} ${pathname === "/Admin/Booking" ? styles.activeLink : ""}`}
          >
            Bookings
          </Link>
          <Link 
            href="/Admin/Payment" 
            className={`${styles.sidebarLink} ${pathname === "/Admin/Payment" ? styles.activeLink : ""}`}
          >
            Payments
          </Link>
          <Link 
            href="/Admin/Users Management" 
            className={`${styles.sidebarLink} ${pathname === "/Admin/Users Management" ? styles.activeLink : ""}`}
          >
            Users
          </Link>
        </nav>

        <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
