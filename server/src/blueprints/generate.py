import json
import os
import random

import google.generativeai as genai
from flask import Blueprint, jsonify, request
from model.NLP import generateRecipe
from utils.generateQuery import generateQuery

generate_bp = Blueprint("generate", __name__)

model = genai.GenerativeModel("gemini-1.5-flash")

@generate_bp.route("/generate/recipe", methods=["POST"])
def generate():
    data = request.get_json()

    main_ingredients = data.get("main_ingredients", [])
    server_for = data.get("serve_for", 1)
    seasonings = data.get("seasonings", [])
    ingredients = main_ingredients + seasonings

    recommended_recipes = generateRecipe(ingredients)
    print(recommended_recipes)

    if not recommended_recipes:
        return jsonify({"error": "No matching recipes found for the provided ingredients."}), 404

    try:
        response = generateQuery(ingredients, recommended_recipes,server_for)
        json_response = response.text.replace("```json", "").replace("```", "").strip()
        json_data = json.loads(json_response)

        # print json_data in a pretty format
        # print(json.dumps(json_data, indent=10))

        return jsonify(json_data)
    except json.JSONDecodeError:
        return jsonify({"error": "Failed to parse JSON from AI response.", "response": response.generated_text}), 500
