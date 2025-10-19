from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('lesson/<int:pk>/', views.lesson_detail, name='lesson_detail'),
    path('lesson/<int:pk>/quiz/', views.take_quiz, name='take_quiz'),
]