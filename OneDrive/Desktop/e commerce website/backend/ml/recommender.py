import pandas as pd
import os

class Recommender:
    def __init__(self):
        # Load datasets
        base_path = os.path.join(os.path.dirname(__file__), "../../data")
        self.products = pd.read_csv(os.path.join(base_path, "products.csv"))
        self.transactions = pd.read_csv(os.path.join(base_path, "transactions.csv"))

    def recommend(self, user_id, top_n=3):
        # Find products bought by the user
        user_history = self.transactions[self.transactions["user_id"] == user_id]["product_id"].tolist()

        if not user_history:
            # If no history, return top popular products
            popular = (
                self.transactions["product_id"]
                .value_counts()
                .head(top_n)
                .index.tolist()
            )
            return self.products[self.products["id"].isin(popular)].to_dict(orient="records")

        # Otherwise recommend similar products (simple: recommend top selling excluding already bought)
        popular = (
            self.transactions[self.transactions["product_id"].isin(user_history) == False]["product_id"]
            .value_counts()
            .head(top_n)
            .index.tolist()
        )

        return self.products[self.products["id"].isin(popular)].to_dict(orient="records")
