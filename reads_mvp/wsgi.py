import os
from django.core.wsgi import get_wsgi_application
from django.core.management import call_command

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'reads_mvp.settings')

application = get_wsgi_application()

# ✅ Automatically apply migrations on Render startup
try:
    call_command('migrate', interactive=False)
    print("✅ Database migrations applied successfully.")
except Exception as e:
    print(f"⚠️ Migration failed: {e}")