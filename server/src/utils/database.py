import os
from sqlalchemy import create_engine
from dotenv import load_dotenv
from models.models import Base

load_dotenv()

DATABASE_URI = os.getenv("DATABASE_URI")
if not DATABASE_URI:
    raise ValueError("DATABASE_URI environment variable is not set")

engine = create_engine(DATABASE_URI)
Base.metadata.create_all(engine)
