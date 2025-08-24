"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Page() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [recommendations, setRecommendations] = useState({});
  const chatEndRef = useRef(null);

  // Scroll chat to bottom
  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Load products and cart
  useEffect(() => {
    fetch("http://127.0.0.1:5000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => console.log("⚠️ Backend not reachable"));

    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Fetch recommendations for each product
  useEffect(() => {
    products.forEach(async (p) => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/recommend/${p.id}`);
        const recs = await res.json();
        setRecommendations((prev) => ({ ...prev, [p.id]: recs }));
      } catch (err) {
        console.error("Recommendation fetch error:", err);
      }
    });
  }, [products]);

  const addToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const sendChat = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { sender: "user", text: chatInput };
    setChatHistory((prev) => [...prev, userMessage]);
    setChatInput("");

    try {
      const res = await fetch("http://127.0.0.1:5000/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatInput }),
      });
      const data = await res.json();
      setChatHistory((prev) => [...prev, { sender: "ai", text: data.reply }]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setChatHistory((prev) => [...prev, { sender: "ai", text: "⚠️ Chatbot unavailable." }]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-blue-50 font-sans relative">
      {/* Header */}
      <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
        <Link href="/">
          <motion.h2 className="text-2xl font-bold cursor-pointer" whileHover={{ scale: 1.05 }}>
            🛒 MyShop
          </motion.h2>
        </Link>
        <Link href="/cart">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-yellow-500 px-4 py-2 rounded-full font-bold shadow-md hover:bg-yellow-400 transition"
          >
            Cart ({cart.length})
          </motion.button>
        </Link>
      </header>

      {/* Products Grid */}
      <main className="flex-1 p-8">
        <h3 className="text-3xl font-semibold mb-6 text-gray-700">✨ Featured Products</h3>
        {products.length === 0 ? (
          <p className="text-center text-gray-500">⏳ Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center text-center transition-transform duration-300"
              >
                <Link href={`/products/${p.id}`}>
                  <motion.img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-40 object-cover rounded-lg cursor-pointer"
                  />
                </Link>
                <h4 className="mt-3 text-lg font-semibold">{p.name}</h4>
                <p className="text-gray-500">{p.category}</p>
                <p className="text-green-600 font-bold text-lg">₹{p.price}</p>
                <p className="text-yellow-500">⭐ {p.rating}</p>
                <motion.button
                  onClick={() => addToCart(p)}
                  whileHover={{ scale: 1.05 }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full font-bold"
                >
                  Add to Cart
                </motion.button>

                {/* Recommendations */}
                {recommendations[p.id] && recommendations[p.id].length > 0 && (
                  <div className="mt-4 w-full">
                    <h5 className="font-semibold text-gray-700 mb-2">You may also like:</h5>
                    <div className="flex gap-2 overflow-x-auto">
                      {recommendations[p.id].map((r) => (
                        <div
                          key={r.id}
                          className="min-w-[120px] bg-gray-100 rounded-lg p-2 text-center flex-shrink-0"
                        >
                          <Link href={`/products/${r.id}`}>
                            <img src={r.image} alt={r.name} className="w-full h-20 object-cover rounded-md mb-1 cursor-pointer" />
                          </Link>
                          <p className="text-sm font-semibold">{r.name}</p>
                          <p className="text-green-600 text-sm">₹{r.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-4 mt-6">
        <p>© 2025 MyShop | Built with Next.js, Flask & AI</p>
      </footer>

      {/* Floating Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        {chatOpen ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-80 h-96 bg-white border rounded-xl shadow-lg flex flex-col overflow-hidden"
          >
            <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
              <span>🤖 AI Assistant</span>
              <button onClick={() => setChatOpen(false)}>✖</button>
            </div>
            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2 rounded ${
                    msg.sender === "user" ? "bg-blue-200 text-right" : "bg-green-200 text-left"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={chatEndRef}></div>
            </div>
            <div className="p-3 flex gap-2 border-t">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                className="flex-1 border rounded px-3 py-1"
                placeholder="Ask about products..."
              />
              <button onClick={sendChat} className="bg-blue-600 text-white px-3 rounded">
                Send
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            onClick={() => setChatOpen(true)}
            whileHover={{ scale: 1.1 }}
            className="bg-blue-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-2xl"
          >
            🤖
          </motion.button>
        )}
      </div>
    </div>
  );
}
