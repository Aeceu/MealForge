import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from blueprints.auth import auth_bp
from blueprints.user import user_bp
from blueprints.ingredients import ingredients_bp
from blueprints.recipe import recipes_bp

load_dotenv()
app = Flask(__name__)
jwt = JWTManager(app)

# CORS Configuration
CORS(app, supports_credentials=True,origin="exp://192.168.0.101:8081")

# Configuration
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config['JWT_TOKEN_LOCATION'] = ['headers', 'cookies']
app.config['JWT_COOKIE_SECURE'] = False  # Only send cookies over HTTPS
app.config['JWT_COOKIE_SAMESITE'] = 'None'
app.config['JWT_COOKIE_CSRF_PROTECT'] = True

app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(recipes_bp)
app.register_blueprint(ingredients_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4200, debug=True)
