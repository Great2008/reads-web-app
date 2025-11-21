from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import List, Optional, Dict, Any
from uuid import UUID

# --- Authentication Schemas (3.1) ---

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class ResetPasswordRequest(BaseModel):
    email: EmailStr

# --- Lessons Schemas (3.3) ---

class LessonBase(BaseModel):
    category: str
    title: str
    order_index: int

class LessonContent(LessonBase):
    id: UUID
    content: str
    video_url: Optional[str] = None
    
    class Config:
        from_attributes = True

class CategoryResponse(BaseModel):
    category: str
    lesson_count: int

class LessonCompleteResponse(BaseModel):
    message: str = "Lesson marked as completed."
    progress_id: UUID

# --- Quiz Schemas (3.4) ---

class QuizQuestionOption(BaseModel):
    key: str # e.g., "A", "B", "C", "D"
    text: str

class QuizQuestionResponse(BaseModel):
    id: UUID
    question: str
    options: List[Dict[str, str]] # List of {"key": "A", "text": "..."}

    class Config:
        from_attributes = True

class SubmittedAnswer(BaseModel):
    question_id: UUID
    selected: str # The selected option key, e.g., "A"

class QuizSubmission(BaseModel):
    lesson_id: UUID
    answers: List[SubmittedAnswer]

class QuizResultResponse(BaseModel):
    score: int = Field(..., ge=0, le=100)
    correct: int
    wrong: int
    tokens_awarded: int
    message: str

# --- Dashboard & Rewards Schemas (3.2 & 3.5) ---

class UserStats(BaseModel):
    lessons_completed: int
    quizzes_taken: int
    
class WalletBalance(BaseModel):
    token_balance: int

class RewardHistoryItem(BaseModel):
    id: UUID
    lesson_id: UUID
    tokens_earned: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class RewardSummary(BaseModel):
    total_tokens_earned: int