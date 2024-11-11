import uuid

from flask import Blueprint, jsonify, request
from sqlalchemy import text
from utils.database import engine

posts_bp = Blueprint("posts", __name__)

# Create a new post for a recipe
@posts_bp.route("/user/<user_id>/recipe/<recipe_name>/create_post", methods=["POST"])
def create_post(user_id, recipe_name):
    try:
        with engine.connect() as conn:
            # Check if user and recipe exist
            user = conn.execute(text("SELECT id FROM users WHERE id = :user_id"), {"user_id": user_id}).fetchone()
            recipe = conn.execute(text("SELECT id FROM recipes WHERE name = :recipe_name"), {"recipe_name": recipe_name}).fetchone()

            if not user:
                return jsonify({"error": "User not found"}), 404
            if not recipe:
                return jsonify({"error": "Recipe not found"}), 404

            # Create a unique ID for the post
            post_id = str(uuid.uuid4())
            conn.execute(text(
                """
                INSERT INTO recipe_posts (id, user_id, recipe_id, posted_at)
                VALUES (:id, :user_id, :recipe_id, CURRENT_DATE)
                """
            ), {"id": post_id, "user_id": user_id, "recipe_id": recipe.id})

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

# Get a specific post by post ID, including bookmark info for the current user
@posts_bp.route("/post/<post_id>", methods=["GET"])
def get_post(post_id):
    user_id = request.args.get("user_id")  # Get the current user's ID from the request
    try:
        with engine.connect() as conn:
            # Fetch post and recipe details
            result = conn.execute(text(
                """
                SELECT rp.id AS post_id, rp.user_id AS post_user_id, rp.posted_at AS post_date,
                r.id AS recipe_id, r.name AS recipe_name, r.ingredients AS recipe_ingredients,
                r.instruction AS recipe_instruction, r.type_of_cuisine AS recipe_cuisine,
                r.nutrient_counts AS recipe_nutrients, r.serve_hot_or_cold AS recipe_serving_temp,
                r.cooking_time AS recipe_cooking_time, r.benefits AS recipe_benefits,
                r.serve_for AS recipe_servings, u.userName AS author_name
                FROM recipe_posts rp
                JOIN recipes r ON rp.recipe_id = r.id
                JOIN users u ON rp.user_id = u.id
                WHERE rp.id = :post_id
                """
            ), {"post_id": post_id}).fetchone()

            if not result:
                return jsonify({"error": "Post not found"}), 404

            # Count total likes for the post
            total_likes = conn.execute(text(
                "SELECT COUNT(*) FROM likes WHERE post_id = :post_id"
            ), {"post_id": post_id}).scalar()

            # Check if the user has liked the post
            is_liked = conn.execute(text(
                "SELECT 1 FROM likes WHERE user_id = :user_id AND post_id = :post_id"
            ), {"user_id": user_id, "post_id": post_id}).fetchone() is not None

            # Check if the user has bookmarked the post
            is_bookmarked = conn.execute(text(
                "SELECT 1 FROM bookmarks WHERE user_id = :user_id AND post_id = :post_id"
            ), {"user_id": user_id, "post_id": post_id}).fetchone() is not None

            # Construct the response
            post = {
                "id": result.post_id,
                "user_id": result.post_user_id,
                "posted_at": result.post_date,
                "recipe": {
                    "id": result.recipe_id,
                    "name": result.recipe_name,
                    "ingredients": result.recipe_ingredients,
                    "instruction": result.recipe_instruction,
                    "type_of_cuisine": result.recipe_cuisine,
                    "nutrient_counts": result.recipe_nutrients,
                    "serve_hot_or_cold": result.recipe_serving_temp,
                    "cooking_time": result.recipe_cooking_time,
                    "benefits": result.recipe_benefits,
                    "serve_for": result.recipe_servings,
                },
                "author": result.author_name,
                "is_bookmarked": is_bookmarked,
                "total_likes": total_likes,
                "is_liked": is_liked
            }
            return jsonify({"post": post}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get all posts for the home page feed, including all recipe details and bookmark info for the current user
@posts_bp.route("/posts", methods=["GET"])
def get_all_posts():
    user_id = request.args.get("user_id")  # Get the current user's ID from the request
    try:
        with engine.connect() as conn:
            result = conn.execute(text(
                """
                SELECT rp.id AS post_id, rp.user_id AS post_user_id, rp.posted_at AS post_date,
                r.id AS recipe_id, r.name AS recipe_name, r.ingredients AS recipe_ingredients,
                r.instruction AS recipe_instruction, r.type_of_cuisine AS recipe_cuisine,
                r.nutrient_counts AS recipe_nutrients, r.serve_hot_or_cold AS recipe_serving_temp,
                r.cooking_time AS recipe_cooking_time, r.benefits AS recipe_benefits,
                r.serve_for AS recipe_servings, u.userName AS author_name
                FROM recipe_posts rp
                JOIN recipes r ON rp.recipe_id = r.id
                JOIN users u ON rp.user_id = u.id
                ORDER BY rp.posted_at DESC
                """
            ))

            posts = []
            for row in result:
                # Count total likes for each post
                total_likes = conn.execute(text(
                    "SELECT COUNT(*) FROM likes WHERE post_id = :post_id"
                ), {"post_id": row.post_id}).scalar()

                # Check if the current user has liked the post
                is_liked = conn.execute(text(
                    "SELECT 1 FROM likes WHERE user_id = :user_id AND post_id = :post_id"
                ), {"user_id": user_id, "post_id": row.post_id}).fetchone() is not None

                # Check if the post is bookmarked by the current user
                is_bookmarked = conn.execute(text(
                    "SELECT 1 FROM bookmarks WHERE user_id = :user_id AND post_id = :post_id"
                ), {"user_id": user_id, "post_id": row.post_id}).fetchone() is not None

                post = {
                    "id": row.post_id,
                    "user_id": row.post_user_id,
                    "posted_at": row.post_date,
                    "recipe": {
                        "id": row.recipe_id,
                        "name": row.recipe_name,
                        "ingredients": row.recipe_ingredients,
                        "instruction": row.recipe_instruction,
                        "type_of_cuisine": row.recipe_cuisine,
                        "nutrient_counts": row.recipe_nutrients,
                        "serve_hot_or_cold": row.recipe_serving_temp,
                        "cooking_time": row.recipe_cooking_time,
                        "benefits": row.recipe_benefits,
                        "serve_for": row.recipe_servings,
                    },
                    "author": row.author_name,
                    "is_bookmarked": is_bookmarked,
                    "total_likes": total_likes,
                    "is_liked": is_liked
                }
                posts.append(post)

            return jsonify({"posts": posts}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get all posts by a specific user for profile feed, including all recipe details and bookmark info
@posts_bp.route("/user/<user_id>/posts", methods=["GET"])
def get_all_user_posts(user_id):
    try:
        with engine.connect() as conn:
            result = conn.execute(text(
                """
                SELECT rp.id AS post_id, rp.user_id, rp.posted_at,
                r.id AS recipe_id, r.name, r.ingredients, r.instruction,
                r.type_of_cuisine, r.nutrient_counts, r.serve_hot_or_cold,
                r.cooking_time, r.benefits, r.serve_for,
                u.userName AS author
                FROM recipe_posts rp
                JOIN recipes r ON rp.recipe_id = r.id
                JOIN users u ON rp.user_id = u.id
                WHERE rp.user_id = :user_id
                ORDER BY rp.posted_at DESC
                """
            ), {"user_id": user_id})

            user_posts = []
            for row in result:
                bookmarks = conn.execute(text(
                    "SELECT user_id FROM bookmarks WHERE post_id = :post_id"
                ), {"post_id": row.post_id}).fetchall()
                bookmark_list = [bookmark.user_id for bookmark in bookmarks]

                post = {
                    "id": row.post_id,
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
                    "bookmarks": bookmark_list,
                }
                user_posts.append(post)

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
            ), {"query": query})


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

# Bookmark or unbookmark a post
@posts_bp.route("/post/<post_id>/bookmark", methods=["POST"])
def bookmark_unbookmark_post(post_id):
    data = request.get_json()
    user_id = data.get("user_id")

    try:
        with engine.connect() as conn:
            # Check if post and user exist
            post = conn.execute(text("SELECT id FROM recipe_posts WHERE id = :post_id"), {"post_id": post_id}).fetchone()
            user = conn.execute(text("SELECT id FROM users WHERE id = :user_id"), {"user_id": user_id}).fetchone()

            if not post or not user:
                return jsonify({"error": "User or Post not found"}), 404

            # Check if the user has already bookmarked the post
            bookmark = conn.execute(text(
                "SELECT id FROM bookmarks WHERE user_id = :user_id AND post_id = :post_id"
            ), {"user_id": user_id, "post_id": post_id}).fetchone()

            if bookmark:
                # Unbookmark the post
                conn.execute(text("DELETE FROM bookmarks WHERE user_id = :user_id AND post_id = :post_id"), {"user_id": user_id, "post_id": post_id})
                message = "Post unbookmarked successfully!"
            else:
                # Bookmark the post
                bookmark_id = str(uuid.uuid4())
                conn.execute(text(
                    "INSERT INTO bookmarks (id, user_id, post_id, bookmarked_at) VALUES (:id, :user_id, :post_id, CURRENT_DATE)"
                ), {"id": bookmark_id, "user_id": user_id, "post_id": post_id})
                message = "Post bookmarked successfully!"

            conn.commit()
            return jsonify({"message": message}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@posts_bp.route("/user/<user_id>/bookmarked_posts", methods=["GET"])
def get_user_bookmarked_posts(user_id):
    try:
        with engine.connect() as conn:
            # Query to get all bookmarked posts by the user, including full recipe details
            result = conn.execute(text(
                """
                SELECT rp.user_id as user_id, rp.id AS post_id, rp.posted_at AS post_date,
                r.id AS recipe_id, r.name AS recipe_name, r.ingredients AS recipe_ingredients,
                r.instruction AS recipe_instruction, r.type_of_cuisine AS recipe_cuisine,
                r.nutrient_counts AS recipe_nutrients, r.serve_hot_or_cold AS recipe_serving_temp,
                r.cooking_time AS recipe_cooking_time, r.benefits AS recipe_benefits,
                r.serve_for AS recipe_servings, u.userName AS author_name
                FROM bookmarks b
                JOIN recipe_posts rp ON b.post_id = rp.id
                JOIN recipes r ON rp.recipe_id = r.id
                JOIN users u ON rp.user_id = u.id
                WHERE b.user_id = :user_id
                ORDER BY rp.posted_at DESC
                """
            ), {"user_id": user_id}).fetchall()

            # # Check if the user has any bookmarks
            # if not result:
            #     return jsonify({"message": "No bookmarks found for this user."}), 404

            # Structure the data for each bookmarked post with recipe details
            bookmarked_posts = []
            for row in result:
                bookmarked_posts.append({
                    "id": row.post_id,
                    "posted_at": row.post_date,
                    "user_id":row.user_id,
                    "recipe": {
                        "id": row.recipe_id,
                        "name": row.recipe_name,
                        "ingredients": row.recipe_ingredients,
                        "instruction": row.recipe_instruction,
                        "type_of_cuisine": row.recipe_cuisine,
                        "nutrient_counts": row.recipe_nutrients,
                        "serve_hot_or_cold": row.recipe_serving_temp,
                        "cooking_time": row.recipe_cooking_time,
                        "benefits": row.recipe_benefits,
                        "serve_for": row.recipe_servings,
                    },
                    "author": row.author_name,
                })

            return jsonify({"bookmarked_posts": bookmarked_posts}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
