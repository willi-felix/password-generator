from flask import Flask, render_template, request, jsonify
import random
import string
import os

app = Flask(__name__)

def generate_password(length, include_uppercase, include_digits, include_special):
    characters = string.ascii_lowercase
    if include_uppercase:
        characters += string.ascii_uppercase
    if include_digits:
        characters += string.digits
    if include_special:
        characters += string.punctuation

    password = ''.join(random.choice(characters) for _ in range(length))
    return password

def remove_duplicate_passwords(file_path, new_password_name):
    if not os.path.exists(file_path):
        return  # File does not exist
    
    with open(file_path, 'r') as file:
        lines = file.readlines()
    
    with open(file_path, 'w') as file:
        for line in lines:
            if not line.startswith(f'{new_password_name}:'):
                file.write(line)

def sort_passwords(file_path):
    if not os.path.exists(file_path):
        return  # File does not exist
    
    with open(file_path, 'r') as file:
        lines = file.readlines()
    
    lines.sort(key=lambda line: line.split(':')[0].strip())  # Adjust sorting key if needed
    
    with open(file_path, 'w') as file:
        file.writelines(lines)

def save_password_for_user(email, password_data):
    file_name = f"password-create-{email.replace('@', '-').replace('.', '-')}.txt"
    with open(file_name, 'w') as file:
        file.write(password_data)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    length = data.get('length', 8)
    include_uppercase = data.get('include_uppercase', True)
    include_digits = data.get('include_digits', True)
    include_special = data.get('include_special', True)
    password_name = data.get('password_name', 'Unnamed')
    user_email = data.get('email', 'user@example.com')  # Get user email if provided

    # Generate password
    password = generate_password(length, include_uppercase, include_digits, include_special)
    
    # Remove duplicates and sort
    remove_duplicate_passwords('password-created.txt', password_name)
    with open('password-created.txt', 'a') as file:
        file.write(f'{password_name}: {password}\n')

    # Save password to user-specific file
    save_password_for_user(user_email, f'{password_name}: {password}')

    # Sort passwords in the main file
    sort_passwords('password-created.txt')

    return jsonify({'password': password})

if __name__ == '__main__':
    app.run(debug=True)
