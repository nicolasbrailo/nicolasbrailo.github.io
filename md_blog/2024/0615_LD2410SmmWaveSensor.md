# LD2410S: mmWave human-presence detection

@meta publishDate 2024-06-15
@meta author Nico Brailovsky
@meta tags IoT

For a project, I bought a bunch of cheap LD2410S, an mmWave (radar) sensor to detect human presence (I actually started with an infrared sensor, but it had too many false negatives for my use case). The ones I got were pre-flashed with firmware to use a pin to announce presence or absence. To figure out if it's working or not, I tried using my [GPIOmon](md_blog/2024/0615_RaspberryPiGpioMon.md) byt found the sensor so accurate, that I couldn't manage to not detect my presence when in the room, no mater what material I used to cover it. Instead, I had to leave the room, and only then confirm the sensor was working as expected by looking at the GPIOmon logs.

The LD2410S also has a UART interface, and comes with a (Windows only) test app, but I wasn't able to make it work under Wine. I spent a bit of time reverse engineering how to talk UART with the LD2410S from the manual, and I got halfway there. There are examples, but many of them (even in the manufacturer's page) seem to be for a different model, and the LD2410S doesn't behave quite the same. First, I tested a basic command to figure out how to talk to the sensor:

```
import serial
import binascii

ser = serial.Serial('/dev/ttyUSB1', 115200, timeout=10)

def read_ser():
    data = b''
    while True:
        data = data + binascii.hexlify(ser.read())
        if data.endswith(b'04030201') or data.endswith(b'08070605') or len(data) > 50:
            print(' <= ', data)
            return

def ser_message(msg):
    head = "FDFCFBFA"
    tail = "04030201"
    fullmsg = head + msg + tail
    print(' => ', fullmsg)
    ser.write(binascii.unhexlify(fullmsg))
    read_ser()

# Enter config mode
ser_message("0400" + "FF000100")

# Request serial
ser_message("0200" + "1100")

# Write new serial
ser_message("0C00" + "10000800" + "BADB0B00F00DF00D")

# Request serial
ser_message("0200" + "1100")

# Disable config mode
ser_message("0400" + "FE010000")

ser.close()
```

If things work, the reply to the 4th message (request serial) should be the serial we set in the message just before. Something like `<=  b'fdfcfbfa0e00110100000800BADB0B00F00DF00D04030201'`. Once that worked, I knew I could talk to the device over UART, but I still couldn't make sense of the periodic reports the device was sending:


```
import serial
import binascii

ser = serial.Serial('/dev/ttyUSB1', 115200, timeout=10)

data = b''
while True:
    data = data + binascii.hexlify(ser.read())
    if len(data) == 10:
        print('< ', data)
        data = b''

ser.close()
```

The periodic messages here didn't match any of the messages specified in the docs I found, so I printed these out together with the GPIO status. Got something like this:

```
<  b'6e02320162'    GPIO=1
<  b'6e02320162'    GPIO=1
<  b'6e00000062'    GPIO=0
<  b'6e00000062'    GPIO=0
...
<  b'6e00000062'    GPIO=0
<  b'6e01000062'    GPIO=0
<  b'6e01000062'    GPIO=0
<  b'6e02d20062'    GPIO=1
<  b'6e02d20062'    GPIO=1
<  b'6e02d20062'    GPIO=1
<  b'6e02d20062'    GPIO=1
```

I still haven't figured out what these messages mean, and my weekend timedout so it will have to wait (unless a kind reader of this note can drop me a line with info on how to parse the sensor's report, that is.)


