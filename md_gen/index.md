#
@meta docType index
## Homeboard: Industrial Design (bonus: Inkscape)

Post by Nico Brailovsky @ 2025-02-09 | [Permalink](md_blog/2025/0209_HomeboardIndustrialDesign.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2025/0209_HomeboardIndustrialDesign.md&body=I%20have%20a%20comment!)

My Homeboard project has officially left its cardboard pizza phase. Almost:

[![](/blog_img/0209_HomeboardIDv2.jpg)](/blog_img/0209_HomeboardIDv2.jpg)

The 2 or 3 pixels above show the first "industrial design" of the homeboard. Or at least the parts that "work". It's hanging from a wall, like a real picture frame. Unfortunately it has bugs, and all its guts are hanging from the top.

I spent some time working on a mount, cut with a laser engraver. The mount has two main pieces: a frame for the display, and a horizontal mount that can be hanged from a hook in the wall. The vertical display frame slots into the horizontal mount, meaning there is no flimsy glue holding expensive equipment: gravity does the job. There are some screws and Ls to give it a nice shape, but the main stress between the hook in the wall and the display is supported by the material strength, not by glue. All the cool electronics fit in a small box on top of the horizontal mount. Or at least that's the idea.

As nice as my design is, it has bugs: You can see in the picture I forgot to consider that wires, especially fat cables such as HDMIs, have physical properties, such as bend radius. Without a slot for wiring, the electronics that fit nicely on the top box in my drawing, actually protrude from the top. The ribbon cable was mirrored in my drawing, meaning a weird 180-degree twist was needed to fit the screen to the main board. The box itself doesn't lock, because the "teeth" are slightly misaligned. And the screw holes for the Raspberry Pi are about a quarter mm out of alignment.

Attached to this post is my SVG design, with theoretical bug-fixes for the problems (version 3, if anyone is counting). I haven't tried printing it yet, and I wouldn't be surprised if V4 is required too.

[![](/blog_img/0209_HomeboardV3.jpg)](/blog_img/0209_HomeboardV3.svg)

Image above shows the outline; clicking on it should open the original svg, which is probably mostly blank because vector laser cuts have 0.001mm strokes. Download and open with Inkscape to see it (you may need to change the view mode to outline, too).


## Bonus: misc Inkscape tips

My experience with anything that has colors is zero, and I had to spend time learning how Inkscape works to build the design above. Seeing a mechanical design you have in your head come to life with a laser cutter is incredibly rewarding, and I can see myself embarking in more ambitious designs some day, when I have more free time.  Here's a list of things I learned and should remember next time I'm using Inkscape:

* It's easy to build complex shapes from basic ones using Path > Union/Difference/etc
* millimeter alignment is hard by hand, but using the position and size input boxes it becomes easy. Start all sub-assemblies in a new drawing, at (0,0), and follow the plans to build the full assembly.
* Actually, alignment by hand is easy (just not precise). It can be a time saver: Build guide-rules, then align by hand, finally adjust the position coordinates for precise fitting. For example, to place a screw hole in the bottom right corner, 3mm from the borders: the hard way is to calculate the position (width of board - 3mm - hole size / 2), same for height. The easy way: create a guide line at `width - 3mm` and `height - 3mm`. Place hole by hand, zooming in. The coordinates will usually be a few 100s or 10s of micrometers (um!) from the correct value, which you can then set by hand.
* Actually, there's an even easier way: An element in inkscape will have 8 arrows around it. By default, the center of coordinates is the center of the object, but clicking on any of these arrows will make the coordinates relative to it. That means you can select the top center arrow of a screw hole, enter `board width - 3` to position it horizontally, then select the left center arrow and enter `board height - 3` to position it vertically.
* When I write `board width - 3` I actually mean you can write `NNN - XXX` in the position boxes of Inkscape. They perform basic math operations. This is a huge time saver.
* Most boards are regular, and have screw holes in symmetric positions vertically and horizontally. When this is the case, you can place all 4 screw holes by mirroring the first one: place the top left screw hole, then select it together with a box the size of the board. Mirror the board vertically, and place a new hole in the position of the first. Select both holes, mirror horizontally, etc. Voila, 4 screw holes with only one measurement!





---

## Zigbee Boiler: bugfix addendum

Post by Nico Brailovsky @ 2025-01-07 | [Permalink](md_blog/2025/0107_ZigbeeBoilerAddendum.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2025/0107_ZigbeeBoilerAddendum.md&body=I%20have%20a%20comment!)

I came back from holidays with a mystery to solve: my [automated heating system](md_blog/2024/0506_ZigbeeBoiler.md) kept, for hours, trying to shut down heating. Why wasn't it turning off?

After a few weeks, once home (because my home automation has no inbound internet access, only message publishing to Telegram) the puzzle got more interesting: the logs said it was trying to shut heating down, however its state was never "on" in the first place. To top it off, the temp charts showed this: Crazy high spikes, as high as 25 degrees. Why did the system think it was off while the boiler was running?

[![](/blog_img/250107temp.jpg)](/blog_img/250107temp.jpg)

I tried a few lines of investigation. Sometimes sensors misreport data, saying a room is 0, or Nan, or 50 degrees (C!), or some other unreasonable value, however those are filtered out. Maybe a bit flipped and the Zigbee name/alias is different, but no, I could control the boiler normally if I manually turned it on when it was off. It was like something else was controlling the device... and then I re-read [my own article](md_blog/2024/0506_ZigbeeBoiler.md).

Turns out I never disconnected the original RF controller, I only added a new parallel one. I figured it'd be useful, should my Zigbee controller ever fail! Turns out I chucked the original RF control in a drawer, in a cold corner of my house where I have the heating off. In a cold week, the room where the controller was never reached the minimum temperature to turn the heating off, despite my careful network of sensors shouting "it's hot in here, turn it off".

Fun fact: I bought current sensor to detect when the boiler is on, but it doesn't match the Zigbee state. It was sitting in a drawer, next to the original RF controller. This would make a great fail of the week, too bad the Embedded Muse is no longer running.

I'm not looking forward to the gas bill next month, but at least my cats got to enjoy a balmy 24C winter break for a few weeks.





---

## Homeboard: Wayland on X

Post by Nico Brailovsky @ 2024-10-28 | [Permalink](md_blog/2024/1028_waylandonx.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/1028_waylandonx.md&body=I%20have%20a%20comment!)

Besides [cross-compiling to RaspberryPi](md_blog/2024/1012_rpixcompile.md), at times it's also useful to just run things locally. While faster than building on the target, the cycle of xcompile and deploy is still cumbersome for short sessions (i.e. when the target is usually offline, unpowered, and possibly lost somewhere in my house). For these situations, I found out I can run Wayland based apps on top of my X-based desktop, using Weston.

Weston is an implementation of Wayland. If you don't have it already, you can `apt-get install weston`. If you do this in an X based desktop, you can still run weston in a terminal, inside X.

[![](/blog_img/241028weston.jpg)](/blog_img/241028weston.jpg)

Between Wayland on X and [cross-compiling to RaspberryPi](md_blog/2024/1012_rpixcompile.md), I can test my fork (hack) of [Swayimg](https://github.com/nicolasbrailo/swayimg) for RaspberryPi Zero.





---

## Crosscompiling to RaspberryPi Zero

Post by Nico Brailovsky @ 2024-10-12 | [Permalink](md_blog/2024/1012_rpixcompile.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/1012_rpixcompile.md&body=I%20have%20a%20comment!)

Homeboard continues progressing, albeit at a snail pace. Using a RaspberryPi Zero as the base board means not only the project runs at a leisurely pace, but so do any attempts at compiling software in the target itself. Because I got tired of measuring my build times in minutes, I decided it's time to set up a cross-compiler from my PC to my homeboard. This means I can now build things in my reasonably fast PC, and deploy the resulting binary to the RaspberryPi Zero.

Setting up a cross compiler from scratch can be challenging, as it requires replicating a large chunk of your target. Luckily, the Raspberry Pi is a popular platform and plenty of articles explaining how to set up a x-compiler are available. Unluckily, I found most of them didn't work for me, with my host being Debian Bookworm. In the end I managed to find a combination of arcane spells to make x-compiling work.

First, get a Raspberry Pi Zero image, and mount it locally. This will be the sys-root of the target when x-compiling:

```bash
wget https://downloads.raspberrypi.com/raspios_armhf/images/raspios_armhf-2024-07-04/2024-07-04-raspios-bookworm-armhf.img.xz
xz -d 2024-07-04-raspios-bookworm-armhf.img.xz

# Find out the mount-start offset (multiply by 512)
fdisk -lu "$IMG_FNAME" | grep Linux | awk '{print $2}'

mkdir -p mnt
mount -o loop,offset=541065216 2024-07-04-raspios-bookworm-armhf.img.xz ./mnt
```

And to build things:

```
clang -target arm-linux-gnueabihf -mcpu=arm1176jzf-s --sysroot ./mnt/ test.c
```

That's all; this should create a binary in armv6 format, ready to be deployed to your target. A few things I discovered:

* I couldn't make this work with gcc. I don't know why.
* If your `--sysroot` isn't correct, things won't work. You won't get an error, but a binary will still be built; it will just be a binary with the wrong format, and you'll only know because it will segfault on start. Good luck trying to figure out if the segfault is yours, or from a problem in the build process.


I wrapped this in a convenient bash script so you can build a [makefile that will x-compile easily, have a look here: https://github.com/nicolasbrailo/rpiz-xcompile](https://github.com/nicolasbrailo/rpiz-xcompile)





---

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

## OS

Starting with a base Raspbian Bookworm for Rpi Zero (32 bit), with no GUI:

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
* sudo apt-get install mesa-utils-bin wayfire 
* reboot
* After booting up, it should be possible to run `wayfire` in a terminal; an empty Wayland screen (with a cursor) should show up

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

No need to reboot Wayfire, it should pick up the changes and fix itself immediately. I think.


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

With everything "working", we can make Wayfire and swayimg a system service, so they'll start at boot:

Add this to `/etc/systemd/system/wayfire.service` (change the user name):

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
sudo systemctl enable wayfire
sudo systemctl enable ambiene
sudo systemctl restart wayfire
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

@meta extraNav [Next](md_gen/index1.md)