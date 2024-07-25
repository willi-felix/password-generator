import os
import sys

def set_permissions(email):
    # Define the file name based on email
    file_name = f"password-create-{email.replace('@', '-').replace('.', '-')}.txt"
    
    # Ensure the file exists
    if os.path.exists(file_name):
        # Set file permissions (example)
        # You can use specific methods for file permission management
        print(f"Permissions set for file: {file_name}")
    else:
        print(f"File not found: {file_name}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: manage_permissions.py <email>")
        sys.exit(1)
    
    email = sys.argv[1]
    set_permissions(email)
