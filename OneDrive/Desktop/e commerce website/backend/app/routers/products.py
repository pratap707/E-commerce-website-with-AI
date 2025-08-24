from flask import Blueprint, jsonify
import pandas as pd
import os

products_bp = Blueprint("products", __name__)

@products_bp.route("/api/products", methods=["GET"])
def get_products():
    try:
        # Load dataset (products.csv should be inside ../data/)
        csv_path = os.path.join(os.path.dirname(__file__), "../../data/products.csv")
        df = pd.read_csv(csv_path)

        # Convert to list of dicts
        products = df.to_dict(orient="records")
        return jsonify(products)
    except Exception as e:
        return jsonify({"error": str(e)})
