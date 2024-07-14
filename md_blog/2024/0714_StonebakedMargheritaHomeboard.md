# Homeboard P0: Stonebaked Margherita

@meta publishDate 2024-07-14
@meta author Nico Brailovsky
@meta tags IoT, RaspberryPi, Homeboard

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
* Pizza. Margherita not required.
* Mini HDMI to HDMI

Optionals:

* [UART](https://www.amazon.co.uk/gp/product/B0B7RHPMT7/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1) - to figure out why things don't boot, or to [debug sensors](md_blog/2024/0615_LD2410SmmWaveSensor.md)
* Regulable power source 3 to 30V - useful to debug power to elements in isolation
* [HLK-LD2410S 24G mmWave sensor](https://www.aliexpress.com/i/1005006282168742.html) [Manual](https://drive.google.com/file/d/1CYgZTTEkZoo29QDd8V-qMWQCiwLFjlw1/view) - not used yet, but soon

## Useful references
* [Pi GPIO pins](https://pi4j.com/1.2/pins/model-3b-rev1.html)
* [PI Zero pins](https://images.theengineeringprojects.com/image/webp/2021/03/raspberry-pi-zero-5.png.webp?ssl=1)

