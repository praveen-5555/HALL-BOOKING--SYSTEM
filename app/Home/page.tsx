"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import HallCard from "../Components/HallCard";
import { motion, AnimatePresence } from "framer-motion";

interface Hall {
  id: string;
  name: string;
  price: string | number;
  capacity: string | number;
  image?: string;
}

function HomeContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/halls");
        const data = await res.json();
        setHalls(data);
      } catch (error) {
        console.error("Failed to fetch halls:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHalls();
  }, []);

  const filteredHalls = halls.filter((hall) => 
    hall.name.toLowerCase().includes(query)
  );

  const styles = {
    container: {
      minHeight: "100vh",
      background: "#050505",
      paddingTop: "60px",
      paddingBottom: "100px",
      paddingLeft: "20px",
      paddingRight: "20px",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: "#ffffff",
    },
    wrapper: {
      maxWidth: "1200px",
      margin: "0 auto",
    },
    header: {
      textAlign: "center" as const,
      marginBottom: "60px",
      marginTop: "40px",
    },
    title: {
      fontSize: "56px",
      fontWeight: "900",
      letterSpacing: "-2px",
      marginBottom: "16px",
      background: "linear-gradient(to bottom, #ffffff, #52525b)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    subtitle: {
      color: "#94a3b8",
      fontSize: "18px",
      maxWidth: "600px",
      margin: "0 auto",
      fontWeight: "500",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
      gap: "32px",
    },
  };

  if (loading) {
    return (
      <div style={styles.container} className="flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.header}
        >
          
        </motion.div>

        <motion.div 
          layout
          style={styles.grid}
        >
          <AnimatePresence mode="popLayout">
            {filteredHalls.length > 0 ? (
              filteredHalls.map((hall) => (
                <motion.div
                  key={hall.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <HallCard 
                    id={hall.id} 
                    name={hall.name} 
                    price={hall.price?.toString() || "0"} 
                    capacity={typeof hall.capacity === 'number' ? `${hall.capacity} Guests` : hall.capacity} 
                    image={hall.image || "img/Hall.avif"}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white/5 rounded-[32px] border border-white/10">
                <p className="text-zinc-500 text-lg">No halls found matching your search.</p>
                <button 
                  onClick={() => window.location.href = '/Home'}
                  className="mt-6 text-primary-red font-semibold hover:underline"
                >
                  View all halls
                </button>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}