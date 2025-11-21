from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Annotated, Dict, Any
from uuid import UUID
from datetime import datetime

from . import schemas, models, auth
from .database import get_db, engine, Base

# Create all database tables (for development/MVP, use Alembic for production)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="$READS Learn-to-Earn MVP Backend",
    description="Core API for User Authentication, Lessons, Quizzes, and Token Rewards."
)

# --- CORS Configuration ---
# Allow all origins for the frontend MVP
origins = ["*"] 
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routers ---
auth_router = APIRouter(prefix="/auth", tags=["Authentication"])
user_router = APIRouter(prefix="/user", tags=["Dashboard"], dependencies=[Depends(auth.get_current_user)])
lesson_router = APIRouter(prefix="/lessons", tags=["Lessons"], dependencies=[Depends(auth.get_current_user)])
quiz_router = APIRouter(prefix="/quiz", tags=["Quiz"], dependencies=[Depends(auth.get_current_user)])
rewards_router = APIRouter(prefix="/rewards", tags=["Rewards"], dependencies=[Depends(auth.get_current_user)])


# --- 3.1. Authentication Endpoints ---

@auth_router.post("/signup", response_model=schemas.Token)
def signup(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    # Hash password
    hashed_password = auth.get_password_hash(user_in.password)
    
    # Create User
    db_user = models.User(
        name=user_in.name,
        email=user_in.email,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.flush() # Flush to get the user ID for wallet creation

    # Create Wallet (2.7)
    db_wallet = models.Wallet(
        user_id=db_user.id,
        token_balance=0 # Start with 0 balance
    )
    db.add(db_wallet)
    db.commit()
    db.refresh(db_user)

    # Return JWT token
    access_token = auth.create_access_token(data={"sub": db_user.id})
    return {"access_token": access_token, "token_type": "bearer"}

@auth_router.post("/login", response_model=schemas.Token)
def login_for_access_token(form_data: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == form_data.email).first()
    
    if not db_user or not auth.verify_password(form_data.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth.create_access_token(data={"sub": db_user.id})
    return {"access_token": access_token, "token_type": "bearer"}

@auth_router.post("/reset")
def reset_password(req: schemas.ResetPasswordRequest):
    # MVP: Placeholder for reset password logic
    print(f"Password reset requested for: {req.email}. (No action taken in MVP)")
    return {"message": "If the email is registered, a reset link has been sent (MVP placeholder)."}

# --- 3.2. Dashboard Endpoints ---

@user_router.get("/profile", response_model=schemas.UserResponse)
def get_user_profile(current_user: Annotated[models.User, Depends(auth.get_current_user)]):
    return current_user

@user_router.get("/stats", response_model=schemas.UserStats)
def get_user_stats(current_user: Annotated[models.User, Depends(auth.get_current_user)], db: Session = Depends(get_db)):
    user_id = current_user.id
    
    lessons_completed = db.query(models.LessonProgress).filter(
        models.LessonProgress.user_id == user_id, 
        models.LessonProgress.completed == True
    ).count()
    
    quizzes_taken = db.query(models.QuizResult).filter(models.QuizResult.user_id == user_id).count()
    
    return schemas.UserStats(
        lessons_completed=lessons_completed,
        quizzes_taken=quizzes_taken
    )

@user_router.get("/wallet/balance", response_model=schemas.WalletBalance)
def get_wallet_balance(current_user: Annotated[models.User, Depends(auth.get_current_user)]):
    if not current_user.wallet:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wallet not found")
    return schemas.WalletBalance(token_balance=current_user.wallet.token_balance)

# --- 3.3. Lessons APIs ---

@lesson_router.get("/categories", response_model=List[schemas.CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    categories = db.query(
        models.Lesson.category, 
        func.count(models.Lesson.id).label('lesson_count')
    ).group_by(models.Lesson.category).all()
    
    return [schemas.CategoryResponse(category=c, lesson_count=count) for c, count in categories]

@lesson_router.get("/category/{category}", response_model=List[schemas.LessonBase])
def lessons_in_category(category: str, db: Session = Depends(get_db)):
    lessons = db.query(models.Lesson).filter(models.Lesson.category == category).order_by(models.Lesson.order_index).all()
    return lessons

@lesson_router.get("/lesson/{lesson_id}", response_model=schemas.LessonContent)
def retrieve_lesson(lesson_id: UUID, db: Session = Depends(get_db)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == str(lesson_id)).first()
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")
    return lesson

@lesson_router.post("/lesson/{lesson_id}/complete", response_model=schemas.LessonCompleteResponse)
def mark_lesson_complete(lesson_id: UUID, current_user: Annotated[models.User, Depends(auth.get_current_user)], db: Session = Depends(get_db)):
    user_id = current_user.id
    lesson_id_str = str(lesson_id)
    
    # Check if lesson exists
    if not db.query(models.Lesson).filter(models.Lesson.id == lesson_id_str).first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")

    # 4.1. Lesson Completion Logic
    db_progress = db.query(models.LessonProgress).filter(
        models.LessonProgress.user_id == user_id, 
        models.LessonProgress.lesson_id == lesson_id_str
    ).first()
    
    if db_progress:
        # If progress exists but is not completed, update it
        if not db_progress.completed:
            db_progress.completed = True
            db_progress.completed_at = datetime.now()
            db.commit()
            return schemas.LessonCompleteResponse(message="Lesson completion updated.", progress_id=db_progress.id)
        else:
            # Already completed
            return schemas.LessonCompleteResponse(message="Lesson already completed.", progress_id=db_progress.id)
    else:
        # If progress does not exist, create it
        new_progress = models.LessonProgress(
            user_id=user_id,
            lesson_id=lesson_id_str,
            completed=True,
            completed_at=datetime.now()
        )
        db.add(new_progress)
        db.commit()
        db.refresh(new_progress)
        return schemas.LessonCompleteResponse(message="Lesson marked as completed.", progress_id=new_progress.id)

# --- 3.4. Quiz APIs ---

@quiz_router.get("/start/{lesson_id}", response_model=List[schemas.QuizQuestionResponse])
def start_quiz(lesson_id: UUID, db: Session = Depends(get_db)):
    questions = db.query(models.QuizQuestion).filter(models.QuizQuestion.lesson_id == str(lesson_id)).all()
    
    if not questions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No quiz questions found for this lesson.")
        
    return questions

@quiz_router.post("/submit", response_model=schemas.QuizResultResponse)
def submit_quiz(submission: schemas.QuizSubmission, current_user: Annotated[models.User, Depends(auth.get_current_user)], db: Session = Depends(get_db)):
    user_id = current_user.id
    lesson_id_str = str(submission.lesson_id)
    
    # 4.2. Quiz Submission Logic Step 1 & 2: Fetch questions and compare answers
    submitted_answers_map = {str(a.question_id): a.selected for a in submission.answers}
    
    db_questions = db.query(models.QuizQuestion).filter(
        models.QuizQuestion.lesson_id == lesson_id_str,
        models.QuizQuestion.id.in_(submitted_answers_map.keys())
    ).all()
    
    if not db_questions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson or questions not found.")

    correct_count = 0
    total_questions = len(db_questions)
    
    for question in db_questions:
        selected_answer = submitted_answers_map.get(question.id)
        if selected_answer and selected_answer == question.correct_option:
            correct_count += 1
            
    wrong_count = total_questions - correct_count
    
    # 4.3. Reward Calculation
    if total_questions == 0:
        score = 0
    else:
        # Score (percentage)
        score = int((correct_count / total_questions) * 100)
    
    # MVP formula: tokens = correct_answers * 2
    tokens_awarded = correct_count * 2 
    
    # 4.2. Quiz Submission Logic Step 5, 6, 7: Insert results, rewards, and update wallet

    # 5. Insert into QuizResults
    db_result = models.QuizResult(
        user_id=user_id,
        lesson_id=lesson_id_str,
        score=score,
        correct_count=correct_count,
        wrong_count=wrong_count
    )
    db.add(db_result)
    
    # 6. Insert into Rewards (only if tokens were earned)
    if tokens_awarded > 0:
        db_reward = models.Reward(
            user_id=user_id,
            lesson_id=lesson_id_str,
            tokens_earned=tokens_awarded
        )
        db.add(db_reward)
    
    # 7. Update Wallet token balance
    # Use existing current_user.wallet relationship (fetched in auth dependency)
    current_user.wallet.token_balance += tokens_awarded
    
    db.commit()

    return schemas.QuizResultResponse(
        score=score,
        correct=correct_count,
        wrong=wrong_count,
        tokens_awarded=tokens_awarded,
        message="Quiz submitted successfully and rewards calculated."
    )

# --- 3.5. Rewards APIs ---

@rewards_router.get("/history", response_model=List[schemas.RewardHistoryItem])
def get_rewards_history(current_user: Annotated[models.User, Depends(auth.get_current_user)], db: Session = Depends(get_db)):
    history = db.query(models.Reward).filter(models.Reward.user_id == current_user.id).order_by(models.Reward.created_at.desc()).all()
    return history

@rewards_router.get("/summary", response_model=schemas.RewardSummary)
def get_rewards_summary(current_user: Annotated[models.User, Depends(auth.get_current_user)], db: Session = Depends(get_db)):
    # Calculate total tokens earned from the Rewards table
    total_earned = db.query(func.sum(models.Reward.tokens_earned)).filter(models.Reward.user_id == current_user.id).scalar()
    
    return schemas.RewardSummary(total_tokens_earned=total_earned or 0)

# --- Include all routers in the main app ---
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(lesson_router)
app.include_router(quiz_router)
app.include_router(rewards_router)

@app.get("/", tags=["Health"])
def read_root():
    return {"message": "Welcome to the $READS Backend MVP. Read the docs at /docs."}