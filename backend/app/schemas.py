from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any
from uuid import UUID
from datetime import datetime

# --- Auth Schemas ---
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[str] = None

# --- User & Wallet Schemas ---
class UserProfile(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    created_at: datetime

class WalletBalance(BaseModel):
    token_balance: int

class UserStats(BaseModel):
    lessons_completed: int
    quizzes_taken: int

# --- Lesson Schemas ---
class LessonBase(BaseModel):
    id: UUID
    category: str
    title: str
    order_index: int

class LessonDetail(LessonBase):
    content: str
    video_url: Optional[str] = None

class CategoryResponse(BaseModel):
    category: str
    count: int

# --- Quiz Schemas ---
class QuizQuestionResponse(BaseModel):
    id: UUID
    question: str
    options: List[str] # e.g. ["Option A", "Option B"]

class AnswerSubmission(BaseModel):
    question_id: UUID
    selected: str # "A", "B", etc.

class QuizSubmitRequest(BaseModel):
    lesson_id: UUID
    answers: List[AnswerSubmission]

class QuizResultResponse(BaseModel):
    score: int
    correct: int
    wrong: int
    tokens_awarded: int

# --- Reward Schemas ---
class RewardHistory(BaseModel):
    id: UUID
    lesson_id: UUID
    tokens_earned: int
    created_at: datetime

class RewardSummary(BaseModel):
    total_earned: int