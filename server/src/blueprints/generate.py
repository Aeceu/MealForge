import json
import os
import random

import google.generativeai as genai
from flask import Blueprint, jsonify, request
from model.NLP import recommend
from utils.generateQuery import generateQuery

generate_bp = Blueprint("generate", __name__)

model = genai.GenerativeModel("gemini-1.5-flash")

@generate_bp.route("/generate/recipe", methods=["POST"])
def generate():
    data = request.get_json()

    main_ingredients = data.get("main_ingredients", [])
    seasonings = data.get("seasonings", [])
    ingredients = main_ingredients + seasonings

    servings = data.get("servings")
    serve_hot_or_cold = data.get("serve_hot_or_cold")
    cuisine_type = data.get("cuisine_type")
    user_preference = data.get("user_preference", [])
    difficulty = data.get("difficulty")
    segment = random.choice(["seg1","seg2","seg3","seg4"])

    recommended_recipes = recommend(segment, ingredients)

    if not recommended_recipes:
        return jsonify({"error": "No matching recipes found for the provided ingredients."}), 404


    top_recipe = random.choice(recommended_recipes)

    print(top_recipe)

    top_recipe_str = ", ".join(
    f"{col.capitalize()}: {top_recipe.get(col, 'N/A')}"
    for col in ["name", "ingredients", "steps", "minutes", "calories", "sugar", "sodium", "protein", "saturated", "carbohydrates"]
    if col in top_recipe)
    user_preference_str = ', '.join(user_preference)

    try:
        response = generateQuery(main_ingredients,seasonings,servings,serve_hot_or_cold,cuisine_type,difficulty,top_recipe_str,user_preference_str)
        json_response = response.text.replace("```json", "").replace("```", "").strip()
        json_data = json.loads(json_response)
        return jsonify(json_data)
    except json.JSONDecodeError:
        return jsonify({"error": "Failed to parse JSON from AI response.", "response": response.generated_text}), 500
