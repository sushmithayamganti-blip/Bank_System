from flask import Flask, request, jsonify
from pathlib import Path
import json
from random import randint
from datetime import datetime

app = Flask(__name__, static_folder='.', static_url_path='')
DATA_FILE = Path(__file__).resolve().parent / 'account_data.json'
VISITOR_FILE = Path(__file__).resolve().parent / 'visitor_log.json'

ALLOWED_EDIT_FIELDS = {'name', 'age', 'gender', 'address', 'branch', 'phone', 'email'}


def read_account():
    if not DATA_FILE.exists():
        return None

    try:
        with DATA_FILE.open('r', encoding='utf-8') as file:
            account = json.load(file)
            if account.get('accountExists'):
                return account
    except (json.JSONDecodeError, IOError):
        return None

    return None


def write_account(account):
    account['accountExists'] = True
    with DATA_FILE.open('w', encoding='utf-8') as file:
        json.dump(account, file, indent=2)
    return account


def delete_account_file():
    if DATA_FILE.exists():
        DATA_FILE.unlink()


def normalize_int(value):
    try:
        return int(value)
    except (ValueError, TypeError):
        return None


def read_visitors():
    if not VISITOR_FILE.exists():
        return []

    try:
        with VISITOR_FILE.open('r', encoding='utf-8') as file:
            return json.load(file)
    except (json.JSONDecodeError, IOError):
        return []


def write_visitors(visitors):
    with VISITOR_FILE.open('w', encoding='utf-8') as file:
        json.dump(visitors, file, indent=2)


def record_visit(request):
    visits = read_visitors()
    ip_address = request.headers.get('X-Forwarded-For', request.remote_addr or '')
    if ',' in ip_address:
        ip_address = ip_address.split(',')[0].strip()

    visits.append({
        'timestamp': datetime.utcnow().isoformat() + 'Z',
        'ip': ip_address,
        'path': request.json.get('page') if request.is_json else request.path,
        'userAgent': request.headers.get('User-Agent', ''),
        'referrer': request.headers.get('Referer', '')
    })
    if len(visits) > 1000:
        visits = visits[-1000:]
    write_visitors(visits)
    return visits[-1]


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/api/account', methods=['GET'])
def get_account():
    account = read_account()
    if not account:
        return jsonify({'success': False, 'message': 'No account found', 'accountExists': False}), 404
    return jsonify({'success': True, 'account': account})


@app.route('/api/visit', methods=['POST'])
def visit():
    record_visit(request)
    return jsonify({'success': True, 'message': 'Visit recorded'})


@app.route('/api/visitors', methods=['GET'])
def visitors():
    return jsonify({'success': True, 'visitors': read_visitors()})


@app.route('/api/account', methods=['POST'])
def create_account():
    payload = request.get_json(force=True)
    if read_account():
        return jsonify({'success': False, 'message': 'An account already exists'}), 400

    required_fields = ['name', 'age', 'gender', 'address', 'branch', 'phone', 'email', 'aadhar', 'password']
    missing = [field for field in required_fields if not payload.get(field)]
    if missing:
        return jsonify({'success': False, 'message': f"Missing fields: {', '.join(missing)}"}), 400

    age = normalize_int(payload.get('age'))
    phone = normalize_int(payload.get('phone'))
    aadhar = normalize_int(payload.get('aadhar'))
    if age is None or phone is None or aadhar is None:
        return jsonify({'success': False, 'message': 'Age, phone, and aadhar must be numbers'}), 400

    account = {
        'name': str(payload.get('name')).strip(),
        'age': age,
        'gender': str(payload.get('gender')).strip(),
        'address': str(payload.get('address')).strip(),
        'branch': str(payload.get('branch')).strip(),
        'phone': phone,
        'email': str(payload.get('email')).strip(),
        'aadhar': aadhar,
        'password': str(payload.get('password')),
        'account_number': randint(1000000000, 9999999999),
        'balance': 0.0,
    }
    write_account(account)
    return jsonify({'success': True, 'account': account})


@app.route('/api/account', methods=['PATCH'])
def update_account():
    account = read_account()
    if not account:
        return jsonify({'success': False, 'message': 'No account exists to update'}), 404

    payload = request.get_json(force=True)
    field = payload.get('field')
    value = payload.get('value')

    if field not in ALLOWED_EDIT_FIELDS:
        return jsonify({'success': False, 'message': 'Invalid field to update'}), 400

    if field in {'age', 'phone'}:
        value = normalize_int(value)
        if value is None:
            return jsonify({'success': False, 'message': f'{field} must be a number'}), 400

    account[field] = value
    write_account(account)
    return jsonify({'success': True, 'account': account})


@app.route('/api/account/deposit', methods=['POST'])
def deposit():
    account = read_account()
    if not account:
        return jsonify({'success': False, 'message': 'No account exists'}), 404

    payload = request.get_json(force=True)
    try:
        amount = float(payload.get('amount'))
    except (TypeError, ValueError):
        amount = None

    if amount is None or amount <= 0:
        return jsonify({'success': False, 'message': 'Deposit amount must be a positive number'}), 400

    account['balance'] += amount
    write_account(account)
    return jsonify({'success': True, 'account': account, 'message': f'Deposited ${amount:.2f} successfully'})


@app.route('/api/account/withdraw', methods=['POST'])
def withdraw():
    account = read_account()
    if not account:
        return jsonify({'success': False, 'message': 'No account exists'}), 404

    payload = request.get_json(force=True)
    try:
        amount = float(payload.get('amount'))
    except (TypeError, ValueError):
        amount = None

    if amount is None or amount <= 0:
        return jsonify({'success': False, 'message': 'Withdrawal amount must be a positive number'}), 400

    if amount > account['balance']:
        return jsonify({'success': False, 'message': 'Insufficient balance'}), 400

    account['balance'] -= amount
    write_account(account)
    return jsonify({'success': True, 'account': account, 'message': f'Withdrew ${amount:.2f} successfully'})


@app.route('/api/account/reset-password', methods=['POST'])
def reset_password():
    account = read_account()
    if not account:
        return jsonify({'success': False, 'message': 'No account exists'}), 404

    payload = request.get_json(force=True)
    current_password = str(payload.get('currentPassword', ''))
    new_password = str(payload.get('newPassword', ''))
    confirm_password = str(payload.get('confirmPassword', ''))

    if current_password != account.get('password'):
        return jsonify({'success': False, 'message': 'Current password is incorrect'}), 400
    if new_password != confirm_password:
        return jsonify({'success': False, 'message': 'New password confirmation does not match'}), 400
    if not new_password:
        return jsonify({'success': False, 'message': 'New password cannot be empty'}), 400

    account['password'] = new_password
    write_account(account)
    return jsonify({'success': True, 'account': account, 'message': 'Password updated successfully'})


@app.route('/api/account/forgot-password', methods=['POST'])
def forgot_password():
    account = read_account()
    if not account:
        return jsonify({'success': False, 'message': 'No account exists'}), 404

    payload = request.get_json(force=True)
    email = str(payload.get('email', '')).strip()
    otp = str(payload.get('otp', '')).strip()
    new_password = str(payload.get('newPassword', ''))
    confirm_password = str(payload.get('confirmPassword', ''))

    if email != account.get('email'):
        return jsonify({'success': False, 'message': 'Email does not match registered email'}), 400
    if otp != '1234':
        return jsonify({'success': False, 'message': 'Invalid OTP'}), 400
    if new_password != confirm_password:
        return jsonify({'success': False, 'message': 'Password confirmation does not match'}), 400
    if not new_password:
        return jsonify({'success': False, 'message': 'New password cannot be empty'}), 400

    account['password'] = new_password
    write_account(account)
    return jsonify({'success': True, 'account': account, 'message': 'Password reset successfully'})


@app.route('/api/account', methods=['DELETE'])
def remove_account():
    account = read_account()
    if not account:
        return jsonify({'success': False, 'message': 'No account exists'}), 404

    delete_account_file()
    return jsonify({'success': True, 'message': 'Account deleted successfully'})


if __name__ == '__main__':
    app.run(debug=True)
