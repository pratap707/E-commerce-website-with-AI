"use client";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext"; // ⬅️ Import Cart Context (adjust path if needed)

export default function Recommendation() {
  const [recs, setRecs] = useState([]);
  const { addToCart } = useCart(); // ⬅️ Access cart function
  const userId = 1; // Example user (later dynamic with login)

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/recommendations/${userId}`)
      .then((res) => res.json())
      .then((data) => setRecs(data))
      .catch((err) => console.error("Error fetching recommendation:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🎯 Recommended for You</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {recs.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              width: "200px",
            }}
          >
            <img
              src={p.image}
              alt={p.name}
              style={{ width: "100%", height: "auto" }}
            />
            <h3>{p.name}</h3>
            <p>💰 ${p.price}</p>
            <button
              onClick={() => addToCart(p)} // works fine now
              style={{
                background: "green",
                color: "white",
                padding: "6px 12px",
                borderRadius: "5px",
              }}
            >
              🛒 Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
