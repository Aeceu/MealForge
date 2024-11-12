import uuid

from sqlalchemy import Column, ForeignKey, Integer, String, Text, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from utils.GUID import GUID

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    userName = Column(String(250), unique=True, nullable=False)
    firstName = Column(String(250), nullable=False)
    lastName = Column(String(250), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password = Column(String(250), nullable=False)
    refreshToken = Column(Text, nullable=True)
    profile_picture_url = Column(String(500), nullable=True)
    allergies = Column(Text, nullable=True)

    recipes = relationship('Recipe', back_populates='user', cascade="all, delete-orphan")
    recipe_posts = relationship('RecipePost', back_populates='user', cascade="all, delete-orphan")
    likes = relationship('Like', back_populates='user', cascade="all, delete-orphan")
    dislikes = relationship('Dislike', back_populates='user', cascade="all, delete-orphan")
    bookmarks = relationship('Bookmark', back_populates='user', cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(firstName={self.firstName}, lastName={self.lastName}, email={self.email})>"

class Recipe(Base):
    __tablename__ = 'recipes'

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = Column(String(250), nullable=False)
    ingredients = Column(Text, nullable=False)
    instruction = Column(Text, nullable=False)
    type_of_cuisine = Column(String(250), nullable=False)
    nutrient_counts = Column(Text, nullable=False)
    serve_hot_or_cold = Column(String(50), nullable=False)
    cooking_time = Column(Integer, nullable=False)
    benefits = Column(Text, nullable=True)
    serve_for = Column(Integer, nullable=False)

    user_id = Column(GUID(), ForeignKey('users.id'), nullable=False)
    user = relationship('User', back_populates='recipes')

    recipe_posts = relationship('RecipePost', back_populates='recipe', cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Recipe(name={self.name}, type_of_cuisine={self.type_of_cuisine}, serve_for={self.serve_for})>"

class RecipePost(Base):
    __tablename__ = 'recipe_posts'

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID(), ForeignKey('users.id'), nullable=False)
    recipe_id = Column(GUID(), ForeignKey('recipes.id'), nullable=False)
    posted_at = Column(String(20), nullable=False, default=func.current_date())
    recipe_post_image  = Column(String(500), nullable=True)
    # Relationships
    user = relationship("User", back_populates="recipe_posts")
    recipe = relationship("Recipe", back_populates="recipe_posts")
    likes = relationship("Like", back_populates="recipe_post", cascade="all, delete-orphan")
    dislikes = relationship("Dislike", back_populates="recipe_post", cascade="all, delete-orphan")
    bookmarks = relationship("Bookmark", back_populates="recipe_post", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<RecipePost(user_id={self.user_id}, recipe_id={self.recipe_id}, posted_at={self.posted_at})>"

class Like(Base):
    __tablename__ = 'likes'

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID(), ForeignKey('users.id'), nullable=False)
    post_id = Column(GUID(), ForeignKey('recipe_posts.id'), nullable=False)
    liked_at = Column(String(20), nullable=False, default=func.current_date())

    # Relationships
    user = relationship("User", back_populates="likes")
    recipe_post = relationship("RecipePost", back_populates="likes")

    def __repr__(self):
        return f"<Like(user_id={self.user_id}, post_id={self.post_id}, liked_at={self.liked_at})>"

class Dislike(Base):
    __tablename__ = 'dislikes'

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID(), ForeignKey('users.id'), nullable=False)
    post_id = Column(GUID(), ForeignKey('recipe_posts.id'), nullable=False)
    disliked_at = Column(String(20), nullable=False, default=func.current_date())

    # Relationships
    user = relationship("User", back_populates="dislikes")
    recipe_post = relationship("RecipePost", back_populates="dislikes")

    def __repr__(self):
        return f"<Dislike(user_id={self.user_id}, post_id={self.post_id}, disliked_at={self.disliked_at})>"

class Bookmark(Base):
    __tablename__ = 'bookmarks'

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID(), ForeignKey('users.id'), nullable=False)
    post_id = Column(GUID(), ForeignKey('recipe_posts.id'), nullable=False)
    bookmarked_at = Column(String(20), nullable=False, default=func.current_date())

    # Relationships
    user = relationship("User", back_populates="bookmarks")
    recipe_post = relationship("RecipePost", back_populates="bookmarks")

    def __repr__(self):
        return f"<Bookmark(user_id={self.user_id}, post_id={self.post_id}, bookmarked_at={self.bookmarked_at})>"
