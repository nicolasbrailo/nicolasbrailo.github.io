# Houseboard P0: PP0

@meta publishDate 2024-06-30
@meta author Nico Brailovsky
@meta tags IoT, RaspberryPi, Homeboard

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

