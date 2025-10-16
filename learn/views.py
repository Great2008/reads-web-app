from django.shortcuts import render, get_object_or_404
from .models import Lesson

def home(request):
    lessons = Lesson.objects.all()
    return render(request, 'learn/home.html', {'lessons': lessons})

def lesson_detail(request, pk):
    lesson = get_object_or_404(Lesson, pk=pk)
    return render(request, 'learn/detail.html', {'lesson': lesson})
    from django.contrib.auth.decorators import login_required

@login_required(login_url='/users/login/')
def home(request):
    ...