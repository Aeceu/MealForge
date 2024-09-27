import uuid
from sqlalchemy import Column, String, Text, ForeignKey, Integer, Table, func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from utils.GUID import GUID

Base = declarative_base()

recipe_ingredients_table = Table(
    'recipe_ingredients',
    Base.metadata,
    Column('recipe_id', GUID(), ForeignKey('recipes.id'), primary_key=True),
    Column('ingredient_id', GUID(), ForeignKey('ingredients.id'), primary_key=True)
)

# User Model
class User(Base):
    __tablename__ = 'users'

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    userName = Column(String(250), unique=True, nullable=False)
    firstName = Column(String(250), nullable=False)
    lastName = Column(String(250), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password = Column(String(250), nullable=False)
    refreshToken = Column(Text, nullable=True)

    recipes = relationship('Recipe', back_populates='user', cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(firstName={self.firstName}, lastName={self.lastName}, email={self.email})>"

class Ingredient(Base):
    __tablename__ = 'ingredients'

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = Column(String(250), nullable=False)
    measurements = Column(String(100), nullable=False)
    expirationDate = Column(String(20), nullable=True)
    date_added = Column(String(20), nullable=False, default=func.current_date())

    user_id = Column(GUID(), ForeignKey('users.id'), nullable=False)
    user = relationship("User", backref="ingredients")

    def __repr__(self):
        return f"<Ingredient(name={self.name}, measurements={self.measurements})>"


class Recipe(Base):
    __tablename__ = 'recipes'

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = Column(String(250), nullable=False)
    instruction = Column(Text, nullable=False)
    type_of_cuisine = Column(String(250), nullable=False)
    nutrient_counts = Column(Text, nullable=False)
    serve_hot_or_cold = Column(String(50), nullable=False)
    cooking_time = Column(Integer, nullable=False)
    benefits = Column(Text, nullable=True)
    serve_for = Column(Integer, nullable=False)

    user_id = Column(GUID(), ForeignKey('users.id'), nullable=False)
    user = relationship('User', back_populates='recipes')

    ingredients = relationship('Ingredient', secondary=recipe_ingredients_table, backref='recipes')

    def __repr__(self):
        return f"<Recipe(name={self.name}, type_of_cuisine={self.type_of_cuisine}, serve_for={self.serve_for})>"
