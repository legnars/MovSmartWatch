var equipmentListTau = null;

(function(tau) {
	console.log("Initializing Equipment-list.js");

	var page = document.getElementById("equipment-list"), listHelper, elScroller;

	onBluetoothDevicesChange = populateList;

	page.addEventListener("pagebeforeshow", function(e) {
		var list;

		elScroller = page.querySelector(".ui-scroller");
		if (elScroller) {
			list = elScroller.querySelector(".ui-listview");
		}

		if (elScroller && list) {
			//listHelper = tau.helper.SnapListStyle.create(list, {
				//animate : "scale"
			//});

			elScroller.setAttribute("tizen-circular-scrollbar", "");
		}
	});

	page.addEventListener("pagebeforehide", function(e) {
		if (listHelper) {
			listHelper.destroy();

			listHelper = null;

			if (elScroller) {
				elScroller.removeAttribute("tizen-circular-scrollbar");
			}
		}
	});
}(tau));

function populateList() {
	if (bluetoothDevices) {
		$('#equipment-listview').html('');

		for (var int = 0; int < bluetoothDevices.length; int++) {
			var device = bluetoothDevices[int];

			$('#equipment-listview').append(
					'<li onClick="selectDevice(this)" id="' + device.address
							+ '"><a href="#">' + device.name + '</a></li>');
		}
	}
}

function selectDevice(device) {
	if (device) {
		connectToDevice(device.id);
		tau.changePage("exercise.html");
	}
}