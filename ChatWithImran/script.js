const loginContainer = document.getElementById('login-container');
const chatContainer = document.getElementById('chat-container');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
let username = localStorage.getItem('username') || '';
let profilePic = localStorage.getItem('profilePic') || '';

function renderMessages() {
    messagesDiv.innerHTML = '';
    const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    messages.forEach((msg, index) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `
            <img src="${msg.profilePic}" alt="Profile Picture">
            <strong>${msg.username}</strong>: ${msg.message}
            <br><small>${new Date(msg.timestamp).toLocaleString()}</small>
            <div class="buttons">
                <button onclick="editMessage(${index})">Edit</button>
                <button onclick="deleteMessage(${index})">Delete</button>
            </div>`;
        messagesDiv.appendChild(messageElement);
    });
}

function sendMessage() {
    const message = messageInput.value;
    if (message.trim() !== '') {
        const chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
        chatMessages.push({ username, message, profilePic, timestamp: new Date().getTime() });
        localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
        renderMessages();
        messageInput.value = '';
    }
}

function editMessage(index) {
    const chatMessages = JSON.parse(localStorage.getItem('chatMessages'));
    const newMessage = prompt("Edit your message:", chatMessages[index].message);
    if (newMessage) {
        chatMessages[index].message = newMessage;
        localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
        renderMessages();
    }
}

function deleteMessage(index) {
    const chatMessages = JSON.parse(localStorage.getItem('chatMessages'));
    chatMessages.splice(index, 1);
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
    renderMessages();
}

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

document.getElementById('login-button').addEventListener('click', () => {
    username = document.getElementById('username').value.trim();
    const fileInput = document.getElementById('profile-pic');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            profilePic = e.target.result;
            localStorage.setItem('profilePic', profilePic);
            login();
        };
        reader.readAsDataURL(file);
    } else {
        login();
    }
});

function login() {
    if (username) {
        localStorage.setItem('username', username);
        localStorage.setItem('loginTime', new Date().getTime());
        loginContainer.style.display = 'none';
        chatContainer.style.display = 'block';
        renderMessages();
    }
}

// Check if there's a saved username
if (username) {
    loginContainer.style.display = 'none';
    chatContainer.style.display = 'block';
    renderMessages();
}

// Clear profile after 2 days
if (username && (new Date().getTime() - localStorage.getItem('loginTime')) > 2 * 24 * 60 * 60 * 1000) {
    localStorage.removeItem('username');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('profilePic');
}
