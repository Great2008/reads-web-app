import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configuration
# It's highly recommended to set this in your environment or a secure config file
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/reads_mvp")

# 1. Create the SQLAlchemy Engine
# The pool_pre_ping=True helps maintain connection health
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    pool_pre_ping=True
)

# 2. Create a configured "Session" class
# expire_on_commit=False prevents objects from expiring after commit, making them usable outside the session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 3. Base class for ORM models
Base = declarative_base()

# Dependency to get the database session
def get_db():
    """
    Dependency that yields a database session and ensures it's closed afterward.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Note: For production use, ensure your PostgreSQL server has the uuid-ossp extension enabled 
# (CREATE EXTENSION IF NOT EXISTS "uuid-ossp";) for native UUID generation.