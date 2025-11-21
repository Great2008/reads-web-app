from datetime import datetime
from uuid import uuid4

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.sql import func

from .database import Base

# Utility function for default UUID generation
def generate_uuid():
    return str(uuid4())

class User(Base):
    __tablename__ = "users"
    
    # 2.1. Users Table
    id = Column(UUID(as_uuid=False), primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    wallet = relationship("Wallet", back_populates="user", uselist=False)
    progress = relationship("LessonProgress", back_populates="user")
    quiz_results = relationship("QuizResult", back_populates="user")
    rewards = relationship("Reward", back_populates="user")

class Lesson(Base):
    __tablename__ = "lessons"
    
    # 2.2. Lessons Table
    id = Column(UUID(as_uuid=False), primary_key=True, default=generate_uuid)
    category = Column(String, index=True, nullable=False) # JAMB, WAEC, SAT, etc.
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    video_url = Column(String, nullable=True)
    order_index = Column(Integer, nullable=False)
    
    # Relationships
    questions = relationship("QuizQuestion", back_populates="lesson")
    
class LessonProgress(Base):
    __tablename__ = "lesson_progress"
    
    # 2.3. LessonProgress Table
    id = Column(UUID(as_uuid=False), primary_key=True, default=generate_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    lesson_id = Column(UUID(as_uuid=False), ForeignKey("lessons.id"), nullable=False)
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True) # Set only when completed is True
    
    # Relationships
    user = relationship("User", back_populates="progress")
    
class QuizQuestion(Base):
    __tablename__ = "quiz_questions"
    
    # 2.4. QuizQuestions Table
    id = Column(UUID(as_uuid=False), primary_key=True, default=generate_uuid)
    lesson_id = Column(UUID(as_uuid=False), ForeignKey("lessons.id"), nullable=False)
    question = Column(Text, nullable=False)
    # Storing options as a JSON array ["A: text", "B: text", ...]
    options = Column(JSON, nullable=False) 
    correct_option = Column(String, nullable=False) # e.g., "A"
    
    # Relationships
    lesson = relationship("Lesson", back_populates="questions")

class QuizResult(Base):
    __tablename__ = "quiz_results"
    
    # 2.5. QuizResults Table
    id = Column(UUID(as_uuid=False), primary_key=True, default=generate_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    lesson_id = Column(UUID(as_uuid=False), ForeignKey("lessons.id"), nullable=False)
    score = Column(Integer, nullable=False) # 0-100
    correct_count = Column(Integer, nullable=False)
    wrong_count = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="quiz_results")

class Reward(Base):
    __tablename__ = "rewards"
    
    # 2.6. Rewards Table
    id = Column(UUID(as_uuid=False), primary_key=True, default=generate_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    lesson_id = Column(UUID(as_uuid=False), ForeignKey("lessons.id"), nullable=False)
    tokens_earned = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="rewards")

class Wallet(Base):
    __tablename__ = "wallets"
    
    # 2.7. Wallet Table
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), primary_key=True) # PK is user_id
    token_balance = Column(Integer, default=0, nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="wallet")