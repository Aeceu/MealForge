from flask import Blueprint, jsonify,request
from sqlalchemy.exc import IntegrityError
from sqlalchemy import text
import uuid
from utils.database import engine
from datetime import datetime

ingredients_bp = Blueprint("ingredients", __name__)

@ingredients_bp.route("/user/<userId>/ingredients",methods=["GET"])
def get_ingredients(userId):
    try:
      with engine.connect() as conn:
        query = """
            SELECT * FROM ingredients
            WHERE user_id = :userId
        """
        result = conn.execute(text(query),{"userId":userId})
        ingredients = result.fetchall()

        if not ingredients:
                return jsonify({"message": "No ingredients found for this user."}), 404

        ingredients_list = []
        for ingredient in ingredients:
              ingredients_list.append({
                  "id": str(ingredient.id),
                  "name": ingredient.name,
                  "type": ingredient.type,
                  "measurements": ingredient.measurements,
                  "expirationDate": ingredient.expirationDate,
                  "date_added": ingredient.date_added
              })

        return jsonify({"ingredients": ingredients_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@ingredients_bp.route("/user/add_ingredients/<userId>", methods=["POST"])
def create_ingredient(userId):
    data = request.get_json()

    name = data.get("name")
    type = data.get("type")
    measurements = data.get("measurements")
    expiration_date = data.get("expirationDate")

    date_added = datetime.now().strftime("%Y-%m-%d")

    if not name or not measurements or not type or not userId:
        return jsonify({"error": "Missing required fields: 'name', 'measurements', and 'user_id'"}), 400

    try:
        with engine.connect() as conn:
            user_query = text("SELECT * FROM users WHERE id = :user_id")
            user_exists = conn.execute(user_query, {"user_id": userId}).fetchone()

            if not user_exists:
                return jsonify({"error": "User does not exist!"}), 404

            ingredient_id = str(uuid.uuid4())

            query = text("""
                INSERT INTO ingredients (id, name, type, measurements, expirationDate, date_added, user_id)
                VALUES (:id, :name, :type, :measurements, :expirationDate, :date_added, :user_id)
            """)

            conn.execute(query, {
                "id": ingredient_id,
                "name": name,
                "type":type,
                "measurements": measurements,
                "expirationDate": expiration_date if expiration_date else None,
                "date_added": date_added,
                "user_id": userId
            })

            conn.commit()

            return jsonify({
                "message": "Ingredient created successfully!",
                "ingredient": {
                    "id": ingredient_id,
                    "name": name,
                    "type":type,
                    "measurements": measurements,
                    "expirationDate": expiration_date,
                    "date_added": date_added,
                    "user_id": userId
                }
            }), 201

    except IntegrityError:
        return jsonify({"error": "Database integrity error occurred!"}), 409

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@ingredients_bp.route("/user/dele_ingredients/<ingredientsId>",methods=["DELETE"])
def delete_ingredients(ingredientsId):
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM ingredients WHERE id = :ingredient_id"), {"ingredient_id": ingredientsId})
            ingredient = result.fetchone()

            if not ingredient:
                return jsonify({"error": "Ingredient not found."}), 404

            conn.execute(text(
                """
                DELETE FROM ingredients
                WHERE id = :ingredientsId
                """),{"ingredientsId":ingredientsId})
            return jsonify({"message":"ingredients deleted successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
