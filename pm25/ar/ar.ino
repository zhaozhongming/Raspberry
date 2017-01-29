#include "LedControl.h" //  need the library
LedControl lc=LedControl(12,11,10,2); // 

byte dic[80] = {
    B00000000,
    B01110000,	//0
    B10001000,
    B10011000,
    B10101000,
    B11001000,
    B10001000,
    B01110000,
  
    B00000000,
    B01000000,	//1
    B11000000,
    B01000000,
    B01000000,
    B01000000,
    B01000000,
    B11100000,

    B00000000,  
    B01110000,	//2
    B10001000,
    B00001000,
    B00010000,
    B00100000,
    B01000000,
    B11111000,
   
    B00000000,
    B11111000,	//3
    B00010000,
    B00100000,
    B00010000,
    B00001000,
    B10001000,
    B01110000,
 
    B00000000,   
    B00010000,	//4
    B00110000,
    B01010000,
    B10010000,
    B11111000,
    B00010000,
    B00010000,

    B00000000,    
    B11111000,	//5
    B10000000,
    B11110000,
    B00001000,
    B00001000,
    B10001000,
    B01110000,
  
    B00000000,
    B00110000,	//6
    B01000000,
    B10000000,
    B11110000,
    B10001000,
    B10001000,
    B01110000,
 
    B00000000,   
    B11111000,	//7
    B10001000,
    B00001000,
    B00010000,
    B00100000,
    B00100000,
    B00100000,

    B00000000,
    B01110000,	//8
    B10001000,
    B10001000,
    B01110000,
    B10001000,
    B10001000,
    B01110000,
    
    B00000000,
    B01110000,	//9
    B10001000,
    B10001000,
    B01111000,
    B00001000,
    B00010000,
    B01100000
};
char buffer [24];

void setup() {
  lc.shutdown(0,false);// turn off power saving, enables display
  lc.setIntensity(0,3);// sets brightness (0~15 possible values)
  lc.clearDisplay(0);// clear screen
  
  // start serial port at 9600 bps:
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
}

void loop() {
  if (Serial.available()>0)
  {
    Serial.readBytes(buffer,24);
    
    int high = int(buffer[12]);
    int low = int(buffer[13]);
    
    int pm = high*256+low;
    
    int n3 = pm/100;
    int n2 = pm/10 - (10*n3);
    int n1 = pm%10;
    
    Serial.print("N");    
    Serial.print(n3);
    Serial.print("N");
    Serial.print(n2);
    Serial.print("N");
    Serial.print(n1);
    
    showNum(0, n2);
    showNum(1, n1);
    
    Serial.print("R");
    Serial.print(pm);
    Serial.print();
  }
}

void showNum(int pos, int num) {
  for(int i=0; i < 8; i++) {
    lc.setRow(pos, i, dic[num*8 + i]);
  }
}

