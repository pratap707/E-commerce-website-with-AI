"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // ✅ Save order to backend
  const handlePlaceOrder = async () => {
    if (!name || !address) {
      alert("Please enter your name and address!");
      return;
    }

    const newOrder = {
      name,
      address,
      paymentMethod,
      items: cart,
      total,
    };

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("✅ Order saved:", data);
        setOrderPlaced(true);
        clearCart(); // clear context cart
      } else {
        alert("⚠️ Error: " + data.error);
      }
    } catch (err) {
      console.error("⚠️ Order API error:", err);
      alert("⚠️ Server not available.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "40px auto",
        background: "linear-gradient(to right, #f8f9fa, #eaf1ff)",
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      }}
    >
      <AnimatePresence>
        {orderPlaced ? (
          // ✅ Success Screen
          <motion.div
            key="success"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            style={{ textAlign: "center" }}
          >
            <h2 style={{ color: "#2ecc71" }}>✅ Order Placed Successfully!</h2>
            <p style={{ marginTop: "10px" }}>Payment Method: {paymentMethod}</p>
            <p>Total Paid: <b>₹{total}</b></p>
          </motion.div>
        ) : (
          // ✅ Checkout Form
          <motion.div
            key="form"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 style={{ marginBottom: "20px", color: "#2874f0" }}>🧾 Checkout</h2>

            {/* Cart Summary */}
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <div
                style={{
                  background: "#fff",
                  padding: "15px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  marginBottom: "20px",
                }}
              >
                {cart.map((item) => (
                  <p key={item.id}>
                    {item.name} × {item.qty} = ₹{item.price * item.qty}
                  </p>
                ))}
                <h3 style={{ marginTop: "10px", color: "#388e3c" }}>
                  Total: ₹{total}
                </h3>
              </div>
            )}

            {/* Form */}
            <label>Name:</label>
            <motion.input
              whileFocus={{ scale: 1.02, borderColor: "#2874f0" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />

            <label>Address:</label>
            <motion.textarea
              whileFocus={{ scale: 1.02, borderColor: "#2874f0" }}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows="3"
              style={inputStyle}
            />

            <label>Payment Method:</label>
            <motion.select
              whileFocus={{ scale: 1.02, borderColor: "#2874f0" }}
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={inputStyle}
            >
              <option>Cash on Delivery</option>
              <option>UPI</option>
              <option>Credit / Debit Card</option>
              <option>Net Banking</option>
            </motion.select>

            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: "#005bb5",
                boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlaceOrder}
              disabled={loading || cart.length === 0}
              style={{
                marginTop: "15px",
                padding: "12px 20px",
                background: loading ? "#ccc" : "#2874f0",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "bold",
                width: "100%",
              }}
            >
              {loading ? "⏳ Placing Order..." : "🚀 Place Order"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  fontSize: "14px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  width: "100%",
};
