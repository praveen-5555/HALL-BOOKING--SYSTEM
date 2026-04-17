"use client";
import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import hallStyles from "./halls.module.css";

interface Hall {
  id: string;
  name: string;
  capacity: number | string;
  pricePerHour?: number;
  price?: string | number;
  status?: string;
  image?: string;
  description?: string;
  location?: string;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80";

export default function AdminHalls() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [halls, setHalls] = useState<Hall[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHall, setEditingHall] = useState<Hall | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form fields
  const [formName, setFormName] = useState("");
  const [formCapacity, setFormCapacity] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formStatus, setFormStatus] = useState("Active");
  const [formImage, setFormImage] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formLocation, setFormLocation] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchHalls = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/halls");
      const data = await res.json();
      setHalls(data);
    } catch (error) {
      console.error("Failed to fetch halls:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchHalls(), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setCurrentPage(1), 0);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, viewMode]);

  const filteredHalls = halls.filter((hall) => {
    const matchSearch =
      hall.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hall.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      (hall.location || "").toLowerCase().includes(searchQuery.toLowerCase());

    const hallStatus = (hall.status || "active").toLowerCase();
    const matchStatus =
      statusFilter === "all" || hallStatus === statusFilter.toLowerCase();

    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredHalls.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentHalls = filteredHalls.slice(startIndex, startIndex + itemsPerPage);

  const totalCapacity = halls.reduce(
    (sum, h) => sum + (Number(h.capacity) || 0),
    0
  );
  const activeCount = halls.filter(
    (h) => (h.status || "active").toLowerCase() === "active"
  ).length;
  const maintenanceCount = halls.filter(
    (h) => (h.status || "").toLowerCase() === "maintenance"
  ).length;

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/halls/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setHalls(halls.filter((h) => h.id !== id));
        setDeleteConfirmId(null);
      }
    } catch (error) {
      console.error("Failed to delete hall:", error);
    }
  };

  const openAddModal = () => {
    setEditingHall(null);
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (hall: Hall) => {
    setEditingHall(hall);
    setFormName(hall.name);
    setFormCapacity(hall.capacity.toString());
    setFormPrice(
      (hall.pricePerHour || hall.price || "")
        .toString()
        .replace(/[^0-9.]/g, "")
    );
    setFormStatus(hall.status || "Active");
    setFormImage(hall.image || "");
    setFormDescription(hall.description || "");
    setFormLocation(hall.location || "");
    setModalError("");
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormName("");
    setFormCapacity("");
    setFormPrice("");
    setFormStatus("Active");
    setFormImage("");
    setFormDescription("");
    setFormLocation("");
    setModalError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingHall(null);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");

    if (!formName.trim() || !formCapacity || !formPrice) {
      setModalError("Please fill in all required fields.");
      return;
    }
    if (Number(formCapacity) <= 0 || Number(formPrice) <= 0) {
      setModalError("Capacity and price must be positive numbers.");
      return;
    }

    setIsSaving(true);
    const hallData = {
      name: formName.trim(),
      capacity: parseInt(formCapacity),
      price: parseInt(formPrice),
      pricePerHour: parseInt(formPrice),
      status: formStatus,
      image: formImage.trim() || DEFAULT_IMAGE,
      description: formDescription.trim(),
      location: formLocation.trim(),
    };

    try {
      if (editingHall) {
        const res = await fetch(
          `/api/halls/${editingHall.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(hallData),
          }
        );
        if (res.ok) {
          const data = await res.json();
          setHalls(halls.map((h) => (h.id === data.id ? data : h)));
          closeModal();
        } else {
          setModalError("Failed to update hall. Please try again.");
        }
      } else {
        const res = await fetch("/api/halls", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(hallData),
        });
        if (res.ok) {
          const data = await res.json();
          setHalls([...halls, data]);
          closeModal();
        } else {
          setModalError("Failed to add hall. Please try again.");
        }
      }
    } catch (error) {
      setModalError("Server error. Please check your connection.");
      console.error("Failed to save hall:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusClass = (status?: string) => {
    const s = (status || "active").toLowerCase();
    if (s === "active") return styles.active;
    if (s === "maintenance") return styles.pending;
    return styles.banned;
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Halls Management</h1>
          <p className={styles.subtitle}>
            Add, edit, and monitor all available event halls in the system.
          </p>
        </div>

        <div className={hallStyles.headerActions}>
          {/* View Toggle */}
          <div className={hallStyles.viewToggle}>
            <button
              className={`${hallStyles.toggleBtn} ${viewMode === "table" ? hallStyles.toggleActive : ""}`}
              onClick={() => setViewMode("table")}
              title="Table view"
            >
              ☰
            </button>
            <button
              className={`${hallStyles.toggleBtn} ${viewMode === "grid" ? hallStyles.toggleActive : ""}`}
              onClick={() => setViewMode("grid")}
              title="Grid view"
            >
              ⊞
            </button>
          </div>

          {/* Status filter */}
          <select
            className={styles.input}
            style={{ width: "130px" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Search */}
          <input
            placeholder="Search halls..."
            className={styles.input}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <button className={styles.addButton} onClick={openAddModal}>
            + Add New Hall
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={hallStyles.statsGrid}>
        <div className={hallStyles.statCard}>
          <div className={hallStyles.statIcon} style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}>🏛️</div>
          <div>
            <p className={hallStyles.statLabel}>Total Halls</p>
            <h2 className={hallStyles.statValue}>{halls.length}</h2>
          </div>
        </div>
        <div className={hallStyles.statCard}>
          <div className={hallStyles.statIcon} style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>✅</div>
          <div>
            <p className={hallStyles.statLabel}>Active Halls</p>
            <h2 className={hallStyles.statValue}>{activeCount}</h2>
          </div>
        </div>
        <div className={hallStyles.statCard}>
          <div className={hallStyles.statIcon} style={{ background: "rgba(234,179,8,0.12)", color: "#eab308" }}>🔧</div>
          <div>
            <p className={hallStyles.statLabel}>Maintenance</p>
            <h2 className={hallStyles.statValue}>{maintenanceCount}</h2>
          </div>
        </div>
        <div className={hallStyles.statCard}>
          <div className={hallStyles.statIcon} style={{ background: "rgba(168,85,247,0.12)", color: "#a855f7" }}>👥</div>
          <div>
            <p className={hallStyles.statLabel}>Total Capacity</p>
            <h2 className={hallStyles.statValue}>{totalCapacity.toLocaleString()}</h2>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className={hallStyles.loadingBox}>
          <div className={hallStyles.spinner} />
          <p>Loading halls...</p>
        </div>
      )}

      {/* TABLE VIEW */}
      {!loading && viewMode === "table" && (
        <div className={styles.tableBox}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Hall</th>
                <th className={styles.th}>Location</th>
                <th className={styles.th}>Capacity</th>
                <th className={styles.th}>Price/hr</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentHalls.length === 0 ? (
                <tr>
                  <td colSpan={6} className={hallStyles.emptyRow}>
                    No halls found.
                  </td>
                </tr>
              ) : (
                currentHalls.map((hall) => (
                  <tr key={hall.id} className={hallStyles.tableRow}>
                    <td className={styles.td}>
                      <div className={hallStyles.hallCell}>
                        <img
                          src={hall.image || DEFAULT_IMAGE}
                          alt={hall.name}
                          className={hallStyles.hallThumb}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "14px" }}>{hall.name}</div>
                          <div style={{ fontSize: "11px", color: "#94a3b8" }}>#{hall.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.td} style={{ color: "#64748b", fontSize: "13px" }}>
                      {hall.location || "—"}
                    </td>
                    <td className={styles.td}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ color: "#94a3b8" }}>👥</span>
                        {hall.capacity}
                      </span>
                    </td>
                    <td className={styles.td} style={{ fontWeight: 600 }}>
                      ₹{hall.pricePerHour || hall.price}
                    </td>
                    <td className={styles.td}>
                      <span className={`${styles.badge} ${getStatusClass(hall.status)}`}>
                        {hall.status || "Active"}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => openEditModal(hall)}
                          className={styles.button}
                          style={{ fontSize: "12px", padding: "5px 10px" }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(hall.id)}
                          className={styles.deleteButton}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className={hallStyles.pagination}>
            <p className={hallStyles.paginationInfo}>
              Showing{" "}
              {filteredHalls.length > 0 ? startIndex + 1 : 0}–
              {Math.min(startIndex + itemsPerPage, filteredHalls.length)} of{" "}
              {filteredHalls.length} halls
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className={styles.button}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                ← Previous
              </button>
              <span className={hallStyles.pageIndicator}>
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
      )}

      {/* GRID VIEW */}
      {!loading && viewMode === "grid" && (
        <>
          {currentHalls.length === 0 ? (
            <div className={hallStyles.emptyState}>
              <span style={{ fontSize: "48px" }}>🏛️</span>
              <p>No halls found.</p>
            </div>
          ) : (
            <div className={hallStyles.gridView}>
              {currentHalls.map((hall) => (
                <div key={hall.id} className={hallStyles.hallCard}>
                  <div className={hallStyles.cardImageWrap}>
                    <img
                      src={hall.image || DEFAULT_IMAGE}
                      alt={hall.name}
                      className={hallStyles.cardImage}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                      }}
                    />
                    <span className={`${styles.badge} ${getStatusClass(hall.status)} ${hallStyles.cardBadge}`}>
                      {hall.status || "Active"}
                    </span>
                  </div>
                  <div className={hallStyles.cardBody}>
                    <h3 className={hallStyles.cardName}>{hall.name}</h3>
                    {hall.location && (
                      <p className={hallStyles.cardLocation}>📍 {hall.location}</p>
                    )}
                    {hall.description && (
                      <p className={hallStyles.cardDesc}>{hall.description}</p>
                    )}
                    <div className={hallStyles.cardMeta}>
                      <span>👥 {hall.capacity} guests</span>
                      <span>💰 ₹{hall.pricePerHour || hall.price}/hr</span>
                    </div>
                    <div className={hallStyles.cardActions}>
                      <button
                        onClick={() => openEditModal(hall)}
                        className={styles.button}
                        style={{ flex: 1, fontSize: "13px" }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(hall.id)}
                        className={styles.deleteButton}
                        style={{ flex: 1, fontSize: "13px" }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Grid Pagination */}
          <div className={hallStyles.pagination} style={{ marginTop: "20px" }}>
            <p className={hallStyles.paginationInfo}>
              Showing {filteredHalls.length > 0 ? startIndex + 1 : 0}–
              {Math.min(startIndex + itemsPerPage, filteredHalls.length)} of{" "}
              {filteredHalls.length} halls
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className={styles.button}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                ← Previous
              </button>
              <span className={hallStyles.pageIndicator}>
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
        </>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={`${styles.modal} ${hallStyles.wideModal}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={hallStyles.modalHeader}>
              <h2 className={hallStyles.modalTitle}>
                {editingHall ? "✏️ Edit Hall" : "🏛️ Add New Hall"}
              </h2>
              <button className={hallStyles.closeBtn} onClick={closeModal}>✕</button>
            </div>

            {modalError && (
              <div className={hallStyles.errorBanner}>{modalError}</div>
            )}

            <form onSubmit={handleSubmit} className={hallStyles.modalForm}>
              <div className={hallStyles.formGrid}>
                {/* Left */}
                <div className={hallStyles.formCol}>
                  <div className={styles.formGroup}>
                    <label className={hallStyles.label}>
                      Hall Name <span className={hallStyles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Grand Ballroom"
                      className={styles.formInput}
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={hallStyles.label}>
                      Capacity (guests) <span className={hallStyles.required}>*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="e.g. 300"
                      className={styles.formInput}
                      value={formCapacity}
                      onChange={(e) => setFormCapacity(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={hallStyles.label}>
                      Price per Hour (₹) <span className={hallStyles.required}>*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="e.g. 5000"
                      className={styles.formInput}
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={hallStyles.label}>Status</label>
                    <select
                      className={styles.formInput}
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                    >
                      <option value="Active">Active</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Right */}
                <div className={hallStyles.formCol}>
                  <div className={styles.formGroup}>
                    <label className={hallStyles.label}>Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Floor 2, Wing A"
                      className={styles.formInput}
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={hallStyles.label}>Description</label>
                    <textarea
                      rows={3}
                      placeholder="Brief description of the hall..."
                      className={`${styles.formInput} ${hallStyles.textarea}`}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={hallStyles.label}>Image URL</label>
                    <input
                      type="text"
                      placeholder="https://... or leave blank for default"
                      className={styles.formInput}
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                    />
                  </div>

                  {/* Image Preview */}
                  {(formImage || editingHall?.image) && (
                    <div className={hallStyles.imagePreviewWrap}>
                      <img
                        src={formImage || editingHall?.image || DEFAULT_IMAGE}
                        alt="Preview"
                        className={hallStyles.imagePreview}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className={hallStyles.modalFooter}>
                <button
                  type="button"
                  className={styles.button}
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.addButton}
                  disabled={isSaving}
                  style={{ minWidth: "120px" }}
                >
                  {isSaving ? "Saving..." : editingHall ? "Update Hall" : "Add Hall"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirmId && (
        <div className={styles.modalOverlay} onClick={() => setDeleteConfirmId(null)}>
          <div className={`${styles.modal} ${hallStyles.confirmModal}`} onClick={(e) => e.stopPropagation()}>
            <div className={hallStyles.confirmIcon}>🗑️</div>
            <h3 className={hallStyles.confirmTitle}>Delete Hall?</h3>
            <p className={hallStyles.confirmText}>
              This action cannot be undone. All data for this hall will be permanently removed.
            </p>
            <div className={hallStyles.confirmActions}>
              <button
                className={styles.button}
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>
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