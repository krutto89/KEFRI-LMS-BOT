function toggleChat() {
  const chat = document.getElementById('chat-widget');
  chat.classList.toggle('open');
}

function sendMessage() {
  const input = document.getElementById('userInput');
  const message = input.value.trim();
  if (!message) return;

  const messages = document.getElementById('messages');

  // Add user message with timestamp
  const userMsg = document.createElement('div');
  userMsg.className = 'user';
  userMsg.innerHTML = `<div>${message}</div><span class="timestamp">${getTime()}</span>`;
  messages.appendChild(userMsg);

  input.value = "";

  // Add typing indicator
  const typing = document.createElement('div');
  typing.className = 'bot typing';
  typing.textContent = 'KEFRI Lexi is typing...';
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;

  // Simulated delay and bot response
// Call backend API
fetch('http://127.0.0.1:8021/librarybot', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ message: message }),
})
.then(response => response.json())
.then(data => {
  typing.remove();
  const botReply = document.createElement('div');
  botReply.className = 'bot';
  botReply.innerHTML = `<div>${data.response}</div><span class="timestamp">${getTime()}</span>`;
  messages.appendChild(botReply);
  messages.scrollTop = messages.scrollHeight;
})
.catch(error => {
  typing.remove();
  const botReply = document.createElement('div');
  botReply.className = 'bot';
  botReply.innerHTML = `<div>Error contacting server. Please try again.</div><span class="timestamp">${getTime()}</span>`;
  messages.appendChild(botReply);
  messages.scrollTop = messages.scrollHeight;
});
}

function getTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
