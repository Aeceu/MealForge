import os
import jwt
import uuid
import boto3
from sqlalchemy import text
from flask_bcrypt import Bcrypt
from utils.database import engine
from sqlalchemy.exc import IntegrityError
from flask import Blueprint, jsonify, request
from flask_jwt_extended import (  jwt_required, get_jwt_identity,)

user_bp = Blueprint("user", __name__)
bcrypt = Bcrypt()

s3 = boto3.client(
    "s3",
    aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name = "ap-southeast-2"
);

BUCKET_NAME = "mealforgebucket"


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

# TODO: Add/Change Profile Picture
@user_bp.route("/user/profile-picture", methods=["POST"])
@jwt_required()
def upload_profile_picture():
    current_user_id = get_jwt_identity()
    file = request.files.get('profile_picture')

    if not file:
        return jsonify({"error": "No file provided"}), 400

    # Generate a unique filename for the new image
    file_extension = file.filename.split('.')[-1]
    file_name = f"{current_user_id}_{uuid.uuid4()}.{file_extension}"

    try:
        # Start a transaction
        with engine.connect() as conn:
            # First, fetch the current profile picture URL
            result = conn.execute(text(
                """
                SELECT profile_picture_url FROM users WHERE id = :userId
                """), {"userId": current_user_id})
            user_data = result.fetchone()

            # If there's an old profile picture, delete it from S3
            if user_data and user_data.profile_picture_url:
                old_file_name = user_data.profile_picture_url.split("/")[-1]
                try:
                    s3.delete_object(Bucket=BUCKET_NAME, Key=old_file_name)
                except Exception as delete_error:
                    return jsonify({"error": f"Could not delete old profile picture: {str(delete_error)}"}), 500

            # Upload the new file to S3
            s3.upload_fileobj(
                file,
                BUCKET_NAME,
                file_name,
                ExtraArgs={"ContentType": file.content_type}
            )

            # Create the S3 file URL
            file_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{file_name}"

            # Update the user's profile picture in the database
            conn.execute(text(
                """
                UPDATE users SET profile_picture_url = :profile_picture_url WHERE id = :userId
                """
            ), {
                "profile_picture_url": file_url,
                "userId": current_user_id
            })

            # Commit the transaction
            conn.commit()

        return jsonify({"message": "Profile picture updated!", "profile_picture_url": file_url}), 200

    except Exception as e:
        # Rollback if there was an error
        return jsonify({"error": str(e)}), 500

# TODO: Search user via username / email / firstname / lastName

# TODO: follow / unfollow a user

# TODO: Get all the follower


# TODO: change profile picture

# TODO: add / update user's prefrerence

# TODO: ewan na

# TODO: update yung user's model to the latest (add followers, preference and more)
