
function popup() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        var connectFilter = document.getElementById("Connect-filter").value;
        chrome.tabs.sendMessage(activeTab.id, { "message": "connectRequest", "connectFilter": connectFilter });
    });
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("SelectOptions").addEventListener("submit", popup);
});

function showDiv() {
    document.getElementById('SelectOptions').style.display = "block";
}
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('ConnectAll').addEventListener("click", showDiv);
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

