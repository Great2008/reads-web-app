from django.shortcuts import render, get_object_or_404, redirect
from learn.models import Lesson
from .models import Question, Choice, QuizResult
from django.contrib.auth.decorators import login_required

@login_required(login_url='/users/login/')
def take_quiz(request, lesson_id):
    lesson = get_object_or_404(Lesson, id=lesson_id)
    questions = lesson.questions.all()
    return render(request, 'quiz/quiz.html', {'lesson': lesson, 'questions': questions})

@login_required(login_url='/users/login/')
def submit_quiz(request, lesson_id):
    lesson = get_object_or_404(Lesson, id=lesson_id)
    questions = lesson.questions.all()
    score = 0
    total = questions.count()

    for question in questions:
        selected = request.POST.get(str(question.id))
        if selected:
            choice = Choice.objects.get(id=selected)
            if choice.is_correct:
                score += 1

    QuizResult.objects.create(user=request.user, lesson=lesson, score=score)
    return render(request, 'quiz/result.html', {'lesson': lesson, 'score': score, 'total': total})