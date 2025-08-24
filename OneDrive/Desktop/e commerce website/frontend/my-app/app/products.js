"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/products") // Flask backend
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(to right, #f8f9fa, #eaf1ff)",
        minHeight: "100vh",
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: "20px", color: "#2874f0" }}
      >
        🛒 Products
      </motion.h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {products.map((p, index) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "15px",
              width: "220px",
              background: "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              textAlign: "center",
              transition: "0.3s",
            }}
          >
            <motion.img
              src={p.image}
              alt={p.name}
              style={{
                width: "100%",
                height: "160px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
            <h3 style={{ margin: "10px 0" }}>{p.name}</h3>
            <p style={{ fontWeight: "bold", color: "#388e3c" }}>💰 ${p.price}</p>

            <motion.button
              whileHover={{
                scale: 1.1,
                backgroundColor: "#0056d6",
                boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
              }}
              whileTap={{ scale: 0.9 }}
              style={{
                marginTop: "10px",
                padding: "10px 18px",
                background: "#2874f0",
                color: "#fff",
                border: "none",
                borderRadius: "25px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "all 0.3s ease",
              }}
            >
              Add to Cart
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
