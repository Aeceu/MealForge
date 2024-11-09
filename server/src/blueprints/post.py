from flask import Blueprint, jsonify, request
from sqlalchemy import text
import uuid
from utils.database import engine

posts_bp = Blueprint("posts", __name__)

# Create a new post for a recipe
@posts_bp.route("/user/<user_id>/recipe/<recipe_id>/create_post", methods=["POST"])
def create_post(user_id, recipe_id):
    try:
        with engine.connect() as conn:
            # Check if user and recipe exist
            user = conn.execute(text("SELECT id FROM users WHERE id = :user_id"), {"user_id": user_id}).fetchone()
            recipe = conn.execute(text("SELECT id FROM recipes WHERE id = :recipe_id"), {"recipe_id": recipe_id}).fetchone()

            if not user or not recipe:
                return jsonify({"error": "User or Recipe not found"}), 404

            # Create a new post
            post_id = str(uuid.uuid4())
            conn.execute(text(
                """
                INSERT INTO recipe_posts (id, user_id, recipe_id, posted_at)
                VALUES (:id, :user_id, :recipe_id, CURRENT_DATE)
                """
            ), {"id": post_id, "user_id": user_id, "recipe_id": recipe_id})

            conn.commit()
            return jsonify({"message": "Post created successfully!", "post_id": post_id}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete a post
@posts_bp.route("/post/<post_id>/delete", methods=["DELETE"])
def delete_post(post_id):
    try:
        with engine.connect() as conn:
            post = conn.execute(text("SELECT id FROM recipe_posts WHERE id = :post_id"), {"post_id": post_id}).fetchone()

            if not post:
                return jsonify({"error": "Post not found"}), 404

            conn.execute(text("DELETE FROM recipe_posts WHERE id = :post_id"), {"post_id": post_id})
            conn.commit()
            return jsonify({"message": "Post deleted successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# TODO:IDK IF WE'LL USE THIS!!
# Update a post (e.g., change recipe details associated with a post)
@posts_bp.route("/post/<post_id>/update", methods=["PUT"])
def update_post(post_id):
    data = request.get_json()
    recipe_id = data.get("recipe_id")

    try:
        with engine.connect() as conn:
            # Verify the new recipe exists
            recipe = conn.execute(text("SELECT id FROM recipes WHERE id = :recipe_id"), {"recipe_id": recipe_id}).fetchone()

            if not recipe:
                return jsonify({"error": "New recipe not found"}), 404

            # Update the post with the new recipe
            conn.execute(text(
                "UPDATE recipe_posts SET recipe_id = :recipe_id WHERE id = :post_id"
            ), {"recipe_id": recipe_id, "post_id": post_id})

            conn.commit()
            return jsonify({"message": "Post updated successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Like or unlike a post
@posts_bp.route("/post/<post_id>/like", methods=["POST"])
def like_unlike_post(post_id):
    data = request.get_json()
    user_id = data.get("user_id")

    try:
        with engine.connect() as conn:
            # Check if post and user exist
            post = conn.execute(text("SELECT id FROM recipe_posts WHERE id = :post_id"), {"post_id": post_id}).fetchone()
            user = conn.execute(text("SELECT id FROM users WHERE id = :user_id"), {"user_id": user_id}).fetchone()

            if not post or not user:
                return jsonify({"error": "User or Post not found"}), 404

            # Check if the user has already liked the post
            like = conn.execute(text(
                "SELECT id FROM likes WHERE user_id = :user_id AND post_id = :post_id"
            ), {"user_id": user_id, "post_id": post_id}).fetchone()

            if like:
                # Unlike the post
                conn.execute(text("DELETE FROM likes WHERE user_id = :user_id AND post_id = :post_id"), {"user_id": user_id, "post_id": post_id})
                message = "Post unliked successfully!"
            else:
                # Like the post
                like_id = str(uuid.uuid4())
                conn.execute(text(
                    "INSERT INTO likes (id, user_id, post_id, liked_at) VALUES (:id, :user_id, :post_id, CURRENT_DATE)"
                ), {"id": like_id, "user_id": user_id, "post_id": post_id})
                message = "Post liked successfully!"

            conn.commit()
            return jsonify({"message": message}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# TODO: ====================|
# TODO: ********************|
# TODO: FIX THE POST LIKES!!|
# TODO: WE NEED TO KNOW WHO |
# TODO: LIKES THE POST!!!   |
# TODO: ********************|
# TODO: ====================|


# Get a specific post by post ID, including all recipe details
@posts_bp.route("/post/<post_id>", methods=["GET"])
def get_post(post_id):
    try:
        with engine.connect() as conn:
            result = conn.execute(text(
                """
                SELECT rp.*, r.*, u.userName AS author
                FROM recipe_posts rp
                JOIN recipes r ON rp.recipe_id = r.id
                JOIN users u ON rp.user_id = u.id
                WHERE rp.id = :post_id
                """
            ), {"post_id": post_id}).fetchone()

            if not result:
                return jsonify({"error": "Post not found"}), 404

            post = {
                "id": result.id,
                "user_id": result.user_id,
                "posted_at": result.posted_at,
                "recipe": {
                    "id": result.recipe_id,
                    "name": result.name,
                    "ingredients": result.ingredients,
                    "instruction": result.instruction,
                    "type_of_cuisine": result.type_of_cuisine,
                    "nutrient_counts": result.nutrient_counts,
                    "serve_hot_or_cold": result.serve_hot_or_cold,
                    "cooking_time": result.cooking_time,
                    "benefits": result.benefits,
                    "serve_for": result.serve_for,
                },
                "author": result.author,
            }
            return jsonify({"post": post}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get all posts for the home page feed, including all recipe details
@posts_bp.route("/posts", methods=["GET"])
def get_all_posts():
    try:
        with engine.connect() as conn:
            result = conn.execute(text(
                """
                SELECT rp.*, r.*, u.userName AS author
                FROM recipe_posts rp
                JOIN recipes r ON rp.recipe_id = r.id
                JOIN users u ON rp.user_id = u.id
                ORDER BY rp.posted_at DESC
                """
            ))

            posts = [{
                "id": row.id,
                "user_id": row.user_id,
                "posted_at": row.posted_at,
                "recipe": {
                    "id": row.recipe_id,
                    "name": row.name,
                    "ingredients": row.ingredients,
                    "instruction": row.instruction,
                    "type_of_cuisine": row.type_of_cuisine,
                    "nutrient_counts": row.nutrient_counts,
                    "serve_hot_or_cold": row.serve_hot_or_cold,
                    "cooking_time": row.cooking_time,
                    "benefits": row.benefits,
                    "serve_for": row.serve_for,
                },
                "author": row.author,
            } for row in result]

            return jsonify({"posts": posts}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get all posts by a specific user for profile feed, including all recipe details
@posts_bp.route("/user/<user_id>/posts", methods=["GET"])
def get_all_user_posts(user_id):
    try:
        with engine.connect() as conn:
            result = conn.execute(text(
                """
                SELECT rp.*, r.*, u.userName AS author
                FROM recipe_posts rp
                JOIN recipes r ON rp.recipe_id = r.id
                JOIN users u ON rp.user_id = u.id
                WHERE rp.user_id = :user_id
                ORDER BY rp.posted_at DESC
                """
            ), {"user_id": user_id})

            user_posts = [{
                "id": row.id,
                "user_id": row.user_id,
                "posted_at": row.posted_at,
                "recipe": {
                    "id": row.recipe_id,
                    "name": row.name,
                    "ingredients": row.ingredients,
                    "instruction": row.instruction,
                    "type_of_cuisine": row.type_of_cuisine,
                    "nutrient_counts": row.nutrient_counts,
                    "serve_hot_or_cold": row.serve_hot_or_cold,
                    "cooking_time": row.cooking_time,
                    "benefits": row.benefits,
                    "serve_for": row.serve_for,
                },
                "author": row.author,
            } for row in result]

            return jsonify({"user_posts": user_posts}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Search posts via search button by any keywords in the recipe name or user name
@posts_bp.route("/posts/search", methods=["GET"])
def search_posts():
    query = request.args.get("query", "")
    try:
        with engine.connect() as conn:
            result = conn.execute(text(
                """
                SELECT rp.*, r.name AS recipe_name, u.userName AS author
                FROM recipe_posts rp
                JOIN recipes r ON rp.recipe_id = r.id
                JOIN users u ON rp.user_id = u.id
                WHERE r.name ILIKE :query OR u.userName ILIKE :query
                ORDER BY rp.posted_at DESC
                """
            ), {"query": f"%{query}%"})

            searched_posts = [{
                "id": row.id,
                "user_id": row.user_id,
                "recipe_id": row.recipe_id,
                "posted_at": row.posted_at,
                "recipe_name": row.recipe_name,
                "author": row.author,
            } for row in result]

            return jsonify({"searched_posts": searched_posts}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
