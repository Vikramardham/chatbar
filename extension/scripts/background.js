let socket;
function connect() {
    socket = new WebSocket("ws://127.0.0.1:8000/ws");

    socket.onopen = function (e) {
        console.log("[open] Connection established");
    };

    socket.onerror = function (error) {
        console.log(`[error] ${error.message}`);
    };

    socket.onclose = function (event) {
        console.log('WebSocket closed, attempting to reconnect...');
        setTimeout(connect, 1000);
    };

    socket.onmessage = function (event) {
        console.log(`[message] Data received from server: ${event.data}`);
    };
}

connect();

async function sendHTML(html) {
    if (socket.readyState === WebSocket.OPEN) {
        try {
            socket.send(JSON.stringify({ html: html }));
            console.log("HTML content sent");
        } catch (error) {
            console.error("Error sending HTML content:", error);
        }
    } else {
        console.error("WebSocket is not open: ", socket.readyState);
    }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    if (changeInfo.status === "complete" && tab.active && tab.url.startsWith('http')) {
        console.log("Tab updated:", tab.url);
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["scripts/get_html.js"] // Replace with your script filename
        }, (result) => {
            if (chrome.runtime.lastError) {
                console.error("Error injecting script:", chrome.runtime.lastError);
            } else {
                //console.log("html:", JSON.stringify(result, null, 2)); // Assuming get_html.js returns HTML as array
                sendHTML(result[0].result.toString());
            }
        });
    }
});

// async function sendHTML(html) {
//     try {
//         const response = await fetch('http://127.0.0.1:8000/send-html', {
//             method: 'POST',
//             mode: 'no-cors',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ "html": html })
//         });
//         console.log("HTML content sent:", response.status);
//     } catch (error) {
//         console.error("Error sending HTML content:", error);
//     }
// }

