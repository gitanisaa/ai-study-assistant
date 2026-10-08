const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const placeholder = document.getElementById('placeholder');
const answerContent = document.getElementById('answerContent');

// Array untuk menyimpan riwayat percakapan
let conversationHistory = [];

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    if (placeholder) placeholder.style.display = 'none';
    
    // Tambahkan pesan user ke riwayat
    conversationHistory.push({ role: 'user', content: message });

    answerContent.innerHTML = '<p class="text-slate-400">Sedang berpikir...</p>';
    sendBtn.disabled = true;

    try {
        const response = await fetch("/chat", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Kirim seluruh riwayat percakapan ke server
            body: JSON.stringify({ messages: conversationHistory })
        });

        const data = await response.json();

        if (response.ok) {
            // Simpan jawaban AI ke riwayat
            conversationHistory.push({ role: 'assistant', content: data.response });
            answerContent.innerHTML = marked.parse(data.response);
        } else {
            answerContent.innerHTML = `<p class="text-red-400">Error: ${data.error || 'Gagal mendapatkan respon'}</p>`;
        }
    } catch (error) {
        console.error("Error:", error);
        answerContent.innerHTML = '<p class="text-red-400">Gagal terhubung ke server. Coba lagi nanti.</p>';
    } finally {
        sendBtn.disabled = false;
        userInput.value = '';
    }
}
