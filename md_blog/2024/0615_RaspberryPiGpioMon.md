# RaspberryPi gpio cli monitor

@meta publishDate 2024-06-15
@meta author Nico Brailovsky
@meta tags IoT, RaspberryPi

I wrote a [small CLI utility to display when a GPIO pin changes state in a Raspberry Pi](https://github.com/nicolasbrailo/pi_gpio_mon/tree/main).

Using [gpiomon](https://github.com/nicolasbrailo/pi_gpio_mon/tree/main), it's possible to monitor all pins to get an output like this:

```
$ ./gpiomon
CNT P00 P01 P02 P03 P04 P05 P06 P07 P08 P09 P10 P11 P12 P13 P14 P15 P16 P17 P18 P19 P20 P21 P22 P23 P24
000 >1< >1< >1< >1< >1< >1< >1< >1< >1<  0   0   0   0   0   0  >1<  0   0   0   0   0  >1<  0   0   0
001  1   1   1   1   1   1   1   1   1   0   0   0   0   0  >1<  1   0   0   0   0   0   1   0   0   0
002  1   1   1   1   1   1   1   1   1   0   0   0   0   0   1   1   0   0   0   0   0   1   0   0   0
003  1   1   1   1   1   1   1   1   1   0   0   0   0   0   1   1   0   0   0   0   0   1   0   0   0
004  1   1   1   1   1  >1<  1   1   1   0   0   0   0   0   1   1   0   0   0   0   0   1   0   0   0
005  1   1   1   1   1   1   1   1   1   0   0   0   0   0   1   1   0   0   0   0   0   1   0   0   0
```

Where the left most column is the number of seconds since startup. It's also easy to monitor a single pin:

```
$ ./gpiomon 21
000 PIN 21 = >1<
001 PIN 21 =  1
002 PIN 21 =  1
003 PIN 21 = >0<
004 PIN 21 =  0
005 PIN 21 =  0
006 PIN 21 = >1<
007 PIN 21 =  1
```

And most useful of all, an option to only print out (log) when a pin changes state. Eg:

```
$ ./gpiomon -u -l 21
000 PIN 21 = >1<
009 PIN 21 = >0<
015 PIN 21 = >1<
```

