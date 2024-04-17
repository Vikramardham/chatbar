let socket;

function connect() {
    socket = new WebSocket("ws://127.0.0.1:8000/ws");

    socket.onopen = function (e) {
        console.log("[background] Connection established");
    };

    socket.onerror = function (error) {
        console.log(`background.js:[error] ${error.message}`);
    };

    socket.onclose = function (event) {
        console.log('background:WebSocket closed, attempting to reconnect...');
        setTimeout(connect, 1000);
    };

    socket.onmessage = function (event) {
        console.log(`background:[message] Data received from server: ${event.data}`);
        chrome.runtime.sendMessage(JSON.parse(event.data));
        console.log("Message sent to background script");
    };
}

connect();

async function sendHTML(html) {
    if (socket.readyState === WebSocket.OPEN) {
        try {
            socket.send(JSON.stringify({ html: html }));
            console.log("HTML content sent");
            console.log("html:", html.substring(0, 100) + "...");
        } catch (error) {
            console.error("Error sending HTML content:", error);
        }
    } else {
        console.error("WebSocket is not open: ", socket.readyState);
    }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.active && tab.url.startsWith('http')) {
        if (!tab.url.startsWith('https://docs.google.com')) {
            console.log("Tab updated:", tab.url);
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ["scripts/get_html.js"]
            }, (result) => {
                if (chrome.runtime.lastError) {
                    console.error("Error injecting script:", chrome.runtime.lastError);
                } else {
                    //sendHTML(result[0].result.toString());
                    console.log("logging from loop 1");
                }
            });
        }
        else if (tab.url.startsWith('https://docs.google.com')) {
            console.log("Tab updated:", tab.url);
            console.log("tesseract loop");
        }
    }

});

chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        if (tab.url.startsWith('http')) {
            chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["scripts/get_html.js"] }, (result) => {
                if (chrome.runtime.lastError) {
                    console.error("Error injecting script:", chrome.runtime.lastError);
                } else {
                    //sendHTML(result[0].result.toString());
                    console.log("logging from loop 2");
                }
            });
        }
    });
});