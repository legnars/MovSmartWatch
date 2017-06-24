(function() {
	backButton();
}());

function backButton() {
	window.addEventListener("tizenhwkey", function(ev) {
		var activePopup = null;

		if (ev.keyName === "back") {
			activePopup = document.querySelector(".ui-popup-active");
			var page = document.getElementsByClassName("ui-page-active")[0];
			var pageid = page ? page.id : "";

			if (pageid === "main" && !activePopup) {
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {
				}
			} else {
				window.history.back();
			}
		}
	});
}