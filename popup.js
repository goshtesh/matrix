
function popup() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { "message": "connectRequest" });
    });
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("ConnectAll").addEventListener("click", popup);
});



function messagepopup() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        var message = document.getElementById("MessageAll").value;
        console.log("message", message)
        chrome.tabs.sendMessage(activeTab.id, { "message": "messageRequest", "text": message });
    });
}



document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('theForm').addEventListener("submit", messagepopup);
});

