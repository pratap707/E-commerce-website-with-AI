# backend/ml/gen_synthetic_data.py
import numpy as np
import pandas as pd
import os

def generate(n_users=500, n_items=100, interactions_per_user=20, out="data/interactions.csv"):
    rows = []
    for u in range(1, n_users+1):
        pos = np.random.choice(range(1, n_items+1), size=interactions_per_user, replace=False)
        for it in pos:
            rows.append((u, int(it), 1))
    df = pd.DataFrame(rows, columns=["user_id","item_id","interaction"])
    os.makedirs(os.path.dirname(out), exist_ok=True)
    df.to_csv(out, index=False)
    print("Saved", out)

if __name__ == "__main__":
    generate()
