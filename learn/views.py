from django.shortcuts import render
from .models import Lesson

def home(request):
    lessons = Lesson.objects.all()
    return render(request, 'learn/home.html', {'lessons': lessons})