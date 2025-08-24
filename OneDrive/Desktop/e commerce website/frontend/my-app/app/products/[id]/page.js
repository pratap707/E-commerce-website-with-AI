"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);

  // Fetch product details
  useEffect(() => {
    if (id) {
      fetch(`http://127.0.0.1:5000/products/${id}`)
        .then((res) => res.json())
        .then((data) => setProduct(data))
        .catch((err) => console.error("Error fetching product:", err));
    }
  }, [id]);

  if (!product) return <p style={{ padding: "20px" }}>⏳ Loading...</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Product details */}
      <h1>{product.name}</h1>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Price:</strong> ₹{product.price}</p>
      <p><strong>Stock:</strong> {product.stock}</p>
      <p><strong>Rating:</strong> ⭐ {product.rating}</p>
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          width="250"
          style={{ borderRadius: "8px", margin: "10px 0" }}
        />
      )}

      {/* Add to Cart button */}
      <button
        style={{
          marginTop: "15px",
          padding: "12px 20px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
        onClick={() => {
          addToCart(product);
          toast.success(`${product.name} added to cart`);
        }}
      >
        🛒 Add to Cart
      </button>
    </div>
  );
}
