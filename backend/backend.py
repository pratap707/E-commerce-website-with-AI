from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from groq import Groq

# ================== Flask App ==================
app = Flask(__name__)
CORS(app)

# ================== Load Products ==================
try:
    products = pd.read_csv("../data/products.csv")
except Exception as e:
    print("⚠️ Error loading products.csv:", e)
    products = pd.DataFrame(columns=["id", "name", "category", "description", "price", "stock", "rating", "image"])

# Ensure required columns
for col in ["id", "name", "category", "description", "price", "stock", "rating", "image"]:
    if col not in products.columns:
        products[col] = ""
    else:
        products[col] = products[col].fillna("").astype(str).str.strip()

# Convert IDs safely
if not products.empty:
    products["id"] = pd.to_numeric(products["id"], errors="coerce")
    products = products.dropna(subset=["id"])
    products["id"] = products["id"].astype(int)

# ================== AI Recommendation ==================
if not products.empty:
    products["combined"] = products["name"] + " " + products["category"] + " " + products["description"]
    tfidf = TfidfVectorizer(stop_words="english")
    tfidf_matrix = tfidf.fit_transform(products["combined"])
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
else:
    cosine_sim = []

def get_recommendations(product_id, top_n=4):
    if products.empty or product_id not in products["id"].values:
        return []
    idx = products[products["id"] == product_id].index[0]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:top_n+1]
    rec_idx = [i[0] for i in sim_scores]
    return products.iloc[rec_idx][
        ["id", "name", "category", "price", "stock", "rating", "image"]
    ].to_dict(orient="records")

# ================== Orders ==================
orders = []  # In-memory store (can switch to DB or CSV later)

@app.route("/orders", methods=["GET", "POST"])
def handle_orders():
    if request.method == "POST":
        data = request.json
        if not data.get("name") or not data.get("address") or not data.get("items"):
            return jsonify({"error": "Invalid order data"}), 400

        order = {
            "id": len(orders) + 1,
            "name": data["name"],
            "address": data["address"],
            "paymentMethod": data.get("paymentMethod", "Cash on Delivery"),
            "items": data["items"],
            "total": data["total"],
            "date": pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S"),
        }
        orders.append(order)
        return jsonify({"message": "Order placed successfully 🚀", "order": order}), 201

    return jsonify(orders)

# ================== Groq Client ==================
client = os.getenv("GROQ_API_KEY")
# ================== Routes ==================
@app.route("/")
def home():
    return jsonify({"message": "E-commerce AI Backend Running 🚀"})

@app.route("/products")
def get_products():
    return jsonify(products[["id", "name", "category", "price", "stock", "rating", "image"]].to_dict(orient="records"))

@app.route("/products/<int:product_id>")
def get_product(product_id):
    product = products[products["id"] == product_id]
    if product.empty:
        return jsonify({"error": "Product not found"}), 404
    return jsonify(product.iloc[0][["id","name","category","description","price","stock","rating","image"]].to_dict())

@app.route("/recommend/<int:product_id>")
def recommend(product_id):
    recs = get_recommendations(product_id)
    return jsonify(recs)

@app.route("/chatbot", methods=["POST"])
def chatbot():
    try:
        data = request.json
        user_msg = data.get("message", "")

        if not user_msg:
            return jsonify({"reply": "Please ask something."})

        # Build small product context
        context = ""
        for p in products.head(10).to_dict(orient="records"):
            context += f"{p['name']} ({p['category']}): {p['description']}. Price: ₹{p['price']}\n"

        # Send request to Groq
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": "You are an AI assistant for an e-commerce website. Help users with products, shopping, and support."},
                {"role": "user", "content": f"Catalog:\n{context}\nUser: {user_msg}"}
            ],
        )

        reply = response.choices[0].message.content.strip()
        return jsonify({"reply": reply})

    except Exception as e:
        print("⚠️ Groq error:", e)
        return jsonify({"reply": "⚠️ Chatbot not available."})

# ================== Run ==================
if __name__ == "__main__":
    app.run(debug=True, port=5000)
