from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Lesson


@login_required(login_url='/users/login/')
def home(request):
    lessons = Lesson.objects.all()
    return render(request, 'learn/home.html', {'lessons': lessons})


@login_required(login_url='/users/login/')
def lesson_detail(request, pk):
    lesson = get_object_or_404(Lesson, pk=pk)
    return render(request, 'learn/detail.html', {'lesson': lesson})
    from django.shortcuts import render, get_object_or_404
from .models import Lesson, Quiz, Question

def take_quiz(request, pk):
    lesson = get_object_or_404(Lesson, pk=pk)
    questions = Question.objects.filter(lesson=lesson)
    return render(request, 'learn/quiz.html', {'lesson': lesson, 'questions': questions})