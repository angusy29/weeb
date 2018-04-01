function restoreOptions() {
    chrome.storage.sync.get({
        'isWeeb': true    // default value set to true, when first open extension
    }, function(items) {
        document.getElementById('weeb-toggle-1').checked = items.isWeeb;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    restoreOptions();
    document.getElementById('weeb-toggle-1').addEventListener('click', function(e) {
        chrome.runtime.sendMessage({'isWeeb': e.target.checked});
        // console.log('Now: ' + e.target.checked);
        chrome.storage.sync.set({'isWeeb': e.target.checked}, function() {
            // console.log('Set to: ' + e.target.checked);
        });
    });
});


