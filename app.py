import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from groq import Groq

app = Flask(__name__)
CORS(app)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

@app.route('/')
def home():
    return send_file('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json() or {}
        
        # Mendukung pengiriman format tunggal 'message' maupun riwayat 'messages'
        incoming_messages = data.get('messages', [])
        single_message = data.get('message', '')

        # Jika frontend mengirim pesan tunggal, ubah ke format daftar
        if not incoming_messages and single_message:
            incoming_messages = [{"role": "user", "content": single_message}]

        if not incoming_messages:
            return jsonify({'error': 'Pesan tidak boleh kosong'}), 400

        # Instruksi dasar untuk karakter AI
        system_instruction = [{
            "role": "system",
            "content": "Kamu adalah AI Study Assistant yang ramah dan membantu siswa belajar."
        }]

        # Gabungkan instruksi awal dengan pesan dari pengguna
        full_conversation = system_instruction + incoming_messages

        chat_completion = client.chat.completions.create(
            messages=full_conversation,
            model="openai/gpt-oss-20b"
        )

        reply = chat_completion.choices[0].message.content
        return jsonify({'response': reply})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
