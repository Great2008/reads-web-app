import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
from fastapi import HTTPException 

load_dotenv()

# --- Aggressive DATABASE_URL Handling ---
DATABASE_URL_RAW = os.getenv("DATABASE_URL")
DATABASE_URL = None

if DATABASE_URL_RAW:
    # 1. Standardize scheme to 'postgresql://' as required by SQLAlchemy
    # CRITICAL: We also replace 'postgres://' with 'postgresql://' if found
    DATABASE_URL = DATABASE_URL_RAW.replace("postgres://", "postgresql://", 1)
    
    # We are reverting to the hostname URL, as static IPs are failing with timeout.
    # The hope is that simplifying the connection arguments helps Vercel resolve the hostname better.
else:
    # Local Fallback for debugging (only runs if DB is not set in env)
    DATABASE_URL = "postgresql://postgres:password@localhost/reads_mvp"
    print("WARNING: Using local default database URL.")


# --- Vercel/Cloud Connection Arguments ---
# We REMOVE the explicit connect_args={"sslmode": "require"} to simplify connection attempt.
connect_args = {}


# Pass the connect_args (now empty) to the engine initialization
engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args, 
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
        # Log the error to the Vercel Function logs
        print(f"FATAL: Database connection error during runtime: {e}")
        # Raise an explicit 500 so we can track the message if we get lucky
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server Error: Database connection failed. See Vercel logs for full error."
        )
    finally:
        db.close()