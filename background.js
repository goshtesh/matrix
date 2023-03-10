/* Check whether new version is installed */
chrome.runtime.onInstalled.addListener(function(details) {
    /* other 'reason's include 'update' */
    if (details.reason == "install") {
        /* If first install, set uninstall URL */
        var uninstallGoogleFormLink = 'https://forms.gle/6LCnPNnEjrzKhkgF8';
        /* If Chrome version supports it... */
        if (chrome.runtime.setUninstallURL) {
            chrome.runtime.setUninstallURL(uninstallGoogleFormLink);
        }
    }
});