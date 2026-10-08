import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from groq import Groq

app = Flask(__name__)
CORS(app)

# Inisialisasi Groq Client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

@app.route('/')
def home():
    return send_file('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '')

        if not user_message:
            return jsonify({'error': 'Pesan tidak boleh kosong'}), 400

        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "Kamu adalah AI Study Assistant yang ramah dan membantu siswa belajar."
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            model="llama-3.1-8b-instant"
        )

        reply = chat_completion.choices[0].message.content
        return jsonify({'response': reply})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
