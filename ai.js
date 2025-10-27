const apiKey = "AIzaSyCtVUR5ii1B_IBYiQwM2XWYKs4vLeowc-U";
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

const chatArea = document.getElementById("chat-area");
const chatForm = document.getElementById("chat-form");
const input = document.getElementById("prompts");
const loading = document.getElementById("loading-indicator");
const saveChatBtn = document.getElementById('save-chat-btn');
const sessionsList = document.getElementById('sessions-list');
const deleteAllBtn = document.getElementById('delete-all-btn');
const themeToggle = document.getElementById('theme-toggle');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarEl = document.querySelector('.sidebar');
const overlay = document.getElementById('overlay');
const chatContainerEl = document.querySelector('.chat-container');

function applyTheme(theme) {
    if (theme === 'light') document.documentElement.classList.add('light');
    else document.documentElement.classList.remove('light');
}

const savedTheme = localStorage.getItem('gemini_theme') || 'dark';
applyTheme(savedTheme);

themeToggle?.addEventListener('click', () => {
    const isLight = document.documentElement.classList.toggle('light');
    localStorage.setItem('gemini_theme', isLight ? 'light' : 'dark');
});
let home = () => {
    window.location.href = 'dashboard.html'
}
sidebarToggle?.addEventListener('click', () => {
    if (!sidebarEl || !overlay) return;
    const isOpen = sidebarEl.classList.toggle('open');
    overlay.style.display = isOpen ? 'block' : 'none';
    setTimeout(() => overlay.classList.toggle('show', isOpen), 10);
    if (isOpen) sidebarEl.classList.remove('hidden');
    try {
        const smallScreen = window.matchMedia('(max-width: 900px)').matches;
        if (smallScreen && chatContainerEl) {
            if (isOpen) {
                sidebarEl.style.position = 'relative';
                sidebarEl.style.transform = 'none';
                sidebarEl.style.left = 'auto';
                sidebarEl.style.right = 'auto';
                sidebarEl.style.top = 'auto';
                sidebarEl.style.width = '100%';
                sidebarEl.style.maxWidth = 'none';
                sidebarEl.style.padding = '22px 20px';
                const rect = sidebarEl.getBoundingClientRect();
                const push = Math.round(rect.height + 12);
                chatContainerEl.style.marginTop = push + 'px';
                chatContainerEl.style.transition = 'margin-top .22s ease';
            } else {
                sidebarEl.style.removeProperty('position');
                sidebarEl.style.removeProperty('transform');
                sidebarEl.style.removeProperty('left');
                sidebarEl.style.removeProperty('right');
                sidebarEl.style.removeProperty('top');
                sidebarEl.style.removeProperty('width');
                sidebarEl.style.removeProperty('max-width');
                sidebarEl.style.removeProperty('padding');
                chatContainerEl.style.removeProperty('margin-top');
                chatContainerEl.style.removeProperty('transition');
            }
        }
    } catch (e) {
        console.warn('sidebar shift error', e);
    }
});

overlay?.addEventListener('click', () => {
    if (!sidebarEl || !overlay) return;
    sidebarEl.classList.remove('open');
    overlay.classList.remove('show');
    overlay.style.display = 'none';
    try {
        const smallScreen = window.matchMedia('(max-width: 900px)').matches;
        if (smallScreen && chatContainerEl) {
            sidebarEl.style.removeProperty('position');
            sidebarEl.style.removeProperty('transform');
            sidebarEl.style.removeProperty('left');
            sidebarEl.style.removeProperty('right');
            sidebarEl.style.removeProperty('top');
            sidebarEl.style.removeProperty('width');
            sidebarEl.style.removeProperty('max-width');
            sidebarEl.style.removeProperty('padding');
            chatContainerEl.style.removeProperty('margin-top');
            chatContainerEl.style.removeProperty('transition');
        }
    } catch (e) { }
});

let chatHistory = [];
let currentSession = null;
const newChatBtn = document.getElementById('new-chat-btn');

function appendMessage(text, sender = "ai") {
    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-message ${sender}`;
    const content = document.createElement('div');
    content.className = 'msg-content';
    content.textContent = text;
    const ts = document.createElement('div');
    ts.className = 'msg-time';
    ts.textContent = new Date().toLocaleTimeString();
    msgDiv.appendChild(content);
    msgDiv.appendChild(ts);
    chatArea.appendChild(msgDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
    chatHistory.push({ sender, text, time: ts.textContent });
    return msgDiv;
}

function appendThinkingBubble() {
    const bubble = document.createElement("div");
    bubble.className = "chat-message ai thinking-bubble";
    bubble.innerHTML = `
        <span style="display:flex;align-items:center;gap:10px;">
            <span>Thinking...</span>
        </span>
    `;
    chatArea.appendChild(bubble);
    chatArea.scrollTop = chatArea.scrollHeight;
    return bubble;
}
async function sendPrompt(prompt) {
    appendMessage(prompt, "user");
    const thinkingBubble = appendThinkingBubble();
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        const data = await response.json();
        let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No output received";
        const aiMsg = document.createElement('div');
        aiMsg.className = 'chat-message ai';
        const content = document.createElement('div');
        content.className = 'msg-content';
        content.textContent = aiText;
        const ts = document.createElement('div');
        ts.className = 'msg-time';
        ts.textContent = new Date().toLocaleTimeString();
        aiMsg.appendChild(content);
        aiMsg.appendChild(ts);
        thinkingBubble.replaceWith(aiMsg);
        chatArea.scrollTop = chatArea.scrollHeight;
    } catch (err) {
        thinkingBubble.remove();
        appendMessage("Error: " + err.message, "ai");
        console.error(err);
    }
}

function saveCurrentSession() {
    const name = prompt('Enter a name for this chat session:');
    if (!name) return;
    const key = 'gemini_session_' + name;
    localStorage.setItem(key, JSON.stringify(chatHistory));
    currentSession = name;
    renderSessions();
}

function renderSessions() {
    sessionsList.innerHTML = '';
    let found = false;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key.startsWith('gemini_session_')) continue;
        found = true;
        const name = key.replace('gemini_session_', '');
        const row = document.createElement('div');
        row.className = 'recent-item recent-row';
        const nameEl = document.createElement('div');
        nameEl.className = 'recent-name';
        nameEl.textContent = name;
        nameEl.onclick = () => loadSession(name);
        const delBtn = document.createElement('button');
        delBtn.className = 'recent-delete';
        delBtn.textContent = '🗑';
        delBtn.title = 'Delete session';
        delBtn.onclick = (e) => { e.stopPropagation(); deleteSession(name); };
        row.appendChild(nameEl);
        row.appendChild(delBtn);
        sessionsList.appendChild(row);
    }
    if (deleteAllBtn) deleteAllBtn.disabled = !found;
}

function deleteSession(name) {
    if (!confirm(`Delete saved session "${name}"? This cannot be undone.`)) return;
    const key = 'gemini_session_' + name;
    localStorage.removeItem(key);
    if (currentSession === name) {
        currentSession = null;
        chatHistory = [];
        chatArea.innerHTML = '';
        appendMessage('What can I help you with?', 'ai');
    }
    renderSessions();
}

deleteAllBtn?.addEventListener('click', () => {
    if (!confirm('Delete ALL saved chat sessions? This cannot be undone.')) return;
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('gemini_session_')) keysToRemove.push(key);
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    currentSession = null;
    chatHistory = [];
    chatArea.innerHTML = '';
    appendMessage('What  do you want to learn?', 'ai');
    renderSessions();
});

function loadSession(name) {
    const key = 'gemini_session_' + name;
    const data = localStorage.getItem(key);
    if (!data) return;
    const messages = JSON.parse(data);
    chatArea.innerHTML = '';
    chatHistory = [];
    messages.forEach(m => appendMessage(m.text, m.sender));
    currentSession = name;
}

saveChatBtn?.addEventListener('click', saveCurrentSession);
newChatBtn?.addEventListener('click', function() {
    if (chatHistory.length > 0 && !confirm('Start a new chat? Unsaved conversation will be lost.')) return;
    chatHistory = [];
    currentSession = null;
    chatArea.innerHTML = '';
    appendMessage('What do you want to learn?', 'ai');
    input.focus();
});
renderSessions();

chatForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const promptText = input.value.trim();
    if (!promptText) return;
    input.value = "";
    input.style.height = 'auto';
    sendPrompt(promptText);
});

input.addEventListener('keydown', function(e){
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.requestSubmit();
    }
});

function autosizeTextarea(el){
    el.style.height = 'auto';
    const newH = Math.min(el.scrollHeight, 140);
    el.style.height = newH + 'px';
}
input.addEventListener('input', function(){ autosizeTextarea(this); });

window.onload = () => {
    appendMessage("What can I help you with?", "ai");
    input.focus();
};
