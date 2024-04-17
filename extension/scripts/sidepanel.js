document.addEventListener('DOMContentLoaded', (event) => {
    let loadingItem;
    let socket;

    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const messageList = document.getElementById('messages');
    const statusElement = document.getElementById('status');

    function connect() {
        console.log("Attempting to connect...");

        socket = new WebSocket("ws://127.0.0.1:8000/ws");

        socket.onopen = function (e) {
            console.log("[open] Connection established");
            console.log("WebSocket readyState: " + socket.readyState);
        };

        socket.onerror = function (error) {
            console.log(`[error] ${error.message}`);
            console.log("WebSocket readyState: " + socket.readyState);
        };

        socket.onclose = function (event) {
            console.log('WebSocket closed, attempting to reconnect...');
            console.log("WebSocket readyState: " + socket.readyState);
            console.log("Close event code: " + event.code);
            console.log("Close event reason: " + event.reason);
            setTimeout(connect, 1000);
        };

        socket.onmessage = function (event) {
            console.log(`[message] Data received from server: ${event.data}`);
            const data = JSON.parse(event.data);
            if (loadingItem) {
                messageList.removeChild(loadingItem);
                loadingItem = null;
            }
            appendMessage(data.message, 'bot');

            if (data.type === "status") {
                statusElement.textContent = data.message;
            }
        }
    }
    connect();

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

            loadingItem = document.createElement('li');
            loadingItem.textContent = 'Thinking ...';
            messageList.appendChild(loadingItem);

            socket.send(JSON.stringify({ "message": message }));
            console.log("Message sent");
        }
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log("Message received from background:", message);
        if (message.type === "status") {
            statusElement.textContent = message.text;
        }
        //else if (message.type === "response") {
        //    appendMessage(message.text, 'bot');
        //}
    });


});