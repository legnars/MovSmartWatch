(function() {
	// TODO: Test with real bluetooth
	// bluetoothControl();
}());

var bluetoothAdapter = null;
var bluetoothDevices = [];
var onBluetoothDevicesChange = null;
var connectedDevice = null;

function connectToDevice(deviceAddress) {
	console.log("Attempt to connect to device " + deviceAddress);
	
	if (deviceAddress) {
		if (connectedDevice != null) {
			connectedDevice.disconnect();
		}

		connectedDevice = searchDevice(deviceAddress);
		connectedDevice.connect(connectSuccess, connectFailure);
	}
}

function connectSuccess() {
	console.log("Connected successfully to equipment " + connectedDevice.name);
	stopScan();
}

function connectFailure(error) {
	console.log("Failed to connect to device: " + error.message);
}

function beginScan(onError) {
	try {
		bluetoothAdapter.startScan(onDeviceFound, onError);
	} catch (e) {
		// TODO: handle exception
		console.log(e);
	}
}

function stopScan() {
	if (bluetoothAdapter) {
		bluetoothAdapter.stopScan();
	}
	bluetoothDevices = [];
}

function bluetoothControl() {
	try {
		bluetoothAdapter = tizen.bluetooth.getLEAdapter();
	} catch (e) {
		// TODO: handle exception
		console.log(e);
	}

	beginScan(onScanError);
}

function onDeviceFound(device) {
	console.log('Found device - name: ' + device.name);
	console.log('Found device - power: ' + device.txpowerlevel);

	if (!updateDevice(device)) {
		bluetoothDevices.push(device);
	}

	bluetoothDevices = bluetoothDevices.sort(sortDevices);

	if (onBluetoothDevicesChange) {
		onBluetoothDevicesChange();
	}
}

function sortDevices(a, b) {
	return b.txpowerlevel - a.txpowerlevel;
}

function onScanError(e) {
	console.log(e.message);

	if (e.name === 'ServiceNotAvailableError') {
		tryEnableBluetooth();
	}
}

function tryEnableBluetooth() {
	var serviceReply = {
		/* Called when the launched application reports success */
		onsuccess : serviceReplySuccess,
		/* Called when launched application reports failure */
		onfailure : serviceReplyFailure
	};

	var bluetoothSwitchAppControl = new tizen.ApplicationControl(
			'http://tizen.org/appcontrol/operation/edit', null,
			'application/x-bluetooth-on-off');

	console.log('Try to launch the Bluetooth Settings application.');

	try {
		tizen.application.launchAppControl(bluetoothSwitchAppControl, null,
				launchSuccess, launchError, serviceReply);
	} catch (e) {
		// TODO: handle exception
		console.log(e);
	}
}

function serviceReplySuccess(data) {
	console.log(data);
	beginScan(onScanError);
}

function serviceReplyFailure() {
	alert('Bluetooth Settings application reported failure.');

	exitApp();
}

function launchSuccess() {
	console.log('Bluetooth Settings application is successfully launched.');
}

function launchError(error) {
	alert('An error occurred: ' + error.name
			+ '. Please enable Bluetooth through the Settings application.');

	exitApp();
}

function exitApp() {
	try {
		tizen.application.getCurrentApplication().exit();
	} catch (e) {
		// TODO: handle exception
		console.log(e);
	}
}

function searchDevice(address) {
	for (var i = 0; i < bluetoothDevices.length; i++) {
		if (bluetoothDevices[i].address === address) {
			return bluetoothDevices[i];
		}
	}
}

function updateDevice(device) {
	for (var i = 0; i < bluetoothDevices.length; i++) {
		if (bluetoothDevices[i].address === device.address) {
			bluetoothDevices[i] = device;
			return true;
		}
	}

	return false;
}