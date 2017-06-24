var currentSet = 1;
var currentRep = 0;
var currentRepPercentage = 0;
var currentRest = 0;

var progressBarWidget;
var restTimeout = null;
var decreaseTimer = false;

(function() {
	var page;
	var progressBar = document.getElementById('circleprogress'), isCircle = tau.support.shape.circle;

	page = document.getElementById('exercise');

	function clearVariables() {
		page = null;
		progressBar = null;
	}

	function unbindEvents() {
		page.removeEventListener('pageshow', pageBeforeShowHandler);
		page.removeEventListener('pagehide', pageHideHandler);
	}

	function pageHideHandler() {
		unbindEvents();
		clearVariables();
		/* Release the object */
		progressBarWidget.destroy();
	}

	function pageBeforeShowHandler() {
		if (isCircle) {
			/* Make the circular progressbar object */
			progressBarWidget = new tau.widget.CircleProgressBar(progressBar, {
				size : 'full'
			});
		}

		$("#rest-title").hide();
		$("#rest-count").hide();

		changeSet(currentSet);
		changeRep(currentRep);
		changeRepPercentage(currentRepPercentage);
	}

	page.addEventListener('pagehide', pageHideHandler);
	page.addEventListener('pagebeforeshow', pageBeforeShowHandler);
}());

function changeSet(set) {
	console.log("Change current set to " + set);
	currentSet = set;

	$("#set-count").html(currentSet);
}

function changeRep(rep) {
	console.log("Change current rep to " + rep);
	currentRep = rep;

	$("#rep-count").html(currentRep);
}

function changeRepPercentage(repPercentage) {
	if (restTimeout) {
		console.log('Ending rest');

		clearInterval(restTimeout);
		restTimeout = null;

		$("#rest-count").slideUp("fast");
		$("#rep-count").slideDown('fast');

		$("#rest-title").slideUp("fast");
		$("#rep-title").slideDown('fast');
	}

	if (repPercentage < 0) {
		repPercentage = 0;
	} else if (repPercentage > 100) {
		repPercentage = 100;
	}

	if (repPercentage <= 50) {
		currentRepPercentage = repPercentage * 2;
	} else if (repPercentage <= 100) {
		currentRepPercentage = (100 - repPercentage) * 2;
	}

	console.log("Change current rep percentage to " + currentRepPercentage);

	updateProgressBar();
}

function changeRest(rest) {
	console.log("Change current rest to " + rest);

	currentRest = rest;

	if (currentRest < 0) {
		currentRest = 0;
	}

	$("#rest-count").html(millisToMinutesAndSeconds(currentRest));
}

function startRest(restTime) {
	console.log('Starting rest for ' + restTime);

	var startTime = tizen.time.getCurrentDateTime();
	changeRest(restTime);

	if (currentRest && currentRest > 0) {
		$("#rest-count").removeClass('blue green').addClass('green');
		decreaseTimer = true;
	} else {
		$("#rest-count").removeClass('blue green').addClass('blue');
		decreaseTimer = false;
	}

	restTimeout = window.setInterval(restInterval, 1000, startTime, restTime);

	$("#rep-count").slideUp("fast");
	$("#rest-count").slideDown('fast');
	$("#rep-title").slideUp("fast");
	$("#rest-title").slideDown('fast');
}

function restInterval(startTime, restTime) {
	var duration = tizen.time.getCurrentDateTime().difference(startTime).length;
	console.log(decreaseTimer);
	console.log(duration);
	console.log(startTime);

	if (startTime != null && restTime != null) {
		if (decreaseTimer) {
			if (currentRest === 0) {
				$("#rest-count").removeClass('blue green').addClass('blue');

				decreaseTimer = false;
			} else {
				changeRest(restTime - duration);
			}
		}

		if (!decreaseTimer) {
			changeRest(duration);
		}
	}
}

function updateProgressBar() {
	progressBarWidget.value(currentRepPercentage);
}

function millisToMinutesAndSeconds(millis) {
	var minutes = Math.floor(millis / 60000);
	var seconds = ((millis % 60000) / 1000).toFixed(0);
	return (seconds == 60 ? (minutes + 1) + ":00" : minutes + ":"
			+ (seconds < 10 ? "0" : "") + seconds);
}