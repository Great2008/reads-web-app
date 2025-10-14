# $READS Flask Starter (mobile-friendly)

This is a lightweight Flask starter project tailored for development on mobile editors (like SPCK Editor).
It includes basic routes: Home, Learn, Earn (mock), and Marketplace.

## Files
- `app.py` — main Flask app
- `templates/` — HTML templates
- `static/` — CSS and assets
- `requirements.txt` — Python dependencies

## Run locally (PC) / Quick test
1. Create a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python app.py
   ```
2. Visit http://127.0.0.1:5000

## Using SPCK Editor on Android + GitHub
1. Open SPCK Editor and create a new project folder.
2. Copy these files into the folder.
3. Use the built-in terminal (or Termux) to run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: $READS Flask starter"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
4. For deployment use Render, Railway, or similar — connect to GitHub repo and deploy.

## Next steps I can help with
- Add user auth (Flask-Login)
- Connect to PostgreSQL or Supabase
- Add Web3.py integration for $READS token
- USSD integration via Africa's Talking