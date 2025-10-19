from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from learn.models import Lesson

def custom_login(request):
    error = None
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        role = request.POST.get('role')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            if role == 'admin' and user.is_staff:
                return redirect('/admin-dashboard/')
            elif role == 'user':
                return redirect('/dashboard/')
            else:
                error = "Invalid role selection."
        else:
            error = "Invalid username or password."
    return render(request, 'users/login.html', {'error': error})


@login_required
def user_dashboard(request):
    lessons = Lesson.objects.all()
    return render(request, 'users/dashboard.html', {'lessons': lessons})


@login_required
def admin_dashboard(request):
    lessons = Lesson.objects.all()
    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description')
        reward_tokens = request.POST.get('reward_tokens')
        Lesson.objects.create(title=title, description=description, reward_tokens=reward_tokens)
        return redirect('/admin-dashboard/')
    return render(request, 'users/admin_dashboard.html', {'lessons': lessons})


def user_logout(request):
    logout(request)
    return redirect('/users/login/')