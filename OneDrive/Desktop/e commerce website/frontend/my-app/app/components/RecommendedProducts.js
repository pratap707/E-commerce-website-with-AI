"use client";

import { useCart } from "../context/CartContext";

export default function RecommendedProducts({ products }) {
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    // Update context
    addToCart(product);

    // Update localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.qty += 1;   // 👈 use qty
    } else {
      cart.push({ ...product, qty: 1 });  // 👈 use qty
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Sync with checkout
    localStorage.setItem("checkoutCart", JSON.stringify(cart));
    const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0); // 👈 use qty
    localStorage.setItem("checkoutTotal", total);

    // Optional: notify other tabs/components
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (!products || products.length === 0) {
    return <p>No recommendations available.</p>;
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>🔥 Recommended Products</h2>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
              width: "200px",
              textAlign: "center",
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              width={150}
              height={150}
              style={{ objectFit: "cover", marginBottom: "1rem" }}
            />
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
            <button
              style={{
                marginTop: "0.5rem",
                padding: "0.5rem 1rem",
                background: "#0070f3",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => handleAddToCart(product)}
            >
              🛒 Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
