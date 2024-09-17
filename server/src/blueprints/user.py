from flask import Blueprint, jsonify, make_response, request
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required,
    get_jwt_identity, set_access_cookies, set_refresh_cookies, unset_jwt_cookies
)
from sqlalchemy.exc import IntegrityError
from flask_bcrypt import Bcrypt
from sqlalchemy import text
import uuid
from utils.database import engine


user_bp = Blueprint("user", __name__)
bcrypt = Bcrypt()

# TODO: Create user account
@user_bp.route("/signup", methods=["POST"])
def handleSignup():
    data = request.get_json()
    userName = data.get("userName")
    firstName = data.get("firstName")
    lastName = data.get("lastName")
    email = data.get("email")
    password = data.get("password")

    if not userName or not firstName or not lastName or not email or not password:
        return jsonify({"error": "Missing field!"}), 400

    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM users WHERE email = :email"), {"email": email})
            user_exists = result.fetchone()

            if user_exists:
                return jsonify({"error": "Email already registered!"}), 400

            hashPass = bcrypt.generate_password_hash(password).decode('utf-8')
            userID = str(uuid.uuid4())

            query = text(
                """
                INSERT INTO users (id, userName, firstName, lastName, email, password)
                VALUES (:id, :userName, :firstName, :lastName, :email, :password)
                """
            )

            conn.execute(query, {
                "id": userID,
                "userName":userName,
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "password": hashPass
            })

            conn.commit()

            return jsonify({"message": "User registered successfully!"}), 201

    except IntegrityError:
        return jsonify({"error": "There's an error in database handling!"}), 409

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# TODO: Login user's account
@user_bp.route("/signin", methods=["POST"])
def handleLogin():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Please fill up the missing field!"}), 400

    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM users WHERE email = :email"), {"email": email})
            user_exists = result.fetchone()
            if user_exists is None:
                return jsonify({"error": "Email is not registered!"}), 400

            user = {
                "id": user_exists.id,
                "userName":user_exists.userName,
                "firstName": user_exists.firstName,
                "lastName": user_exists.lastName,
                "email": user_exists.email,
                "password": user_exists.password
            }

            valid_password = bcrypt.check_password_hash(user["password"], password)
            if not valid_password:
                return jsonify({"error": "Password incorrect!"}), 400

            # Create access and refresh tokens
            accessToken = create_access_token(identity=user["id"], additional_claims=user)
            refreshToken = create_refresh_token(identity=user["id"], additional_claims=user)

            # Store refresh token in the database
            conn.execute(text("UPDATE users SET refreshToken = :refreshToken WHERE id = :id"), {
                "refreshToken": refreshToken,
                "id": user['id']
            })
            conn.commit()

            secure_cookie = True if request.is_secure else False

            # Create the response object
            response = make_response({
                "message": "User authenticated!",
                "user": {
                    "id": user["id"],
                    "userName":user["userName"],
                    "firstName": user["firstName"],
                    "lastName": user["lastName"],
                    "email": user["email"],
                },
                "accessToken": accessToken
            })

            # Set cookies with access and refresh tokens
            set_access_cookies(response, accessToken, max_age=86400)
            set_refresh_cookies(response, refreshToken, max_age=86400)

            return response, 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# TODO: Show's the cookies set
@user_bp.route("/showcookie", methods=["GET"])
def show_cookie():
    refreshToken = request.cookies.get("refresh_token_cookie")
    if not refreshToken:
        return jsonify({"error": "Token missing!"}), 401

    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM users WHERE refreshToken = :refreshToken"), {"refreshToken": refreshToken})
        foundUser = result.fetchone()
        if foundUser is None:
            return jsonify({"error": "User not found!"}), 403
        return jsonify({"message": "User authenticated!", "refreshToken": foundUser.refreshToken}), 200

# TODO: Refresh user's cookies
@user_bp.route("/refresh", methods=["GET"])
def refresh():
    try:
        refreshToken = request.cookies.get("refresh_token_cookie")
        if not refreshToken:
            return jsonify({"error": "Token missing!"}), 401

        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM users WHERE refreshToken = :refreshToken"), {"refreshToken": refreshToken})
            user_exists = result.fetchone()

            if user_exists is None:
                return jsonify({"error": "User not found!"}), 403

            user = {
                "id": user_exists.id,
                "userName":user_exists.userName,
                "firstName": user_exists.firstName,
                "lastName": user_exists.lastName,
                "email": user_exists.email,
            }

            # Generate new access token and refresh token
            new_access_token = create_access_token(identity=user["id"], additional_claims=user)
            new_refresh_token = create_refresh_token(identity=user["id"], additional_claims=user)

            # Update refresh token in the database
            conn.execute(text("UPDATE users SET refreshToken = :new_refresh_token WHERE id = :id"), {
                "new_refresh_token": new_refresh_token,
                "id": user['id']
            })
            conn.commit()

            # Update the cookie with the new refresh token
            secure_cookie = True if request.is_secure else False
            response = jsonify({
                "accessToken": new_access_token,
                "refreshToken": new_refresh_token,
                "user": user,
                "message": "Token refreshed successfully!"
            })
            set_access_cookies(response, new_access_token)
            set_refresh_cookies(response, new_refresh_token)

            return response, 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# TODO: logout user's account
@user_bp.route("/logout", methods=["GET"])
@jwt_required(locations=["cookies"])
def logout():
    try:
        user_id = get_jwt_identity()

        with engine.connect() as conn:
            # Clear the refresh token in the database
            conn.execute(text("UPDATE users SET refreshToken = NULL WHERE id = :id"), {"id": user_id})
            conn.commit()

        # Create response object and unset JWT cookies
        response = jsonify({"message": "Logged out successfully!"})
        unset_jwt_cookies(response)  # This will remove access and refresh tokens from cookies

        return response, 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# TODO: GET the specific user
@user_bp.route("/user/<id>",methods=["GET"])
def getUser(id):
    userId = id

    if not userId:
        return jsonify({"error":"User id not found!"})

    try:
      with engine.connect() as conn:
          result = conn.execute(text("SELECT * FROM users WHERE id = :userId"),{"userId":userId})

          userExists = result.fetchone()
          if not userExists:
              return jsonify({"error":"user does not exists!"}),400

          user = {
              "id":userExists.id,
              "userName":userExists.userName,
              "firstName":userExists.firstName,
              "lastName":userExists.lastName,
              "email":userExists.email,
          }
      return jsonify(user) , 200

    except Exception as e:
        return jsonify({ "error":str(e) }) , 500

# TODO: GET all users
@user_bp.route("/users",methods=["GET"])
def getUsers():
    try:
      with engine.connect() as conn:
          results = conn.execute(text("SELECT * FROM users")).mappings()
          users = [{
               "id":x["id"],
              "userName":x["userName"],
              "firstName":x["firstName"],
              "lastName":x["lastName"],
              "email":x["email"],
          } for x in results.fetchall()]
      return jsonify(users),200
    except Exception as e:
        return jsonify({"error":str(e)}),500

# TODO: DELETE specific user account
@user_bp.route("/user/<id>",methods=["DELETE"])
def deleteUser(id):
    userId = id
    try:
      with engine.connect() as conn:
          conn.execute(text("DELETE FROM users WHERE id = :id"),{"id":userId})
          conn.commit()
          return jsonify({"message":"User's account deleted successfully!"}),200
    except Exception as e:
          return jsonify({"error":str(e)}),500

# TODO: UPDATE user information
@user_bp.route("/user/<id>",methods=["POST"])
def updateUser(id):
    data = request.get_json()
    userName = data.get("userName")
    firstName = data.get("firstName")
    lastName = data.get("lastName")
    email = data.get("email")
    userId = id

    if not userId:
        return jsonify({"error":"UserId missing!"}),400

    if not userName or not firstName or not lastName or not email:
        return jsonify({"error": "Missing field!"}), 400


    try:
        with engine.connect() as conn:
            conn.execute(text(
                """
                UPDATE users SET
                userName = :userName,
                firstName = :firstName,
                lastName = :lastName,
                email = :email
                WHERE id = :userId
                """
            ),{
                "userName":data.get("userName"),
                "firstName":data.get("firstName"),
                "lastName":data.get("lastName"),
                "email":data.get("email"),
                "userId":userId
            })
            conn.commit()
            return jsonify({
                "message":"User updated successfully!"
            }),200
    except Exception as e:
        return jsonify({"error":str(e)}),500

# TODO: Search user via username / email / firstname / lastName

# TODO: follow / unfollow a user

# TODO: Change user's password

# TODO: Get all the follower

# TODO: add profile picture

# TODO: change profile picture

# TODO: add / update user's prefrerence

# TODO: ewan na

# TODO: update yung user's model to the latest (add followers, preference and more)
