const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const placeholder = document.getElementById('placeholder');
const answerContent = document.getElementById('answerContent');

const API_URL = fetch("/chat", { ... })

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) {
        userInput.style.borderColor = '#f87171';
        setTimeout(() => {
            userInput.style.borderColor = '#2a2a35';
        }, 1500);
        return;
    }

    // Reset border
    userInput.style.borderColor = '#2a2a35';
    
    // Tampilkan loading
    if (placeholder) placeholder.style.display = 'none';
    if (answerContent) {
        answerContent.style.display = 'block';
        answerContent.innerHTML = '<div class="loading">🤔 AI sedang berpikir... <span class="loading-dot"></span><span class="loading-dot"></span><span class="loading-dot"></span></div>';
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message }),
        });

        const data = await response.json();
        
        if (answerContent) {
            answerContent.innerHTML = `<div style="background: #1e1e2a; padding: 1rem; border-radius: 0.75rem; line-height: 1.6;">💬 ${data.reply}</div>`;
        }
        
        // Kosongkan input setelah kirim (opsional)
        // userInput.value = '';

    } catch (error) {
        console.error('Error:', error);
        if (answerContent) {
            answerContent.innerHTML = '<div style="color: #f87171; background: #1e1e2a; padding: 1rem; border-radius: 0.75rem;">⚠️ Gagal konek ke server. Pastikan Flask jalan di terminal (python app.py)</div>';
        }
    }
}
