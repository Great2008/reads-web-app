from flask import Flask, render_template, request, redirect, url_for, flash, session
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3, os

app = Flask(__name__)
app.secret_key = "change_this_secret"

DB_NAME = "reads_users.db"

# ---------- Database setup ----------
def init_db():
    if not os.path.exists(DB_NAME):
        with sqlite3.connect(DB_NAME) as conn:
            conn.execute("""
                CREATE TABLE users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL
                );
            """)
            print("Database created!")

# ---------- Helper functions ----------
def get_user_by_email(email):
    with sqlite3.connect(DB_NAME) as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM users WHERE email = ?", (email,))
        return cur.fetchone()

# ---------- Routes ----------
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        hashed_pw = generate_password_hash(password)

        try:
            with sqlite3.connect(DB_NAME) as conn:
                conn.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", 
                             (name, email, hashed_pw))
                conn.commit()
            flash("Registration successful! Please log in.", "success")
            return redirect(url_for('login'))
        except sqlite3.IntegrityError:
            flash("Email already registered. Try logging in.", "danger")
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = get_user_by_email(email)

        if user and check_password_hash(user[3], password):
            session['user_id'] = user[0]
            session['user_name'] = user[1]
            flash(f"Welcome back, {user[1]}!", "success")
            return redirect(url_for('earn'))
        else:
            flash("Invalid email or password.", "danger")
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash("You’ve been logged out.", "info")
    return redirect(url_for('index'))

@app.route('/learn')
def learn():
    return render_template('learn.html')

@app.route('/earn', methods=['GET','POST'])
def earn():
    if 'user_id' not in session:
        flash("Please log in to earn tokens.", "warning")
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        flash(f"Congratulations {session['user_name']}! You earned 10 $READS tokens (mock).", "success")
        return redirect(url_for('earn'))

    return render_template('earn.html', user=session.get('user_name'))

@app.route('/marketplace')
def marketplace():
    return render_template('marketplace.html')

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)