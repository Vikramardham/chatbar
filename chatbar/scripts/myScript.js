// top level await is available in ES modules loaded from script tags
// const [tab] = await chrome.tabs.query({
//   active: true,
//   lastFocusedWindow: true
// });

// const tabId = tab.id;
// const button = document.getElementById('openSidePanel');
// button.addEventListener('click', async () => {
//   await chrome.sidePanel.open({ tabId });
//   await chrome.sidePanel.setOptions({
//     tabId,
//     path: 'sidepanel-tab.html',
//     enabled: true
//   });
// });

// Send the entire HTML content to the server on page load
window.addEventListener('load', () => {
    chrome.runtime.sendMessage({ message: "getHTML" }, function (response) {
        const htmlContent = response.html;
        fetch('http://127.0.0.1:8000/send-html', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ html: htmlContent })
        });
    });
});

// Handle form submission and send the message to the server

const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const messageList = document.getElementById('messages');
function appendMessage(text, sender) {
    const messageItem = document.createElement('li');

    // Create a strong element for the sender's name
    const senderName = document.createElement('strong');
    senderName.textContent = sender === 'user' ? 'You' : 'Bot';
    messageItem.appendChild(senderName);

    const messageText = document.createElement('div');
    messageText.textContent = text;
    messageItem.appendChild(messageText);
    messageList.appendChild(messageItem);

    // Scroll to the bottom of the chat window
    messageList.scrollTop = messageList.scrollHeight;

}

chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = chatInput.value.trim();
    if (message) {
        appendMessage(`${message}`, 'user');
        chatInput.value = '';

        const loadingItem = document.createElement('li');
        loadingItem.textContent = 'Loading...';
        messageList.appendChild(loadingItem);

        fetch('http://127.0.0.1:8000/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                messageList.removeChild(loadingItem);
                appendMessage(`${data.response}`, 'Bot');
            })
            .catch(error => {
                messageList.removeChild(loadingItem);
                console.error('Error sending message to server:', error);
            });
    }
});