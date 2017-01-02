import serial, time

ser = serial.Serial('/dev/ttyAMA0', 9600, timeout=3)

while 1:
	print 'start'
	serial_line = ser.read()
	print 'end'
	print serial_line # If using Python 2.x use: print serial_line
	time.sleep(3)

ser.close() 
