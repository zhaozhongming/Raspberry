var gpio = require('rpi-gpio');
 
gpio.setup(7, gpio.DIR_IN, readInput);
 
function readInput() {
	  gpio.read(7, function(err, value) {
		console.log('anyone here ' + value);
			if (err) throw err;
			sleep(3);
			readInput();
    	});
}


