"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface HallCardProps {
  id?: string;
  name: string;
  price: string;
  capacity: string;
  image: string;
}

export default function HallCard({ id = "1", name, price, capacity, image }: HallCardProps) {
  const imageSrc = image
    ? image.startsWith("http") || image.startsWith("/")
      ? image
      : `/${image}`
    : null;

  const displayPrice = price && price.toLowerCase().includes("day") 
    ? price 
    : `₹${price} / day`;

  const styles = {
    card: {
      position: "relative" as const,
      background: "var(--card-bg)",
      borderRadius: "24px",
      overflow: "hidden",
      border: "1px solid var(--card-border)",
      backdropFilter: "blur(12px)",
      cursor: "pointer",
      height: "100%",
      display: "flex",
      flexDirection: "column" as const,
    },

    imageBox: {
      width: "100%",
      height: "240px",
      position: "relative" as const,
      overflow: "hidden",
    },

    content: {
      padding: "24px",
      flex: 1,
      display: "flex",
      flexDirection: "column" as const,
    },

    title: {
      fontSize: "22px",
      fontWeight: "700",
      color: "#ffffff",
      marginBottom: "8px",
      letterSpacing: "-0.4px",
    },

    text: {
      color: "var(--text-muted)",
      fontSize: "15px",
      marginBottom: "24px",
    },

    bottom: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "auto",
    },

    price: {
      fontSize: "18px",
      fontWeight: "700",
      color: "var(--primary-red)",
    },

    button: {
      padding: "10px 22px",
      borderRadius: "12px",
      border: "none",
      background: "var(--primary-red)",
      color: "white",
      fontWeight: "700",
      fontSize: "14px",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    },
  };

  return (
    <motion.div 
      style={styles.card}
      whileHover={{ 
        y: -12,
        borderColor: "rgba(239, 68, 68, 0.3)",
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 20px rgba(239, 68, 68, 0.1)"
      }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div style={styles.imageBox}>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}
            className="hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}
      </div>

      <div style={styles.content}>
        <h3 style={styles.title}>{name}</h3>
        <p style={styles.text}>{capacity}</p>

        <div style={styles.bottom}>
          <p style={styles.price}>{displayPrice}</p>
          <Link href={`/Book?hallId=${id}`}>
            <button style={styles.button} className="hover:brightness-110 active:scale-95">
              Book Now
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}


