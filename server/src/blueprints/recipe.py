from flask import Blueprint, jsonify, request
from sqlalchemy import text
import uuid
from utils.database import engine

recipes_bp = Blueprint("recipes", __name__)

@recipes_bp.route("/create_recipe/<userId>", methods=["POST"])
def create_recipe(userId):
    data = request.get_json()
    
    recipe_data = data.get("recipe")
    recipe_name = recipe_data.get("name")
    ingredients = recipe_data.get("ingredients")
    instructions = recipe_data.get("instructions")
    type_of_cuisine = recipe_data.get("type_of_cuisine")
    nutrient_counts = recipe_data.get("nutrient_counts")
    serve_hot_or_cold = recipe_data.get("serve_hot_or_cold")
    cooking_time = recipe_data.get("cooking_time")
    benefits = recipe_data.get("benefits")
    serve_for = recipe_data.get("serve_for")

    try:
        with engine.connect() as conn:
            user = conn.execute(text("SELECT * FROM users WHERE id = :userId"), {"userId": userId}).fetchone()
            if not user:
                return jsonify({"error": "User not found"}), 404

            recipe_id = str(uuid.uuid4())

            # Convert ingredients list to a comma-separated string of ingredient names
            ingredients_text = ", ".join([ingredient["name"] for ingredient in ingredients])

            recipe_query = text(
                """
                INSERT INTO recipes (
                    id, name, ingredients, instruction, type_of_cuisine, nutrient_counts,
                    serve_hot_or_cold, cooking_time, benefits, serve_for, user_id
                )
                VALUES (
                    :id, :name, :ingredients, :instruction, :type_of_cuisine, :nutrient_counts,
                    :serve_hot_or_cold, :cooking_time, :benefits, :serve_for, :user_id
                )
                """
            )

            # Insert recipe instructions as a single string joined with newlines
            instructions_text = "\n".join(instructions)

            conn.execute(recipe_query, {
                "id": recipe_id,
                "name": recipe_name,
                "ingredients": ingredients_text,
                "instruction": instructions_text,
                "type_of_cuisine": type_of_cuisine,
                "nutrient_counts": nutrient_counts,
                "serve_hot_or_cold": serve_hot_or_cold,
                "cooking_time": cooking_time,
                "benefits": benefits,
                "serve_for": serve_for,
                "user_id": userId
            })

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
