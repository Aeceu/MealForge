from flask import Blueprint, jsonify,request
from sqlalchemy import text
import uuid
from utils.database import engine
import google.generativeai as genai
import os


genai.configure(api_key=os.getenv("AI_API_KEY"))


recipes_bp = Blueprint("recipes", __name__)

@recipes_bp.route("/create_recipe/<userId>", methods=["POST"])
def create_recipe(userId):
    data = request.get_json()
    ingredient_ids = data.get("ingredient_ids")

    #? Manual muna hanggat matapos yung gnn :)
    #? eto dapat result ng gnn
    recipe_name = data.get("name")
    instruction = data.get("instruction")
    type_of_cuisine = data.get("type_of_cuisine")
    nutrient_counts = data.get("nutrient_counts")
    serve_hot_or_cold = data.get("serve_hot_or_cold")
    cooking_time = data.get("cooking_time")
    benefits = data.get("benefits")
    serve_for = data.get("serve_for")

    if not userId or not recipe_name or not instruction or not ingredient_ids:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        with engine.connect() as conn:
            user = conn.execute(text("SELECT * FROM users WHERE id = :userId"), {"userId": userId}).fetchone()
            if not user:
                return jsonify({"error": "User not found"}), 404

            ingredients = conn.execute(
                text("SELECT * FROM ingredients WHERE id IN :ingredient_ids"),
                {"ingredient_ids": tuple(ingredient_ids)}
            ).fetchall()

            if len(ingredients) != len(ingredient_ids):
                return jsonify({"error": "Some ingredients were not found"}), 404

            recipe_id = str(uuid.uuid4())
            query = text(
                """
                INSERT INTO recipes (id, name, instruction, type_of_cuisine, nutrient_counts, serve_hot_or_cold, cooking_time, benefits, serve_for, user_id)
                VALUES (:id, :name, :instruction, :type_of_cuisine, :nutrient_counts, :serve_hot_or_cold, :cooking_time, :benefits, :serve_for, :user_id)
                """
            )
            conn.execute(query, {
                "id": recipe_id,
                "name": recipe_name,
                "instruction": instruction,
                "type_of_cuisine": type_of_cuisine,
                "nutrient_counts": nutrient_counts,
                "serve_hot_or_cold": serve_hot_or_cold,
                "cooking_time": cooking_time,
                "benefits": benefits,
                "serve_for": serve_for,
                "user_id": userId
            })

            for ingredient in ingredients:
                conn.execute(text(
                    """
                    INSERT INTO recipe_ingredients (recipe_id, ingredient_id)
                    VALUES (:recipe_id, :ingredient_id)
                    """), {"recipe_id": recipe_id, "ingredient_id": ingredient.id})

            conn.commit()

            return jsonify({"message": "Recipe created successfully!", "recipe_id": recipe_id}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@recipes_bp.route("/user/<user_id>/recipes", methods=["GET"])
def get_user_recipes(user_id):
    try:
        with engine.connect() as conn:
            result = conn.execute(text(
                """
                SELECT r.*, GROUP_CONCAT(i.name SEPARATOR ', ') as ingredients
                FROM recipes r
                JOIN recipe_ingredients ri ON r.id = ri.recipe_id
                JOIN ingredients i ON i.id = ri.ingredient_id
                WHERE r.user_id = :user_id
                GROUP BY r.id
                """
            ), {"user_id": user_id})

            recipes = [dict(row) for row in result]

            return jsonify({"recipes": recipes}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@recipes_bp.route("/test", methods=["GET"])
def test():
  model = genai.GenerativeModel("gemini-1.5-flash")
  response = model.generate_content("""
    Generate a recipe based only on these selected ingredients: (salt,tilapia, tomato,onions,vinegar,soy sauce) and can be serves for 2 person;child and a mother. Ensure the recipe includes all specified attributes:

    Name: The title of the recipe, a string with a maximum length of 250 characters.
    Instruction: Detailed cooking instructions, provided as a text field.
    Type of Cuisine: The cuisine type (e.g., Italian, Mexican), also as a string of up to 250 characters.
    Nutrient Counts: A textual representation of the nutritional content (e.g., calories, fats, proteins).
    Serve Hot or Cold: Specify whether the recipe is best served hot or cold, as a string of up to 50 characters.
    Cooking Time: An integer representing the time required to cook the recipe in minutes.
    Benefits: Any health benefits associated with the recipe, provided as optional text.
    Serve For: An integer indicating how many servings the recipe yields.

    Provide a recipe with realistic values for each attribute.
  """)
  print(response.text)
  return jsonify(response.text)
