import os
from django.core.wsgi import get_wsgi_application
from django.core.management import call_command

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'reads_mvp.settings')

application = get_wsgi_application()

# ✅ Auto create & migrate database
try:
    call_command('makemigrations', 'learn', interactive=False)
    call_command('migrate', interactive=False)
    print("✅ Database migrations applied successfully.")
except Exception as e:
    print(f"⚠️ Migration failed: {e}")

# ✅ Add sample lessons if database is empty
try:
    from learn.models import Lesson
    if Lesson.objects.count() == 0:
        Lesson.objects.create(
            title="Introduction to $READS",
            description="Learn how $READS helps students study and earn tokens.",
            reward_tokens=10
        )
        Lesson.objects.create(
            title="How to Earn Tokens",
            description="Complete quizzes after reading lessons to earn $READS tokens.",
            reward_tokens=20
        )
        Lesson.objects.create(
            title="What is Learn-to-Earn?",
            description="A new way to learn where effort and consistency are rewarded.",
            reward_tokens=15
        )
        print("✅ Demo lessons added successfully.")
except Exception as e:
    print(f"⚠️ Could not add demo lessons: {e}")

# ✅ Auto create default admin user if not exists
try:
    from django.contrib.auth import get_user_model
    User = get_user_model()
    if not User.objects.filter(username="admin").exists():
        User.objects.create_superuser(
            username="admin",
            email="admin@reads.com",
            password="admin123"
        )
        print("✅ Default admin user created (username: admin, password: admin123).")
except Exception as e:
    print(f"⚠️ Could not create admin user: {e}")