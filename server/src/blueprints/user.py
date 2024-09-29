from flask import Blueprint, jsonify, request
from flask_jwt_extended import (  jwt_required, get_jwt_identity,)
from sqlalchemy.exc import IntegrityError
from flask_bcrypt import Bcrypt
from sqlalchemy import text
import uuid
from utils.database import engine
import jwt

user_bp = Blueprint("user", __name__)
bcrypt = Bcrypt()


# TODO: GET the specific user
@user_bp.route("/user",methods=["GET"])
@jwt_required()
def getUser():
    current_user_id = get_jwt_identity()
    print(current_user_id)
    if not current_user_id:
        print("TOKEN IS MISSING")
        return jsonify({"error":"Token is missing"}),401
    try:
          with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM users WHERE id = :userId"), {"userId": current_user_id})
            userExists = result.fetchone()
            if not userExists:
                return jsonify({"error": "User does not exist!"}), 400

            user = {
                "id": userExists.id,
                "userName": userExists.userName,
                "firstName": userExists.firstName,
                "lastName": userExists.lastName,
                "email": userExists.email,
            }

          return jsonify(user), 200

    except jwt.ExpiredSignatureError:
        print("Token has expired")
        return jsonify({"error": "Token has expired!"}), 401
    except jwt.InvalidTokenError:
        print("Invalid Token")
        return jsonify({"error": "Invalid token!"}), 401
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

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

    print(data)
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

# TODO: Change user's password
@user_bp.route("/user/password/<id>",methods=["POST"])
def changePassword(id):
    data = request.get_json()
    currentPassword = data.get("currentPassword")
    newPassword = data.get("newPassword")
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT * FROM users WHERE id = :id"),{
                "id":id
            })

            user_exists = result.fetchone()
            if user_exists is None:
                return jsonify({"error":"User not found!"}), 400

            user = {
                "id": user_exists.id,
                "userName":user_exists.userName,
                "firstName": user_exists.firstName,
                "lastName": user_exists.lastName,
                "email": user_exists.email,
                "password": user_exists.password
            }

            valid_password  = bcrypt.check_password_hash(user["password"],currentPassword)
            hashPass = bcrypt.generate_password_hash(newPassword).decode('utf-8')
            if not valid_password:
                return jsonify({"error": "Password incorrect!"}), 400

            conn.execute(text("UPDATE users SET password = :newPassword WHERE id = :id"),{
                "newPassword":hashPass,
                "id":user["id"]
            })
            conn.commit()
            return jsonify({"message":"User's password updated successfully!"})
    except Exception as e:
        return jsonify({"error":str(e)}),500


# TODO: Search user via username / email / firstname / lastName

# TODO: follow / unfollow a user

# TODO: Get all the follower

# TODO: add profile picture

# TODO: change profile picture

# TODO: add / update user's prefrerence

# TODO: ewan na

# TODO: update yung user's model to the latest (add followers, preference and more)
