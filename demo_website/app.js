"use strict";
(function() {
	
	// Ensure the Chrome APIs are available
	if(!chrome) {
		alert("This demo must be run within Chrome");
		return;
	}

	// Cache the DOM elements we'll be using
	var statusSpan = document.getElementById("ext-status"),
		inlineInstallParagraph = document.getElementById("inline-install"),
		inlineInstallButton = document.getElementById("inline-install-button");
	
	// Add a click listener to the inline install button
	inlineInstallButton.addEventListener("click", attemptInlineInstall);
	
	// Method to call to check if the extension is installed or not, then update the related Status <span>
	function retryExtensionCheck() {
		checkExtensionIsInstalled(function() {
			statusSpan.innerText = "Installed";
			statusSpan.setAttribute("class", "installed");
		}, function() {
			statusSpan.innerText = "Not Installed";
			statusSpan.setAttribute("class", "not-installed");
			showInlineInstallMessage();
		});
	}
	
	// Check on DOM ready
	retryExtensionCheck();
	
	// Attempts to install the extension from the Chrome web store
	function attemptInlineInstall() {
		// We can pull the link from the chrome-webstore-item link in the <head>
		chrome.webstore.install(document.querySelector("link[rel='chrome-webstore-item']").getAttribute("href"), function () {
			// Try the extension check on success & failure so that the status <span> is updated
			retryExtensionCheck();
		}, function (e) {
			retryExtensionCheck();
		});
	}
	
	// Show the inline install paragraph
	function showInlineInstallMessage() {
		inlineInstallParagraph.setAttribute("class", "show");
	}

	// Checks to see if the extension is installed and calls the necessary callback
	function checkExtensionIsInstalled(success, failure) {
		// If the Chrome.Runtime API is not defined, the domain has not been added to the manifest or the extension is not installed
		if(!chrome.runtime) {
			failure.call();
			return;
		}
		statusSpan.innerHTML = "Checking...";
		// Send a message to the Extension ID
		chrome.runtime.sendMessage("nakeofmieafnillbhheaknangaopehal", { message: "version" },
			function (reply) {
				// We should get a reply, but the reply may be undefined if the extension isn't installed
				// I have put an additional check to ensure that the versionCode >= 1 but this may not
				// be necessary for your situation and if(reply) may suffice
				if(reply && reply.versionCode >= 1) {
					success.call();
				}
				else {
					failure.call();
				}
			}
		);
	}
}());