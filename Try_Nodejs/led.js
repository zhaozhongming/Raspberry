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
     console.log('Azure IoThub connected');
		client.on('message', function (msg) {
       console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
       client.complete(msg, printResultFor('completed'));
     });
   }
 };

client.open(connectCallback);
