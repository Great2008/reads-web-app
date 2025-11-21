import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
from fastapi import HTTPException # Import HTTPException for runtime error reporting

load_dotenv()

# --- Aggressive DATABASE_URL Handling ---
DATABASE_URL_RAW = os.getenv("DATABASE_URL")
DATABASE_URL = None

if DATABASE_URL_RAW:
    # 1. Standardize scheme to 'postgresql://' as required by SQLAlchemy
    if DATABASE_URL_RAW.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL_RAW.replace("postgres://", "postgresql://", 1)
    elif DATABASE_URL_RAW.startswith("postgresql://"):
        DATABASE_URL = DATABASE_URL_RAW
    else:
        # Fallback for weirdly formatted URLs, though unlikely
        print(f"WARNING: DATABASE_URL has non-standard prefix: {DATABASE_URL_RAW}")
        DATABASE_URL = DATABASE_URL_RAW

# 2. Local Fallback for debugging (only runs if DB is not set in env)
if not DATABASE_URL:
    DATABASE_URL = "postgresql://postgres:password@localhost/reads_mvp"
    print("WARNING: Using local default database URL.")


# --- Vercel/Cloud Connection Arguments ---
# Cloud platforms require 'sslmode=require' for PostgreSQL (Supabase/Heroku)
connect_args = {}
if DATABASE_URL and DATABASE_URL.startswith("postgresql://"):
    # This is a safe addition for external PostgreSQL services
    if 'VERCEL' in os.environ or DATABASE_URL_RAW is not None: 
         connect_args["sslmode"] = "require"
         print("Using SSL Mode: require for PostgreSQL connection.")


# Pass the connect_args to the engine initialization
engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args, # CRITICAL FOR CLOUD SSL
    pool_recycle=3600 # Helps manage dropped connections
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        # PING the DB connection right here to test it early
        # This will be the line that crashes if the DB config is wrong
        db.connection() 
        yield db
    except Exception as e:
        # Log the error to the Vercel Function logs
        print(f"FATAL: Database connection error during runtime: {e}")
        # Raise an explicit 500 so we can track the message if we get lucky
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server Error: Database connection failed. See Vercel logs for full error."
        )
    finally:
        db.close()