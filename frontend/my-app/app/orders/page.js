"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-8 font-sans">
      {/* Heading */}
      <motion.h2
        className="text-3xl font-bold text-gray-800 mb-6 flex items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        📦 Order History
      </motion.h2>

      {/* Back Button */}
      <Link href="/">
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "#4b5563" }}
          whileTap={{ scale: 0.95 }}
          className="mb-6 px-5 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg shadow-lg hover:shadow-2xl transition-all"
        >
          ← Back to Home
        </motion.button>
      </Link>

      {/* Orders */}
      {orders.length === 0 ? (
        <motion.p
          className="text-gray-600 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No past orders found.
        </motion.p>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                🛍 Order #{order.id}
              </h3>
              <p>
                <b>Name:</b> {order.name}
              </p>
              <p>
                <b>Address:</b> {order.address}
              </p>
              <p>
                <b>Date:</b> {order.date}
              </p>
              <p>
                <b>Total:</b> ₹{order.total}
              </p>
              <p>
                <b>Payment Method:</b> {order.paymentMethod}
              </p>

              <h4 className="mt-4 font-semibold text-gray-700">Items:</h4>
              <ul className="list-disc pl-5 text-gray-600">
                {order.items.map((item: any, index: number) => (
                  <motion.li
                    key={index}
                    whileHover={{ scale: 1.05, x: 5, color: "#4f46e5" }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="mt-1"
                  >
                    {item.name} – ₹{item.price}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
