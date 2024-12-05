import os

import joblib
import numpy as np
import pandas as pd

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
print(base_dir)
# Load segment data (seg1, seg2, seg3, seg4)
seg1 = pd.read_csv(os.path.join(base_dir,'dataset','NLPPP', 'seg1_recipes.csv'), index_col=0)
seg2 = pd.read_csv(os.path.join(base_dir,'dataset','NLPPP', 'seg2_recipes.csv'), index_col=0)
seg3 = pd.read_csv(os.path.join(base_dir,'dataset','NLPPP', 'seg3_recipes.csv'), index_col=0)
seg4 = pd.read_csv(os.path.join(base_dir,'dataset','NLPPP', 'seg4_recipes.csv'), index_col=0)

# Load vectorizers and TF-IDF matrices using joblib
seg1_vectorizer = joblib.load(os.path.join(base_dir,'dataset','NLPPP', 'seg1_vectorizer.pkl'))
seg1_tfidf_matrix = joblib.load(os.path.join(base_dir,'dataset','NLPPP', 'seg1_tfidf_matrix.pkl'))

seg2_vectorizer = joblib.load(os.path.join(base_dir,'dataset','NLPPP', 'seg2_vectorizer.pkl'))
seg2_tfidf_matrix = joblib.load(os.path.join(base_dir,'dataset','NLPPP', 'seg2_tfidf_matrix.pkl'))

seg3_vectorizer = joblib.load(os.path.join(base_dir,'dataset','NLPPP', 'seg3_vectorizer.pkl'))
seg3_tfidf_matrix = joblib.load(os.path.join(base_dir,'dataset','NLPPP', 'seg3_tfidf_matrix.pkl'))

seg4_vectorizer = joblib.load(os.path.join(base_dir,'dataset','NLPPP', 'seg4_vectorizer.pkl'))
seg4_tfidf_matrix = joblib.load(os.path.join(base_dir,'dataset','NLPPP', 'seg4_tfidf_matrix.pkl'))

segment_mapping = {
    "seg1": {"data": seg1, "vectorizer": seg1_vectorizer, "tfidf": seg1_tfidf_matrix},
    "seg2": {"data": seg2, "vectorizer": seg2_vectorizer, "tfidf": seg2_tfidf_matrix},
    "seg3": {"data": seg3, "vectorizer": seg3_vectorizer, "tfidf": seg3_tfidf_matrix},
    "seg4": {"data": seg4, "vectorizer": seg4_vectorizer, "tfidf": seg4_tfidf_matrix},
}


def get_similar_top5(segment_data, vectorizer, tfidf_matrix, user_input):
    user_input_vector = vectorizer.transform([' '.join(user_input)])

    cosine_similarities = np.dot(user_input_vector, tfidf_matrix.T).toarray()[0]
    top_indices = cosine_similarities.argsort()[-5:][::-1]

    recommended_recipes = segment_data.iloc[top_indices]
    print(recommended_recipes.columns)

    available_columns = recommended_recipes.columns
    selected_columns = [col for col in ["name", 'ingredients',"steps","minutes","calories","sugar","sodium","protein","saturated","carbohydrates"] if col in available_columns]

    return recommended_recipes[selected_columns]

def recommend(segment,user_input):
    segment_data = segment_mapping[segment]

    data = segment_data["data"]
    vectorizer = segment_data["vectorizer"]
    tfidf_matrix = segment_data["tfidf"]

    recommendations = get_similar_top5(data, vectorizer, tfidf_matrix, user_input)
    # recommendations_json = recommendations.to_dict(orient='records')

    return recommendations
