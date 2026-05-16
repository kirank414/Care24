import requests
import json

url = "http://localhost:3000/api/auth/signup"
data = {
    "name": "Admin User",
    "email": "admin@care24.com",
    "password": "password123",
    "role": "admin"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
