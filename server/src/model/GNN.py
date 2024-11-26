import os
import pickle

import torch
import torch.nn.functional as F

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

with open(os.path.join(base_dir,'dataset','ingredient_graph.pkl'),'rb') as f:
    G = pickle.load(f)

embeddings = torch.load(os.path.join(base_dir,'dataset','ingredient_embeddings.pt'))

# Function to get similar ingredients
def get_similar_ingredients(ingredient, k=5):
    try:
        idx = list(G.nodes).index(ingredient)
    except ValueError:
        return {"error": f"{ingredient} not found in graph."}

    ingredient_embedding = embeddings[idx]
    similarities = F.cosine_similarity(ingredient_embedding, embeddings)
    # Get the top-k similar ingredients (excluding itself)
    top_k = similarities.argsort(descending=True)[1:k+1]
    return [list(G.nodes)[i] for i in top_k]
