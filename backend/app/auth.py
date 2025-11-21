import os
from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from . import models
from .database import get_db

# Load environment variables
load_dotenv()

# --- Configuration ---
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-very-secret-key-that-should-be-random-and-long")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24 hours

# --- Password Hashing ---
# Uses the bcrypt hashing scheme
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    """Checks if the plain password matches the hashed one."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Hashes the password using bcrypt."""
    return pwd_context.hash(password)

# --- JWT Token Management ---
def create_access_token(data: dict):
    """Creates a new JWT access token."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- Authentication Dependency ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    """
    Dependency function to retrieve the authenticated user from the JWT token.
    Raises HTTPException if the token is invalid or expired.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode the JWT
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Fetch the user from the database
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise credentials_exception
    
    return user