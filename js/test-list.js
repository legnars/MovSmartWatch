(function() {
	var page, interval;

	page = document.getElementById('equipment-list');

	function pageHideHandler() {
		window.clearInterval(interval);

		page.removeEventListener('pageshow', pageBeforeShowHandler);
		page.removeEventListener('pagehide', pageHideHandler);

		page = null;
		interval = null;
	}

	function pageBeforeShowHandler() {
		interval = window.setInterval(generateBluetoothDevices, 3000);
	}

	page.addEventListener('pagehide', pageHideHandler);
	page.addEventListener('pagebeforeshow', pageBeforeShowHandler);
}());

function generateBluetoothDevices() {
	// Add bluetooth gym equipments
	var test1 = {
		address : '1',
		name : 'Leg Press Horizontal',
		txpowerlevel : Math.floor((Math.random() * 650) + 100),
		connect : function(success, error) {
			success();
		},
		disconnect : function() {
			console.log("Disconnecting from current device.")
		}
	};

	var test2 = {
		address : '2',
		name : 'Leg Press 90',
		txpowerlevel : Math.floor((Math.random() * 650) + 100),
		connect : function(success, error) {
			success();
		},
		disconnect : function() {
			console.log("Disconnecting from current device.")
		}
	};

	var test3 = {
		address : '3',
		name : 'Supino Reto',
		txpowerlevel : Math.floor((Math.random() * 650) + 100),
		connect : function(success, error) {
			success();
		},
		disconnect : function() {
			console.log("Disconnecting from current device.")
		}
	};

	onDeviceFound(test1);
	onDeviceFound(test2);
	onDeviceFound(test3);
}