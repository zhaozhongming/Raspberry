// blink.c
//
// Example program for bcm2835 library
// Blinks a pin on an off every 0.5 secs
//
// After installing bcm2835, you can build this 
// with something like:
// make or gcc -o rect rect.c -lbcm2835
// sudo ./led

#include <bcm2835.h>
#include <stdio.h>
#define uchar unsigned char
#define uint unsigned int


#define Max7219_pinCLK  RPI_GPIO_P1_23
#define Max7219_pinCS  RPI_GPIO_P1_24
#define Max7219_pinDIN  RPI_V2_GPIO_P1_19


/*
I heart U

1000000000001001		x80 09
1000110011001001	   x8C C9
1001111111101001		x9F E9
1001111111101001		x9F E9	
1001111111101001		x9F E9
1000111111001001		x8F C9
1000011110001001		x87 89
1000001100000110		x83 06

*/
uchar disp1[2][8] = {
	{0x00,0x8C,0x9F,0x9F,0x9F,0x8F,0x87,0x83},
	{0x00,0xC9,0xE9,0xE9,0xE9,0xC9,0x89,0x06}
};

void Delay_xms(uint x)
{
	bcm2835_delay(x);
}

void Write_Max7219_byte(uchar DATA)
{
	uchar i ;
	bcm2835_gpio_write(Max7219_pinCS,LOW);
	
	bcm2835_spi_transfer(DATA);


}
void Write_Max7219(uchar address1,uchar dat1,uchar address2,uchar dat2)
{
	bcm2835_gpio_write(Max7219_pinCS,LOW);

	Write_Max7219_byte(address1);

	Write_Max7219_byte(dat1); 

	Write_Max7219_byte(address2);

	Write_Max7219_byte(dat2);

	bcm2835_gpio_write(Max7219_pinCS,HIGH);

}

void Init_MAX7219(void)
{
	Write_Max7219(0x09,0x00,0x09,0x00);
	Write_Max7219(0x0a,0x03,0x0a,0x03);
	Write_Max7219(0x0b,0x07,0x0b,0x07);
	Write_Max7219(0x0c,0x01,0x0c,0x01);
	Write_Max7219(0x0f,0x00,0x0f,0x00);
}

void main(void)
{
	printf("bcm init......\r\n");

	uchar i , j;
	if (!bcm2835_init())
	{
		printf("bcm failed.\r\n");
		return;
	}
	printf("bcm init sucess.\r\n");

	bcm2835_spi_begin();
	bcm2835_spi_setBitOrder(BCM2835_SPI_BIT_ORDER_MSBFIRST);      // The default
	bcm2835_spi_setDataMode(BCM2835_SPI_MODE0);                   // The default
	bcm2835_spi_setClockDivider(BCM2835_SPI_CLOCK_DIVIDER_256); // The default

	bcm2835_gpio_fsel(Max7219_pinCS, BCM2835_GPIO_FSEL_OUTP); 

 	bcm2835_gpio_write(disp1[j][i],HIGH);

	Delay_xms(50);
	Init_MAX7219();
	
	double a;

	while(1)
 	{
		for(i = 1;i<9;i++)
			Write_Max7219(i , disp1[1][i-1],i,disp1[0][i-1]);
		Delay_xms(1000);

		for(i = 1;i<9;i++)
			Write_Max7219(i , 0x00,i, 0x00);
		Delay_xms(1000);
	}
	
	for(i = 1;i<9;i++)
		Write_Max7219(i , 0x00,i, 0x00);

	bcm2835_spi_end();
	bcm2835_close();

	return;
}

