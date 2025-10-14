from flask import Flask, render_template, redirect, url_for, request, flash
app = Flask(__name__)
app.secret_key = "change_this_to_a_secure_random_value"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/learn')
def learn():
    return render_template('learn.html')

@app.route('/earn', methods=['GET','POST'])
def earn():
    if request.method == 'POST':
        # mock quiz pass -> award tokens (placeholder)
        name = request.form.get('name','Student')
        flash(f"Congratulations {name}! You earned 10 $READS tokens (mock).")
        return redirect(url_for('earn'))
    return render_template('earn.html')

@app.route('/marketplace')
def marketplace():
    return render_template('marketplace.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)