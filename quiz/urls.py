from django.urls import path
from . import views

urlpatterns = [
    path('<int:lesson_id>/', views.take_quiz, name='take_quiz'),
    path('<int:lesson_id>/submit/', views.submit_quiz, name='submit_quiz'),
]