chrome.runtime.onMessage.addListener(function(message, sender) {
    chrome.tabs.query({}, function(tabs) {
        for (var i = 0; i < tabs.length; i++) {
            chrome.tabs.sendRequest(tabs[i].id, { isWeeb: message.isWeeb });
        }
    });
});
