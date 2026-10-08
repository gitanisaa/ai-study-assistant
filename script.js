const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const placeholder = document.getElementById('placeholder');
const answerContent = document.getElementById('answerContent');

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

    // Tampilkan status loading
    if (placeholder) placeholder.style.display = 'none';
    answerContent.innerHTML = '<p class="text-slate-400">Sedang berpikir...</p>';
    sendBtn.disabled = true;

    try {
        const response = await fetch("/chat", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();

        if (response.ok) {
            answerContent.innerHTML = marked.parse(data.response);
        } else {
            answerContent.innerHTML = `<p class="text-red-400">Error: ${data.error || 'Gagal mendapatkan respon'}</p>`;
        }
    } catch (error) {
        console.error("Error:", error);
        answerContent.innerHTML = '<p class="text-red-400">Gagal terhubung ke server Flask. Pastikan koneksi aman.</p>';
    } finally {
        sendBtn.disabled = false;
        userInput.value = '';
    }
}
