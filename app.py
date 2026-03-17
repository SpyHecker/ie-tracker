"""
Income Expense Tracker - Flask Application
A single-page income expense tracker with authentication
"""

from flask import Flask, render_template, redirect, url_for, request, flash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
from datetime import datetime, date
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Database configuration
DB_NAME = 'tracker.db'


def init_db():
    """Initialize the database with required tables"""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )
    ''')
    
    # Create transactions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
            amount REAL NOT NULL,
            description TEXT,
            category TEXT NOT NULL,
            date TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()


# User class for Flask-Login
class User(UserMixin):
    def __init__(self, id, username):
        self.id = id
        self.username = username


@login_manager.user_loader
def load_user(user_id):
    """Load user by ID for Flask-Login"""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('SELECT id, username FROM users WHERE id = ?', (user_id,))
    user_data = cursor.fetchone()
    conn.close()
    
    if user_data:
        return User(user_data[0], user_data[1])
    return None


def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


def get_user_transactions(user_id, start_date=None, end_date=None):
    """Get transactions for a user with optional date filtering"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = 'SELECT * FROM transactions WHERE user_id = ?'
    params = [user_id]
    
    if start_date:
        query += ' AND date >= ?'
        params.append(start_date)
    
    if end_date:
        query += ' AND date <= ?'
        params.append(end_date)
    
    query += ' ORDER BY date DESC, id DESC'
    
    cursor.execute(query, params)
    transactions = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in transactions]


def get_user_summary(user_id, start_date=None, end_date=None):
    """Get financial summary for a user"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Build query based on filters
    base_where = 'WHERE user_id = ?'
    params = [user_id]
    
    if start_date:
        base_where += ' AND date >= ?'
        params.append(start_date)
    
    if end_date:
        base_where += ' AND date <= ?'
        params.append(end_date)
    
    # Get total income
    cursor.execute(f"SELECT COALESCE(SUM(amount), 0) FROM transactions {base_where} AND type = 'income'", params)
    total_income = cursor.fetchone()[0]
    
    # Get total expenses
    cursor.execute(f"SELECT COALESCE(SUM(amount), 0) FROM transactions {base_where} AND type = 'expense'", params)
    total_expenses = cursor.fetchone()[0]
    
    conn.close()
    
    return {
        'total_income': total_income,
        'total_expenses': total_expenses,
        'balance': total_income - total_expenses
    }


# Routes
@app.route('/')
def index():
    """Redirect to dashboard or login"""
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))


@app.route('/register', methods=['GET', 'POST'])
def register():
    """User registration"""
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')
        
        # Validation
        if not username or not password:
            flash('Username and password are required', 'error')
            return render_template('register.html')
        
        if len(username) < 3:
            flash('Username must be at least 3 characters', 'error')
            return render_template('register.html')
        
        if len(password) < 6:
            flash('Password must be at least 6 characters', 'error')
            return render_template('register.html')
        
        if password != confirm_password:
            flash('Passwords do not match', 'error')
            return render_template('register.html')
        
        # Check if username exists
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT id FROM users WHERE username = ?', (username,))
        
        if cursor.fetchone():
            conn.close()
            flash('Username already exists', 'error')
            return render_template('register.html')
        
        # Create new user
        password_hash = generate_password_hash(password)
        try:
            cursor.execute('INSERT INTO users (username, password_hash) VALUES (?, ?)',
                          (username, password_hash))
            conn.commit()
            conn.close()
            flash('Registration successful! Please login.', 'success')
            return redirect(url_for('login'))
        except Exception as e:
            conn.close()
            flash('An error occurred. Please try again.', 'error')
            return render_template('register.html')
    
    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    """User login"""
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')
        
        if not username or not password:
            flash('Username and password are required', 'error')
            return render_template('login.html')
        
        # Find user
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT id, username, password_hash FROM users WHERE username = ?', (username,))
        user_data = cursor.fetchone()
        conn.close()
        
        if user_data and check_password_hash(user_data[2], password):
            user = User(user_data[0], user_data[1])
            login_user(user)
            flash('Login successful!', 'success')
            
            next_page = request.args.get('next')
            return redirect(next_page or url_for('dashboard'))
        else:
            flash('Invalid username or password', 'error')
            return render_template('login.html')
    
    return render_template('login.html')


@app.route('/logout')
@login_required
def logout():
    """User logout"""
    logout_user()
    flash('You have been logged out', 'success')
    return redirect(url_for('login'))


@app.route('/dashboard')
@login_required
def dashboard():
    """Main dashboard showing transactions and summary"""
    # Get date filter parameters
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    # Get transactions and summary
    transactions = get_user_transactions(current_user.id, start_date, end_date)
    summary = get_user_summary(current_user.id, start_date, end_date)
    
    # Get today's date for the form
    today = date.today().strftime('%Y-%m-%d')
    
    return render_template('dashboard.html',
                         transactions=transactions,
                         total_income=summary['total_income'],
                         total_expenses=summary['total_expenses'],
                         balance=summary['balance'],
                         start_date=start_date or '',
                         end_date=end_date or '',
                         today=today)


@app.route('/add_transaction', methods=['POST'])
@login_required
def add_transaction():
    """Add a new transaction"""
    trans_type = request.form.get('type')
    amount = request.form.get('amount')
    description = request.form.get('description', '').strip()
    category = request.form.get('category', '').strip()
    trans_date = request.form.get('date')
    
    # Validation
    if not all([trans_type, amount, category, trans_date]):
        flash('All fields are required', 'error')
        return redirect(url_for('dashboard'))
    
    try:
        amount = float(amount)
        if amount <= 0:
            flash('Amount must be positive', 'error')
            return redirect(url_for('dashboard'))
    except ValueError:
        flash('Invalid amount', 'error')
        return redirect(url_for('dashboard'))
    
    # Insert transaction
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT INTO transactions (user_id, type, amount, description, category, date)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (current_user.id, trans_type, amount, description, category, trans_date))
        conn.commit()
        flash('Transaction added successfully!', 'success')
    except Exception as e:
        flash('Error adding transaction', 'error')
    finally:
        conn.close()
    
    return redirect(url_for('dashboard'))


@app.route('/delete_transaction/<int:transaction_id>', methods=['POST'])
@login_required
def delete_transaction(transaction_id):
    """Delete a transaction"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Verify the transaction belongs to the current user
    cursor.execute('SELECT id FROM transactions WHERE id = ? AND user_id = ?',
                  (transaction_id, current_user.id))
    
    if not cursor.fetchone():
        conn.close()
        flash('Transaction not found', 'error')
        return redirect(url_for('dashboard'))
    
    try:
        cursor.execute('DELETE FROM transactions WHERE id = ? AND user_id = ?',
                      (transaction_id, current_user.id))
        conn.commit()
        flash('Transaction deleted successfully!', 'success')
    except Exception as e:
        flash('Error deleting transaction', 'error')
    finally:
        conn.close()
    
    return redirect(url_for('dashboard'))


# Error handlers
@app.errorhandler(404)
def not_found(error):
    return render_template('base.html'), 404


@app.errorhandler(500)
def internal_error(error):
    flash('An internal error occurred', 'error')
    return redirect(url_for('dashboard'))


# Initialize database on startup
if __name__ == '__main__':
    init_db()
    print("Database initialized successfully!")
    print("Starting Flask application...")
    app.run(debug=True)
