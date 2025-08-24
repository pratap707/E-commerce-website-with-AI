from flask import Blueprint, jsonify
from ml_models.recommender import Recommender

recommend_bp = Blueprint("recommendations", __name__)
recommender = Recommender()

@recommend_bp.route("/api/recommendations/<int:user_id>", methods=["GET"])
def get_recommendations(user_id):
    try:
        recs = recommender.recommend(user_id)
        return jsonify(recs)
    except Exception as e:
        return jsonify({"error": str(e)})
