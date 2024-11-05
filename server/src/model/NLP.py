import pickle
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import ast

# Function to get the top 5 similar recipes based on user input
def get_similar_top5(vectorizer, tfidf_matrix, user_input):
    # Combine user input ingredients into a single string
    user_input_combined = ' '.join(user_input)

    # Transform the combined user input using the fitted vectorizer
    user_input_tfidf = vectorizer.transform([user_input_combined])

    # Compute the cosine similarity between the user input and recipe corpus
    cosine_sim = cosine_similarity(user_input_tfidf, tfidf_matrix)

    # Get the indices of the top 5 similar recipes
    similar_top5 = list(cosine_sim.argsort()[0][-5:])

    return similar_top5

# Function to get full recipe details for top 5 similar recipes
def get_recipe_details_top5(dataframe, similar_top5):
    recommended_recipes = dataframe.iloc[similar_top5][['title', 'ingredients', 'directions', "NER"]]
    return recommended_recipes
