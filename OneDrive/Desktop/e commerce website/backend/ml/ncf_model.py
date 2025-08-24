# backend/ml/ncf_model.py
import torch
import torch.nn as nn

class NCF(nn.Module):
    def __init__(self, n_users, n_items, emb_size=64, hidden_sizes=[128,64], dropout=0.2):
        super().__init__()
        self.user_emb = nn.Embedding(n_users+1, emb_size)
        self.item_emb = nn.Embedding(n_items+1, emb_size)
        layers = []
        in_dim = emb_size*2
        for h in hidden_sizes:
            layers += [nn.Linear(in_dim, h), nn.ReLU(), nn.Dropout(dropout)]
            in_dim = h
        layers.append(nn.Linear(in_dim,1))
        self.mlp = nn.Sequential(*layers)
    def forward(self, user_ids, item_ids):
        u = self.user_emb(user_ids)
        i = self.item_emb(item_ids)
        x = torch.cat([u, i], dim=1)
        return torch.sigmoid(self.mlp(x)).squeeze()
