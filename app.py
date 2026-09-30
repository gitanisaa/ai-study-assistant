import os
import requests
import traceback
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

# Atur agar Flask membaca file static/HTML dari folder utama saat ini (root)
app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# Route untuk menampilkan index.html dari folder luar
@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        
        print(f"Pesan diterima: {user_message}")
        
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            # Gunakan ID model resmi Groq
            "model": "openai/gpt-oss-20b",
            "messages": [
                {"role": "system", "content": "Kamu adalah asisten belajar yang ramah."},
                {"role": "user", "content": user_message}
            ],
            "max_tokens": 500
        }
        
        response = requests.post(GROQ_API_URL, json=payload, headers=headers)
        print(f"Status API: {response.status_code}")
        
        result = response.json()
        
        if "error" in result:
            print(f"Error dari Groq: {result['error']}")
            return jsonify({"reply": f"Error dari AI: {result['error'].get('message', 'Unknown Error')}"})
            
        ai_reply = result['choices'][0]['message']['content']
        return jsonify({"reply": ai_reply})
        
    except Exception as e:
        print(f"ERROR: {str(e)}")
        traceback.print_exc()
        return jsonify({"reply": f"Terjadi kesalahan sistem: {str(e)}"})

if __name__ == '__main__':
    app.run(debug=True, port=5001)