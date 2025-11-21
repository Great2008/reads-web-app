from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime
import uuid
import os

# --- CRITICAL FIX: Use relative imports for Vercel runtime environment ---
from .app import models, schemas, auth, database


# Initialize DB - WRAP THIS IN A TRY/EXCEPT BLOCK
print("Attempting to create database tables...")
try:
    # This might fail due to permissions or connection issues. If it fails, 
    # the server still starts, but endpoints that use `get_db` will crash (and log the error).
    models.Base.metadata.create_all(bind=database.engine)
    print("Database tables initialized successfully (or already exist).")
except Exception as e:
    print(f"WARNING: Initial database table creation failed. This is likely a connection or permission issue. Error: {e}")


# --- Ensure the root_path is set for Vercel routing ---
app = FastAPI(title="$READS Backend", root_path="/api")
print("FastAPI app initialized with root_path=/api")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- 3.1 Authentication ---

@app.post("/auth/signup", response_model=schemas.Token)
def signup(user_in: schemas.UserCreate, db: Session = Depends(database.get_db)):
    print(f"Attempting signup for: {user_in.email}")
    # 1. Check email
    if db.query(models.User).filter(models.User.email == user_in.email).first():
        print("Email already registered (400)")
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # 2. Create User
    hashed_pw = auth.get_password_hash(user_in.password)
    new_user = models.User(
        name=user_in.name,
        email=user_in.email,
        password_hash=hashed_pw
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 3. Create Wallet (Balance 0)
    new_wallet = models.Wallet(user_id=new_user.id, token_balance=0)
    db.add(new_wallet)
    db.commit()

    # 4. Return Token
    access_token = auth.create_access_token(data={"sub": str(new_user.id)})
    print("User created and token returned (200)")
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/login", response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    if not user or not auth.verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(status_code=403, detail="Invalid credentials")
    
    access_token = auth.create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

# --- 3.2 Dashboard ---

@app.get("/user/profile", response_model=schemas.UserProfile)
def get_profile(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.get("/user/stats", response_model=schemas.UserStats)
def get_stats(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    completed_lessons = db.query(models.LessonProgress).filter(
        models.LessonProgress.user_id == current_user.id,
        models.LessonProgress.completed == True
    ).count()
    
    quizzes_taken = db.query(models.QuizResult).filter(models.QuizResult.user_id == current_user.id).count()
    
    return {"lessons_completed": completed_lessons, "quizzes_taken": quizzes_taken}

@app.get("/wallet/balance", response_model=schemas.WalletBalance)
def get_balance(current_user: models.User = Depends(auth.get_current_user)):
    return {"token_balance": current_user.wallet.token_balance}

# --- 3.3 Lessons ---

@app.get("/lessons/categories")
def get_categories(db: Session = Depends(database.get_db)):
    results = db.query(models.Lesson.category, func.count(models.Lesson.id)).group_by(models.Lesson.category).all()
    return [{"category": r[0], "count": r[1]} for r in results]

@app.get("/lessons/category/{category}", response_model=List[schemas.LessonBase])
def get_lessons_by_category(category: str, db: Session = Depends(database.get_db)):
    return db.query(models.Lesson).filter(models.Lesson.category == category).all()

@app.get("/lesson/{lesson_id}", response_model=schemas.LessonDetail)
def get_lesson_detail(lesson_id: uuid.UUID, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson

@app.post("/lesson/{lesson_id}/complete")
def complete_lesson(lesson_id: uuid.UUID, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    progress = db.query(models.LessonProgress).filter(
        models.LessonProgress.user_id == current_user.id,
        models.LessonProgress.lesson_id == lesson_id
    ).first()

    if not progress:
        progress = models.LessonProgress(user_id=current_user.id, lesson_id=lesson_id, completed=True, completed_at=datetime.now())
        db.add(progress)
    else:
        progress.completed = True
        progress.completed_at = datetime.now()
    
    db.commit()
    return {"status": "success"}

# --- 3.4 Quiz ---

@app.get("/quiz/start/{lesson_id}", response_model=List[schemas.QuizQuestionResponse])
def start_quiz(lesson_id: uuid.UUID, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    questions = db.query(models.QuizQuestion).filter(models.QuizQuestion.lesson_id == lesson_id).all()
    return questions

@app.post("/quiz/submit", response_model=schemas.QuizResultResponse)
def submit_quiz(submission: schemas.QuizSubmitRequest, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    questions = db.query(models.QuizQuestion).filter(models.QuizQuestion.lesson_id == submission.lesson_id).all()
    if not questions:
        raise HTTPException(status_code=404, detail="Quiz not found")

    correct_count = 0
    question_map = {q.id: q.correct_option for q in questions}

    for ans in submission.answers:
        if ans.question_id in question_map and question_map[ans.question_id] == ans.selected:
            correct_count += 1
            
    wrong_count = len(questions) - correct_count
    score = int((correct_count / len(questions)) * 100)

    tokens_awarded = correct_count * 2

    result = models.QuizResult(
        user_id=current_user.id,
        lesson_id=submission.lesson_id,
        score=score,
        correct_count=correct_count,
        wrong_count=wrong_count
    )
    db.add(result)

    if tokens_awarded > 0:
        reward = models.Reward(
            user_id=current_user.id,
            lesson_id=submission.lesson_id,
            tokens_earned=tokens_awarded
        )
        db.add(reward)
        current_user.wallet.token_balance += tokens_awarded
    
    db.commit()

    return {
        "score": score,
        "correct": correct_count,
        "wrong": wrong_count,
        "tokens_awarded": tokens_awarded
    }

# --- 3.5 Rewards ---

@app.get("/rewards/history", response_model=List[schemas.RewardHistory])
def reward_history(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Reward).filter(models.Reward.user_id == current_user.id).all()

@app.get("/rewards/summary", response_model=schemas.RewardSummary)
def reward_summary(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    total = db.query(func.sum(models.Reward.tokens_earned)).filter(models.Reward.user_id == current_user.id).scalar()
    return {"total_earned": total or 0}