from flask import Blueprint, jsonify, make_response, request
from flask_jwt_extended import create_access_token, create_refresh_token,jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from flask_bcrypt import Bcrypt
from sqlalchemy import text
import uuid
from datetime import timedelta, datetime
from utils.database import engine

user_bp = Blueprint("user", __name__)
bcrypt = Bcrypt()

@user_bp.route("/signup", methods=["POST"])
def handleSignup():
    data = request.get_json()
    firstName = data.get("firstName")
    lastName = data.get("lastName")
    email = data.get("email")
    password = data.get("password")

    if not firstName or not lastName or not email or not password:
        return jsonify({"error": "Missing field!"}), 400

    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM user WHERE email = :email"), {"email": email})
            user_exists = result.fetchone()

            if user_exists:
                return jsonify({"error": "Email already registered!"}), 400

            hashPass = bcrypt.generate_password_hash(password).decode('utf-8')
            userID = str(uuid.uuid4())

            query = text(
                """
                INSERT INTO user (id, firstName, lastName, email, password)
                VALUES (:id, :firstName, :lastName, :email, :password)
                """)

            conn.execute(query, {
                "id": userID,
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "password": hashPass
            })

            conn.commit()

            return jsonify({"message": "User registered successfully!"}), 201

    except IntegrityError as e:
        return jsonify({"error": "There's an error in database handling!"}), 409

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@user_bp.route("/signin", methods=["POST"])
def handleLogin():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Please fill up the missing field!"}), 400

    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM user WHERE email = :email"), {"email": email})
            user_exists = result.fetchone()
            if user_exists is None:
                return jsonify({"error": "Email is not registered!"}), 400

            user = {
                "id": user_exists.id,
                "firstName": user_exists.first_name,
                "lastName": user_exists.last_name,
                "email": user_exists.email,
                "password": user_exists.password
            }

            valid_password = bcrypt.check_password_hash(user["password"], password)
            if not valid_password:
                return jsonify({"error": "Password incorrect!"}), 400

            expires = datetime.utcnow() + timedelta(days=1)
            accessToken = create_access_token(identity=user["id"], additional_claims=user)
            refreshToken = create_refresh_token(identity=user["id"], additional_claims=user)

            conn.execute(text("UPDATE user SET refreshToken = :refreshToken WHERE id = :id"), {
                "refreshToken": refreshToken,
                "id": user['id']
            })

            conn.commit()

            secure_cookie = True if request.is_secure else False

            response = make_response({
                "message": "User authenticated!",
                "user": {
                    "id": user["id"],
                    "firstName": user["firstName"],
                    "lastName": user["lastName"],
                    "email": user["email"],
                },
                "accessToken": accessToken
            })
            response.set_cookie("jwt", refreshToken, expires=expires, max_age=86400, httponly=True, samesite='None', secure=secure_cookie)
            return response, 200

    except IntegrityError as e:
        print(e)
        return jsonify({"error": "A user with this email already exists"}), 409

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


@user_bp.route("/showcookie", methods=["GET"])
def show_cookie():
    refreshToken = request.cookies.get("jwt")
    if not refreshToken:
        return jsonify({"error": "Token missing!"}), 401

    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM user WHERE refreshToken = :refreshToken"), {"refreshToken": refreshToken})
        foundUser = result.fetchone()
        if foundUser is None:
            return jsonify({"error": "User not found!"}), 403
        return jsonify({"message": "User authenticated!"}), 200


@user_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    try:
        current_user_id = get_jwt_identity()

        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM user WHERE id = :id"), {"id": current_user_id})
            user_exists = result.fetchone()

            if user_exists is None:
                return jsonify({"error": "User not found!"}), 403

            user = {
                "id": user_exists.id,
                "firstName": user_exists.first_name,
                "lastName": user_exists.last_name,
                "email": user_exists.email,
            }

            new_access_token = create_access_token(identity=user["id"], additional_claims=user)
            return jsonify({
                "accessToken": new_access_token,
                "user": user,
                "message": "Token refreshed successfully!"
            }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
