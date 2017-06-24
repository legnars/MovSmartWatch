(function() {
	var page, interval;

	page = document.getElementById('exercise');

	function pageHideHandler() {
		window.clearInterval(interval);

		page.removeEventListener('pageshow', pageBeforeShowHandler);
		page.removeEventListener('pagehide', pageHideHandler);

		page = null;
		interval = null;
	}

	function pageBeforeShowHandler() {
		interval = window.setInterval(generateCharacteristics, 200);
	}

	page.addEventListener('pagehide', pageHideHandler);
	page.addEventListener('pagebeforeshow', pageBeforeShowHandler);
}());

var localRepPercentage = 0;
function generateCharacteristics() {
	console.log("Generating characteristics");

	if (currentSet < 3) {
		if (currentRep < 3) {
			if (localRepPercentage < 100) {
				localRepPercentage += 5;
				changeRepPercentage(localRepPercentage);
			} else {
				localRepPercentage = 0;
				changeRep(currentRep + 1);
				changeRepPercentage(0);
			}
		} else {
			if (restTimeout == null) {
				startRest(15 * 1000);
			} else {
				if (currentRest === 0 || decreaseTimer === false) {
					changeSet(currentSet + 1);
					changeRepPercentage(0);
					changeRep(0);
				}
			}
		}
	} else {
		changeSet(1);
		changeRep(0);
		changeRepPercentage(0);
	}
}