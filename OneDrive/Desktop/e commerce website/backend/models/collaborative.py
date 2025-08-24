import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

def recommend_products(user_id, transactions, top_n=5):
    """
    Collaborative Filtering: Recommend products for a user based on purchase history.
    """

    # Create user-item matrix
    user_item_matrix = transactions.pivot_table(index="user_id", columns="product_id", values="rating").fillna(0)

    if user_id not in user_item_matrix.index:
        return []

    # Compute similarity between users
    user_similarity = cosine_similarity(user_item_matrix)
    user_similarity_df = pd.DataFrame(user_similarity, index=user_item_matrix.index, columns=user_item_matrix.index)

    # Find similar users
    similar_users = user_similarity_df[user_id].sort_values(ascending=False).index[1:]

    # Get products the target user has already interacted with
    user_products = set(user_item_matrix.loc[user_id][user_item_matrix.loc[user_id] > 0].index)

    # Recommend products from similar users
    recommendations = []
    for sim_user in similar_users:
        sim_user_products = set(user_item_matrix.loc[sim_user][user_item_matrix.loc[sim_user] > 0].index)
        new_products = sim_user_products - user_products
        recommendations.extend(list(new_products))
        if len(recommendations) >= top_n:
            break

    return recommendations[:top_n]
