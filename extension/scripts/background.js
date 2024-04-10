chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.active && tab.url.startsWith('http')) {
        console.log("Tab updated:", tab.url);
        //show html
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["scripts/get_html.js"] // Replace with your script filename
        }, (result) => {
            if (chrome.runtime.lastError) {
                console.error("Error injecting script:", chrome.runtime.lastError);
            } else {
                //console.log("html:", JSON.stringify(result, null, 2)); // Assuming get_html.js returns HTML as array
                sendHTML(result[0].result);
            }
        });
    }
});

async function sendHTML(html) {
    try {
        const response = await fetch('http://127.0.0.1:8000/send-html', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "html": html })
        });
        console.log("HTML content sent:", response.status);
    } catch (error) {
        console.error("Error sending HTML content:", error);
    }
}

