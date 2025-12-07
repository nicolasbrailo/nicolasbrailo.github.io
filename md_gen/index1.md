#
@meta docType index
## Homeboard: wwwslide

Post by Nico Brailovsky @ 2024-09-10 | [Permalink](md_blog/2024/0909_wwwslide.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0909_wwwslide.md&body=I%20have%20a%20comment!)

Homeboard hasn't seen much progress during the holidays, except for a small but useful piece of software: I created [a hacky way to serve pictures over a web interface](https://github.com/nicolasbrailo/wwwslide). This is a fairly fundamental piece of infrastructure for my homeboard project; most of the time these will be displaying some ambient information, but most of the screen's real estate will be used to show my (reasonably large and decades spanning) personal picture collection.

[wwwslide](https://github.com/nicolasbrailo/wwwslide) looks like this:

[![](/blog_img/1009_wwwslide.jpg)](/blog_img/1009_wwwslide.jpg)

From the readme:

> wwwslide is a client/server for LAN slideshows. If you have a large picture collection and want a way to display them in multiple places, wwwslide server will create a web interface to retrieve random pictures from a single url. The web client can display these pictures, but there is no reason to use the included client: you could curl wwwslide and pipe it to an image viewer.

> wwwslide has a server that can be pointed to a local pictures directory. It expects that pictures will be grouped in albums, sorted by /$year/$arbitrary_name/*.jpg (eg 2019/foo/bar/album/*.jpg). On startup, it will pick up one album, randomly, and serve a few pictures from this album to anyone calling its /get_image web endpoint. Once it runs out of pictures for this album, it will select a new random album (with a new random subset of pictures).

> The included client (which can be accessed on the root of the server) can be used to browser this picture (just point your browser to your wwwslide LAN address). It's not very smart, but it should work!

> Remote control: each picture includes a QR code. Scanning the QR will take you to a local page with metadata of the shown image. This page can also be used to control wwwslide (eg to request that this album is displayed from the start, or to select a new album)

> Reverse geolocation: the metadata of each picture includes a reverse-geolocation. No need to guess where you took a picture, wwwslide will guess for you (as long as your pictures have geotags in their exif data)


wwwslide v0 was just a Flask service sending local-disk jpg's, and I found I frequently wondered where a particular picture was taken, or wish I had a way to see more pictures from a specific location. I'm quite proud of the idea to implement this: wwwslide will watermark pictures with a qr-code that can be used to get more info on the shown picture, and to display more picture of a specific album.





---

## Homeboard P0: Stonebaked Margherita Picture frame

Post by Nico Brailovsky @ 2024-07-18 | [Permalink](md_blog/2024/0718_SonebakedMargheritaPictureFrame.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0718_SonebakedMargheritaPictureFrame.md&body=I%20have%20a%20comment!)

With my homeboard booting up, it's time to make it show something. Some day I'll build a net-boot capable system, but until then I'd like to have it do something, even if it's by installing a few services by hand.

[![](/blog_img/0714_HomeboardP0/6FirstBoot.jpg)](/blog_img/0714_HomeboardP0/6FirstBoot.jpg)

## SD bootstrap

[Feb 25 edit: added this section]

An Rpi Zero won't do much without one, so, starting with a base Raspbian Bookworm for Rpi Zero (32 bit), with no GUI:

* [Download an ISO](https://www.raspberrypi.com/software/operating-systems/) compatible with the board
* `sudo dd of=/dev/sdX if=./XXXX.img bs=8M status=progress`
* Mount sd card, then
* Enable ssh: `cd /media/$USER/bootfs && touch ssh && touch ssh.txt`
* [Create user (headless)](https://www.raspberrypi.com/documentation/computers/configuration.html#configuring-a-user): `echo username:password > /media/$USER/bootfs/userconf.txt`

These steps will give you an sd card that should boot and automatically connect to an eth connection (not wifi, of course), and let you ssh into the device to continue the setup. No need to hook up a keyboard.


## First boot

Optional: UART is useful to debug the first boot, but if the SD bootstrap was successful everything should just work.

* Debug why the system doesn't boot, as with any new install
* UART into the system, then enable SSH (because the USB ports are hard to reach to connect a keyboard)
* Disconnect UART, reconnect sensors, login over SSH
* apt-get update, upgrade, etc...

## Prepare Wayland

Raspbian Bookworm 32bit doesn't have support for Wayland out of the box. To enable:

* Add this magic to /boot/firmware/config.txt

```bash
dtoverlay=vc4-kms-v3d
gpu_mem=128
```

* /boot/firmware/cmdline.txt needs to have `wayland=on`
* `sudo apt-get install mesa-utils-bin wayfire seatd` - seatd is required to manage sessions, otherwise wayfire will complain it can't open a terminal.
* `sudo usermod -aG tty username` - I'm not sure if this is required. Try to skip it and see what happens. Let me know if you do.
* reboot
* After booting up, it should be possible to run `wayfire` in a terminal; an empty Wayland screen (with a cursor) should show up

## Wayfire as a service

With everything "working", we can make Wayfire a system service, so it will start at boot:

Add this to `/etc/systemd/system/wayfire.service` (change the user name, and you may want to change the runtime dir too):

```config
[Unit]
Description=wayfire
After=multi-user.target

[Service]
Environment=XDG_RUNTIME_DIR=/run/user/1000
ExecStart=wayfire
StandardOutput=inherit
StandardError=inherit
Restart=always
RestartSec=10s
User=batman

[Install]
WantedBy=multi-user.target
```

Now enable the service

* `sudo systemctl daemon-reload`
* `sudo systemctl enable wayfire`

Use this on your next reboot to find out why things are broken: `journalctl --follow --unit wayfire`

Note: wayfire seems to crash a few times on startup. I guess there is a service dependency I haven't found yet, but as long as it's set to `Restart=Always` it should eventually come up.

## Screen rotation

Because of the way the flex cable is fed to the HDMI-to-eDP board, the screen may end up rotated 180 degrees. You may also want a portrait picture frame, instead of a landscape one. To rotate Wayland:

1. Do `kmsprint` or `kmsprint -m`
2. Look for the name of the screen, eg HDMI-A-1
3. Look for the mode, eg 1920x1080@60.00
4. Create this in ~/.config/wayfire.ini, replacing the values found above for your setup

```bash
[output:HDMI-A-1]
mode = 1920X1080@60.00
position = 0,0
transform = 90
```

~~No need to reboot Wayfire, it should pick up the changes and fix itself immediately. I think.~~ You'll need to `sudo systemctl restart wayfire` to see the changes.


## swayimg

With a GUI, it's time to show a picture. I [hacked swayimg to load pictures from a local server](https://github.com/nicolasbrailo/swayimg), plus a few other useful features to make it more usable in a RpiW, like consuming less memory than default, and porting to 32 bits. To install dependencies:

```bash
sudo apt-get install libcurl git ninja-build meson
sudo apt-get install libcurl4-openssl-dev
sudo apt-get install libwayland-dev wayland-protocols
sudo apt-get install libjson-c-dev libxkbcommon-dev libfontconfig-dev libjpeg-dev
```

To build: [Yes, this is building swayimg in our target. This is horrible and will take a long time, so be prepared for a long coffee break. Some day I'll setup a crosscompiler].

```bash
git clone https://github.com/nicolasbrailo/swayimg.git
meson setup [build|--wipe build]
ninja -C build
```
Make sure the `meson` step finds curl and libjpeg, otherwise it won't be a very useful LAN picture frame.

To start:

* Launch Wayfire in a terminal
* In another terminal:
* `WAYLAND_DISPLAY="wayland-1" DISPLAY="" /home/batman/swayimg/build/swayimg`

Check that nothing crashes too much.

## P0 picture frame

Also this to `/etc/systemd/system/ambience.service` (also change the user name. Or make a new user):

```config
[Unit]
Description=ambience
After=multi-user.target

[Service]
Environment=XDG_RUNTIME_DIR=/run/user/1000 WAYLAND_DISPLAY="wayland-1" DISPLAY=""
ExecStart=/home/batman/swayimg/build/swayimg
StandardOutput=inherit
StandardError=inherit
Restart=always
RestartSec=3s
User=batman

[Install]
WantedBy=multi-user.target
```

Then:

* `sudo systemctl daemon-reload`
* In a terminal: `journalctl --follow --unit wayfire --unit ambience`
* In another terminal:

```bash
sudo systemctl enable ambience
sudo systemctl restart ambience
```

Next time you boot up, the Stonebaked Margherita P0 frame should behave like a picture frame.





---

## Homeboard P0: Stonebaked Margherita

Post by Nico Brailovsky @ 2024-07-14 | [Permalink](md_blog/2024/0714_StonebakedMargheritaHomeboard.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0714_StonebakedMargheritaHomeboard.md&body=I%20have%20a%20comment!)

**Homeboard P0 has been built!!1**

After figuring out [how to run my own LCD panel](md_blog/2024/0707_HouseboardHdmiToEdp.md), it was just a question of buying the right cables. I wanted to build a homeboard, and I thought I'd spend a ton of time writing cool software. Turns out 90% of the project is a game of "did I buy the right cable". Eventually I did end up with enough cables to build this monstrosity:

[![](/blog_img/0714_HomeboardP0/1PanelTest.jpg)](/blog_img/0714_HomeboardP0/1PanelTest.jpg)

You are admiring a:

* Raspberry Pi zero,
* Powered over ethernet, with a PoE adapter
* The Raspberry Pi Zero powers the LCD controller board
* But the controller board needs 12V, so there is a DC-DC board that bumps the 5V from the RaspberryPi to the 12V the board needs.

(Full list of materials further down, so you don't need to hunt all of these)

Here the glorious moment everything is connected together, and actually boots an OS:

[![](/blog_img/0714_HomeboardP0/2Boots.jpg)](/blog_img/0714_HomeboardP0/2Boots.jpg)

Of course at this point I realized the weak point of my design is on the mechanical linkage between the different boards. To tame this quite literally unwieldy hodgepodge of cables, I ate a pizza:

[![](/blog_img/0714_HomeboardP0/3Mechanical.jpg)](/blog_img/0714_HomeboardP0/3Mechanical.jpg)

Using the cardboard box of a pizza, some ducktape and a few M2 screws, I built a beautiful hack mount for all my boards, which let me move the assembly around for tests. This was enough for quick power checks, but pizza box cardboard isn't a very durable material. I upgraded to a full frame:

[![](/blog_img/0714_HomeboardP0/4Framing.jpg)](/blog_img/0714_HomeboardP0/4Framing.jpg)

This is an Ikea picture frame, with an LCD screen tapped to the front and a hole in the back for the eDP connector. Everything mounted together:

[![](/blog_img/0714_HomeboardP0/5BoardMount.jpg)](/blog_img/0714_HomeboardP0/5BoardMount.jpg)

And the glorious, glorious first boot of the Stonebaked Margherita Homeboard P0:

[![](/blog_img/0714_HomeboardP0/6FirstBoot.jpg)](/blog_img/0714_HomeboardP0/6FirstBoot.jpg)

Of course at this stage the only thing the Houseboard P0 does is boot. An achievement, but not too useful. Next up, I'll make it do something. Possibly crash.


## BoM
* Pi Zero (not W, but W works too)
* [LCD panel](https://www.amazon.co.uk/dp/B0742D2718)
* [HDMI to eDP board](https://www.aliexpress.com/item/32968710965.html)
* [PoE adapter](https://thepihut.com/products/poe-to-micro-usb-adapter-for-pi-zero-ethernet-power-ieee-802-3af-compliant)
* [M2 Screws](https://www.amazon.co.uk/dp/B08F7SXC7S?psc=1&ref=ppx_yo2ov_dt_b_product_details)
* [Step up board DC-DC 5v to 12V](https://www.amazon.co.uk/Step-up-Supply-Adjustable-Converter-4-5V-32V/dp/B075JQTPX6?)
* [M2 Screws](https://www.amazon.co.uk/dp/B08F7SXC7S)
* [Jumper wires](https://thepihut.com/collections/jumper-wires) (get a mix of F/F, M/F and M/M)
* [An Ikea Ribba picture frame](https://www.ikea.com/gb/en/p/ribba-frame-white-00268876/)
* Pizza. Margherita not required.
* Mini HDMI to HDMI

Optionals:

* [UART](https://www.amazon.co.uk/gp/product/B0B7RHPMT7/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1) - to figure out why things don't boot, or to [debug sensors](md_blog/2024/0615_LD2410SmmWaveSensor.md)
* Regulable power source 3 to 30V - useful to debug power to elements in isolation
* [HLK-LD2410S 24G mmWave sensor](https://www.aliexpress.com/i/1005006282168742.html) [Manual](https://drive.google.com/file/d/1CYgZTTEkZoo29QDd8V-qMWQCiwLFjlw1/view) - not used yet, but soon

## Useful references
* [Pi GPIO pins](https://pi4j.com/1.2/pins/model-3b-rev1.html)
* [PI Zero pins](https://images.theengineeringprojects.com/image/webp/2021/03/raspberry-pi-zero-5.png.webp?ssl=1)





---

## Houseboard P0: HDMI to eDP

Post by Nico Brailovsky @ 2024-07-07 | [Permalink](md_blog/2024/0707_HouseboardHdmiToEdp.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0707_HouseboardHdmiToEdp.md&body=I%20have%20a%20comment!)

Minor victory in my quest to build a houseboard based on a Linux-PoE-netboot-RaspberryPi-etc: I figured out how to run my own LCD panel.

[![](/blog_img/0707_HouseboardHdmiToEdp/1DPtoeDP.jpg)](/blog_img/0707_HouseboardHdmiToEdp/1DPtoeDP.jpg)

The first step was verifying my panel worked. For this, I used a display port to eDP converter. Turns out eDP is basically DP, but over a ribbon cable. There are some cheap boards, [for example](https://www.aliexpress.com/item/1005006914739674.html), that do this - searching for "DP to eDP" or "display port to eDP" will yield a high number of vendors. The key part is matching the ribbon type of the panel you need to drive (30 or 40 pins).

Unfortunatelly, single-board-computers (like the RaspberryPi) don't have DP, despite DP being better than HDMI in every way. The cost of adding a DP connector seems to be high and mosty in licenses, not necessarily in components, so SBCs don't do it. This meant that getting my expensive GPU to use my cheap panel wasn't good for much beyond knowing the panel works.

Fortunatelly, I managed to find a board that liked my panel:

[![](/blog_img/0707_HouseboardHdmiToEdp/2HDMItoeDP.jpg)](/blog_img/0707_HouseboardHdmiToEdp/2HDMItoeDP.jpg)

I got a "[PCB-800807V6-1HDMI-EDP 30PIN LCD driver board](https://www.aliexpress.com/item/32968710965.html)", which comes at about £10 and supports multiple resolutions. This was a nice lucky find, and it unblocked the build of HouseboardP0, which I'll document in some other entry.





---

## Houseboard P0: PP0

Post by Nico Brailovsky @ 2024-06-30 | [Permalink](md_blog/2024/0630_HouseboardP0.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0630_HouseboardP0.md&body=I%20have%20a%20comment!)

I have a [ton of unnecessary home automation](https://github.com/nicolasbrailo/BatiCasa), but I'm lacking some kind of house board: a quick way of getting info before leaving (like weather, or transport conditions), leaving messages (don't forget to pick up kids from school) or just a shopping list. Sensible people would look at readily available digital signage solutions. Of course I didn't do that, instead decided to build my own.

I settled for a quick list of requirements to guide the project: Linux based, running off power-over-ethernet, with net-boot and 100% locally hosted. How hard can that be?

The first step to design my houseboard was searching for a panel. Here is a capture of the moment it failed:

[![](/blog_img/0630_HouseboardP0/1PanelBoardFail.jpg)](/blog_img/0630_HouseboardP0/1PanelBoardFail.jpg)

Turns out that scoring a random replacement panel for a laptop and trying to pair that with a random controller board works well in theory but needs a lot of luck. Starting with a cheapish £40 LCD panel with an eDP connector, I got an HDMI-to-eDP board. My panel and my board didn't like each other, so all I got was backlight, and that is not very useful unless you only need to display binary information.

Since ordering and shipping a different panel controller board would take a few weeks, I decided to change my strategy: my P0 would be changed to a Prototype-Prototype-0 (PP0), using a similar platform to let me start working on the software and sensors, while I figured the way to control a panel. Here is Houseboard PP0, in all it's glory:

[![](/blog_img/0630_HouseboardP0/2PP0.jpg)](/blog_img/0630_HouseboardP0/2PP0.jpg)

I got a USB-powered touchscreen, which is powered by a RaspberryPi 4. The RPI itself is powered over PoE, and there is an HDMI connection between the Rpi and the screen, and a secondary USB connection to get touch screen support. The PoE adapter is barely capable of powering the screen AND the Rpi: if I turn the brightness of the screen to 100%, the system will reset.

And with a few sensors (a PIR + mmWave):

[![](/blog_img/0630_HouseboardP0/3Sensors.jpg)](/blog_img/0630_HouseboardP0/3Sensors.jpg)

It's not going to win any design prizes, but it works

[![](/blog_img/0630_HouseboardP0/4Running.jpg)](/blog_img/0630_HouseboardP0/4Running.jpg)

While eventually I did end up solving my LCD panel woes, Houseboard PP0 let me start building some software for the houseboard quickly:

1. A [Wayland based image display](https://github.com/nicolasbrailo/swayimg) built on top of Swayimage; to show a gallery of pictures when there is no other info to show
2. A [presence service](https://github.com/nicolasbrailo/pipresencemon) (to determine when there are humans nearby, based on PIR and mmWave sensors).


## BoM for Houseboard PP0

* A RaspberryPi 4 (any Pi will do, but having a bunch of USB ports makes this project a lot simpler)
* A USB powered screen. I went for a 14'' 1080p 1920x1080, and with the PoE constrain that's probably as big as it's feasible. My browsing history says I got this one: https://www.amazon.co.uk/dp/B0CB5FWGT8
* PoE splitter (USBC + ETH out, 5v 4A) - Look for the adapter with largest power rating you can, a cheap one won't work. I went for this one: https://www.amazon.co.uk/dp/B0CHW5K5F4
* [PIR sensor](https://thepihut.com/products/pir-motion-sensor-module) (NB VCC=5v, connect to Pin4, GND Pin6, OUT Pin17)
* [Smaller PIR sensor](https://thepihut.com/products/breadboard-friendly-mini-pir-motion-sensor-with-3-pin-header) (VCC=5v Pin4, GND Pin6, OUT Pin17)
  
## Useful references
* [Pi GPIO pins](https://pi4j.com/1.2/pins/model-3b-rev1.html)
* [PI Zero pins](https://images.theengineeringprojects.com/image/webp/2021/03/raspberry-pi-zero-5.png.webp?ssl=1)





---

## RaspberryPi gpio cli monitor

Post by Nico Brailovsky @ 2024-06-15 | [Permalink](md_blog/2024/0615_RaspberryPiGpioMon.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0615_RaspberryPiGpioMon.md&body=I%20have%20a%20comment!)

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





---

## LD2410S: mmWave human-presence detection

Post by Nico Brailovsky @ 2024-06-15 | [Permalink](md_blog/2024/0615_LD2410SmmWaveSensor.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0615_LD2410SmmWaveSensor.md&body=I%20have%20a%20comment!)

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





---

## No cloud IoT: LAN only Security camera

Post by Nico Brailovsky @ 2024-05-23 | [Permalink](md_blog/2024/0523_NoCloudSecurityCam.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0523_NoCloudSecurityCam.md&body=I%20have%20a%20comment!)

A while back I spent some time setting up a security camera/doorbell. I wanted to have a camera that

* Requires no external vendor connection: I must be able to run it locally, forever, with or without Internet.
* I can monitor on real time, ideally with my phone.
* notifies me when the doorbell button is pressed (integrating with the Sonos speakers throughout my home).
* triggers an event when motion is detected, so I can integrate it with other systems.
* stores videos on a disk when there is motion, so I can review them later.
* will send me a message when I'm out of home and motion is detected.

The process required a lot of trial and error, guessing arcane commands from poor documentation or from random (often decade-old, unmaintained) open source projects. I figured I should document my setup.

## tl;dr

This article ended up being a lot longer than I expected, so if you're here for the short version:

* Reolink makes cameras that are easy to integrate with and require no cloud
* Here's an [example of how to subscribe and process camera events](https://github.com/nicolasbrailo/reolink_aio/tree/ec2469fe45bb4f050900a7bb8d23f51c2bbd6da2/examples/reolink_onvif_subscription), like motion detection or doorbell presses.

* Any sane camera will stream over RTSP. Once you find the RTSP URL, you can test it with ffmepg: `
ffmpeg -i $rtsp_url, -c:v copy -c:a copy $outpath`

* I built a [hacky galery for stored RTSP streams](https://github.com/nicolasbrailo/zigbee2mqtt2web/blob/master/zigbee2mqtt2web_extras/reolink_cam/nvrish.py).

* And also send [copies of the video over Telegram](https://github.com/nicolasbrailo/PyTelegramBot)


## Sourcing a camera

I went for Reolink. After a lot of reading (and a few months of usage, now) it's a very good option in its price range (cheap). They seem to have a good range of cameras, and all the features I was looking for: LAN-first, streaming, motion events, power-over-ethernet and a decent enough admin interface. Besides a very good range of PTZ (pan-tilt-zoom) cams, they also have a PoE a doorbell, which closed the deal for me.

PoE, again: Can't recommend PoE enough: there's no Wifi fighting, and if things get wonky you just ask the switch to cycle the port. You probably already need to run a cable for power, so why not do it for eth instead, and get both in one?

I would love a camera with open source firmware, but I figured if I spent my time tinkering with cam firmware, I would have never actually got the time to integrate it with my IoT network - so maybe a project for the far off future, when I have finished absolutely everything else on my ToDo list. As it is, I decided it's an acceptable trade-off to have an untrusted closed-source firmware running in my network, placed in an isolated vlan without internet access (it's not the only untrusted device I run in my network, and I admit not all of them live in vlans...)

## Talking to the camera

There is a protocol called "[ONVIF](https://en.wikipedia.org/wiki/ONVIF)". Wikipedia claims it hails from the dark ages of the late 2000's, and it has an XML based transport to prove it. ONVIF is meant to be a standard way to discover how an IP camera works, but, like most XML-based protocols turned out to be in practice, is extremely verbose, requires you to traverse countless schema definition files to understand it, and it's quite hard to parse. Of course most cameras I've seen seem to implement ONVIF either partially or with non-standard extensions, making the whole design idea around the XML schema quite pointless anyway.

Reolink cams also support an HTTP/Json REST-like API, which makes things a lot easier. The HTTP interface is simple to inspect and understand by looking at the admin page with a browser's dev tools. Unfortunately, not everything is exposed through their HTTP API, so a bit of ONVIF digging may be necessary. Most notably, in the version of the firmware I tried, it's not possible to configure the camera to talk back to a server when events happen - which is quite important if you intend to use it as a doorbell.

There is an [open source project that translates most of the Reolink HTTP commands to python](https://github.com/nicolasbrailo/reolink_aio). This project makes it very easy to replicate the functionality of the admin interface, but with a Python API. This project should cover 99% of all basic usage. Using this project, you can do things like `cam.doorbell_led` to set up the LED state. Most importantly, [it will take care of the login flow for you](https://github.com/nicolasbrailo/zigbee2mqtt2web/blob/master/zigbee2mqtt2web_extras/reolink_cam/__init__.py#L77), which is quite tedious to implement using raw requests.

## Getting the camera to talk back to us

Note [the project I linked above is actually a fork](https://github.com/nicolasbrailo/reolink_aio). The original project exists pretty much solely to integrate with HomeAssistant, and it's not too ~~user~~developer-friendly if what you're looking for is a way to configure a camera to talk back to a server. Since my most important goal was to use a camera as a doorbell, the first requirement was getting some sort of notification when the doorbell button is pressed.

Reolink cams can announce events back to a URL ([as simple as `cam.subscribe(webhook_url)`](https://github.com/nicolasbrailo/zigbee2mqtt2web/blob/master/zigbee2mqtt2web_extras/reolink_cam/__init__.py#L92C11-L92C37)), but they will do so in an ONVIF format. There is a standalone example of how to [subscribe to ONVIF notifications, and how to parse them, over here](https://github.com/nicolasbrailo/reolink_aio/tree/ec2469fe45bb4f050900a7bb8d23f51c2bbd6da2/examples/reolink_onvif_subscription).

In the example above, there is a Flask server printing a Json version of the ONVIF message. For Reolink cams, it prints the state of the camera (either motion detected, or doorbell button pressed) in a human-friendly Json format. I found the latency to be less than a second for the doorbell press event. The motion detection events, and the AI people detection events, also seem to trigger with low latency, but you'll need to tweak the config to suite your environment; if there is lots of movement in your street, it can be quite noisy.

## Streaming

Streaming is easy! Reolink has an [RTSP](https://en.wikipedia.org/wiki/Real-Time_Streaming_Protocol) link. RTSP is an UDP based protocol that will transport media from a streaming device to another (and you likely use it every day, whenever you make a VoIP call). It's also lightweight, relatively sane, and comes to us from the late 90's (I wonder what happened between the 90's and 10's that gave us XML based protocols).

The RTSP link will be something like `rtsp://$user:$pass@$cam_ip:554/h264Preview_01_main`, but it's [easier to ask the camera](https://github.com/nicolasbrailo/zigbee2mqtt2web/blob/master/zigbee2mqtt2web_extras/reolink_cam/__init__.py#L92C11-L92C37). There are different stream URLs, depending on the camera model, supported codecs, etc, so a little bit of trial and error may be required.

To test an RTSP URL, [VLC](https://www.videolan.org/) is 80% likely to work. I found it, however, quite hard to debug failures using VLC. There may be codec mismatches, missing libraries, connection failures, or other random problems - and VLC it would just say "nope". This is usually good enough for most users, there is not too much a "normal" user can do on an RTSP setup failure. We are, however, not normal, so we use [ffmpeg](https://ffmpeg.org/):

```
ffmpeg -i $rtsp_url, -c:v copy -c:a copy $outpath
```

This magic ffmpeg incantation will connecto to an RTSP URL and copy the incoming audio and video streams to a file, without any re-encoding (by default ffmpeg will try to reencode and spend tons of cpu on it). If everything goes fine, you'll end up with an mpeg of your camera. If it doesn't, ffmpeg will usually print a developer friendly (ish) error message.

Of course once we found a working RTSP URL we wouldn't want to use ffmpeg just to check who's at the door. For that, I found [Ojo works amazingly well](https://github.com/penguin86/ojo). It's an RTSP viewer for Android, available in [F-Droid and probably other app stores](https://f-droid.org/is/packages/it.danieleverducci.ojo/).

## NVR-like service

If you can see an RTSP stream, you can also save to disk. In fact that's exactly what we did to test it, with ffmpeg. [My custom Reolink integration](https://github.com/nicolasbrailo/zigbee2mqtt2web/blob/master/zigbee2mqtt2web_extras/reolink_cam/ffmpeg_helper.py) has an ffmpeg helper; whenever motion is reported by the camera, it will save a copy of the RTSP stream to disk. This means:

* we rely on the camera to report movement, so there can be false positives, and false negatives. You'll need to figure out how well the camera motion detection algorithms work for you.
* by only recording when the camera reports movement, we save a ton of disk space and CPU: no need to record when 99% of the day there is no motion. I like keeping my electricity bill down.
* but we miss the first few seconds of movement. By the time the camera triggers a motion alert, the RTSP is set up, and we start recording, it's likely that more than a few seconds have passed.

I don't know if this is how real NVR services behave: my IoT network is built for fun, and since I have fun coding, I don't always spend a lot of time looking into already-built services. I didn't immediately find an open source NVR-like service that worked as I wanted, so I quickly hacked one based on ffmpeg and some [hacky Flask to create a gallery for the stored videos](https://github.com/nicolasbrailo/zigbee2mqtt2web/blob/master/zigbee2mqtt2web_extras/reolink_cam/nvrish.py).

## Telegram integration

By now, I had a camera integrated into a system that 

* I can monitor on real time, using RTSP
* notifies me when the doorbell button is pressed
* triggers an event when motion is detected
* stores videos on a disk when there is motion

I was only missing IM notifications. I used [Telegram for this, with a custom built integration](https://github.com/nicolasbrailo/PyTelegramBot). The [notifications will trigger](https://github.com/nicolasbrailo/BatiCasa/blob/main/notifications.py#L140) first when motion is detected, and it will send a still frame of the camera stream. Once the motion stops, it will reencode the video in a format that Telegram likes, and send it over too:

```
ffmpeg -i $fpath -vf scale=640:360 -c:v libx264 -crf 23 -preset veryfast -c:a copy $out_path
```

Unfortunately this integration seems to trigger some spam control in Telegram, and got my account banned. I recommend sending pictures only, that seems to be more acceptable to Telegram's term of service.





---

## Raspberry Pi UART debug notes

Post by Nico Brailovsky @ 2024-05-19 | [Permalink](md_blog/2024/0519_RaspberryPiUARTNotes.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0519_RaspberryPiUARTNotes.md&body=I%20have%20a%20comment!)

I spent a bit of time setting up UARTs to troubleshoot different Raspberry Pis. Here are my notes.

## Electrical config

* Get a UART to USB adapter. I got one called "UART-TTL USB Adapter with CH340G Converter for 3.3 V" for less than $5. This one comes with 5 pins: 3.3v, 5v, tx, rx, gnd. For Rpi's UART, we'll ignore the two Vcc pins, we just need tx, rx and gnd. The adapter needs to run at 3.3v for an Rpi.
* Connect GND=Rpi pin 6, RX adapter = Rpi pin 8 (GPIO14/TXD), TX adapter = Rpi pin 10 (GPIO15/RXD). Remember that tx and rx need to be inverted: tx in the adapter should be plugged to rx in the Rpi - See [here for a pinout map](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html).
* UART is simple, but very sensitive to the quality of the electrical connection. Flaky connection leads to poor connectivity, and poor connectivity leads to lost bits. Really bad connections will come out garbled and impossible to read (probably not resembling text). Bad-but-not-terrible connections will appear broken, but legible (eg with missing characters). If the connection is flaky, try a different ground pin in the RPI (for example, you can switch GND to pin 39). You can also try a different USB hub.
* The adapter I got has an LED light for the TX path, and another for the RX path. This is very helpful to figure out if the connection is good (a bad connection results in a dim LED, or in both LEDs lighting up). It also helps detect when TX/RX are swapped.


## Raspberry Pi config

* echo "enable_uart=1" > /boot/firmware/config.txt (Or change in the sd card).
* In a (booted) Rpi: `rpi-eeprom-config`, then set `BOOT_UART=1` - this may not work in Raspberry Pis Zeros.
* Adding `uart_2ndstage=1` in config.txt should [help get bootloader logs](https://github.com/raspberrypi/firmware/issues/1301).
* Don't forget to configure the Kernel: `console=serial0,115200` should be in your cmdline.txt (it's set by default nowadays).
* If you are troubleshooting boot issues, `bootcode_delay=3` and `boot_delay=3` should add 3 seconds of [delay between bootloaders](https://www.raspberrypi.com/documentation/computers/legacy_config_txt.html).
* init_uart_baud can [tweak UART speed](https://www.raspberrypi.com/documentation/computers/configuration.html#part3.1), but shouldn't be needed unless your connection is very flaky and you can't fix it for some reason.


There are other things in config.txt that may or may not help. Here's mine:

```
enable_uart=1
dtparam=uart0=on
uart_2ndstage=1

hdmi_force_hotplug=1
config_hdmi_boost=4

bootcode_delay=3
boot_delay=3
```

## Test run

* Connect the adapter before power on the target, to get boot logs. The adapter should appear as /dev/ttyUSB0 or similar (tail dmesg to confirm)
* Monitor UART with `sudo screen /dev/ttyUSB0 115200` (115200 seems to be the default speed in Rpi, configured as a kernel param in cmdline.txt)
* Exit screen with `C-A \`
* If you don't like screen, minicom is nicer (scrollback works better with tmux, out of the box): `sudo minicom --device /dev/ttyUSB0`
* Exit minicom with `C-A x`

Extra tip: Unlike their bigger brothers, Raspberry Pi Zeros don't seem to want to boot up with no SD card in, not even to show a bootloader error.


## Example

If everything worked well, you should see either boot logs (if the UART was connected before power on) or a login screen. Here's an example of the first few seconds of my Rpi booting:


```
Raspberry Pi Bootcode
Read File: config.txt, 987
Read File: start.elf, 2980544 (bytes)
Read File: fixup.dat, 7303 (bytes)
MESS:00:00:04.185459:0: brfs: File read: /mfs/sd/config.txt
MESS:00:00:04.190074:0: brfs: File read: 987 bytes
MESS:00:00:04.226963:0: HDMI0:EDID error reading EDID block 0 attempt 0
MESS:00:00:04.233130:0: HDMI0:EDID error reading EDID block 0 attempt 1
MESS:00:00:04.239466:0: HDMI0:EDID error reading EDID block 0 attempt 2
MESS:00:00:04.245803:0: HDMI0:EDID error reading EDID block 0 attempt 3
MESS:00:00:04.252140:0: HDMI0:EDID error reading EDID block 0 attempt 4
MESS:00:00:04.258477:0: HDMI0:EDID error reading EDID block 0 attempt 5
MESS:00:00:04.264814:0: HDMI0:EDID error reading EDID block 0 attempt 6
MESS:00:00:04.271150:0: HDMI0:EDID error reading EDID block 0 attempt 7
MESS:00:00:04.277487:0: HDMI0:EDID error reading EDID block 0 attempt 8
MESS:00:00:04.283824:0: HDMI0:EDID error reading EDID block 0 attempt 9
MESS:00:00:04.289919:0: HDMI0:EDID giving up on reading EDID block 0
MESS:00:00:04.302298:0: brfs: File read: /mfs/sd/config.txt
MESS:00:00:07.306971:0: gpioman: gpioman_get_pin_num: pin LEDS_PWR_OK not defined
MESS:00:00:07.809022:0: gpioman: gpioman_get_pin_num: pin LEDS_PWR_OK not defined
MESS:00:00:07.814848:0: *** Restart logging
MESS:00:00:07.818724:0: brfs: File read: 987 bytes
MESS:00:00:07.826906:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 0
MESS:00:00:07.833596:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 1
MESS:00:00:07.840454:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 2
MESS:00:00:07.847313:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 3
MESS:00:00:07.854170:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 4
MESS:00:00:07.861028:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 5
MESS:00:00:07.867886:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 6
MESS:00:00:07.874743:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 7
MESS:00:00:07.881600:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 8
MESS:00:00:07.888459:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 9
MESS:00:00:07.895074:0: hdmi: HDMI0:EDID giving up on reading EDID block 0
MESS:00:00:07.900979:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 0
MESS:00:00:07.908770:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 1
MESS:00:00:07.915629:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 2
MESS:00:00:07.922486:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 3
MESS:00:00:07.929344:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 4
MESS:00:00:07.936201:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 5
MESS:00:00:07.943060:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 6
MESS:00:00:07.949917:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 7
MESS:00:00:07.956775:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 8
MESS:00:00:07.963633:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 9
MESS:00:00:07.970248:0: hdmi: HDMI0:EDID giving up on reading EDID block 0
MESS:00:00:07.976078:0: gpioman: gpioman_get_pin_num: pin EMMC_ENABLE not defined
MESS:00:00:07.991589:0: HDMI0: hdmi_pixel_encoding: 162000000
MESS:00:00:08.621290:0: brfs: File read: /mfs/sd/initramfs
MESS:00:00:08.625085:0: Loaded 'initramfs' to 0x0 size 0x9f66d9
MESS:00:00:08.642498:0: initramfs loaded to 0x1b5f9000 (size 0x9f66d9)
MESS:00:00:08.656992:0: dtb_file 'bcm2708-rpi-zero-w.dtb'
MESS:00:00:08.660702:0: brfs: File read: 10446553 bytes
MESS:00:00:08.671327:0: brfs: File read: /mfs/sd/bcm2708-rpi-zero-w.dtb
MESS:00:00:08.676246:0: Loaded 'bcm2708-rpi-zero-w.dtb' to 0x100 size 0x7823
MESS:00:00:08.696709:0: brfs: File read: 30755 bytes
MESS:00:00:08.713197:0: brfs: File read: /mfs/sd/overlays/overlay_map.dtb
MESS:00:00:08.749553:0: brfs: File read: 5195 bytes
MESS:00:00:08.757160:0: brfs: File read: /mfs/sd/config.txt
MESS:00:00:08.761107:0: dtparam: audio=on
MESS:00:00:08.771124:0: brfs: File read: 987 bytes
MESS:00:00:08.793681:0: brfs: File read: /mfs/sd/overlays/vc4-kms-v3d.dtbo
MESS:00:00:08.844556:0: Loaded overlay 'vc4-kms-v3d'
MESS:00:00:08.848045:0: dtparam: act_led_trigger=actpwr
MESS:00:00:08.865089:0: dtparam: uart0=on
MESS:00:00:08.974561:0: brfs: File read: 2760 bytes
MESS:00:00:08.981941:0: brfs: File read: /mfs/sd/cmdline.txt
MESS:00:00:08.985916:0: Read command line from file 'cmdline.txt':
MESS:00:00:08.991800:0: 'console=serial0,115200 console=tty1 root=PARTUUID=5c64668e-02 rootfstype=ext4 fsck.repair=yes rootwait'
MESS:00:00:09.100396:0: brfs: File read: 103 bytes
MESS:00:00:09.520104:0: brfs: File read: /mfs/sd/kernel.img
MESS:00:00:09.523957:0: Loaded 'kernel.img' to 0x8000 size 0x6c3648
MESS:00:00:09.529958:0: Device tree loaded to 0x1b5f1300 (size 0x7cde)
MESS:00:00:09.536944:0: uart: Set PL011 baud rate to 103448.300000 Hz
MESS:00:00:09.543886:0: uart: Baud rate change done...
MESS:00:00:09.547298:0: uart: Baud rate[    0.000000] Booting Linux on physical CPU 0x0
[    0.000000] Linux version 6.6.20+rpt-rpi-v6 (debian-kernel@lists.debian.org) (gcc-12 (Raspbian 12.2.0-14+rpi1) 12.2.0, GNU ld (GNU Binutils for Raspbian) 2.40) #1 Raspbian 1:6.6.20-1+rpt1 (2024-03-07)
[    0.000000] CPU: ARMv6-compatible processor [410fb767] revision 7 (ARMv7), cr=00c5387d
[    0.000000] CPU: PIPT / VIPT nonaliasing data cache, VIPT nonaliasing instruction cache
[    0.000000] OF: fdt: Machine model: Raspberry Pi Zero W Rev 1.1
[    0.000000] random: crng init done
[    0.000000] Memory policy: Data cache writeback
[    0.000000] Reserved memory: created CMA memory pool at 0x0b400000, size 256 MiB
[    0.000000] OF: reserved mem: initialized node linux,cma, compatible id shared-dma-pool
[    0.000000] OF: reserved mem: 0x0b400000..0x1b3fffff (262144 KiB) map reusable linux,cma
[    0.000000] Zone ranges:
[    0.000000]   Normal   [mem 0x0000000000000000-0x000000001bffffff]
[    0.000000] Movable zone start for each node
[    0.000000] Early memory node ranges
[    0.000000]   node   0: [mem 0x0000000000000000-0x000000001bffffff]
[    0.000000] Initmem setup node 0 [mem 0x0000000000000000-0x000000001bffffff]
[    0.000000] Kernel command line: coherent_pool=1M 8250.nr_uarts=1 snd_bcm2835.enable_headphones=0 snd_bcm2835.enable_hdmi=1 snd_bcm2835.enable_hdmi=0  smsc95xx.macaddr=B8:27:EB:E1:0B:27 vc_mem.mem_bast
[    0.000000] Dentry cache hash table entries: 65536 (order: 6, 262144 bytes, linear)
[    0.000000] Inode-cache hash table entries: 32768 (order: 5, 131072 bytes, linear)
[    0.000000] Built 1 zonelists, mobility grouping on.  Total pages: 113680
[    0.000000] mem auto-init: stack:all(zero), heap alloc:off, heap free:off
[    0.000000] Memory: 165396K/458752K available (10000K kernel code, 1478K rwdata, 3116K rodata, 452K init, 582K bss, 31212K reserved, 262144K cma-reserved)
[    0.000000] SLUB: HWalign=32, Order=0-3, MinObjects=0, CPUs=1, Nodes=1
[    0.000000] ftrace: allocating 34944 entries in 103 pages
[    0.000000] ftrace: allocated 103 pages with 5 groups
[    0.000000] trace event string verifier disabled
[    0.000000] NR_IRQS: 16, nr_irqs: 16, preallocated irqs: 16
[    0.000006] sched_clock: 32 bits at 1000kHz, resolution 1000ns, wraps every 2147483647500ns
[    0.000061] clocksource: timer: mask: 0xffffffff max_cycles: 0xffffffff, max_idle_ns: 1911260446275 ns
[    0.000146] bcm2835: system timer (irq = 27)
[    0.000913] Console: colour dummy device 80x30
[    0.000949] printk: console [tty1] enabled
[    0.001662] Calibrating delay loop... 697.95 BogoMIPS (lpj=3489792)
[    0.060283] CPU: Testing write buffer coherency: ok
[    0.060386] pid_max: default: 32768 minimum: 301
[    0.060548] LSM: initializing lsm=capability,integrity
[    0.060859] Mount-cache hash table entries: 1024 (order: 0, 4096 bytes, linear)
[    0.060931] Mountpoint-cache hash table entries: 1024 (order: 0, 4096 bytes, linear)
[    0.062179] cgroup: Disabling memory control group subsystem
[    0.064297] RCU Tasks Rude: Setting shift to 0 and lim to 1 rcu_task_cb_adjust=1.
[    0.064590] RCU Tasks Trace: Setting shift to 0 and lim to 1 rcu_task_cb_adjust=1.
[    0.064902] Setting up static identity map for 0x8220 - 0x8258
[    0.066193] devtmpfs: initialized
[    0.078200] VFP support v0.3: implementor 41 architecture 1 part 20 variant b rev 5
[    0.078605] clocksource: jiffies: mask: 0xffffffff max_cycles: 0xffffffff, max_idle_ns: 19112604462750000 ns
[    0.078696] futex hash table entries: 256 (order: -1, 3072 bytes, linear)
```

Won't win any ID prizes, but it got the job done:

[![](/blog_img/240519_UART.jpg)](/blog_img/240519_UART.jpg)





---

## Raspberry Pi: HDMI debugging

Post by Nico Brailovsky @ 2024-05-18 | [Permalink](md_blog/2024/0518_RaspberryPiHDMI.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0518_RaspberryPiHDMI.md&body=I%20have%20a%20comment!)

If a Raspberry Pi boots but has no HDMI signal:

* Add `hdmi_force_hotplug=1` to /boot/firmware/config.txt - this forces the Pi to send HDMI video even if it thinks there's no monitor connected.
* Add `config_hdmi_boost=4` to /boot/firmware/config.txt - this tweaks the HDMI signal strength.

Also, remove all possible adapters (each will add a bit of noise and attenuation) and get a cable with good shielding.

Source <https://elinux.org/R-Pi_Troubleshooting#No_HDMI_output_at_all>

Extra tip: Unlike their bigger brothers, Raspberry Pi Zeros don't seem to want to boot up with no SD card in, not even to show a bootloader error.





---

@meta extraNav [Prev](md_gen/index.md) | [Next](md_gen/index2.md)