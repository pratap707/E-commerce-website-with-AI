# backend/ml/train_ncf.py
import argparse, random, os
import pandas as pd
import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader
from ml.ncf_model import NCF
from sklearn.model_selection import train_test_split
from collections import defaultdict

class ImplicitDataset(Dataset):
    def __init__(self, interactions, n_items, neg_ratio=4):
        self.pos = interactions
        self.n_items = n_items
        self.neg_ratio = neg_ratio
        self.user_pos = defaultdict(set)
        for u,i in interactions:
            self.user_pos[u].add(i)

    def __len__(self):
        return len(self.pos)

    def __getitem__(self, idx):
        u,i = self.pos[idx]
        negs = []
        for _ in range(self.neg_ratio):
            j = random.randint(1, self.n_items)
            while j in self.user_pos[u]:
                j = random.randint(1, self.n_items)
            negs.append(j)
        return np.int64(u), np.int64(i), np.array(negs, dtype=np.int64)

def collate_fn(batch):
    users, items, negs = [], [], []
    for u,i,neg in batch:
        users.append(u); items.append(i); negs.append(neg)
    return (torch.tensor(users, dtype=torch.long),
            torch.tensor(items, dtype=torch.long),
            torch.tensor(np.stack(negs), dtype=torch.long))

def train(args):
    df = pd.read_csv(args.data)
    n_users = int(df['user_id'].max())
    n_items = int(df['item_id'].max())
    interactions = list(zip(df.user_id, df.item_id))
    train_inter, test_inter = train_test_split(interactions, test_size=0.1, random_state=42)

    model = NCF(n_users=n_users, n_items=n_items, emb_size=args.emb, hidden_sizes=[args.h1, args.h2])
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    opt = torch.optim.Adam(model.parameters(), lr=args.lr)
    loss_fn = torch.nn.BCELoss()

    ds = ImplicitDataset(train_inter, n_items, neg_ratio=4)
    loader = DataLoader(ds, batch_size=args.bs, shuffle=True, collate_fn=collate_fn)

    for epoch in range(args.epochs):
        model.train()
        total_loss = 0.0
        for users, items_pos, negs in loader:
            users = users.to(device); items_pos = items_pos.to(device)
            # positive
            pos_scores = model(users, items_pos)
            pos_target = torch.ones_like(pos_scores)
            # negative: flatten
            negs_flat = negs.view(-1).to(device)
            users_rep = users.unsqueeze(1).repeat(1, negs.size(1)).view(-1)
            neg_scores = model(users_rep, negs_flat)
            neg_target = torch.zeros_like(neg_scores)

            loss = loss_fn(pos_scores, pos_target) + loss_fn(neg_scores, neg_target)
            opt.zero_grad(); loss.backward(); opt.step()
            total_loss += loss.item()
        print(f"Epoch {epoch+1}/{args.epochs} loss={total_loss/len(loader):.4f}")

    # save model
    out_dir = os.path.join(os.path.dirname(__file__), "..", "models")
    os.makedirs(out_dir, exist_ok=True)
    torch.save(model.state_dict(), os.path.join(out_dir, "ncf.pth"))
    print("Saved model to", os.path.join(out_dir, "ncf.pth"))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default="../data/interactions.csv")
    parser.add_argument("--epochs", type=int, default=3)
    parser.add_argument("--bs", type=int, default=256)
    parser.add_argument("--emb", type=int, default=64)
    parser.add_argument("--h1", type=int, default=128)
    parser.add_argument("--h2", type=int, default=64)
    parser.add_argument("--lr", type=float, default=1e-3)
    args = parser.parse_args()
    train(args)
