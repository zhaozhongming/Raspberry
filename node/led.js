//////////////////////////////////////////////////////////////////////
var gpio = require("rpi-gpio");
var readLine = require("readline");
var interval = 0;
var currentValue = false;

var rl = readLine.createInterface({input: process.stdin,output: process.stdout});
gpio.setup(38, gpio.DIR_OUT, notQuiteReady);

function notQuiteReady() {
	gpio.setup(40, gpio.DIR_OUT, ready);
}

///////////////////////////////Azure IoT message////////////////////////////////////////////////
var clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
var Message = require('azure-iot-device').Message;

//the sharedkey is the one in Device tab
var connectionString = 'HostName=IoThubZhaoz1.azure-devices.net;DeviceId=Raspberry1;SharedAccessKey=aGSneKO7wnGmA04KqvzSImRMSfJnLFtQ0uoJA7IWH7U=';
var client = clientFromConnectionString(connectionString);

function printResultFor(op) {
   return function printResult(err, res) {
     if (err) console.log(op + ' error: ' + err.toString());
     if (res) console.log(op + ' status: ' + res.constructor.name);
   };
 }

var connectCallback = function (err) {
   if (err) {
     console.log('Could not connect: ' + err);
   } else {
     console.log('by the way, the Azure IoThub is connected');


		client.on('message', function (msg) {
       console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
       client.complete(msg, printResultFor('completed'));
		var d = msg.data;
		if (d.indexOf("on")>-1) {
			setPin(true, askWhatToDo);
		}
		else if (d.indexOf("off")>-1) {
			setPin(false, askWhatToDo);
		}
		else if (d.indexOf("fancy")>-1) {
			if (interval !== 0) {
				clearInterval(interval);
			}

			interval = setInterval(function () {
								currentValue = !currentValue; 
								setPin(currentValue);
						}, 500);
		}	
		
     });
   }
 };

function ConnectAzureIoT() {
	client.open(connectCallback);
}

function ready() {
	ConnectAzureIoT();
	askWhatToDo();
}

function askWhatToDo() {
		rl.question("Please enter 1 or 0 to turn on/off, f for fancy, q for quit: \r\n",
				 function (answer) {
						switch (answer) {
							case "1":setPin(true, askWhatToDo);
								break;
							case "0":setPin(false, askWhatToDo);
								break;
							case "f":
										if (interval !== 0) {
											clearInterval(interval);
											break;
										}
	
										interval = setInterval(function () {
															currentValue = !currentValue; 
															setPin(currentValue);
														}, 500);
								break;
							case "q":
								quit();
								return;
							break;
						}
	
						askWhatToDo();
				});
}

function setPin(on, callback) {
			gpio.write(38, on, function(err) {
						gpio.write(40, !on, function(err) {
							if (err) throw err;
							if (callback) callback();
						});});}

function quit() {
	gpio.destroy(function () {process.exit();});
}