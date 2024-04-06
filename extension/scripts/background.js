chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "getHTML") {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                if (tabs[0].url.startsWith('http://') || tabs[0].url.startsWith('https://')) {
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        function: getHTML
                    }).then((results) => {
                        sendResponse({ html: results[0].result });
                    }).catch((error) => {
                        console.error('Error executing script:', error);
                    });
                }
                });
        }
        return true;  // Will respond asynchronously.
    }
);

function getHTML() {
    return document.documentElement.outerHTML;
}
