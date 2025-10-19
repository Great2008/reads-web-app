from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('learn.urls')),          # home + lessons
    path('users/', include('users.urls')),    # login, register, dashboard
]