function popup() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        var connectFilter = document.getElementById("Connect-filter").value;
        chrome.tabs.sendMessage(activeTab.id, { "message": "connectRequest", "connectFilter": connectFilter });
    });
}

function showDiv() {
    document.getElementById('SelectOptions').style.display = "block";
}

function reset() {
    chrome.storage.local.set({ "contactedPeople": [] });
}


function messagepopup() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        var message = document.getElementById("MessageAll").value;
        chrome.tabs.sendMessage(activeTab.id, { "message": "messageRequest", "text": message });
    });
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("SelectOptions").addEventListener("submit", popup);
    document.getElementById('ConnectAll').addEventListener("click", showDiv);
    document.getElementById('resetButton').addEventListener("click", reset);
    document.getElementById('theForm').addEventListener("submit", messagepopup);
});
