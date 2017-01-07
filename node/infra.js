var gpio = require('rpi-gpio');
var interval = 0;
var currentValue = false;
var index = 1;

var clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
var Message = require('azure-iot-device').Message;

//the sharedkey is the one in Device tab
var connectionString = 'HostName=IoThubZhaoz1.azure-devices.net;DeviceId=Raspberry1;SharedAccessKey=aGSneKO7wnGmA04KqvzSImRMSfJnLFtQ0uoJA7IWH7U=';
var client = clientFromConnectionString(connectionString);


var connectCallback = function (err) {
   if (err) {
     console.log('Could not connect: ' + err);
   } else {
     console.log('Azure IoThub connected, Ready to go!');
   }
 };

client.open(connectCallback);
 
gpio.setup(37, gpio.DIR_OUT, notQuiteReady);

function notQuiteReady() {
	
}

function printResultFor(op) {
   return function printResult(err, res) {
     if (err) console.log(op + ' error: ' + err.toString());
     if (res) console.log(op + ' status: ' + res.constructor.name);
   };
 }

function init() {
	console.log('start');
	gpio.on('change', function(channel, value) {
		if (value) {
	   		console.log('freeze! low your weapon down!');
			gpio.write(37, value, function(err) {
				if (err) throw err;
			});

			//send message to IoT
			var data = JSON.stringify({ deviceId: 'Raspberry1', alarm: index++ });
	         var message = new Message(data);
         		client.sendEvent(message, printResultFor(message.getData()));
			
		}
		else {
			console.log('ok, get out of here');
			gpio.write(37, value, function(err) {
				if (err) throw err;
			});
		}
	});
}

gpio.setup(32, gpio.DIR_IN, gpio.EDGE_BOTH);

console.log('initializing.......');

setTimeout(init, 1000);
