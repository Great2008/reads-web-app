import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "")

# --- FIX 1: Ensure URL starts with postgresql:// and fix connect_args ---

if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    # SQLAlchemy requires postgresql://
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Vercel/Cloud platforms often require "sslmode=require" and prevent use of connection pooling
# The connect_args dictionary is passed directly to the database driver.
connect_args = {}
if DATABASE_URL.startswith("postgresql://"):
    connect_args["sslmode"] = "require"


# Fallback for local testing if env var is missing
if not DATABASE_URL:
    DATABASE_URL = "postgresql://postgres:password@localhost/reads_mvp"
    # Don't add SSL for local fallback
    connect_args = {}


# Pass the connect_args to the engine initialization
engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args, # <- THIS IS THE CRITICAL CHANGE
    pool_recycle=3600 # Helps manage dropped connections
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        # PING the DB connection right here to test it early
        db.connection() 
        yield db
    except Exception as e:
        # If connection fails here, we will see the error in Vercel logs
        print(f"Database connection error: {e}")
        # Re-raise the exception so the app doesn't proceed
        raise
    finally:
        db.close()