"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  // Calculate total
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = () => {
    // Save checkout data in localStorage (or send to backend later)
    localStorage.setItem("checkoutCart", JSON.stringify(cart));
    localStorage.setItem("checkoutTotal", total);
    router.push("/checkout");
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(to right, #f8f9fa, #eaf1ff)",
        minHeight: "100vh",
      }}
    >
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: "20px", color: "#2874f0" }}
      >
        🛒 Your Cart
      </motion.h2>

      <Link href="/">
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "#555" }}
          whileTap={{ scale: 0.9 }}
          style={{
            marginBottom: "20px",
            padding: "10px 15px",
            background: "gray",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ← Back to Products
        </motion.button>
      </Link>

      {cart.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ fontSize: "18px", color: "#555" }}
        >
          Your cart is empty.
        </motion.p>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ul style={{ listStyle: "none", padding: 0 }}>
            {cart.map((item, index) => (
              <motion.li
                key={item.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                style={{
                  marginBottom: "15px",
                  background: "#fff",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* Product Image + Details */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      width={60}
                      height={60}
                      style={{
                        objectFit: "cover",
                        borderRadius: "5px",
                      }}
                    />
                  )}
                  <div>
                    <h3>{item.name}</h3>
                    <p>
                      ₹{item.price} × {item.qty} = ₹{item.price * item.qty}
                    </p>
                  </div>
                </div>

                {/* Remove Button */}
                <motion.button
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "#c0392b",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeFromCart(item.id)}
                  style={{
                    marginLeft: "10px",
                    padding: "6px 12px",
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  ❌ Remove
                </motion.button>
              </motion.li>
            ))}
          </ul>

          {/* Total */}
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ marginTop: "20px", color: "#388e3c" }}
          >
            Total: ₹{total}
          </motion.h3>

          {/* Checkout + Clear Cart */}
          <div style={{ marginTop: "15px", display: "flex", gap: "15px" }}>
            <motion.button
              whileHover={{
                scale: 1.1,
                backgroundColor: "#e67e22",
                boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
              }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCheckout}
              style={{
                padding: "12px 20px",
                background: "orange",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ✅ Checkout
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.1,
                backgroundColor: "#333",
              }}
              whileTap={{ scale: 0.9 }}
              onClick={clearCart}
              style={{
                padding: "12px 20px",
                background: "#444",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              🧹 Clear Cart
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
