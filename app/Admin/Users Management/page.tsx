"use client";
import { useEffect, useState } from "react";
import styles from "../admin.module.css";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  password?: string;
}

const ITEMS_PER_PAGE = 5;

export default function AdminUsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState("user");
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Delete confirm
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(), 0);
    return () => clearTimeout(timer);
  }, []);

  // Reset page on filter changes
  useEffect(() => {
    const timer = setTimeout(() => setCurrentPage(1), 0);
    return () => clearTimeout(timer);
  }, [searchQuery, roleFilter]);

  // ─── Filtering ──────────────────────────────────────────────
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q);
    const matchRole =
      roleFilter === "all" || u.role.toLowerCase() === roleFilter;
    return matchSearch && matchRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = users.filter((u) => u.role !== "admin").length;

  // ─── Handlers ───────────────────────────────────────────────
  const openAddModal = () => {
    setEditingUser(null);
    setFormName("");
    setFormEmail("");
    setFormRole("user");
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (u: User) => {
    setEditingUser(u);
    setFormName(u.name);
    setFormEmail(u.email);
    setFormRole(u.role);
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!formName.trim() || !formEmail.trim()) {
      setFormError("Name and email are required.");
      return;
    }
    setIsSaving(true);
    const payload = {
      name: formName.trim(),
      email: formEmail.trim(),
      role: formRole,
      status: "Active",
    };
    try {
      if (editingUser) {
        const res = await fetch(
          `/api/users/${editingUser.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (res.ok) {
          const data = await res.json();
          setUsers(users.map((u) => (u.id === data.id ? data : u)));
          closeModal();
        } else {
          setFormError("Failed to update user.");
        }
      } else {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, password: "123" }),
        });
        if (res.ok) {
          const data = await res.json();
          setUsers([...users, data]);
          closeModal();
        } else {
          setFormError("Failed to add user.");
        }
      }
    } catch {
      setFormError("Server error. Check your connection.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/users/${id}`, { method: "DELETE" });
      setUsers(users.filter((u) => u.id !== id));
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const toggleRole = async (u: User) => {
    const newRole = u.role === "admin" ? "user" : "admin";
    try {
      const res = await fetch(`/api/users/${u.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers(users.map((x) => (x.id === u.id ? { ...x, role: newRole } : x)));
      }
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Users Management</h1>
          <p className={styles.subtitle}>
            View, add, edit, and manage all user accounts and roles.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <select
            className={styles.input}
            style={{ width: "120px" }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <input
            placeholder="Search users..."
            className={styles.input}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className={styles.addButton} onClick={openAddModal}>
            + Add User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        {[
          { label: "Total Users", value: users.length, icon: "👥", color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
          { label: "Admins", value: adminCount, icon: "🛡️", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
          { label: "Members", value: userCount, icon: "👤", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
        ].map((s) => (
          <div key={s.label} className={styles.tableBox} style={{ padding: "18px", display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: s.color, flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <p style={{ color: "#64748b", fontSize: "11px", margin: 0, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</p>
              <h2 style={{ fontSize: "24px", fontWeight: 800, margin: 0, color: "#0f172a" }}>{s.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className={styles.tableBox}>
        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#94a3b8" }}>Loading users...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>User</th>
                <th className={styles.th}>Email</th>
                <th className={styles.th}>Role</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "50px", color: "#94a3b8", fontSize: "14px" }}>
                    No users found.
                  </td>
                </tr>
              ) : (
                currentUsers.map((u) => (
                  <tr key={u.id} style={{ transition: "background 0.15s" }}>
                    <td className={styles.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width: "36px", height: "36px", borderRadius: "50%",
                          background: u.role === "admin" ? "linear-gradient(135deg,#8b5cf6,#6d28d9)" : "linear-gradient(135deg,#3b82f6,#1d4ed8)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "white", fontWeight: 700, fontSize: "13px", flexShrink: 0
                        }}>
                          {u.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "14px" }}>{u.name}</div>
                          <div style={{ fontSize: "11px", color: "#94a3b8" }}>#{u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.td} style={{ color: "#475569", fontSize: "13px" }}>{u.email}</td>
                    <td className={styles.td}>
                      <span className={`${styles.badge} ${u.role === "admin" ? styles.refunded : styles.active}`}>
                        {u.role === "admin" ? "🛡️ Admin" : "👤 User"}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className={`${styles.badge} ${styles.active}`}>Active</span>
                    </td>
                    <td className={styles.td}>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        <button
                          className={styles.button}
                          style={{ fontSize: "12px", padding: "4px 8px" }}
                          onClick={() => openEditModal(u)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className={styles.button}
                          style={{ fontSize: "12px", padding: "4px 8px" }}
                          onClick={() => toggleRole(u)}
                          title={`Switch to ${u.role === "admin" ? "user" : "admin"}`}
                        >
                          {u.role === "admin" ? "→ User" : "→ Admin"}
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => setDeleteConfirmId(u.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div style={{ padding: "14px 16px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>
            Showing {filteredUsers.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} users
          </p>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              className={styles.button}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              ← Previous
            </button>
            <span style={{ fontSize: "13px", fontWeight: 600, padding: "6px 12px", background: "#f1f5f9", borderRadius: "6px", color: "#374151" }}>
              {currentPage} / {totalPages || 1}
            </span>
            <button
              className={styles.button}
              disabled={currentPage >= totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>
                {editingUser ? "✏️ Edit User" : "👤 Add New User"}
              </h2>
              <button onClick={closeModal} style={{ background: "none", border: "1px solid #d1d5db", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", color: "#64748b" }}>✕</button>
            </div>

            {formError && (
              <div style={{ background: "#fef2f2", color: "#dc2626", padding: "10px 14px", borderRadius: "8px", marginBottom: "15px", fontSize: "13px", border: "1px solid #fee2e2" }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  className={styles.formInput}
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  className={styles.formInput}
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>Role</label>
                <select
                  className={styles.formInput}
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "24px", justifyContent: "flex-end" }}>
                <button type="button" className={styles.button} onClick={closeModal}>Cancel</button>
                <button type="submit" className={styles.addButton} disabled={isSaving} style={{ minWidth: "100px" }}>
                  {isSaving ? "Saving..." : editingUser ? "Update" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirmId && (
        <div className={styles.modalOverlay} onClick={() => setDeleteConfirmId(null)}>
          <div className={styles.modal} style={{ textAlign: "center", padding: "32px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🗑️</div>
            <h3 style={{ margin: "0 0 10px", fontSize: "18px", fontWeight: 700 }}>Delete User?</h3>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>
              This action cannot be undone. The user account will be permanently removed.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button className={styles.button} onClick={() => setDeleteConfirmId(null)}>Cancel</button>
              <button
                className={styles.deleteButton}
                style={{ padding: "8px 20px", fontSize: "14px" }}
                onClick={() => handleDelete(deleteConfirmId)}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
