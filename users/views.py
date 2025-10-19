from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout

def register_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already taken.')
        else:
            User.objects.create_user(username=username, password=password)
            messages.success(request, 'Registration successful! You can now log in.')
            return redirect('login')
    return render(request, 'users/register.html')

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Invalid credentials.')
    return render(request, 'users/login.html')

def logout_view(request):
    logout(request)
    return redirect('login')
    from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login

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