(function(tau) {
	var page = document.getElementById('main');

	function clearVariables() {
		page = null;
	}

	function unbindEvents() {
		page.removeEventListener('pageshow', pageBeforeShowHandler);
		page.removeEventListener('pagehide', pageHideHandler);
	}

	function pageHideHandler() {
		unbindEvents();
		clearVariables();
	}

	function pageBeforeShowHandler() {
		var mainButton = document.getElementById('main-button');
		mainButton.addEventListener('click', function() {
			tau.changePage('equipment-list.html');
		});
	}

	page.addEventListener('pagehide', pageHideHandler);
	page.addEventListener('pagebeforeshow', pageBeforeShowHandler);
}(tau));