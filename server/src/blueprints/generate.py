import json
import os
import random
import google.generativeai as genai
import joblib as joblib
import pandas as pd
from flask import Blueprint, jsonify, request
from model.NLP import get_recipe_details_top5, get_similar_top5
from utils.generateQuery import generateQuery

generate_bp = Blueprint("generate", __name__)

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
loaded_vectorizer = joblib.load(open(os.path.join(base_dir, 'dataset', 'nlp_vectorizer.pkl'), 'rb'))
loaded_tfidf_matrix = joblib.load(open(os.path.join(base_dir, 'dataset', 'nlp_tfidf_matrix.pkl'), 'rb'))
filtered_recipes = pd.read_csv(os.path.join(base_dir, 'dataset', 'recipes_data_all.csv'), usecols=['title', 'ingredients', 'directions', 'NER'])

@generate_bp.route("/generate/recipe", methods=["POST"])
def generate():
    data = request.get_json()

    main_ingredients = data.get("main_ingredients")
    seasonings = data.get("seasonings")
    ingredients = main_ingredients + seasonings

    servings = data.get("servings")
    serve_hot_or_cold = data.get("serve_hot_or_cold")
    cuisine_type = data.get("cuisine_type")
    user_preference = data.get("user_preference")
    difficulty = data.get("difficulty")

    similar_top5_indices = get_similar_top5(loaded_vectorizer, loaded_tfidf_matrix, ingredients)
    recommended_recipes = get_recipe_details_top5(filtered_recipes, similar_top5_indices)

    top_recipe = recommended_recipes.iloc[random.choice(range(5))]
    top_recipe_str = f"Title: {top_recipe['title']}, Ingredients: {top_recipe['ingredients']}, Directions: {top_recipe['directions']}, NER: {top_recipe['NER']}"
    user_preference_str = ', '.join(user_preference)


    try:
        response = generateQuery(main_ingredients,seasonings,servings,serve_hot_or_cold,cuisine_type,difficulty,top_recipe_str,user_preference_str)
        json_response = response.text.replace("```json", "").replace("```", "").strip()
        print(json_response)
        json_data = json.loads(json_response)
        return jsonify(json_data)
    except json.JSONDecodeError:
        return jsonify({"error": "Failed to parse JSON from AI response.", "response": response.generated_text}), 500

