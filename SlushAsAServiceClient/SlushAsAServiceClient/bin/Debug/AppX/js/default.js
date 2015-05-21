// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
	"use strict";

	var app = WinJS.Application;
	var activation = Windows.ApplicationModel.Activation;

	app.onactivated = function (args) {
		if (args.detail.kind === activation.ActivationKind.launch) {
			if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
				var updateMinutes = function(){
				    document.getElementById("remaining").innerText = document.getElementById("minutesSlider").value +" minutes";
                }
				document.getElementById("minutesSlider").addEventListener("change", updateMinutes);
				updateMinutes();

			    var socket = io("http://slushasaservice.azurewebsites.net");
				io.on('event', function (data) {
				    if (data.action == "status") {
				        if (data.status == "stop") {
				            document.getElementById("serverMessage").innerText = "Stopped at " + new Date();
				        }
				        if (data.status == "start") {
				            document.getElementById("serverMessage").innerText = "Started at " + new Date()+", will be active "+data.time+" minutes";
				        }
				    }
				});
				document.getElementById("startButton").addEventListener("click", function () {
				    io.emit('event', { "action": "start", "time": document.getElementById("minutesSlider").value });
				});
				document.getElementById("stopButton").addEventListener("click", function () {
				    io.emit('event', { "action": "stop" });
				});
			} else {
				// TODO: This application has been reactivated from suspension.
				// Restore application state here.
			}
			args.setPromise(WinJS.UI.processAll());
		}
	};

	app.oncheckpoint = function (args) {
		// TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
		// You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
		// If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
	};

	app.start();
})();
