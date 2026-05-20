# New project: playing with ESP32s

@meta publishDate 2026-05-21
@meta author Nico Brailovsky

I spent about 15 minutes not knowing what to do with my life after I [finished my last project](md_blog/2026/0509_HomeboardComplete.md), then opened up my box of ESP32s and decided to start a new one. This time I'm building a presence sensor.

When I sit down to watch TV, I need to configure the lights in the correct way (there is a correct way), the audio profile, the TV input, even the correct heating settings. I can do all of that from my phone, or even better, from a Zigbee button, but I decided that's still too much work and it should all happen automatically. When I sit down to watch TV, everything should automatically be set up the way I like it. Because I don't live alone, when my wife sits down to watch TV it should be set up the way *she* likes it. How hard could that be?

![Proof of life](/blog_img/2026/0521_NewProjectESP32_1.jpg)

Started with a few basic components: a battery, a USB/LiPo charger, and the ESP32. Above, a "proof of life", showing that I can flash an LED from either battery power, or from USB power. I found later that buying an ESP with battery management is actually cheaper than buying an ESP+battery manager, but I already have these components and I'm not planning to waste them. Since I can flash an LED, surely that's enough to work on the industrial design of my new sensor.

![A case](/blog_img/2026/0521_NewProjectESP32_2.jpg)

Now that I have a 3D printer, nothing can stop my mad ID skills. Except a few mm of bad alignment in my 3D printer. I'm not too unhappy with the results, though, and here's version P0 of my presence sensor:

![It works](/blog_img/2026/0521_NewProjectESP32_3.jpg)

The assembly here looks pretty but the picture is a bit of a lie, as the sensor doesn't do much yet. The [firmware is in its early stages](https://github.com/nicolasbrailo/esp32_playground/), although it can already connect to an MQTT server and broadcast its battery status. The idea is to pair my phone over Bluetooth, and then use it as an identification mechanism, plus the PIR sensor to wake up the device (did I mention the battery is tiny?).

I don't know how useful this sensor will be: the battery seems quite small, and I haven't done any power measurements yet to estimate the lifetime of the device between charges. For now, it's been a good experiment to learn to use my 3D printer, and to start planning V2 of this sensor.

As for the identification part: I managed to coax my phone into automatically connecting to my sensor by declaring the Bluetooth interface as an input device, and the identification part seems to work remarkably well: by reducing the TX power of the ESP, I can get a useful radius of about 3 or 4 meters, enough to put one of these in a room and know who is in there. I can't wait to find out what this device will do once both me and my wife sit down to watch a movie together!
