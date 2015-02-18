(function() {
	"use strict";
	// Expose a listener to allow any websites (as defined in "externally_connectable" in the manifest.json)
	// to query for the installed version number of the extension
    function versionRequestListener(request, sender, sendResponse) {
        if (request && request.message == "version") {
            // Send the response to the client with the version name & code
            sendResponse({version: "0.0.1", versionCode: 1});
        }
        return true;
    };
	
	// Add the listener to the Chrome Runtime
	chrome.runtime.onMessageExternal.addListener(versionRequestListener);
}());