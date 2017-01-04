var SerialPort = require("serialport");
SerialPort.autoOpen = false;
var serialPort = new SerialPort("/dev/ttyAMA0", {
 baudrate: 9600
});

serialPort.on("open", function () {
  console.log('open');
  serialPort.on('data', function(data) {
    console.log('data received: ' + data);
  });
  serialPort.write("lsn", function(err, results) {
    console.log('err ' + err);
    console.log('results ' + results);
  });
});