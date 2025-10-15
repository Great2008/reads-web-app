import os
from django.core.wsgi import get_wsgi_application
from django.core.management import call_command

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'reads_mvp.settings')

application = get_wsgi_application()

# ✅ Automatically create and migrate the database on startup
try:
    call_command('makemigrations', 'learn', interactive=False)
    call_command('migrate', interactive=False)
    print("✅ Database migrations applied successfully.")
except Exception as e:
    print(f"⚠️ Migration failed: {e}")
    from learn.models import Lesson

try:
    if Lesson.objects.count() == 0:
        Lesson.objects.create(title="Introduction to $READS", description="Learn how the $READS MVP works.", reward_tokens=10)
        Lesson.objects.create(title="Study & Earn", description="Complete short lessons to earn tokens.", reward_tokens=20)
        print("✅ Sample lessons added.")
except Exception as e:
    print(f"⚠️ Could not create sample lessons: {e}")